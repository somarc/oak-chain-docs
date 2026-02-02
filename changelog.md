---
prev: /operators/
next: /contributing
---

# Changelog

All notable changes to Oak Chain.

## [Unreleased]

### Added
- Public documentation site
- VitePress with Ethereum theme
- Mermaid diagram support

---

## [0.1.0] - 2026-01-10

### Added

#### Core Features
- **Aeron Cluster Consensus** - Raft-based distributed consensus
- **Ethereum Payment Integration** - Three-tier economic model (Priority/Express/Standard)
- **Wallet-Based Namespaces** - Content ownership via Ethereum addresses
- **Organization Scoping** - Multi-brand support per wallet
- **HTTP Segment Transfer** - Oak Cold Standby pattern for reads

#### Storage
- **Oak Segment Store** - TAR-based immutable segments
- **IPFS Binary Storage** - Content-addressed binaries with CID references
- **Sharded Paths** - 16.7M shards for scalability

#### API
- `POST /v1/propose-write` - Submit content writes
- `POST /v1/propose-delete` - Submit content deletions
- `GET /api/explore?path=...` - Read content
- `GET /v1/events/stream` - Server-Sent Events stream
- `GET /v1/consensus/status` - Cluster status
- `GET /health` - Health check

#### Operations
- Docker Compose configurations
- 3-validator local cluster setup
- Mock mode for development
- Sepolia testnet support

### Security
- Wallet signature verification
- Path ownership enforcement
- Payment verification via Beacon Chain

---

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| 0.1.0 | 2026-01-10 | Initial release |

---

## Upgrade Guide

### From Pre-release to 0.1.0

No breaking changes - this is the first release.

### Future Upgrades

Oak Chain follows semantic versioning:
- **Major** (1.0.0): Breaking API changes
- **Minor** (0.2.0): New features, backwards compatible
- **Patch** (0.1.1): Bug fixes

---

## Release Process

1. Features developed on feature branches
2. Merged to `main` after review
3. Tagged releases for stable versions
4. Docker images published to GitHub Container Registry

---

## Links

- [GitHub Releases](https://github.com/somarc/oak-chain-docs/releases)
- [Docker Images](https://github.com/somarc/oak-chain-validator/pkgs/container/oak-chain-validator)
- [Roadmap](/faq#roadmap)
