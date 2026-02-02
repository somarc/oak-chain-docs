---
prev: /bull-case
next: /how-it-works
---

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

### Who runs the validators?

Anyone can run a validator node. The network is permissionless. Validators:
- Receive ETH payments for storing content
- Participate in Raft consensus
- Replicate content across the network

### How much do validators earn? What are the costs?

**Earnings**:
- Validators receive a **share of write fees** paid by authors
- Share varies by tier (PRIORITY pays more than STANDARD)
- Distributed among cluster members (leader + followers)

**Costs**:
- **Hardware**: 4-8 CPU cores, 8-16GB RAM, 100GB+ SSD (see [Operators Guide](/operators/))
- **Storage**: Grows with content volume (Oak segments + IPFS CIDs)
- **Network**: 100 Mbps+ bandwidth for replication
- **Ethereum RPC**: Infura/Alchemy API costs (~$50-200/month)

**Economics**: Validator economics are designed to be sustainable—authors pay for storage, validators earn for providing it. Exact revenue depends on network usage and tier distribution.

See [Economic Tiers](/guide/economics) for payment details.

### Is my content public?

Yes, all content on Oak Chain is publicly readable. For private content, encrypt before storing.

### What's the difference between SDK (Model 1) and AEM Connector (Model 2)?

Oak Chain offers two integration paths:

**Model 1: Oak Chain SDK** (Blockchain-Native)
- **For**: New applications, modern web/mobile apps, EDS deployments
- **Technology**: JavaScript/TypeScript SDK with REST API client
- **Integration**: Direct HTTPS API calls to validators
- **Best when**: Building from scratch, using React/Next.js, or deploying to Edge Delivery Services

**Model 2: Oak Chain Connector** (AEM Integration)
- **For**: Existing Adobe Experience Manager customers
- **Technology**: AEM package (OSGi bundle) using Oak's composite mount
- **Integration**: JCR API via composite mount pattern (like Cold Standby)
- **Best when**: Already running AEM 6.5+ or AEM Cloud Service, want to keep existing workflows

Both models connect to the same validator cluster. The difference is how your application accesses Oak Chain—SDK for new apps, Connector for existing AEM.

See [Architecture](/architecture) for detailed comparison.

### What happens if my IPFS node goes down?

IPFS is decentralized—if your node goes down, binaries remain available if:
- **Other IPFS nodes** have pinned your content
- **IPFS gateways** (ipfs.io, Cloudflare, Pinata) cached your CID
- **CDN edge caches** have the binary

**Best practices**:
- Use a **pinning service** (Pinata, Infura IPFS, web3.storage) for redundancy
- Pin important binaries on **multiple IPFS nodes**
- Use **IPFS gateways** as fallback (configured in your application)

**Important**: Validators store only CIDs (46 bytes), not binaries. If all IPFS nodes lose a binary, you'll need to re-upload it, but the CID reference in Oak Chain remains valid.

See [Binary Storage Guide](/guide/binaries) for IPFS setup.

### How does wallet-based sharding work?

Content is automatically assigned to clusters based on your wallet address hash:

```java
int shard = hash(walletAddress) & 0xFFF;  // 12-bit = 4096 shards
Cluster cluster = shardToCluster(shard);
```

**You cannot choose** which cluster stores your content—assignment is deterministic and automatic. This ensures:
- **Fair distribution** across clusters
- **Consistent routing** (same wallet → same cluster)
- **Fault isolation** (issues contained to shard)

**Path structure** reflects sharding:
```
/oak-chain/{L1}/{L2}/{L3}/0x{wallet}/...
```
The `{L1}/{L2}/{L3}` prefix (first 6 hex chars) determines shard assignment.

All clusters can **read** all content via composite mounts, but only your assigned cluster can **write** to your namespace.

See [Content Paths](/guide/paths) for details.

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

### What's the minimum cluster size? How many validators do I need?

**Minimum**: 3 validators (for fault tolerance)
- 1 can fail, network continues
- 2 failures = no quorum, network pauses

**Recommended**: 5 validators (production)
- Can tolerate 2 failures
- Better performance under load
- More geographic distribution

