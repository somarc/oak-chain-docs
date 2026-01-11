---
layout: home

hero:
  name: "Oak Chain"
  text: "Distributed Content Repository"
  tagline: Ethereum owns smart contracts. Oak owns enterprise content. We bridge the two.
  image:
    src: /oak-chain.svg
    alt: Oak Chain
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: Architecture
      link: /architecture
    - theme: alt
      text: Run a Validator
      link: /operators/

features:
  - icon: ⚡
    title: Aeron Cluster Consensus
    details: Leader-based Raft consensus with sub-second failover. Deterministic state machine ensures all validators converge.
    link: /guide/consensus
  - icon: 🔗
    title: Ethereum Economic Security
    details: Every write backed by Ethereum payment. Three tiers - Priority (~30s), Express (~6.4min), Standard (~12.8min).
    link: /guide/economics
  - icon: 🌳
    title: Oak Segment Store
    details: Enterprise-grade content repository. Immutable TAR segments, append-only journal, JCR API compatibility.
    link: /architecture
  - icon: 📦
    title: IPFS Binary Storage
    details: Content-addressed binaries via IPFS. Validators store CIDs, authors own storage. Direct binary access.
    link: /guide/binaries
  - icon: 🔄
    title: Real-Time Streaming
    details: Server-Sent Events for content discovery. Subscribe to live feed of all writes.
    link: /guide/streaming
  - icon: 🏢
    title: Multi-Organization
    details: Organization-scoped content paths. One wallet, multiple brands. Enterprise-ready isolation.
    link: /guide/paths
---

## How It Works

```mermaid
graph TB
    subgraph Authors["Content Authors"]
        A1["Wallet 0x74..."]
        A2["Wallet 0xAB..."]
    end
    
    subgraph ClusterA["Cluster A — Authoritative for Shards 00-7F"]
        direction TB
        subgraph WriteA["✏️ READ-WRITE (Own Shard)"]
            SA["/oak-chain/00/../7F/*"]
        end
        subgraph ReadA["👁️ READ-ONLY (Mounted)"]
            MA["/oak-chain/80/../FF/*"]
        end
        LA[Leader] --> SA
        LA -.->|mount| MA
    end
    
    subgraph ClusterB["Cluster B — Authoritative for Shards 80-FF"]
        direction TB
        subgraph WriteB["✏️ READ-WRITE (Own Shard)"]
            SB["/oak-chain/80/../FF/*"]
        end
        subgraph ReadB["👁️ READ-ONLY (Mounted)"]
            MB["/oak-chain/00/../7F/*"]
        end
        LB[Leader] --> SB
        LB -.->|mount| MB
    end
    
    A1 -->|"hash(0x74) → Shard 74<br/>→ Cluster A"| LA
    A2 -->|"hash(0xAB) → Shard AB<br/>→ Cluster B"| LB
    
    SA <-->|"HTTP Segment<br/>Transfer"| MB
    SB <-->|"HTTP Segment<br/>Transfer"| MA
    
    style LA fill:#627EEA,color:#fff
    style LB fill:#627EEA,color:#fff
    style SA fill:#4ade80,color:#000
    style SB fill:#4ade80,color:#000
    style MA fill:#64748b,color:#fff
    style MB fill:#64748b,color:#fff
```

### Composite Mount Architecture

Each cluster sees the **entire content graph** but can only **write to its own shard**:

| Cluster | Own Shard (Read-Write) | Mounted Shards (Read-Only) |
|---------|------------------------|---------------------------|
| **Cluster A** | `/oak-chain/00/../7F/*` | `/oak-chain/80/../FF/*` |
| **Cluster B** | `/oak-chain/80/../FF/*` | `/oak-chain/00/../7F/*` |

This enables:
- **Global reads** — Query any content from any cluster
- **Local writes** — Only the authoritative cluster accepts writes
- **Sovereignty** — Each cluster controls its shard completely

## The Model

1. **Author signs** content with Ethereum wallet
2. **Author pays** via smart contract (ETH)
3. **Router determines** which cluster owns the wallet's shard
4. **Leader validates** payment on Ethereum
5. **Leader proposes** write to Aeron cluster
6. **Followers replicate** via Raft consensus
7. **Content persists** in Oak segment store
8. **Binaries stored** in IPFS (CID in Oak)
9. **Cross-cluster reads** via HTTP segment transfer

Every write is cryptographically signed, economically backed, and replicated. Wallets are deterministically sharded across clusters for horizontal scalability.

## Quick Links

- [**Architecture Overview**](/architecture) - How the system works
- [**Quick Start**](/guide/) - Get running in 10 minutes
- [**Run a Validator**](/operators/) - Join the network

---

<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 3rem;">
  <img src="/oak-chain-logo.jpeg" alt="Oak Chain" style="max-width: 400px; border-radius: 12px; box-shadow: 0 8px 32px rgba(98, 126, 234, 0.3);" />
  <p style="color: #888; margin-top: 1rem; font-style: italic;">Jackrabbit Oak meets Blockchain</p>
</div>
