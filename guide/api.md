---
prev: /segment-gc
next: /guide/auth
---

# API Reference

Oak Chain has three HTTP layers that must not be conflated.

## Why This Matters

If you blur validator source routes, local-only routes, and edge-owned upstream routes, you will publish the wrong contract and build the wrong client.

## What You'll Prove

- You can identify which validator routes are governed source routes.
- You can keep local UI and diagnostic surfaces out of upstream product contracts.
- You can tell when a route exists on the validator but is not yet published upstream.

## Next Action

Start with `Published Specs`, then use the taxonomy below before wiring any browser, CLI, or automation client.

## Contract Boundary

`jackrabbit-oak` owns the validator-native runtime surface.

`oak-chain-edge-worker` owns the canonical upstream `/ops/v1/*` contract.

Local UI, browser, and diagnostic routes on the validator are allowed, but they are not product-contract authority.

## Published Specs

- Canonical upstream `/ops/v1/*`: [openapi.yaml](/openapi.yaml)
- Governed validator source routes: [openapi-validator-source.yaml](/openapi-validator-source.yaml)
- Live validator taxonomy feed: `GET /v1/index`

`/openapi.yaml` now documents the edge-owned upstream contract only.

`/openapi-validator-source.yaml` documents the governed validator routes that upstream composition is allowed to consume.

`/v1/index` remains the live local manifest, not the canonical publication artifact.

## Authentication

Validator token auth and edge auth are separate controls.

On the validator, `/health*` and `/v1/ops/snapshots/{health,runtime,storage}` bypass token auth so monitors and edge adapters can stay alive during boot and failure.

All other validator routes honor the validator bearer token when `OAK_VALIDATOR_AUTH_TOKEN` is configured.

On the edge adapter, `/ops/v1/*` accepts a bearer token when `OPS_API_AUTH_TOKEN` is configured, and `/ops/v1/runtime/*` can require the stricter runtime token when `OPS_RUNTIME_AUTH_TOKEN` is configured.

## Validator Taxonomy

### `source`

These are the governed validator-native routes that runtime code emits with stable `contractVersion` markers and that upstream composition may consume.

```text
/v1/consensus/leader
/v1/consensus/status
/v1/ops/snapshots/health
/v1/ops/snapshots/runtime
/v1/ops/snapshots/storage
/v1/ops/snapshots/cluster
/v1/ops/snapshots/replication
/v1/ops/snapshots/queue
/v1/proposals/queue/stats
/v1/proposals/release-flow
/v1/proposals/epochs
/v1/explorer/summary
/v1/explorer/release-flow
/v1/explorer/proposals/{proposalId}
/v1/explorer/wallets/{walletAddress}
/v1/config/osgi
/v1/config/osgi/schema
/v1/config/osgi/sources
/v1/config/osgi/coverage
/v1/config/osgi/delta
/v1/events/recent
/v1/events/stats
/v1/blockchain/config
/v1/gc/status
/v1/gc/estimate
/v1/compaction/proposals
/v1/fragmentation/metrics
/v1/fragmentation/metrics/{walletAddress}
/v1/fragmentation/top
```

`/v1/index` currently misclassifies `/v1/gc/estimate` and `/v1/proposals/epochs` as `internal`, but the handlers emit `gc.estimate.v1` and `proposal.epoch-overlay.v1`, and `oak-chain-edge-worker` consumes both as governed source routes.

### `local-ui`

These routes are validator-local browser surfaces for on-box operators.

```text
/
/dashboard
/api-browser
/explorer
/chat
```

### `local-diagnostic`

These routes expose useful local detail, but they are not canonical upstream product contracts.

```text
/v1/index
/health
/health/local
/health/deep
/health/cluster
/metrics
/api/metrics
/journal.log
/manifest
/gc.log
/segments/*
/api/explore
/api/segments/recent
/api/segments/tars
/api/blob/{blobId}
/api/cid/{oakBlobId}
/api/cid/reverse/{cid}
/api/cid/stats
/api/cid/gateway/{oakBlobId}
/v1/aeron/cluster-state
/v1/aeron/validator-identities
/v1/aeron/raft-metrics
/v1/aeron/node-status
/v1/aeron/leadership-history
/v1/aeron/replication-lag
/v1/events/stream
/v1/ops/events/stream
```

### `internal`

These routes are mutation, registration, compatibility, or test surfaces.

