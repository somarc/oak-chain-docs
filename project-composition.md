---
prev: /architecture
next: /guide/
---

# Oak Chain Project Composition

Oak Chain is a composite system, not an AEM runtime. It combines:

1. Apache Jackrabbit Oak (state model and segment store)
2. Aeron Cluster / Raft (deterministic consensus replication)
3. Ethereum (economic verification and payment anchoring)
4. IPFS (binary payload distribution)
5. HTTP API surface (operator and application contract)

## What Oak Chain Is

- A headless validator system built on Oak internals.
- A consensus-driven content repository with wallet-scoped ownership.
- An API-first platform where dashboards/workers are consumers of the API contract.

## What Oak Chain Is Not

- Not AEM.
- Not Sling/Felix console-first operations.
- Not dependent on `/system/console` or JMX UI operations for day-to-day control.

Operational control is via APIs, scripts, logs, and consensus-safe workflows.

## Layered Responsibilities

### 1) Oak (Storage and Content Graph)

- Maintains segment/TAR state and content tree semantics.
- Supports immutable segment model and compaction cycles.
- Exposes content read surfaces through validator APIs.

### 2) Aeron/Raft (Consensus)

- Enforces deterministic write ordering and cluster agreement.
- Governs leader/follower behavior, term transitions, and replication lag.
- Makes GC and proposal lifecycle consensus-safe.

### 3) Ethereum (Economics and Verification)

- Anchors payment semantics and wallet-linked operations.
- Supports economic tiers and durability/finality policies.
- Enables auditability of paid writes/deletes.

### 4) IPFS (Binary Distribution)

- Stores binary payload content-addressably.
- Validator side tracks references (CIDs and mappings).
- Keeps heavy binary payload off validator state machine critical path.

### 5) API Surface (Contract)

Primary public operational contract includes:
- `/v1/proposals/queue/stats`
- `/v1/consensus/status`
- `/v1/aeron/*`
- `/v1/gc/*`
- `/v1/fragmentation/*`
- `/v1/compaction/proposals`

Dashboards, edge workers, and CLIs should consume this contract directly.

## Why This Composition Matters

- Clear boundaries reduce operational confusion.
- API-first governance keeps UI and automation aligned to one truth.
- Consensus-safe storage management prevents node divergence.
- Economic and storage layers can evolve independently with stable API contracts.

## Read-Model Strategy (No On-Chain Indexing)

Oak Chain intentionally does not carry full-text/search indexing responsibilities in validator consensus state.

Model:

1. Oak Chain = canonical truth and verification
2. Upstream services = discovery, ranking, aggregation, and agentic curation

This keeps consensus deterministic and lean, while letting read intelligence evolve quickly without changing core validator behavior.

### Upstream Intelligent Service Pattern

Typical architecture:

1. **Ingest**
- Subscribe to `GET /v1/events/stream`
- Poll backfill via `GET /v1/events/recent`
- Pull canonical nodes with `GET /api/explore` and wallet catalog endpoints

2. **Materialize**
- Build wallet-scoped read models in search/index stores (OpenSearch/Elastic/Postgres/vector DB)
- Maintain denormalized projections for feeds, timelines, dashboards, and explorer pages

3. **Enrich (Agentic Layer)**
- Classify content and entities
- Extract tags/topics/relationships
- Rank and cluster by tenant/wallet policy
- Produce derived summaries and navigation views

4. **Verify**
- On critical reads, cross-check canonical state from validator APIs
- Treat upstream index as a read acceleration layer, not source of truth

5. **Serve**
- Expose consumption APIs optimized for UX/query workloads
- Keep validator APIs as integrity anchor

## Operator Guidance

When diagnosing issues, always classify by layer first:

1. Ingest/API acceptance
2. Verifier and queue progression
3. Finalization and durability ack
4. Replication lag and leader health
5. GC/fragmentation and reclaim behavior

Start with:

```bash
curl -s http://127.0.0.1:8090/v1/proposals/queue/stats | jq .
curl -s http://127.0.0.1:8090/v1/consensus/status | jq .
curl -s http://127.0.0.1:8090/v1/aeron/replication-lag | jq .
curl -s http://127.0.0.1:8090/v1/gc/status | jq .
```

For signal interpretation, see [Oak Chain Primary Signals](/guide/primary-signals).
