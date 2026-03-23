---
prev: /guide/testnet
next: /changelog
---

# Running a Validator

Join the Oak Chain network and earn from content storage economics.

## Who This Is For

- **Ecosystem players** wanting to earn from validator economics
- **Infrastructure operators** with experience running distributed systems
- **Organizations** wanting to host their own content provenance layer

> **Deployment strategy**: local cluster validation -> Sepolia payment-flow validation -> mainnet deployment.

Examples below assume the current local process workflow from `oak-chain-infra`.
If you run validators under Kubernetes or another service manager, translate the stop/start/log commands to that runtime.

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

## Quick Start (Build from Source)

Docker images are not yet published. Build from source:

```bash
# Clone the repository
git clone https://github.com/somarc/jackrabbit-oak.git
cd jackrabbit-oak

# Build the validator JAR
mvn clean install -pl oak-segment-consensus -am -DskipTests

# Run the validator
java -jar oak-segment-consensus/target/oak-segment-consensus.jar \
  --port 8090 \
  --store /var/oak-chain/validator-0
```

Current public local automation lives in the [infrastructure repo](https://github.com/somarc/oak-chain-infra).
Use [`modes/mock/validators/lifecycle/start-cluster.sh`](https://github.com/somarc/oak-chain-infra/tree/main/modes/mock/validators/lifecycle) for mock mode or [`modes/sepolia/validators/lifecycle/start-cluster.sh`](https://github.com/somarc/oak-chain-infra/tree/main/modes/sepolia/validators/lifecycle) for Sepolia instead of archived Docker Compose flows.

## Configuration

### 3x2 Validation Rig

For local `3x2` or other multi-cluster proofs, keep cluster identity, HTTP ports,
Aeron ports, runtime roots, and MediaDriver directories separate. This is a
local validation rig, not production density guidance.

| Knob | Example | Purpose |
|------|---------|---------|
| `OAK_CLUSTER_NAME` | `oak-local-a` | Distinguish one cluster from another |
| `CLUSTER_RUNTIME_ROOT` | `~/oak-chain/3x2/cluster-a` | Keep validator state isolated per cluster |
| `OAK_VALIDATOR_HTTP_BASE_PORT` | `8090` | Base HTTP port for the cluster |
| `OAK_VALIDATOR_HTTP_PORT_STEP` | `2` | Keep node ports spaced cleanly (`8090/8092/8094`) |
| `AERON_CLUSTER_BASE_PORT` | `9000` or `9400` | Keep Aeron transport ports from colliding across clusters |
| `AERON_DIR_BASE` | `~/oak-chain/3x2/cluster-a/aeron-media` | Isolate MediaDriver storage per cluster |

Cross-cluster mounts are lazy, read-only views outside Aeron. The local Aeron
cluster owns the writable repository for its shard.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AERON_CLUSTER_MEMBER_ID` | Yes | Unique node ID (0, 1, 2, ...) |
| `AERON_CLUSTER_MEMBERS` | Yes | Cluster member addresses |
| `OAK_CLUSTER_NAME` | No | Logical cluster name for proof harnesses and operator logs |
| `CLUSTER_RUNTIME_ROOT` | No | Filesystem root for validator stores, logs, and cluster state |
| `OAK_VALIDATOR_HTTP_BASE_PORT` | No | HTTP base port for a cluster-local validator set |
| `OAK_VALIDATOR_HTTP_PORT_STEP` | No | HTTP port stride between validators in the same cluster |
| `AERON_CLUSTER_BASE_PORT` | No | Aeron transport base port for the local cluster |
| `AERON_DIR_BASE` | No | MediaDriver directory base used to isolate cluster-local Aeron state |
| `OAK_BLOCKCHAIN_MODE` | Yes | `sepolia` or `mainnet` |
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

### Sepolia Mode

For **smart contract validation** before mainnet. Real transactions on Sepolia testnet. Use this to verify payment flows work correctly.

```bash
OAK_BLOCKCHAIN_MODE=sepolia
INFURA_API_KEY=your-infura-key
```

### Mainnet Mode

**Production**. Real ETH payments. Real economics.

```bash
OAK_BLOCKCHAIN_MODE=mainnet
INFURA_API_KEY=your-infura-key
VALIDATOR_WALLET=0x...
```

> **Reality check**: Use Sepolia to validate payment and contract behavior before mainnet cutover.

## Ports

| Port | Protocol | Purpose |
|------|----------|---------|
| 8090 | HTTP | API & Dashboard |
| 20000 | TCP | Aeron client |
| 20001 | TCP | Aeron member |
| 20002 | TCP | Aeron log |

Confirm these ports are open within each cluster. For multi-cluster proofs,
repeat the same pattern with separated base ports and runtime roots so the
clusters do not share writable Aeron state.

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
# Stop locally managed validators first
cd /path/to/oak-chain-infra/modes/mock/validators/lifecycle
./stop-cluster.sh

# Backup segment store
tar -czf backup-$(date +%Y%m%d).tar.gz /var/oak-chain/segmentstore

# Restart
./start-cluster.sh
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

Published Grafana dashboards have not yet been re-homed into `oak-chain-infra`.
For now, use the script-based monitoring surfaces in:

- `modes/mock/validators/monitoring/`
- `modes/sepolia/validators/monitoring/`

See the [infrastructure repo](https://github.com/somarc/oak-chain-infra) for the current operational layout.

## Troubleshooting

### Validator Won't Start

```bash
# Check the validator log file
tail -f ~/oak-chain/logs/mock/validator-0.log

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
# Confirm ports 20000-20002 are open
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
- [Primary Signals](/guide/primary-signals) - Queue, backpressure, durability, and drain-state interpretation
- [Economic Tiers](/guide/economics) - Payment and finality
- [API Reference](/guide/api) - Full public API surface (including Consensus & Proposals endpoints)

## Operator Reports

- [Validator Load Test Report (2026-02-04)](/operators/validator-load-test-2026-02-04)
- [Validator Load Test Report (2026-02-07): Overnight Finalization Gap](/operators/validator-load-test-2026-02-07-overnight-finalization-gap)
