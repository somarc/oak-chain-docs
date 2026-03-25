---
prev: /architecture
next: /guide/
---

# Oak Chain Project Composition

Oak Chain is a composite system, not an AEM runtime.

It combines:

1. Apache Jackrabbit Oak.
2. Aeron Cluster / Raft.
3. Ethereum.
4. IPFS.
5. A governed validator-native source contract.
6. An edge-owned upstream `/ops/v1/*` contract.

## What Oak Chain Is

- A headless validator system built on Oak internals.
- A consensus-driven content repository with wallet-scoped ownership.
- An API-first platform with separate `source`, `local-ui`, `local-diagnostic`, `internal`, and edge-owned upstream surfaces.

## What Oak Chain Is Not

- Not AEM.
- Not Sling/Felix console-first operations.
- Not dependent on `/system/console` or JMX UI operations for day-to-day control.

Operational control is via APIs, scripts, logs, and consensus-safe workflows.

## Layered Responsibilities

### 1) Oak (Storage and Content Graph)

- Maintains segment and TAR state and content tree semantics.
- Supports immutable segment references and compaction cycles.
- Exposes content read surfaces through validator APIs.

### 2) Aeron/Raft (Consensus)

- Enforces deterministic write ordering and cluster agreement.
- Governs leader and follower behavior, term transitions, and replication lag.
- Makes GC and proposal lifecycle consensus-safe.

### 3) Ethereum (Economics and Verification)

- Anchors payment semantics and wallet-linked operations.
- Supports payment classes and payment verification, while release into consensus is handled by adaptive packing and capacity-governed Aeron release.
- Enables auditability of paid writes and deletes.

### 4) IPFS (Binary Distribution)

- Stores binary payload content-addressably.
- Lets the validator track references through CIDs and mappings.
- Keeps heavy binary payload off the validator state-machine critical path.

### 5) Validator-Native Source Contract

These routes are the direct runtime contract emitted by `jackrabbit-oak`.

```text
/v1/consensus/leader
/v1/consensus/status
/v1/ops/snapshots/{health,runtime,storage,cluster,replication,queue}
/v1/proposals/queue/stats
/v1/proposals/release-flow
/v1/proposals/epochs
/v1/explorer/summary
/v1/explorer/release-flow
/v1/explorer/proposals/{proposalId}
/v1/explorer/wallets/{walletAddress}
/v1/config/osgi*
/v1/events/{recent,stats}
/v1/blockchain/config
/v1/gc/status
/v1/gc/estimate
/v1/compaction/proposals
/v1/fragmentation/*
```

`/v1/index` is the live local taxonomy feed for this surface, not the canonical publication artifact.

`/v1/index` currently misclassifies `/v1/gc/estimate` and `/v1/proposals/epochs` as `internal`, even though runtime handlers emit governed contract versions and the edge worker consumes them as source routes.

### 6) Local UI, Diagnostic, and Internal Validator Surfaces

Local UI surfaces:

```text
/
/dashboard
/api-browser
/explorer
/chat
```

Local diagnostic surfaces:

```text
/health*
/metrics
/api/*
/journal.log
/manifest
/gc.log
/segments/*
/v1/aeron/*
/v1/events/stream
/v1/ops/events/stream
```

Internal and compatibility surfaces:

```text
/v1/propose-write
/v1/propose-delete
/v1/binary/*
/v1/register-client
/v1/peers
/v1/ngrok-url
/v1/head
/v1/follower/head-update
/v1/ops/operations/{operationId}
/v1/gc/account/*
/v1/propose-gc
/v1/gc/execute
/v1/gc/vote
/v1/gc/trigger
/v1/explorer/epochs
/api/mock/*
/v1/chat
```

These routes are valid parts of the runtime, but they are not the canonical non-local product contract.

### 7) Edge-Owned Upstream Contract

`oak-chain-edge-worker` owns `/ops/v1/*`.

It is the only canonical non-local upstream contract.

Current upstream publication includes:

```text
/ops/v1/{overview,header,network,cluster,raft,replication,queue,signals,durability,health}
/ops/v1/proposals/{queue/stats,release-flow,epochs}
/ops/v1/proposals
/ops/v1/explorer/{summary,release-flow}
/ops/v1/explorer/proposal/{proposalId}
/ops/v1/explorer/wallets/{walletAddress}
/ops/v1/runtime/{aeron,media-driver,storage,blobstore,metrics}
/ops/v1/config/osgi*
/ops/v1/events/{recent,stats}
/ops/v1/transactions/{summary,{transactionId}}
/ops/v1/{finality,tarmk,tar-chain,blockchain/config}
/ops/v1/gc/{status,estimate}
/ops/v1/compaction/proposals
/ops/v1/fragmentation/metrics
/ops/v1/fragmentation/metrics/{walletAddress}
/ops/v1/fragmentation/top
```

The current target explorer and fragmentation source routes are now published upstream.

Any future source route gap should be treated as edge publication debt, not as a reason to bind remote clients directly to validator URLs.

## Why This Composition Matters

- Clear boundaries reduce operational confusion.
- Source-contract governance keeps UI and automation aligned to one runtime truth.
- Edge publication keeps browser and remote operator surfaces separate from validator-local concerns.
- Consensus-safe storage management prevents node divergence.
- Economic and storage layers can evolve independently with stable contracts.

## Read-Model Strategy (No On-Chain Indexing)

Oak Chain intentionally does not carry full-text or search indexing responsibilities in validator consensus state.

Model:

1. Oak Chain is canonical truth and verification.
2. Upstream services own discovery, ranking, aggregation, and agentic curation.

This keeps consensus deterministic and lean, while letting read intelligence evolve quickly without changing core validator behavior.

### Upstream Intelligent Service Pattern

Typical architecture:

1. **Ingest**

- Subscribe to `GET /v1/events/stream`.
- Poll backfill via `GET /v1/events/recent`.
- Pull canonical nodes with `GET /api/explore` and selected validator source routes.

2. **Materialize**

- Build wallet-scoped read models in search and index stores.
- Maintain denormalized projections for feeds, timelines, dashboards, and explorer pages.

3. **Enrich**

- Classify content and entities.
- Extract tags, topics, and relationships.
- Rank and cluster by tenant and wallet policy.
- Produce derived summaries and navigation views.

4. **Verify**

- Cross-check critical reads against validator source routes.
- Treat upstream indexes as read accelerators, not source of truth.

5. **Serve**

- Publish UX-oriented APIs behind `/ops/v1/*` or higher-level product contracts.
- Keep validator URLs out of public client contracts.

## Operator Guidance

When diagnosing issues, classify by layer first:

1. Source contract acceptance.
2. Queue and release progression.
3. Finality and durability acknowledgement.
4. Replication lag and leader health.
5. GC, fragmentation, and reclaim behavior.

Start with:

```bash
curl -s http://127.0.0.1:8090/v1/consensus/status | jq .
curl -s http://127.0.0.1:8090/v1/ops/snapshots/queue | jq .
curl -s http://127.0.0.1:8090/v1/ops/snapshots/replication | jq .
curl -s http://127.0.0.1:8090/v1/gc/status | jq .
```

Drop to `/v1/aeron/*` only when the normalized source routes are not enough.

For signal interpretation, see [Oak Chain Primary Signals](/guide/primary-signals).
