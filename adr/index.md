# Architecture Decision Records

ADRs capture important architectural decisions with context and consequences.

## What is an ADR?

An **Architecture Decision Record** documents:
- **Context**: What situation motivated this decision?
- **Decision**: What did we choose?
- **Consequences**: What are the trade-offs?

ADRs are **immutable**. When a decision is superseded, we create a new ADR and mark the old one.

## Key Decisions

### Consensus

| ADR | Decision | Status |
|-----|----------|--------|
| [003](/adr/003-aeron-consensus) | Aeron Cluster for Raft consensus | ✅ Implemented |
| [005](/adr/005-http-segment-transfer) | HTTP for segment transfer | ✅ Implemented |

### Economics

| ADR | Decision | Status |
|-----|----------|--------|
| [004](/adr/004-economic-tiers) | Three economic finality tiers | ✅ Implemented |
| [046](/adr/046-cluster-payment) | Cluster-level payment model | Accepted |

### Storage

| ADR | Decision | Status |
|-----|----------|--------|
| [014](/adr/014-oak-anchor) | Oak segment format as strategic anchor | Accepted |
| [015](/adr/015-ipfs-storage) | IPFS for binary storage | ✅ Implemented |

### Content Model

| ADR | Decision | Status |
|-----|----------|--------|
| [001](/adr/001-sharding) | 12-bit deterministic sharding | Accepted |
| [037](/adr/037-org-paths) | Organization-scoped content paths | ✅ Implemented |

## Status Legend

| Status | Meaning |
|--------|---------|
| ✅ **Implemented** | Code complete and deployed |
| **Accepted** | Decision made, implementation planned |
| **Proposed** | Under consideration |
| **Superseded** | Replaced by newer ADR |
