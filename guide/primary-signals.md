---
prev: /guide/consensus
next: /guide/economics
---

# Oak Chain Primary Signals

This page defines the primary operational signals for Oak Chain and how to interpret them under real load.

## Why This Matters

Without shared signal definitions, teams misread queue pressure and diagnose the wrong bottleneck during incidents.

## What You'll Prove

- You can interpret queue, verifier, durability, and replication signals as one pipeline.
- You can label system state consistently across dashboards and runbooks.
- You can detect settle vs constrained behavior using trend-based metrics.

## Next Action

Use this page while viewing live `queue/stats` output, then tag the system state (`IDLE`, `FILLING`, `DRAINING`, or `CONSTRAINED`) from real data.

## Why This Exists

During stress testing, raw counters can look contradictory unless they are interpreted as a pipeline:

1. proposals are accepted
2. proposals are verified
3. proposals are finalized
4. durability acknowledgements close the loop

Primary Signals gives operators a single language for diagnosing where pressure is building.

Related API contract pages:
- [API Reference](/guide/api)
- `GET /v1/proposals/queue/stats` (primary per-node queue/finality surface)

## Signal Groups

### Queue

- `queue.pending` / `queue.queuePending`: queued proposals waiting to be finalized.
- `queue.backpressurePending`: backlog held by backpressure controls.
- `queue.oldestPendingAgeMs`: age of oldest queued work.

Interpretation:
- High `queue.pending` with low `backpressurePending` usually indicates finalization throughput limits.
- High `backpressurePending` means ingress is outpacing the send/ack loop.

### Verifier

- `verifier.attemptCount`, `successCount`, `errorCount`
- `verifier.queueWaitAvgMs`, `queueWaitMaxMs`
- `verifier.avgTotalMs`, `lastTotalMs`

Interpretation:
- If verifier wait/total are low but queue grows, verifier is not the bottleneck.
- If verifier wait grows sharply, intake is outrunning verifier scheduling.

### Durability

- `durability.pendingAcks`
- `durability.ackTimeouts`

Interpretation:
- `pendingAcks` is in-flight work already sent but not yet durably acknowledged.
- Rising then falling under burst load is normal.
- Rising and flat means commit/ack is bottlenecked or stalled.

### Replication

- `replication.maxLagMs`
- `replication.maxLagNodeId`

Interpretation:
- Non-zero lag with growth indicates replica catch-up pressure.
- Persistent high lag with queue growth is a cluster-side throughput concern.

## Operating States

Use these state labels on dashboards and in runbooks:

- `IDLE`: queue near zero, no backpressure debt, no pending acks.
- `FILLING`: net queue slope positive; ingress > finalize.
- `DRAINING`: net queue slope negative; finalize > ingress.
- `CONSTRAINED`: queue high and flat or rising while backpressure/acks stay elevated.
- `SETTLED`: queue drained and `totalVerifiedCount == totalFinalizedCount`.

## Core Derived Metrics

Recommended derived metrics (computed in dashboard/worker):

- `Finalize Rate (ops/s)`: delta of `totalFinalizedCount` over window
- `Ingest Rate (ops/s)`: delta of accepted proposals over window
- `Net Queue Slope (ops/s)`: `ingest_rate - finalize_rate`
- `Queue Pressure`: label from slope and absolute queue size
- `Gap Ratio (%)`: `(totalVerifiedCount - totalFinalizedCount) / max(totalVerifiedCount,1) * 100`

Notes:
- `Gap Ratio` can be high at startup or short windows; always pair it with slope and queue size.
- Avoid single-point judgments; require at least a 2-5 minute trend.

## Fast Triage Commands

```bash
# Cluster overview
curl -s http://127.0.0.1:8787/ops/v1/overview | jq '.data | {
  leader, queue, durability, replication
}'

# Leader queue stats
curl -s http://127.0.0.1:8090/v1/proposals/queue/stats | jq '{
  totalProposals,totalVerifiedCount,totalFinalizedCount,
  verifiedCount,processedCount,batchQueueSize,
  backpressurePendingCount,backpressurePendingRawCount,
  persistencePendingChanges,persistenceFlushAvgMs,persistenceFlushLastMs,
  verifierQueueWaitAvgMs,verifierQueueWaitMaxMs,pendingEpochStats
}'
```

## Healthy End-of-Run Criteria

For load-test settlement, require all:

1. `batchQueueSize = 0`
2. `backpressurePendingCount = 0`
3. `persistencePendingChanges = 0`
4. `verifiedCount = 0`
5. `totalVerifiedCount == totalFinalizedCount`

If all pass, the run is operationally settled even after heavy burst traffic.
