# FAQ

Frequently asked questions about Oak Chain.

## General

### What is Oak Chain?

Oak Chain is a distributed content repository that bridges Ethereum's economic security with Apache Jackrabbit Oak's enterprise content model. It provides:

- **Decentralized storage** - Content replicated across validator network
- **Wallet-based identity** - Your Ethereum wallet is your namespace
- **Economic security** - Every write backed by ETH payment
- **Enterprise compatibility** - JCR API, Oak segments, AEM patterns

### How is it different from IPFS?

| Feature | Oak Chain | IPFS |
|---------|-----------|------|
| **Data model** | Hierarchical (JCR tree) | Content-addressed blobs |
| **Mutability** | Mutable paths | Immutable CIDs |
| **Consensus** | Raft (strong consistency) | DHT (eventual) |
| **Payment** | Built-in (ETH) | Separate (Filecoin) |
| **Query** | JCR queries | None (hash lookup only) |

Oak Chain uses IPFS for binary storage, but structured content lives in Oak segments.

### Who runs the validators?

Anyone can run a validator node. The network is permissionless. Validators:
- Receive ETH payments for storing content
- Participate in Raft consensus
- Replicate content across the network

### Is my content public?

Yes, all content on Oak Chain is publicly readable. For private content, encrypt before storing.

---

## Technical

### What's the maximum content size?

| Type | Limit |
|------|-------|
| Single write | 10 MB |
| Binary (IPFS) | Unlimited |
| Path depth | 100 levels |
| Organization name | 64 characters |

For large files, upload to IPFS and store the CID in Oak Chain.

### How fast is it?

| Tier | Latency | Use Case |
|------|---------|----------|
| PRIORITY | ~30 seconds | Urgent updates |
| EXPRESS | ~6.4 minutes | Normal publishing |
| STANDARD | ~12.8 minutes | Batch operations |

Latency is determined by Ethereum epoch finality, not Oak Chain itself.

### Can I delete content?

Yes. Submit a delete proposal with your wallet signature. The content is removed from the Oak tree, but:
- Historical segments may retain data until compaction
- IPFS binaries remain until unpinned
- Blockchain payment records are permanent

### What happens if a validator goes down?

Raft consensus handles failures automatically:
- **1 of 3 down**: Network continues normally
- **2 of 3 down**: Network pauses (no quorum)
- **Recovery**: Failed nodes catch up via snapshot

Failover takes < 5 seconds.

### Can I run my own cluster?

Yes! Oak Chain is open source. You can:
- Run a private cluster for your organization
- Join the public network as a validator
- Fork and customize for your use case

---

## Payments

### Why do I need to pay?

Payments provide:
1. **Spam prevention** - Cost deters abuse
2. **Validator incentives** - Operators earn for storage
3. **Economic finality** - Ethereum secures the network

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

## Security

### How is my content secured?

1. **Wallet signature** - Only you can write to your namespace
2. **Raft consensus** - Majority of validators must agree
3. **Ethereum finality** - Payments anchored to Ethereum
4. **Replication** - Content stored on multiple validators

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
- **Apache Jackrabbit Oak** - 10+ years in production at Adobe
- **Aeron Cluster** - Used in financial trading systems
- **Ethereum** - Battle-tested smart contracts

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

### Can I self-host?

Yes. Run your own validator cluster:

```bash
docker-compose -f testing/3-validators-aeron.yml up -d
```

See [Operators Guide](/operators/) for production setup.

---

## Roadmap

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
