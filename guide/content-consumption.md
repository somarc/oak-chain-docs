---
prev: /guide/paths
next: /guide/binaries
---

# Content Consumption Guide

How consumers read Oak Chain content in practice.

This project is API-first. Consumers should read via validator APIs (and optional streaming), not by relying on AEM/Felix runtime consoles.

## Consumption Modes

### 1) Point Reads by Path

Use when you know the content path.

- `GET /api/explore?path=/oak-chain/...`

```bash
curl -s "http://127.0.0.1:8090/api/explore?path=/oak-chain/74/2d/35/0x742d.../Brand/content/page-173..." | jq .
```

Best for:
- detail views
- page render hydration
- operational debugging of a single node/path

### 2) Wallet-Scoped Listing

Use when you need discoverability by wallet.

- `GET /v1/wallets/content?wallet=0x...&page=&pageSize=`
- `GET /v1/wallets/stats?wallet=0x...`

```bash
curl -s "http://127.0.0.1:8090/v1/wallets/content?wallet=0x742d35Cc6634c0532925a3b844bc9e7595f0beb&page=0&pageSize=50" | jq .
curl -s "http://127.0.0.1:8090/v1/wallets/stats?wallet=0x742d35Cc6634c0532925a3b844bc9e7595f0beb" | jq .
```

Best for:
- listing and pagination
- dashboards
- ownership-scoped reporting

### 3) Real-Time Consumption (SSE)

Use when you need push-based update signals.

- `GET /v1/events/stream`
- `GET /v1/events/recent`
- `GET /v1/events/stats`

Best for:
- edge cache invalidation
- near-real-time sync consumers
- event-driven read models

### 4) Binary Retrieval

Structured content references binaries by blob/CID metadata.

- `GET /api/blob/{blobId}`
- `GET /api/cid/{blobId}`
- `GET /api/cid/reverse/{cid}`
- `GET /api/cid/gateway/{blobId}`

Best for:
- media delivery
- binary verification workflows
- CID-based lookup and tracing

## Upstream Aggregation and Agentic Flourish

Oak Chain is the canonical write/finality/provenance layer. Discovery and rich consumption should be built upstream.

Recommended upstream pipeline:

1. **Event intake**
- Consume `GET /v1/events/stream`
- Backfill with `GET /v1/events/recent`

2. **Canonical fetch**
- Resolve affected paths with `GET /api/explore`
- Pull wallet-scoped context from `/v1/wallets/content` and `/v1/wallets/stats`

3. **Read-model indexing**
- Build indexes/materialized views by wallet namespace and content type
- Support search, faceting, recommendations, and explorer views

4. **Agentic enrichment**
- Topic extraction, taxonomy assignment, relationship graphs
- Policy-aware ranking (wallet/organization rules)
- Summaries/collections generated as derived views

5. **Integrity checks**
- For critical or disputed reads, re-verify from validator endpoints
- Keep upstream model eventually consistent but integrity-anchored

## Recommended Read Pattern

1. List with `wallets/content` (or known path catalog).
2. Fetch details with `api/explore`.
3. Resolve binaries with CID/blob endpoints.
4. Subscribe to `events/stream` for freshness.

This gives stable pagination + deterministic node reads + low-latency invalidation.

## Source of Truth Rule

- Upstream services are for speed, search, and intelligence.
- Validator APIs are for canonical truth and verification.
- Never treat upstream indexes as authoritative for finality/provenance semantics.

## Consumer Types

### API Clients / SDK Consumers

Use HTTP endpoints directly. This is the default for web, mobile, and server consumers.

### Edge Worker Read Models

Use route-specific fetches from validator APIs to shape dashboard or control-plane payloads.

### AEM Connector Consumers

AEM integration can mount Oak Chain content read-only through connector/mount architecture. Even then, API endpoints remain the authoritative public contract.

## Consistency and Query Caveat

Oak Chain can store flexible JSON structures, but consumption quality depends on consistent property shapes per namespace.

If structure drifts, query/index behavior degrades and traversal limits can be hit. Keep namespace style guides stable.

### Pre-v1 Direction: Structure Governance

Before v1, treat structure as a contract, not a suggestion.

Proposed direction:

1. **Namespace schema profile**
- Each wallet/organization publishes an allowed content model profile.
- Profile defines required fields, allowed node types, and nested object rules.

2. **Depth-first JCR modeling (not flat blobs)**
- Prefer meaningful child nodes for domain structure (`metadata`, `body`, `assets`, `relations`).
- Avoid flat, unbounded key sprawl at one node level.
- Keep repeated structures in predictable child-node collections.

3. **Write-time validation modes**
- `observe`: collect violations only.
- `warn`: accept writes, return structured warnings.
- `enforce`: reject non-conforming writes.

4. **Deterministic path conventions**
- Stable conventions for content roots and node naming.
- Limit free-form path drift that breaks consumers and read models.

5. **Compatibility budget**
- Version schema profiles explicitly.
- Allow forward-compatible additions; gate breaking shape changes.

6. **Consumer contract tests**
- Add API contract tests that assert shape invariants on `/api/explore` and `/v1/wallets/content` responses.
- Fail CI when schema drift breaks consumers.

The goal is simple: canonical state remains flexible enough for evolution, but constrained enough that upstream read models and agents can reason reliably.

See:
- [API Reference](/guide/api)
- [Content Paths](/guide/paths)
- [Primary Signals](/guide/primary-signals)
