---
prev: /architecture
next: /project-composition
---

# System Map (Excalidraw)

If you only read one architecture artifact, use this one. It shows how request entry, consensus truth, settlement checks, and binary/storage behavior connect as one runtime.

## Diagram

![Oak Chain system map v2 showing experience surface, consensus truth plane, settlement and addressing plane, and runtime control-plane components](/diagrams/oak-chain-system-map-v2.svg)

## Excalidraw Source

- Editable source (v2): [`/diagrams/oak-chain-system-map-v2.excalidraw`](/diagrams/oak-chain-system-map-v2.excalidraw)
- Previous source (v1): [`/diagrams/oak-chain-system-map.excalidraw`](/diagrams/oak-chain-system-map.excalidraw)

## Why This Map Matters

Most people miss Oak Chain by looking at isolated docs pages. This map closes that gap by showing where each module sits in the full write-to-read path.

## How To Read The Map

1. Start at the experience surface (`dashboard`, `supply chain app`, `SDK`, `connector`).
2. Follow requests into the consensus truth plane (`oak-segment-consensus`, `Aeron/Raft`, validator cluster).
3. Track settlement and addressing dependencies (`smart contracts`, `IPFS binary layer`).
4. Use observability surfaces (`/v1/queue`, `/v1/consensus`, `/v1/gc`, events) to verify runtime behavior.

## Critical Paths

### 1) Authoring Write Path

1. Ingest from app, SDK, or connector.
2. Normalize and validate namespace/auth.
3. Enqueue proposal with durability class.
4. Execute consensus and commit segment state.
5. Link CID references for binaries.

Primary docs:
- [Proposal Flow](/guide/proposal-flow)
- [Consensus Model](/guide/consensus)
- [Economic Tiers](/guide/economics)

### 2) Settlement and Policy Path

1. Payment proof and contract checks gate writes.
2. Finality/durability policy influences queue progression.
3. Contract outcomes surface back into validator policy and ops telemetry.

Primary docs:
- [Testnet Guide](/guide/testnet)
- [API Reference](/guide/api)
- [Primary Signals](/guide/primary-signals)

### 3) Read and Delivery Path

1. Committed content surfaces through read APIs.
2. Events stream enables near-real-time consumers.
3. Binary retrieval resolves via CID and gateway surfaces.

Primary docs:
- [Content Consumption](/guide/content-consumption)
- [Real-Time Streaming](/guide/streaming)
- [Binary Storage](/guide/binaries)

## Covered Components

| Component | Role | Canonical Doc |
|---|---|---|
| `oak-chain-dashboard-eds` | Runtime/ops entry surface | [Primary Signals](/guide/primary-signals) |
| `oak-content-supply-chain-web` | Content ingest and policy entry surface | [Proposal Flow](/guide/proposal-flow) |
| `oak-chain-sdk` | App integration surface | [Integration Guide](/guide/aem-integration) |
| `oak-chain-connector` | AEM integration surface | [Integration Guide](/guide/aem-integration) |
| `oak-segment-consensus` | Proposal state machine + segment commit | [Consensus Model](/guide/consensus) |
| `Aeron Cluster / Raft` | Replication + leader election | [Consensus Model](/guide/consensus) |
| `oak-chain-smart-contracts` | Settlement verification boundary | [Testnet Guide](/guide/testnet) |
| `IPFS binary layer` | CID-backed binary durability path | [Binary Storage](/guide/binaries) |
| `oak-ingress-normalizer` | Request normalization and policy guards | [Proposal Flow](/guide/proposal-flow) |
| `oak-chain-edge-worker` + `oak-chain-edge-worker-io` | Worker APIs and edge event fan-out | [Real-Time Streaming](/guide/streaming) |
| `oak-meta` | Schema and metadata control | [Content Paths](/guide/paths) |
| `oak-magnum-oakus` | Experimental orchestration/tooling (non-critical path) | [Project Composition](/project-composition) |

## What Changed In v2

- Expanded content supply chain into explicit ingest -> validate -> enqueue -> consensus -> commit -> read surfaces.
- Expanded smart-contract responsibilities around payment verification, durability/finality policy hooks, and settlement signals.
- Added stronger separation-of-concerns framing across experience, consensus truth plane, settlement/addressing, and observability.
- Added a runtime/control-plane lane to capture `oak-ingress-normalizer`, `oak-chain-edge-worker`, `oak-chain-edge-worker-io`, `oak-meta`, and `oak-magnum-oakus`.

## Excalidraw Power Use

- Use browser find (`Cmd/Ctrl+F`) in the `.excalidraw` source for component IDs and lanes.
- Keep one box per runtime responsibility and one arrow per dependency contract.
- When adding components, update both the diagram and the component table on this page in the same change.
- Preserve the critical path ordering: ingest -> verify -> enqueue -> consensus -> commit -> read.

## Version Metadata

- Current map: `v2`
- Source of truth file: `/public/diagrams/oak-chain-system-map-v2.excalidraw`
- Last reviewed scope: experience, consensus, settlement/addressing, observability, runtime/control-plane
- Update trigger: any new runtime module or dependency that changes write, settlement, or read paths
