---
prev: /architecture
next: /guide/consensus
---

# Developer Guide

If you need to trust who wrote content and why it was accepted, start by running Oak Chain locally and verifying one signed write.

Most teams miss this because they start from architecture diagrams. Start from observable behavior first.

## Why This Matters

This guide is the shortest path from concept to evidence. It helps you validate trust and durability behavior before system-level adoption decisions.

## What You'll Prove

- You can run a validator cluster locally.
- You can submit and verify a signed write.
- You can observe consensus and storage outcomes directly.

## Next Action

Complete the 10-minute first win below, then continue into `Consensus Model` as your primary deep dive.

## Who This Is For

- **Developers** building applications on Oak Chain
- **Existing AEM clients** exploring content provenance
- **Validator operators** testing locally before mainnet
- **Anyone** wanting to understand how Oak Chain works

## Your First Win (10 Minutes)

Do this before deeper reading:

1. Start a 3-validator local cluster
2. Confirm one node is `LEADER` and two are `FOLLOWER`
3. Submit one write proposal
4. Read it back from the API

If these four checks pass, you have proven the core trust path locally.

## Prerequisites

- Docker & Docker Compose
- 8GB RAM minimum
- Ports 8090, 8092, 8094 available

## Start the Cluster

```bash
# Clone the repositories
git clone https://github.com/mhess_adobe/blockchain-aem-infra.git
git clone https://github.com/somarc/jackrabbit-oak.git

# Build the validator JAR first
cd jackrabbit-oak
mvn clean install -pl oak-segment-consensus -am -DskipTests

# Copy JAR to infra directory
cp oak-segment-consensus/target/oak-segment-consensus.jar \
   ../blockchain-aem-infra/docker-compose/

# Start 3-validator cluster
cd ../blockchain-aem-infra/docker-compose
docker-compose -f testing/3-validators-aeron.yml up -d

# Check status
docker-compose -f testing/3-validators-aeron.yml ps
```

> **Note**: Pre-built Docker images coming soon. For now, build from source.

## Verify It's Working

### Check Validator Dashboard

Open http://localhost:8090 in your browser.

You should see:
- Cluster status: **LEADER** or **FOLLOWER**
- Connected peers: 2
- Latest epoch from Ethereum Beacon Chain

### Check API Health

```bash
# Leader status
curl http://localhost:8090/v1/consensus/status

# Expected response:
{
  "role": "LEADER",
  "term": 1,
  "peers": ["validator-1", "validator-2"],
  "epoch": 12345
}
```

### Write Some Content

```bash
# Example write proposal
curl -X POST http://localhost:8090/v1/propose-write \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "walletAddress=0x1234567890abcdef1234567890abcdef12345678" \
  -d "message=Hello, Oak Chain!" \
  -d "paymentTier=standard" \
  -d "ethereumTxHash=0xabc123..." \
  -d "signature=0x..."
```

### Read It Back

```bash
curl "http://localhost:8090/api/explore?path=/oak-chain/content/test/hello"
```

## What Just Happened?

1. Your write proposal went to the **leader** (port 8090)
2. Leader validated the signature
3. Leader proposed to **Aeron cluster**
4. **Followers** (8092, 8094) replicated via Raft
5. Content persisted to **Oak segment store**
6. All three validators now have identical state

## Modes Explained

| Mode | Purpose | When to Use |
|------|---------|-------------|
| **SEPOLIA** | Smart contract validation | Before mainnet, verify payment flows |
| **MAINNET** | Production | External validators and live traffic |

## Next Steps

Primary next step: [Consensus Model](/guide/consensus) to understand exactly how replication and finality are enforced.
