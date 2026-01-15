# FAQ

Frequently asked questions about Oak Chain.

## The Big Questions

### Why does this exist?

Oak Chain is built on two axioms:

1. **Ethereum is physics.** BlackRock, Visa, and JPMorgan have made irreversible commitments to Ethereum. This isn't adoption; it's re-architecture.

2. **Oak is entrenched.** Jackrabbit Oak already stores the majority of the planet's high-stakes digital experiences. Fortune 500 commerce, healthcare, government.

We're building the bridge for when these two systems meet.

→ [Read the full thesis](/thesis)

### Why now?

Because the institutions have moved.

When BlackRock launches BUIDL on Ethereum, when Visa settles USDC directly, when JPMorgan routes Onyx through Ethereum rails: these aren't experiments. They're irreversible commitments.

The question isn't "will content need blockchain?" The question is "which content infrastructure will be ready?"

### What if Ethereum fails?

Then this project fails too.

We've made an explicit bet. Oak Chain treats Ethereum's dominance as physics, not opinion. But we're betting alongside BlackRock, Visa, and JPMorgan. If Ethereum fails, we have bigger problems than a content repository.

This is honest infrastructure building: we've chosen our foundation, and we're building on it.

### What if no one uses this?

Oak Chain is infrastructure for a convergence we believe is inevitable: enterprise content (Oak) meets blockchain ownership (Ethereum).

If we're wrong about the timing, we're early. The infrastructure will be ready when the demand arrives.

If we're wrong about the convergence itself, we've built a very good distributed Oak cluster anyway. The technology works regardless of adoption.

---

## Understanding Oak Chain

### How is it different from IPFS?

| Feature | Oak Chain | IPFS |
|---------|-----------|------|
| **Data model** | Hierarchical (JCR tree) | Content-addressed blobs |
| **Mutability** | Mutable paths | Immutable CIDs |
| **Consensus** | Raft (strong consistency) | DHT (eventual) |
| **Payment** | Built-in (ETH) | Separate (Filecoin) |
| **Query** | JCR queries | None (hash lookup only) |

Oak Chain uses IPFS for binary storage, but structured content lives in Oak segments.

### How is it different from Arweave?

| Feature | Oak Chain | Arweave |
|---------|-----------|---------|
| **Data model** | Hierarchical (JCR tree) | Flat key-value |
| **Mutability** | Mutable paths | Immutable (append-only) |
| **Payment** | Per-write (ETH) | One-time "permanent" fee (AR) |
| **Enterprise tooling** | JCR API, Sling, AEM patterns | Custom APIs |
| **Consensus** | Raft (deterministic) | Proof of Access |

Arweave optimizes for permanent archival. Oak Chain optimizes for enterprise content management with blockchain ownership.

### Who runs the validators?

Anyone can run a validator node. The network is permissionless. Validators:
- Receive ETH payments for storing content
- Participate in Raft consensus
- Replicate content across the network

### Is my content public?

Yes, all content on Oak Chain is publicly readable. For private content, encrypt before storing.

---

## Payments & Economics

### Why do I need to pay?

Payments provide:
1. **Spam prevention.** Cost deters abuse.
2. **Validator incentives.** Operators earn for storage.
3. **Economic finality.** Ethereum secures the network.
4. **Quality filter.** Only content worth publishing gets published.

### Is Oak Chain for everything?

**No.** Oak Chain is for *published* content meant to be seen and shared.

| Use Case | Oak Chain? | Why |
|----------|------------|-----|
| Public website | ✅ Yes | Meant to be seen |
| Product catalog | ✅ Yes | Shared with customers |
| Press releases | ✅ Yes | Public announcements |
| Internal drafts | ❌ No | Keep on enterprise AEM |
| Dev/test content | ❌ No | Use testnet or local |
| Bulk data dumps | ❌ No | Economically prohibitive |

**The economic filter**: Writing costs ETH. This naturally curates the network. You won't pay to store garbage. But the network is open, so low-quality content isn't *excluded*, just *discouraged* by cost.

> **Think of it like publishing**: You *could* print anything, but printing costs money, so you publish what matters.

### How much does it cost?

| Tier | Price | Monthly (1000 writes) |
|------|-------|----------------------|
| PRIORITY | 0.00001 ETH | ~0.01 ETH (~$25) |
| EXPRESS | 0.000002 ETH | ~0.002 ETH (~$5) |
| STANDARD | 0.000001 ETH | ~0.001 ETH (~$2.50) |

*Prices at ~$2500/ETH*

### Can I use testnet for free?

