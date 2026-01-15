# Segment Store Garbage Collection

Oak's segment store uses **generational garbage collection** to reclaim disk space. Content writes create immutable segments, but edits and deletes leave "garbage" (unreachable segments). GC compacts live data into a new generation and deletes old TAR files.

This is the "cost" of the append-only DAG architecture. Understanding it is crucial for operating Oak Chain at scale.

## ⚠️ Key Difference: Consensus-Based GC

::: warning Oak Chain is Different
In traditional Oak, GC is a **local operation**. In Oak Chain, **GC must go through Raft consensus** to maintain deterministic state across all validators. There is **no "offline" mode** in a distributed consensus system.
:::

## Consensus-Based GC Process

In Oak Chain, GC is **proposal-based** through Raft consensus:

<FlowGraph flow="gc-overview" :height="440" />

### Step 1: Epoch Trigger

GC is triggered by Ethereum epoch finalization:

- Ethereum block finality triggers GC check
- Only the **Raft leader** can propose GC
- Leader checks if garbage threshold is exceeded

### Step 2: GC Proposal

The leader creates a signed GC proposal:

- Proposal type: `COMPACT`
- Signed with leader's wallet
- Includes epoch reference for ordering

### Step 3: Raft Consensus

Proposal is replicated to all validators:

- Broadcast via Aeron Raft
- Requires majority acknowledgment
- All validators receive identical proposal

### Step 4: Deterministic Compaction

**Critical**: All validators must apply the same GC:

- Same input → Same output
- Each node compacts locally
- Results must be identical (hash verification)

### Step 5: Consensus Commit

GC is committed to the Raft log:

- Committed at specific Raft log index
- Durable once majority confirms
- All validators reclaim same space

---

## Deep Dive: Compaction

<FlowGraph flow="gc-compaction" :height="480" />

### What Gets Compacted?

1. **Journal Head** → The current repository state
2. **Checkpoints** → Async indexing save points (compacted first, with deduplication)
3. **Content Tree** → All reachable nodes and properties

### The Reachability Problem

Segment graphs are **extremely dense**. A single reachable record in a segment keeps the entire segment alive, along with all segments it references. This is why:

- Typical stores have **70-90% garbage**
- But cleanup may only reclaim **50-80%** of it
- Multiple GC cycles are needed for full cleanup

### Compaction Modes

| Mode | Description | Speed | Thoroughness |
|------|-------------|-------|--------------|
| **Tail** | Compact recent revisions only | Fast | Partial |
| **Full** | Compact all revisions | Slow | Complete |

Tail compaction is the default for online GC. Full compaction is used for offline GC or when tail compaction isn't sufficient.

---

## Generational Model

<FlowGraph flow="gc-generations" :height="460" />

### How Generations Work

1. **Generation N** is the current (active) generation
2. **Generation N-1** is retained as a safety buffer
3. **Generation N-2** is deleted during cleanup

### Why Retain 2 Generations?

Readers may hold references to segments in the previous generation. Keeping 2 generations ensures no reader sees a "segment not found" error during GC.

This is a trade-off:
- More retained generations = more disk space
- Fewer retained generations = risk of read failures

Oak fixes this at **2 generations** (not configurable since Oak 1.8).

---

## TAR File Cleanup

<FlowGraph flow="gc-cleanup" :height="420" />

### The Cleanup Process

1. **Scan** each TAR file's segment index
2. **Check** if segments are referenced by current generation
3. **Mark** empty TAR files for deletion
4. **Rewrite** partial TAR files (optional, to reclaim more space)
5. **Reaper** thread deletes marked files

### TAR File Naming

```
data00000a.tar  ← Generation 1
data00001a.tar  ← Generation 1
data00000b.tar  ← Generation 2
data00001b.tar  ← Generation 2
```

The letter suffix indicates the generation. During cleanup, entire generations of TAR files are removed.

---

## Consensus GC & GC Debt Economics

<FlowGraph flow="gc-modes" :height="440" />

### Consensus GC (Only Mode)

In Oak Chain, **there is no "offline" GC**. All GC must go through consensus:

- ✅ Leader creates signed GC proposal
- ✅ Proposal replicated via Aeron Raft
- ✅ All validators compact deterministically
- ✅ Same input → Same output (critical!)
- ✅ GC committed to Raft log

::: danger Why No Offline GC?
In a distributed consensus system, all validators must have **identical state**. If one validator ran "offline" GC independently, its segment store would diverge from others, **breaking consensus**. GC must be coordinated through Raft to maintain determinism.
:::

### GC Debt Model (ADR 017)

Delete operations have **economic implications**:

| Concept | Description |
|---------|-------------|
| **GC Debt** | Delete operations incur debt (estimated cleanup cost) |
| **Per-Wallet Tracking** | Debt tracked per Ethereum wallet address |
| **Write Blocking** | Writes blocked if debt exceeds limit |
| **Payment** | Pay ETH to ValidatorPayment contract to clear debt |
| **Incentive** | Validators incentivized to run GC (reduces storage costs) |

```
Delete Operation → Debt Accrual → [If over limit] → Writes Blocked
                                                          ↓
                                                    Pay ETH
                                                          ↓
                                                  Writes Unblocked
```

This creates a **sustainable economic model** where:
- Authors pay for the storage cost of their content
- Delete operations aren't "free" (they incur GC debt)
- Validators are compensated for storage and GC overhead

---

## Monitoring GC

### JMX MBean

The `SegmentRevisionGarbageCollection` MBean exposes:

| Metric | Description |
|--------|-------------|
| `LastCompaction` | Timestamp of last successful compaction |
| `LastCleanup` | Timestamp of last cleanup |
| `LastRepositorySize` | Size after last cleanup |
| `LastReclaimedSize` | Space freed in last cleanup |
| `Status` | Current GC phase (idle/estimation/compaction/cleanup) |

### Log Messages

```
TarMK GC #2: started
TarMK GC #2: estimation started
TarMK GC #2: estimation completed in 961.8 μs. Estimated garbage: 45%
TarMK GC #2: compaction started, gc options=...
TarMK GC #2: running full compaction
TarMK GC #2: compaction succeeded in 6.580 min, after 2 cycles
TarMK GC #2: cleanup started
TarMK GC #2: cleanup completed in 16.23 min. Post cleanup size is 10.4 GB and space reclaimed 84.5 GB.
```

---

## Best Practices

### For Oak Chain Validators

1. **Schedule online GC** during low-traffic periods
2. **Monitor disk space** and GC metrics via JMX
3. **Run offline GC** quarterly or after major content changes
4. **Size disks** for 2x expected content (for GC headroom)

### Tuning Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `gcSizeDeltaEstimation` | 1 GB | New content threshold to trigger GC |
| `retryCount` | 5 | Max compaction retry cycles |
| `forceTimeout` | 60s | Max time to block writes for force compact |
| `memoryThreshold` | 5% | Min free heap to continue compaction |

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| GC never completes | High write load | Schedule during quiet periods |
| Disk keeps growing | GC not running | Check scheduler, run manually |
| "Segment not found" | GC too aggressive | Increase retained generations (not recommended) |
| Slow compaction | Large store | Use tail compaction, add RAM |

---

## The Economics of GC

In Oak Chain, GC has economic implications:

- **Validators** pay for storage (disk costs)
- **Authors** pay for writes (ETH per write)
- **GC** is a validator cost, not author cost

This creates an incentive for validators to:
1. Run efficient GC to minimize storage costs
2. Price writes to cover long-term storage + GC overhead
3. Encourage authors to avoid unnecessary content churn

---

<div style="text-align: center; margin-top: 3rem;">
  <a href="/how-it-works" class="action-btn">← Back to How It Works</a>
</div>

<style>
.action-btn {
  display: inline-block;
  padding: 12px 28px;
  background: linear-gradient(135deg, #4a5fd9, #627EEA);
  color: #fff;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(98, 126, 234, 0.4);
  background: linear-gradient(135deg, #3a4fc9, #5a6eda);
}
</style>
