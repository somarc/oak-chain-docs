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
graph LR
    subgraph ClusterA["Cluster A"]
        direction TB
        LA[Leader + Followers]
        SA["✏️ /oak-chain/00-7F/*<br/>READ-WRITE"]
        MA["👁️ /oak-chain/80-FF/*<br/>READ-ONLY"]
        LA --> SA
        LA -.-> MA
    end
    
    subgraph ClusterB["Cluster B"]
        direction TB
        LB[Leader + Followers]
        SB["✏️ /oak-chain/80-FF/*<br/>READ-WRITE"]
        MB["👁️ /oak-chain/00-7F/*<br/>READ-ONLY"]
        LB --> SB
        LB -.-> MB
    end
    
    SA -->|"HTTP Segment Transfer"| MB
    SB -->|"HTTP Segment Transfer"| MA
    
    style SA fill:#4ade80,color:#000
    style SB fill:#4ade80,color:#000
    style MA fill:#64748b,color:#fff
    style MB fill:#64748b,color:#fff
    style LA fill:#627EEA,color:#fff
    style LB fill:#627EEA,color:#fff
```

**Each cluster is sovereign over its shard, but mounts all others read-only.**

| | Cluster A | Cluster B |
|---|-----------|-----------|
| **Writes** | `/oak-chain/00-7F/*` | `/oak-chain/80-FF/*` |
| **Reads** | Everything | Everything |

- **Wallet 0x74...** → hash maps to shard `74` → **Cluster A** is authoritative
- **Wallet 0xAB...** → hash maps to shard `AB` → **Cluster B** is authoritative

Authors write to their authoritative cluster. All clusters can read all content.

## Scaling

The architecture scales horizontally by adding clusters:

| Clusters | Shards/Cluster | Wallets Supported | Read Mounts/Cluster |
|----------|----------------|-------------------|---------------------|
| **2** | 128 shards | ~8M wallets | 1 mount |
| **20** | 12-13 shards | ~80M wallets | 19 mounts |
| **50** | 5 shards | ~200M wallets | 49 mounts |
| **100** | 2-3 shards | ~400M wallets | 99 mounts |
| **1,000** | 16 shards* | ~4B wallets | 999 mounts |

*At 1,000 clusters, shards are subdivided further (L4 sharding).

```mermaid
graph TB
    subgraph Scale["Network at 100 Clusters"]
        C1["Cluster 1<br/>Shards 00-02"]
        C2["Cluster 2<br/>Shards 03-05"]
        C3["Cluster 3<br/>Shards 06-08"]
        CDots["..."]
        C100["Cluster 100<br/>Shards FD-FF"]
    end
    
    C1 <-.->|"99 read-only mounts"| CDots
    C2 <-.-> CDots
    C3 <-.-> CDots
    C100 <-.-> CDots
    
    style C1 fill:#627EEA,color:#fff
    style C2 fill:#627EEA,color:#fff
    style C3 fill:#627EEA,color:#fff
    style C100 fill:#627EEA,color:#fff
    style CDots fill:#1a1a2e,color:#888
```

### Trade-offs at Scale

| Scale | Writes | Reads | Sync Overhead |
|-------|--------|-------|---------------|
| **Small (2-20)** | Fast | Fast | Low |
| **Medium (50-100)** | Fast | Fast | Moderate |
| **Large (1,000+)** | Fast | Fast | High (optimized via gossip) |

**Key insight**: Write throughput scales linearly (each cluster handles its shard independently). Read latency stays constant (local mount). Sync overhead grows with cluster count but is optimized via:
- Lazy segment fetching (pull on demand)
- Gossip-based journal propagation
- Hierarchical sync topology

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
