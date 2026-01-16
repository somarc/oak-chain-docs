# Running a Validator

Join the Oak Chain network and earn from content storage economics.

## Who This Is For

- **Ecosystem players** wanting to earn from validator economics
- **Infrastructure operators** with experience running distributed systems
- **Organizations** wanting to host their own content provenance layer

> **Deployment Strategy**: Most operators will deploy directly to mainnet after local testing. Sepolia is for validating smart contract logic before mainnet—not a staging environment for validators.

## Requirements

### Hardware

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 4 cores | 8+ cores |
| RAM | 8 GB | 16+ GB |
| Storage | 100 GB SSD | 500+ GB NVMe |
| Network | 100 Mbps | 1 Gbps |

### Software

- Java 21+ (LTS)
- Docker (optional)
- Access to Ethereum RPC (Infura, Alchemy, or own node)

## Quick Start (Docker)

```bash
# Pull the validator image
docker pull ghcr.io/somarc/oak-chain-validator:latest

# Run with environment config
docker run -d \
  --name oak-validator \
  -p 8090:8090 \
  -p 20000-20002:20000-20002 \
  -v oak-data:/var/oak-chain \
  -e AERON_CLUSTER_MEMBER_ID=0 \
  -e INFURA_API_KEY=your-key \
  -e OAK_BLOCKCHAIN_MODE=sepolia \
  ghcr.io/somarc/oak-chain-validator:latest
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AERON_CLUSTER_MEMBER_ID` | Yes | Unique node ID (0, 1, 2, ...) |
| `AERON_CLUSTER_MEMBERS` | Yes | Cluster member addresses |
| `OAK_BLOCKCHAIN_MODE` | Yes | `mock`, `sepolia`, or `mainnet` |
| `INFURA_API_KEY` | For Sepolia/Mainnet | Ethereum RPC access |
| `VALIDATOR_WALLET` | For Sepolia/Mainnet | Payment receiving wallet |
| `HTTP_PORT` | No | API port (default: 8090) |

### Cluster Members Format

```
AERON_CLUSTER_MEMBERS=0,host0:20000,host0:20001,host0:20002|1,host1:20000,host1:20001,host1:20002|2,host2:20000,host2:20001,host2:20002
```

Format: `id,client-port,member-port,log-port|...`

### Example: 3-Node Cluster

**Node 0** (validator-0.example.com):
```bash
AERON_CLUSTER_MEMBER_ID=0
AERON_CLUSTER_MEMBERS=0,validator-0.example.com:20000,validator-0.example.com:20001,validator-0.example.com:20002|1,validator-1.example.com:20000,validator-1.example.com:20001,validator-1.example.com:20002|2,validator-2.example.com:20000,validator-2.example.com:20001,validator-2.example.com:20002
```

**Node 1** (validator-1.example.com):
```bash
AERON_CLUSTER_MEMBER_ID=1
# Same AERON_CLUSTER_MEMBERS as above
```

**Node 2** (validator-2.example.com):
```bash
AERON_CLUSTER_MEMBER_ID=2
# Same AERON_CLUSTER_MEMBERS as above
```

## Modes

### Mock Mode

For **local development and testing**. No blockchain, no payments. Use this to understand the mechanics before going live.

```bash
OAK_BLOCKCHAIN_MODE=mock
```

### Sepolia Mode

For **smart contract validation** before mainnet. Real transactions on Sepolia testnet. Use this to verify payment flows work correctly.

```bash
OAK_BLOCKCHAIN_MODE=sepolia
INFURA_API_KEY=your-infura-key
```

### Mainnet Mode

**Production**. Real ETH payments. Real economics. We'll do it live. 🔥

```bash
OAK_BLOCKCHAIN_MODE=mainnet
INFURA_API_KEY=your-infura-key
VALIDATOR_WALLET=0x...
```

> **Reality check**: External validators joining the network go straight to mainnet. Mock is for understanding the system. Sepolia is for validating smart contracts. Mainnet is where the action is.

## Ports

| Port | Protocol | Purpose |
|------|----------|---------|
| 8090 | HTTP | API & Dashboard |
| 20000 | TCP | Aeron client |
| 20001 | TCP | Aeron member |
| 20002 | TCP | Aeron log |

Ensure these ports are open between all cluster members.

## Storage

### Data Directory

```
/var/oak-chain/
├── segmentstore/          # Oak TAR segments
├── aeron/                 # Aeron cluster state
│   ├── cluster/
│   └── archive/
└── ipfs/                  # IPFS data (if local)
```

### Backup

```bash
# Stop validator first
docker stop oak-validator

# Backup segment store
tar -czf backup-$(date +%Y%m%d).tar.gz /var/oak-chain/segmentstore

# Restart
docker start oak-validator
```

## Monitoring

### Health Check

```bash
curl http://localhost:8090/health

{
  "status": "healthy",
  "role": "LEADER",
  "peers": 2,
  "lastCommit": "2024-01-10T12:00:00Z"
}
```

### Prometheus Metrics

Metrics available at `http://localhost:8090/metrics`:

```
# Cluster state
oak_chain_cluster_role 2
oak_chain_cluster_term 42
oak_chain_cluster_peers 2

# Write throughput
oak_chain_writes_total{tier="priority"} 100
oak_chain_writes_total{tier="express"} 5000
oak_chain_writes_total{tier="standard"} 20000

# Storage
oak_chain_segments_total 1234
oak_chain_storage_bytes 1073741824
```

### Grafana Dashboard

Import the dashboard from:
```
https://github.com/somarc/blockchain-aem-infra/grafana/oak-chain-dashboard.json
```

## Troubleshooting

### Validator Won't Start

```bash
# Check logs
docker logs oak-validator

# Common issues:
# - Port already in use
# - Invalid cluster member config
# - Missing environment variables
```

### Can't Connect to Cluster

```bash
# Verify network connectivity
nc -zv validator-1.example.com 20000

# Check firewall rules
# Ensure ports 20000-20002 are open
```

### Leader Election Stuck

```bash
# Check all nodes are running
# Verify AERON_CLUSTER_MEMBERS is identical on all nodes
# Check for network partitions
```

## Economics

Validators earn from content storage payments. Authors pay to write, validators receive a share.

| Tier | Finality | Cost | Validator Share |
|------|----------|------|-----------------|
| Priority | ~12 sec (1 epoch) | Higher | Higher |
| Express | ~2 min | Medium | Medium |
| Standard | ~15 min | Lower | Lower |

See [Economic Tiers](/guide/economics) for full breakdown.

## Next Steps

- [Architecture](/architecture) - How the system works
- [Consensus Model](/guide/consensus) - Aeron Raft details
- [Economic Tiers](/guide/economics) - Payment and finality
- [SDK](/guide/sdk) - Build applications on Oak Chain