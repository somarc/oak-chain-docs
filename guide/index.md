---
prev: /architecture
next: /guide/consensus
---

# Developer Guide

Run a local Oak Chain cluster to understand the system before building on it.

## Who This Is For

- **Developers** building applications on Oak Chain
- **Existing AEM clients** exploring content provenance
- **Validator operators** testing locally before mainnet
- **Anyone** wanting to understand how Oak Chain works

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
curl http://localhost:8090/v1/status

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
# In mock mode (no real Ethereum payment required)
curl -X POST http://localhost:8090/v1/propose-write \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/oak-chain/content/test/hello",
    "content": "Hello, Oak Chain!",
    "wallet": "0x1234567890abcdef1234567890abcdef12345678",
    "signature": "mock-signature",
    "paymentTier": "standard"
  }'
```

### Read It Back

```bash
curl http://localhost:8090/api/content/oak-chain/content/test/hello
```

## What Just Happened?

1. Your write proposal went to the **leader** (port 8090)
2. Leader validated the (mock) signature
3. Leader proposed to **Aeron cluster**
4. **Followers** (8092, 8094) replicated via Raft
5. Content persisted to **Oak segment store**
6. All three validators now have identical state

## Modes Explained

| Mode | Purpose | When to Use |
|------|---------|-------------|
| **MOCK** | Local testing, no blockchain | Understanding mechanics, development |
| **SEPOLIA** | Smart contract validation | Before mainnet, verify payment flows |
| **MAINNET** | Production | We'll do it live 🔥 |

> **Reality**: External validators go straight to mainnet. MOCK is for understanding. SEPOLIA is for smart contract validation. Mainnet is where the action is.

## Next Steps

- [Consensus Model](/guide/consensus) - How Aeron Raft works
- [Economic Tiers](/guide/economics) - Payment and finality
- [AEM Integration](/guide/aem-integration) - For existing AEM clients
- [Run a Validator](/operators/) - Join the network and earn
