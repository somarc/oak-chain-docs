# How Oak Chain Works

Interactive visual diagrams showing the architecture and data flows. **Click nodes** to see details, or hit **Play Animation** to watch data flow through the system.

## Architecture Overview

The complete system: Sling authors content, MetaMask handles payments, validators reach consensus, IPFS stores binaries, and Edge Delivery serves content globally.

<FlowGraph flow="architecture" :height="380" />

---

## Content Write Flow

When an author creates or modifies content in Sling, the change is **signed with their wallet**, submitted as a proposal to the Raft leader, **replicated across validators**, and committed to the Oak segment store. Every write is cryptographically signed and consensus-verified.

<FlowGraph flow="write" :height="420" />

### The Steps

1. **Author creates content** in Sling (via Composum or AEM SDK)
2. **Wallet signs** the content change with secp256k1 key
3. **Write proposal** is created with signature
4. **Raft leader** receives and validates the proposal
5. **Log replication** sends entry to all followers
6. **Followers acknowledge** receipt
7. **Commit** happens when majority confirms
8. **Oak Store** persists content to TAR segments

---

## Payment Flow

Users pay for content writes via **MetaMask**. The payment goes to a smart contract on Ethereum (Sepolia testnet), which emits an event. Validators monitor these events and **authorize writes** for the paying wallet address.

<FlowGraph flow="payment" :height="380" />

### Payment Tiers

| Tier | Confirmation Time | Use Case |
|------|-------------------|----------|
| **Priority** | ~30 seconds | Breaking news, urgent updates |
| **Express** | ~6.4 minutes | Standard publishing |
| **Standard** | ~12.8 minutes | Batch operations, archives |

---

## IPFS Binary Storage

Binary assets (images, PDFs, videos) are stored on **IPFS**, not in Oak segments. The author's local IPFS node pins the content and generates a **CID** (content-addressed hash). Oak stores only the CID reference, enabling global retrieval via any IPFS gateway.

<FlowGraph flow="ipfs" :height="380" />

### Why IPFS for Binaries?

- **Content-addressed**: Same content = same CID, automatic deduplication
- **Author-owned storage**: Validators don't store binaries, just CID references
- **Global availability**: Any IPFS gateway can serve the content
- **Immutable**: CID is a cryptographic hash of the content

---

## Raft Consensus State Machine

Validators use **Aeron Raft** for consensus. Nodes start as Followers, become Candidates on election timeout, and Leaders if they win majority votes. Leaders send heartbeats to maintain authority.

<FlowGraph flow="consensus" :height="420" />

### State Transitions

| From | To | Trigger |
|------|-----|---------|
| **Follower** | Candidate | Election timeout (no heartbeat) |
| **Candidate** | Leader | Receives majority votes |
| **Candidate** | Follower | Discovers higher term |
| **Leader** | Follower | Discovers higher term |

### Timing

- **Heartbeat interval**: 50ms
- **Election timeout**: 150-300ms (randomized)
- **Failover time**: Sub-second

---

## The Complete Picture

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHORING LAYER                          │
│  Sling Author + MetaMask Wallet + JCR API                   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    CONSENSUS LAYER                          │
│  Aeron Raft Cluster (Leader + Followers)                    │
│  • Signed write proposals                                   │
│  • Payment verification via Ethereum                        │
│  • Deterministic state machine                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    STORAGE LAYER                            │
│  Oak Segment Store (TAR files) + IPFS (binaries)            │
│  • Immutable segments                                       │
│  • Append-only journal                                      │
│  • Content-addressed binaries                               │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    DELIVERY LAYER                           │
│  Edge Delivery Services (CDN)                               │
│  • 100 Lighthouse score                                     │
│  • Global distribution                                      │
│  • Real-time streaming                                      │
└─────────────────────────────────────────────────────────────┘
```

## Key Principles

1. **Wallet = Identity**: Every participant has an Ethereum wallet
2. **Signed Proposals**: Every write is cryptographically signed
3. **Payment = Authorization**: No payment, no write
4. **Consensus = Truth**: Majority agreement determines state
5. **Immutable Storage**: Once written, content is permanent

---

<div style="text-align: center; margin-top: 3rem;">
  <a href="/guide/" class="action-btn">Get Started →</a>
</div>

<style>
.action-btn {
  display: inline-block;
  padding: 12px 28px;
  background: linear-gradient(135deg, #627EEA, #8C8DFC);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}
.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(98, 126, 234, 0.4);
}
</style>
