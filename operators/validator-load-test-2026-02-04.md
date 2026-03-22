# Validator Load Test Report (2026-02-04)

## Context

This report documents a local 3-node Aeron cluster load test of `oak-segment-consensus` on a single MacBook. The test targeted the HTTP API on validator-0 (port 8090) while validator-1 (port 8092) acted as leader and validator-2 (port 8094) as follower. The goal was to observe backpressure behavior, thread dump patterns, and log divergence under sustained write pressure.

## Test Setup

- Date: 2026-02-04
- Java: 21 (LTS)
- Nodes: 3 validators on one host
- Ports: 8090 (validator-0), 8092 (validator-1), 8094 (validator-2)
- Load: write-heavy test against validator-0 HTTP API
- Storage: local disk (single machine, shared IO subsystem)

## High-Level Outcome

The cluster did not behave as a stable, coordinated 3-node system during the test. Validator-1 was elected leader (term 1), but it rejected a large volume of incoming proposals due to stale term values (proposal term 0). Validator-0 continued to forward write batches while in the FOLLOWER role, generating very large logs. Validator-2 remained a follower with minimal activity.

This explains the observed divergence in log sizes and the apparent absence of a functional leader from the client’s perspective.

## Per-Node Observations

### Validator-0 (Port 8090, FOLLOWER)

- Log size: 48 MB
- Lines: 241,340
- WARN: 1,419
- ERROR: 3
- Role: FOLLOWER throughout the captured period
- Behavior: Continuously forwarding write batches via `sendWriteBatchThroughIngress()` while a follower.

Evidence:
- Repeated log lines show: `appendProposalBatch() forwarding ... role: FOLLOWER`
- The bulk of log volume corresponds to write ingestion and proposal forwarding.

Interpretation:
- Validator-0 accepted client load but did not appear to reconcile with leader term state, causing its forwarded proposals to be rejected upstream.

### Validator-1 (Port 8092, LEADER)

- Log size: 5.6 MB
- Lines: 33,248
- WARN: 32,797
- ERROR: 1
- Role transition: FOLLOWER -> LEADER (term 1)

Dominant warnings:
- `Rejecting proposal from stale term: proposalTerm=0, currentTerm=1` (23,335 occurrences)
- `MessageDispatcher failed to process message (templateId: 100)` (9,456 occurrences)

Interpretation:
- Validator-1 is leader, but it is rejecting most proposals because they do not include the correct term.
- `templateId: 100` failures are likely the same proposals being dropped after term validation.
- The leader is functioning but is not able to accept the proposals being sent by followers.

### Validator-2 (Port 8094, FOLLOWER)

- Log size: 1.7 MB
- Lines: 8,878
- WARN: 6
- ERROR: 1
- Role: FOLLOWER throughout the captured period

Interpretation:
- Minimal load and minimal errors.
- Some write application logs exist, but overall activity is low relative to validator-0.

## Cross-Node Diagnosis

### Root Cause Likely

Incoming proposals to the leader are missing or using stale term values. The leader is at term 1, while proposals sent from validator-0 carry term 0. This causes the leader to reject the bulk of incoming load.

The end result:
- Validator-0 keeps accepting HTTP writes and forwarding batches.
- Validator-1 rejects most batches due to term mismatch.
- Validator-2 remains idle.

This explains:
- Log divergence (validator-0 huge, validator-1 warning-heavy, validator-2 small).
- Client perception of “leader absence” even though leader is running.

### Why It Matters

The Aeron cluster is behaving as designed (leader enforces term correctness), but the application layer is not ensuring that proposals carry the correct term when forwarded to the ingress. This is a correctness issue, not just performance.

## Immediate Fixes to Apply

1. Ensure all proposals sent through Aeron ingress include the current term.
2. On followers, block or redirect client writes unless they are forwarded with a valid leader term.
3. Reduce warning spam by collapsing repeated stale-term warnings (rate limit or log once per interval).

## Expected Result After Fix

If proposals carry the current term:
- Leader should accept forwarded batches.
- WARN counts should drop dramatically.
- Log sizes should converge across nodes.
- Backpressure should be driven by IO or CPU, not term rejection.

## Next Test Plan

1. Rebuild validators with term-included proposals.
2. Restart all three nodes to reset term state.
3. Re-run the same load test against validator-0.
4. Compare:
   - Leader warning rate
   - Batch acceptance rate
   - Log size ratios across nodes

## Data Appendix

Summary stats captured from logs:

- Validator-0: 48 MB, 241,340 lines, 1,419 WARN, 3 ERROR
- Validator-1: 5.6 MB, 33,248 lines, 32,797 WARN, 1 ERROR
- Validator-2: 1.7 MB, 8,878 lines, 6 WARN, 1 ERROR

Key warning signatures on leader:

- `Rejecting proposal from stale term: proposalTerm=0, currentTerm=1`
- `MessageDispatcher failed to process message (templateId: 100)`
