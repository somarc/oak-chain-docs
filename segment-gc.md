# Segment Store Garbage Collection

Oak's segment store uses **generational garbage collection** to reclaim disk space. Content writes create immutable segments, but edits and deletes leave "garbage" (unreachable segments). GC compacts live data into a new generation and deletes old TAR files.

This is the "cost" of the append-only DAG architecture—and understanding it is crucial for operating Oak Chain at scale.

## The 3-Phase GC Process

Garbage collection runs in three phases: **Estimation**, **Compaction**, and **Cleanup**.

<FlowGraph flow="gc-overview" :height="440" />

### Phase 1: Estimation

Before doing expensive work, Oak estimates how much garbage exists:

- Compares current store size to last compacted size
- If garbage is **less than 25%**, GC is skipped
- Can be disabled to force GC regardless

### Phase 2: Compaction

The heavy lifting—copying live data to a new generation:

- Creates a new generation number (monotonically increasing)
- Traverses content tree from journal head
- Copies reachable segments to new generation
- Handles concurrent writes with retry loops (up to 5 cycles)
- May "force compact" by blocking writes if stuck

### Phase 3: Cleanup

Actually freeing disk space:

- Scans TAR files for unreachable segments
- Marks empty TAR files for deletion
- Background **File Reaper** thread removes marked files
- Logs reclaimed space

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

## Online vs Offline GC

<FlowGraph flow="gc-modes" :height="440" />

### Online GC (Default)

Runs while the system is live:

- ✅ No downtime required
- ✅ Scheduled automatically (daily/weekly)
- ⚠️ Must handle concurrent writes
- ⚠️ May not reclaim all space

**Retry Loop**: If concurrent writes modify the repository during compaction, Oak retries up to 5 times. If still failing, it can "force compact" by blocking writes for up to 60 seconds.

### Offline GC

Requires exclusive access:

- ✅ Fastest and most thorough
- ✅ Retains only 1 generation (maximum cleanup)
- ❌ Requires system shutdown
- ❌ Manual operation

**When to use**: After major content migrations, before production deployments, or when online GC consistently fails.

```bash
# Offline compaction command
java -jar oak-run.jar compact /path/to/segmentstore
```

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
  background: linear-gradient(135deg, #627EEA, #8C8DFC);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}
.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(98, 126, 234, 0.4);
}
</style>
