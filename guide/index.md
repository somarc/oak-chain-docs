# Quick Start

Get a 3-validator Oak Chain cluster running locally in under 10 minutes.

## Prerequisites

- Docker & Docker Compose
- 8GB RAM minimum
- Ports 8090, 8092, 8094 available

## Start the Cluster

```bash
# Clone the infrastructure repo
git clone https://github.com/somarc/blockchain-aem-infra.git
cd blockchain-aem-infra/docker-compose

# Start 3-validator cluster
docker-compose -f testing/3-validators-aeron.yml up -d

# Check status
docker-compose -f testing/3-validators-aeron.yml ps
```

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

## Next Steps

- [Consensus Model](/guide/consensus) - How Aeron Raft works
- [Economic Tiers](/guide/economics) - Payment and finality
- [Run a Validator](/operators/) - Join the real network