**Maximum per cluster**: ~7-9 validators (Aeron Raft limit)
- Beyond this, performance degrades
- For scale, use **sharding** (multiple clusters)

**Scaling strategy**: Don't make one massive cluster. Shard into many small clusters (3-5 nodes each). This is how systems like EigenLayer DA, Espresso, and Near scale.

See [Operators Guide](/operators/) for cluster setup.

### Can I migrate existing AEM content to Oak Chain?

Yes, but migration tools are in development. Current options:

**Option 1: Export/Import via Oak TAR**
- Export content from AEM as Oak TAR segments
- Import segments to Oak Chain via validator API
- Maintains JCR structure and metadata

**Option 2: Content API Migration**
- Use AEM's Content Services API to read content
- Write to Oak Chain via Connector or SDK
- Requires custom migration script

**Option 3: Gradual Migration**
- Install Oak Chain Connector in AEM
- Mount `/oak-chain` read-only initially
- Migrate content incrementally via write proposals

**Note**: Binary migration requires uploading binaries to IPFS first, then storing CIDs in Oak Chain.

Migration tooling is planned for future releases. See [AEM Integration Guide](/guide/aem-integration) for current integration options.

### What's the read/write performance? How many writes per second?

**Write throughput**:
- **Single cluster**: ~100-1000 writes/sec (depends on payload size)
- **Bottleneck**: Ethereum finality (not Oak Chain itself)
- **Scaling**: Add clusters via sharding for linear scale

**Read performance**:
- **Local reads**: Sub-millisecond (from local Oak segments)
- **Remote reads**: ~10-50ms (via HTTP segment transfer)
- **CDN cached**: <10ms (edge delivery)

**Latency** (write confirmation):
- PRIORITY: ~30 seconds (1 Ethereum epoch)
- EXPRESS: ~6.4 minutes (2 epochs)
- STANDARD: ~12.8 minutes (2 epochs)

**Note**: Oak Chain uses Aeron Raft, which can handle 100,000+ messages/sec at the messaging layer. Actual throughput depends on Oak segment store operations and Ethereum verification.

For high-throughput use cases, consider batching writes or using multiple clusters.

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

### Is Oak Chain GDPR/HIPAA compliant?

**Current status**: Oak Chain is **public by design**—all content is publicly readable. This creates compliance challenges:

**GDPR concerns**:
- **Right to erasure**: Content can be deleted, but historical segments may persist until GC
- **Data portability**: Content is exportable (Oak TAR format)
- **Data residency**: Validators may be in any jurisdiction

**HIPAA concerns**:
- **Public accessibility**: All content is readable by anyone
- **Encryption**: Encrypt PHI before storing (Oak Chain doesn't encrypt at rest)
- **Audit trails**: Blockchain provides immutable audit logs

**Recommendations**:
- **Encrypt sensitive data** before storing in Oak Chain
- **Use Oak Chain for public content** only (product catalogs, marketing)
- **Keep PHI/PII in private AEM** instances
- **Consider private clusters** for compliance-sensitive content

**Future**: Access control lists (ACLs) and encryption at rest are planned features.

### Can I export my content? What format?

Yes. Oak Chain uses **Oak TAR segment format**, which is:
- **Standard Oak format** (compatible with any Oak repository)
- **Exportable** via validator API or Oak tools
- **Portable** to other Oak-based systems

**Export options**:
- **TAR segments**: Full repository export (segments + journal)
- **Content API**: JSON export via REST API
- **JCR API**: Standard JCR export (if using AEM Connector)

**Migration away**: You can export your content and import it into:
- Another Oak Chain cluster
- Standard AEM instance
- Any Oak-based CMS

**Note**: IPFS binaries must be exported separately (download from IPFS by CID).

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
const response = await fetch('http://validator:8090/api/explore?path=/oak-chain/...');
const content = await response.json();

// Write content (with wallet signature)
await fetch('http://validator:8090/v1/propose-write', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    walletAddress: wallet,
    message: JSON.stringify(content),
    ethereumTxHash: txHash,
    signature,
  }),
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