Yes! Use Sepolia testnet with free test ETH:
- [sepoliafaucet.com](https://sepoliafaucet.com)
- [infura.io/faucet/sepolia](https://www.infura.io/faucet/sepolia)

See [Testnet Guide](/guide/testnet) for setup.

### What if my payment fails?

- Transaction reverted → No charge, retry
- Insufficient funds → Get more ETH, retry
- Wrong tier amount → Payment rejected, retry with correct amount

Validators verify payment before accepting writes.

---

## Technical

### How fast is it?

| Tier | Latency | Use Case |
|------|---------|----------|
| PRIORITY | ~30 seconds | Urgent updates |
| EXPRESS | ~6.4 minutes | Normal publishing |
| STANDARD | ~12.8 minutes | Batch operations |

Latency is determined by Ethereum epoch finality, not Oak Chain itself.

### What's the maximum content size?

| Type | Limit |
|------|-------|
| Single write | 10 MB |
| Binary (IPFS) | Unlimited |
| Path depth | 100 levels |
| Organization name | 64 characters |

For large files, upload to IPFS and store the CID in Oak Chain.

### Can I delete content?

Yes. Submit a delete proposal with your wallet signature. The content is removed from the Oak tree, but:
- Historical segments may retain data until compaction
- IPFS binaries remain until unpinned
- Blockchain payment records are permanent

### What about abandoned or spam content?

Oak Chain introduces **cross-cluster garbage collection proposals**:

| Scenario | Who Proposes | Outcome |
|----------|--------------|---------|
| Owner deletes | Content owner | Immediate removal |
| Abandoned content | Any cluster | Flagged for review |
| Spam/abuse | Validator consensus | Community decision |

Since clusters mount each other read-only, they can observe content quality. If Cluster B sees spam in Cluster A's shard, Cluster B can propose deletion. The authoritative cluster (A) decides whether to accept.

This creates a **community moderation layer** without central authority. Clusters have economic incentive to maintain quality (validators want a reputable network).

### What happens if a validator goes down?

Raft consensus handles failures automatically:
- **1 of 3 down**: Network continues normally
- **2 of 3 down**: Network pauses (no quorum)
- **Recovery**: Failed nodes catch up via snapshot

Failover takes < 5 seconds.

---

## Security

### How is my content secured?

1. **Wallet signature.** Only you can write to your namespace.
2. **Raft consensus.** Majority of validators must agree.
3. **Ethereum finality.** Payments anchored to Ethereum.
4. **Replication.** Content stored on multiple validators.

### Can someone else write to my namespace?

No. Every write requires a signature from the namespace owner's wallet. Without your private key, no one can:
- Create content under your wallet path
- Modify your existing content
- Delete your content

### What if I lose my wallet?

**Your content remains accessible** (public reads), but you cannot:
- Write new content to that namespace
- Modify existing content
- Delete content

**Best practice**: Use a hardware wallet and secure your seed phrase.

### Is the code audited?

Oak Chain is built on:
- **Apache Jackrabbit Oak.** 10+ years in production at Adobe.
- **Aeron Cluster.** Used in financial trading systems.
- **Ethereum.** Battle-tested smart contracts.

The Oak Chain integration layer is open source for review.

---

## Integration

### Does it work with AEM?

Yes! Oak Chain is designed for AEM compatibility:
- Same JCR API
- Same content model
- Same Sling patterns
- HTTP segment transfer (like Cold Standby)

### Can I use it with React/Vue/etc?

Yes. Oak Chain exposes a REST API:

```javascript
// Read content
const response = await fetch('http://validator:8090/api/content/...');
const content = await response.json();

// Write content (with wallet signature)
await fetch('http://validator:8090/v1/propose-write', {
  method: 'POST',
  body: JSON.stringify({ wallet, path, content, signature }),
});
```

### Is there a JavaScript SDK?

Coming soon! For now, use the REST API directly. See [API Reference](/guide/api).

### Can I run my own cluster?

Yes! Oak Chain is open source. You can:
- Run a private cluster for your organization
- Join the public network as a validator
- Fork and customize for your use case

```bash
docker-compose -f testing/3-validators-aeron.yml up -d
```

See [Operators Guide](/operators/) for production setup.

---

## Roadmap & Contributing

### What's coming next?

- [ ] JavaScript SDK
- [ ] GraphQL API
- [ ] Content versioning
- [ ] Access control lists
- [ ] Mainnet launch

### How can I contribute?

- **Code**: [github.com/somarc/oak-chain-docs](https://github.com/somarc/oak-chain-docs)
- **Docs**: Edit any page (link at bottom)
- **Feedback**: Open an issue

See [Contributing](/contributing) guide.

---

## Still have questions?

- **GitHub Issues**: [github.com/somarc/oak-chain-docs/issues](https://github.com/somarc/oak-chain-docs/issues)
- **Documentation**: Browse the sidebar
- **Source Code**: [github.com/somarc](https://github.com/somarc)