```text
/v1/propose-write
/v1/propose-delete
/v1/proposals/pending/count
/v1/proposals/{proposalId}/status
/v1/binary/declare-intent
/v1/binary/check-intent/{token}
/v1/binary/complete-upload
/v1/wallets/stats
/v1/wallets/content
/v1/register-client
/v1/peers
/v1/ngrok-url
/v1/head
/v1/follower/head-update
/v1/ops/operations/{operationId}
/v1/propose-gc
/v1/gc/execute
/v1/gc/vote
/v1/gc/trigger
/v1/gc/account/{walletAddress}
/v1/gc/account/{walletAddress}/pay
/v1/gc/account/{walletAddress}/set-limit
/v1/gc/account/{walletAddress}/execute-pending
/v1/explorer/epochs
/v1/chat
/api/mock/advance-epoch
/api/mock/set-epoch-offset
/api/mock/epoch-status
```

`/v1/explorer/epochs` is a deprecated compatibility route that points readers to `/v1/explorer/release-flow`.

## Canonical Upstream `/ops/v1/*`

The current edge worker publishes the following upstream contract today.

```text
/ops/v1/overview
/ops/v1/header
/ops/v1/network
/ops/v1/cluster
/ops/v1/raft
/ops/v1/replication
/ops/v1/queue
/ops/v1/signals
/ops/v1/durability
/ops/v1/health
/ops/v1/proposals
/ops/v1/proposals/queue/stats
/ops/v1/proposals/release-flow
/ops/v1/proposals/epochs
/ops/v1/explorer/summary
/ops/v1/explorer/release-flow
/ops/v1/runtime/aeron
/ops/v1/runtime/media-driver
/ops/v1/runtime/storage
/ops/v1/runtime/blobstore
/ops/v1/runtime/metrics
/ops/v1/config/osgi
/ops/v1/config/osgi/schema
/ops/v1/config/osgi/sources
/ops/v1/config/osgi/coverage
/ops/v1/config/osgi/delta
/ops/v1/events/recent
/ops/v1/events/stats
/ops/v1/transactions/summary
/ops/v1/transactions/{transactionId}
/ops/v1/finality
/ops/v1/tarmk
/ops/v1/tar-chain
/ops/v1/blockchain/config
/ops/v1/gc/status
/ops/v1/gc/estimate
/ops/v1/compaction/proposals
/ops/v1/fragmentation/metrics
```

Every upstream response is wrapped by the edge adapter in a top-level envelope with `version`, `generatedAt`, `clusterId`, and `data`.

Raw validator-local routes such as `/v1/aeron/*`, `/health/deep`, `/api/*`, `/metrics`, `/journal.log`, `/manifest`, `/segments/*`, `/dashboard`, `/api-browser`, `/explorer`, `/chat`, and `/v1/index` are not canonical upstream product contracts.

## Source Routes Not Yet Published Upstream

These validator source routes exist today but do not have matching `/ops/v1/*` publication in `oak-chain-edge-worker`.

```text
/v1/explorer/proposals/{proposalId}
/v1/explorer/wallets/{walletAddress}
/v1/fragmentation/metrics/{walletAddress}
/v1/fragmentation/top
```

If you need one of these routes remotely, treat that as edge publication debt rather than silently binding clients to direct validator URLs.

## Recommended Query Order

1. Start at `/ops/v1/*` for every non-local client, browser, or product-facing integration.
2. Drop to validator source routes only when you control the validator directly or you are implementing the edge adapter itself.
3. Use local-diagnostic and internal routes only for on-box investigation, signed mutation flows, or runtime compatibility work.

## Validator Source Query Set

```bash
# Canonical source truth
curl -s http://127.0.0.1:8090/v1/consensus/leader | jq .
curl -s http://127.0.0.1:8090/v1/consensus/status | jq .
curl -s http://127.0.0.1:8090/v1/ops/snapshots/cluster | jq .
curl -s http://127.0.0.1:8090/v1/ops/snapshots/queue | jq .
curl -s http://127.0.0.1:8090/v1/ops/snapshots/replication | jq .
curl -s http://127.0.0.1:8090/v1/ops/snapshots/runtime | jq .
curl -s http://127.0.0.1:8090/v1/ops/snapshots/storage | jq .
```

## Upstream Query Set

```bash
# Canonical remote contract
curl -s http://127.0.0.1:8787/ops/v1/cluster | jq .
curl -s http://127.0.0.1:8787/ops/v1/queue | jq .
curl -s http://127.0.0.1:8787/ops/v1/replication | jq .
curl -s http://127.0.0.1:8787/ops/v1/durability | jq .
curl -s http://127.0.0.1:8787/ops/v1/finality | jq .
```

For signal interpretation guidance, see [Oak Chain Primary Signals](/guide/primary-signals).