### Can an organization use multiple wallets?

Yes. Organizations can use multiple wallets for:
- **Brand separation**: Different wallets for different brands/products
- **Team isolation**: Separate wallets per team/department
- **Security**: Limit exposure if one wallet is compromised

**Management**:
- Each wallet has its own namespace (`/oak-chain/{shard}/0x{wallet}/...`)
- Content is isolated per wallet
- No built-in cross-wallet management UI (use your own tooling)

**Best practice**: Use a **wallet management system** (like MetaMask's account switching or a multi-sig wallet) to manage multiple wallets.

### Is there content versioning?

**Current status**: Oak Chain uses Oak's **immutable segment store**, which provides:
- **Revision history**: Every write creates a new revision
- **Access via revision**: Can read content at specific revisions
- **JCR versioning**: Not yet implemented (planned feature)

**How it works**:
- Each write creates a new **revision** (like Git commits)
- Previous revisions remain accessible until GC
- Revision access via HTTP is not yet exposed (planned).

**Limitations**:
- No **JCR versioning API** yet (planned)
- No **version labels** or **branches**
- GC may remove old revisions (configurable retention)

**Future**: Full JCR versioning support is planned, including version labels, checkpoints, and version history APIs.

### Who pays Ethereum gas fees?

**Authors pay** for both:
1. **Write fees** (to Oak Chain validators) - ETH payment to smart contract
2. **Gas fees** (to Ethereum network) - Transaction costs

**Gas costs**:
- Write proposal transaction: ~85,000-220,000 gas
- At ~20 gwei: ~$2-5 per write (varies with network congestion)
- **Not included** in Oak Chain write fees

**Optimization**: Use **Layer 2** (Arbitrum, Optimism) or **batch transactions** to reduce gas costs.

**Note**: Oak Chain write fees are separate from Ethereum gas. You pay both.

### What query languages are supported?

**Current**:
- **JCR queries** (XPath, SQL-2) - via AEM Connector
- **REST API** - JSON responses for content reads
- **SSE streaming** - Real-time content feed

**Planned**:
- **GraphQL API** - For flexible queries
- **Full-text search** - Via Oak indexes

**Note**: Oak Chain uses Oak's query engine, so standard JCR query syntax works. Queries execute against the local Oak segment store (fast) or remote clusters via composite mounts.

### How do I monitor my content? What metrics are available?

**Available metrics**:
- **Validator dashboard**: `http://validator:8090/` - Cluster status, peers, latest epoch
- **Prometheus metrics**: `http://validator:8090/metrics` - Write throughput, storage, cluster state
- **Health endpoint**: `http://validator:8090/health` - Node health status

**Metrics include**:
- `oak_chain_writes_total{tier="..."}` - Write count by tier
- `oak_chain_cluster_role` - Leader/follower status
- `oak_chain_cluster_term` - Raft term number
- `oak_chain_storage_bytes` - Storage usage

**Grafana dashboards**: Production dashboards in development. See [Operators Guide](/operators/) for current monitoring setup.

### Are there rate limits on writes?

**No hard rate limits**, but practical constraints:
- **Ethereum finality**: ~2 epochs per write (6.4 min for EXPRESS tier)
- **Raft consensus**: ~100-1000 writes/sec per cluster (depends on payload)
- **Gas costs**: High-frequency writes become expensive

**Best practices**:
- **Batch writes** when possible (multiple nodes in one proposal)
- **Use STANDARD tier** for bulk operations
- **Distribute across clusters** via sharding for higher throughput

**Note**: Spam prevention comes from **economic cost** (ETH payments), not rate limits.

### Can I transfer content ownership to another wallet?

**Not directly**. Content is tied to the wallet that created it. Options:

**Option 1: Re-publish**
- Export content from old wallet namespace
- Re-publish to new wallet namespace (pays write fees again)
- Old content remains (but orphaned)

**Option 2: Reference**
- Keep content in original wallet
- Create references/links from new wallet namespace
- Cross-wallet references work via composite mounts

**Future**: Content ownership transfer is a planned feature, allowing wallet-to-wallet transfers with proper authorization.

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
