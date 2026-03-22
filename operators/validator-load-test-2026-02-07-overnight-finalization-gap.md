# Validator Load Test Report (2026-02-07): Overnight Finalization Gap

## Context

This report documents the overnight behavior after an ultra load test run was started on `2026-02-06` and left running while monitoring continued.

Primary concern:
- very high verified volume
- much lower finalized volume
- persistent backlog that did not clear overnight

Observed live state (captured around `2026-02-07T03:46Z`):
- `totalVerifiedCount=81166`
- `totalFinalizedCount=10592`
- gap: `70574`
- `batchQueueSize=25385`
- `backpressurePendingCount=14482`

## Test Artifacts

- Main run logs:
  - `/Users/mhess/oak-chain/logs/ultra-30min-20260206-220352.log`
  - `/Users/mhess/oak-chain/logs/ultra-30min-20260206-221234.log`
- Client logs:
  - `/Users/mhess/oak-chain/logs/ultra-30min-client-*-20260206-220352.log`
  - `/Users/mhess/oak-chain/logs/ultra-30min-client-*-20260206-221234.log`
- Signal capture:
  - `/Users/mhess/oak-chain/logs/limit-signature-20260206-220105.csv`
- Validator logs:
  - `/Users/mhess/oak-chain/logs/validator-0.log`
- Observer captures:
  - `/Users/mhess/oak-chain/postmortem/load-bottleneck-*`

## High-Level Outcome

The cluster entered and remained in an over-limit debt state:
- ingest and verification progressed
- finalization lagged far behind
- sender/backpressure path repeatedly timed out and re-queued batches
- backlog plateaued instead of draining

This is not a verifier rejection event and not a replication lag event.

## Key Evidence

### 1. Runs were interrupted before full 30 minutes

From main logs:
- run `220352` cleaned up at `22:09:38`
- run `221234` cleaned up at `22:26:57`

Implication:
- not a completed benchmark run
- observed debt reflects interrupted overload sessions

### 2. Rate limiting was active during ingest

`validator-0.log` contains large volumes of:
- `Rate limit exceeded for client: 127.0.0.1`

Count in `validator-0.log`:
- `442840` rate-limit log entries

Implication:
- local multi-client load collapsed to same client identity (`127.0.0.1`) from limiter perspective
- 429 pressure was present while backlog formed

### 3. No file descriptor crash in this overnight run

`validator-0.log`:
- `Too many open files`: `0` matches

Implication:
- this event is a throughput/finalization bottleneck, not an FD-exhaustion recurrence

### 4. Signal capture confirms widening debt during active window

From `limit-signature-20260206-220105.csv`:
- active-window verify rate: ~`30.57/s`
- active-window finalize rate: ~`5.65/s`
- max `queue_pending`: `27074`
- max `backpressure_pending`: `10550`
- max gap (`verified_minus_finalized`): `30175`
- tail (last ~58s in capture): queue slightly down but backpressure and gap still rising

Implication:
- system was still accumulating finalize debt near end of capture window

### 5. Backpressure path repeatedly timed out for hours

Repeated entries in `validator-0.log`:
- `Backpressure timeout: pending=14482, max=10000, waited=30000ms`
- `Backpressure timeout - re-queuing batch (...)`

Live queue stats remained pinned:
- `BackpressureManager[sent=14483, acked=1, pending=14482, max=10000, active=true]`

Implication:
- downstream sender/ack/finalizer path is the hard bottleneck
- queue debt can become quasi-static without further ingest

## Root Cause Assessment

Primary bottleneck:
- downstream batch send + ack/finalization throughput

Not primary in this event:
- verifier input queue (mempool was clear)
- replication lag (`maxLagMs=0`)
- durability timeout (`pendingAcks=0` in OPS overview)

Operational nuance:
- queue/finalization counters are leader-centric
- OPS `overview` vs `signals` showed inconsistent verifier wait values in some windows, reducing trust in real-time severity display

## Why Verified Can Be High While Finalized Stays Low

Pipeline behavior under overload:
1. writes are accepted and verified quickly enough
2. verified proposals enter batch/sender path
3. sender hits backpressure limit and timeout loop
4. batches are re-queued repeatedly
5. finalization progresses very slowly, so gap widens and persists

## Remediation Plan (Operations + Tuning)

### Phase 1: Stop debt plateauing

Tune these together (single-variable changes are misleading):
- `oak.proposal.batch.max`
- `oak.proposal.finalization.chunk.size`
- `oak.consensus.max.pending.messages`
- `oak.consensus.backpressure.timeout.ms`

Goal:
- eliminate repeated `pending=14482` timeout loop
- achieve sustained negative slope on:
  - `batchQueueSize`
  - `backpressurePendingCount`
  - `verified-finalized` gap

### Phase 2: Benchmark with debt-aware pass/fail

A run is pass only if:
- target throughput achieved
- gap bounded during steady state
- backlog drains after load stop within recovery window

Do not grade success by ingest/verified counts alone.

### Phase 3: Improve observability truth

- enforce parity between OPS overview and OPS signals for verifier metrics
- keep leader attribution explicit in run summaries

## Immediate Operator Actions

1. Before next ultra run:
- confirm clean baseline (`batchQueueSize=0`, `backpressurePendingCount=0`, low gap)

2. During run:
- capture OPS + leader queue stats every 5s
- capture jstack series during first overload onset

3. After run:
- require a recovery observation window (no load) and measure drain rate
- fail run if backlog plateaus

## Success Criteria

“Everything finalizes” means:
- no long-lived backlog plateau
- no repeated backpressure timeout loop at a fixed pending count
- verified/finalized gap returns near baseline after load removal
- this behavior is repeatable across multiple runs

## Bottom Line

The overnight event confirms a real downstream finalization bottleneck. The system can accept and verify large volume, but finalization is constrained by sender/backpressure behavior and can stall into persistent debt. Any readiness claim must require debt drain, not just ingest.
