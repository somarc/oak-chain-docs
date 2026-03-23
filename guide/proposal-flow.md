---
prev: /guide/consensus
next: /guide/economics
---

# Proposal Flow

Oak Chain proposal handling is a staged pipeline, not a single queue.  
Writes move through this path today, and deletes are designed to share the same ingress and queue semantics once chain-backed delete parity is complete.

## Why This Matters

When write throughput increases, knowing the exact stage boundaries is the fastest way to isolate failures and tune performance.

## What You'll Prove

- You can trace a proposal from ingress to deterministic commit.
- You can identify where backpressure activates and why.
- You can map queue metrics to concrete pipeline stages.

## Next Action

Walk the end-to-end pipeline once, then inspect `GET /v1/proposals/queue/stats` while submitting test traffic.

## End-to-End Pipeline

<FlowGraph flow="proposal-flow" :height="500" />

## Stage-by-Stage

### 1. Ingress + Signature

- Client submits `POST /v1/propose-write` or `POST /v1/propose-delete`.
- Wallet signature is validated before proposal acceptance.
- Leader ingress applies schema and request guards.

### 2. Payment Pathway

- Request may include `paymentTier` to identify the class used in the payment contract flow.
- Payment proof path uses chain-backed tx/event verification in deployed networks.
- Payment result determines whether proposal continues or is rejected.

### 3. Unverified Queue -> Verifier

- Accepted proposals enter unverified queue state.
- Verifier agents run proof/auth/payment checks and update counters.
- Successfully verified proposals move to epoch/tier routing.

### 4. Adaptive Packing and Release

- Verified proposals move into an adaptive packing buffer.
- The runtime groups nearby writes and forms storage-aware micro-batches.
- Release cadence is governed by live capacity, not a fixed per-class wait.
- Queue stats expose this behavior via:
  - `proposalsByEpoch`
  - `proposalsByEpochAndTier`
  - `pendingEpochStats`

### 5. Batch Construction

- Finalizer agent selects ready epoch buckets.
- Proposals are converted into sendable batches/chunks.
- Batch sizing and chunking are controlled by queue tuning knobs.

### 6. Backpressure Gate

- Sender checks in-flight count against `max_pending_messages`.
- If pending ACKs are too high, sender applies backpressure and can re-queue.
- This protects validator stability under heavy write load.

### 7. Aeron/Raft Replication + Commit

- Batches are offered through Aeron to Raft.
- On quorum, proposals are committed and applied deterministically.
- Proposal persistence + counters are updated for observability.

## Queue Surfaces and Signals

Primary observability surface:

- `GET /v1/proposals/queue/stats`

High-value fields:

- `backpressureActive`
- `backpressurePendingRawCount`
- `batchQueueSize`
- `proposalsByEpoch`
- `proposalsByEpochAndTier`
- `currentEpoch`, `finalizedEpoch`, `epochsUntilFinality`
- `verifiedCount`, `totalFinalizedCount`, `processedCount`

## Payment Pathways in Practice

::: info Release model
The canonical release view is `GET /v1/proposals/release-flow`.

- verified proposals enter a packing buffer
- the runtime groups and packs them for storage locality
- Aeron release is capacity-governed rather than tied to a fixed per-class delay
:::

::: warning Throughput nuance
A healthy verifier stage does not guarantee healthy sender/finalizer throughput.  
Backpressure and batch sizing must be tuned with epoch cadence and workload shape.
:::

## Practical Operator Checklist

Before load tests:

1. Confirm queue starts drained (`pending=0`, `batchQueueSize=0`, `backpressureActive=false`).
2. Confirm epoch settings (`currentEpoch`, finalized lag target, epoch cadence).
3. Confirm queue tuning logs at startup (`QUEUE_TUNING_SOURCE`).

During load:

1. Track `proposalsByEpoch` growth and rollover.
2. Watch `backpressurePendingRawCount` and timeout/requeue events.
3. Compare `verifiedCount` vs `processedCount` and `totalFinalizedCount`.

After load:

1. Verify backlog converges back to zero.
2. Confirm finalization catches up to verified totals.
3. Capture queue stats snapshot for run evidence.
