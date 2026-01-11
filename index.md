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
        A1[Wallet 0xABC]
        A2[Wallet 0xDEF]
    end
    
    subgraph Validators["Validator Network"]
        V0[Leader<br/>Port 8090]
        V1[Follower<br/>Port 8092]
        V2[Follower<br/>Port 8094]
        V0 <-->|Aeron Raft| V1
        V0 <-->|Aeron Raft| V2
        V1 <-->|Aeron Raft| V2
    end
    
    subgraph Storage["Storage Layer"]
        OAK[Oak Segments<br/>TAR files]
        IPFS[IPFS<br/>Binaries]
    end
    
    A1 -->|"POST /v1/propose-write<br/>+ ETH payment"| V0
    A2 -->|"POST /v1/propose-write<br/>+ ETH payment"| V0
    V0 --> OAK
    V0 --> IPFS
    
    style V0 fill:#627EEA,color:#fff
    style V1 fill:#4ade80,color:#000
    style V2 fill:#4ade80,color:#000
```

## The Model

1. **Author signs** content with Ethereum wallet
2. **Author pays** via smart contract (ETH)
3. **Leader validates** payment on Ethereum
4. **Leader proposes** write to Aeron cluster
5. **Followers replicate** via Raft consensus
6. **Content persists** in Oak segment store
7. **Binaries stored** in IPFS (CID in Oak)

Every write is cryptographically signed, economically backed, and replicated across the validator network.

## Quick Links

- [**Architecture Overview**](/architecture) - How the system works
- [**Quick Start**](/guide/) - Get running in 10 minutes
- [**Run a Validator**](/operators/) - Join the network
