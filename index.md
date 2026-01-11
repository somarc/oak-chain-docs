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
        A1["Wallet 0x74...<br/>(Shard 74-2d-35)"]
        A2["Wallet 0xAB...<br/>(Shard ab-cd-ef)"]
    end
    
    subgraph Router["Deterministic Routing"]
        R[hash wallet → shard → cluster]
    end
    
    subgraph C1["Cluster A (Shards 00-7F)"]
        L1[Leader]
        F1a[Follower]
        F1b[Follower]
        L1 <-->|Raft| F1a
        L1 <-->|Raft| F1b
    end
    
    subgraph C2["Cluster B (Shards 80-FF)"]
        L2[Leader]
        F2a[Follower]
        F2b[Follower]
        L2 <-->|Raft| F2a
        L2 <-->|Raft| F2b
    end
    
    subgraph Storage["Storage Layer"]
        OAK[Oak Segments]
        IPFS[IPFS Binaries]
    end
    
    A1 -->|"+ ETH payment"| R
    A2 -->|"+ ETH payment"| R
    R -->|"0x74... → Cluster A"| L1
    R -->|"0xAB... → Cluster B"| L2
    
    C1 <-->|"HTTP Segment Transfer<br/>(Cross-Cluster Reads)"| C2
    
    L1 --> OAK
    L2 --> OAK
    L1 --> IPFS
    L2 --> IPFS
    
    style L1 fill:#627EEA,color:#fff
    style L2 fill:#627EEA,color:#fff
    style F1a fill:#4ade80,color:#000
    style F1b fill:#4ade80,color:#000
    style F2a fill:#4ade80,color:#000
    style F2b fill:#4ade80,color:#000
    style R fill:#8C8DFC,color:#fff
```

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
