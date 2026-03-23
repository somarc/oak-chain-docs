---
prev: /guide/auth
next: /operators/
---

# Testnet Guide

Run Oak Chain on Ethereum Sepolia testnet for realistic testing without real ETH.

## Why This Matters

Testnet validation is where you prove payment, signature, and validator interactions before exposing mainnet risk.

## What You'll Prove

- You can configure validator and wallet flows against Sepolia.
- You can execute and verify a test payment transaction.
- You can complete a full paid write path in a realistic network mode.

## Next Action

Get Sepolia ETH first, configure environment variables, and run one payment plus write proposal cycle.

## Sepolia Testnet

| Property | Value |
|----------|-------|
| Network | Sepolia |
| Chain ID | 11155111 |
| Currency | SepoliaETH (test) |
| Block Time | ~12 seconds |
| Epoch Duration | ~6.4 minutes |

## Smart Contract

### ValidatorPaymentV3_2

The current local Sepolia config in `oak-chain-infra` uses:

| Network | Address | Source of Truth |
|---------|---------|-----------------|
| Sepolia | `0x7fcEc350268F5482D04eb4B229A0679374906732` | `modes/sepolia/validators/config/sepolia.env` |
| Mainnet | Not published in this docs repo | `modes/mainnet/` |

### Contract Surface

```solidity
enum Tier { Standard, Express, Priority }

function payForProposal(bytes32 proposalId, Tier tier) external payable;

event ProposalPaid(
    bytes32 indexed proposalId,
    address indexed payer,
    uint256 amount,
    Tier tier,
    PaymentToken indexed paymentToken,
    address preferredValidator,
    uint256 timestamp
);
```

## Get Test ETH

### Faucets

| Faucet | URL | Amount |
|--------|-----|--------|
| Alchemy | [sepoliafaucet.com](https://sepoliafaucet.com) | 0.5 ETH/day |
| Infura | [infura.io/faucet/sepolia](https://www.infura.io/faucet/sepolia) | 0.5 ETH/day |
| QuickNode | [faucet.quicknode.com/ethereum/sepolia](https://faucet.quicknode.com/ethereum/sepolia) | 0.1 ETH |
| Google Cloud | [cloud.google.com/web3/faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) | 0.05 ETH |

### Steps

1. Install MetaMask
2. Add Sepolia network (or select from network list)
3. Copy your wallet address
4. Visit faucet and request test ETH
5. Wait for transaction confirmation

## Configure Validator

### Environment Variables

```bash
# Required before running the Sepolia workflow
export INFURA_API_KEY=your-infura-project-id
```

`dev-sepolia.sh` loads `OAK_BLOCKCHAIN_MODE=sepolia` and the current `OAK_BLOCKCHAIN_CONTRACT_ADDRESS` from the infra repo config.

### Get Infura API Key

1. Go to [infura.io](https://infura.io)
2. Create free account
3. Create new project
4. Copy Project ID (this is your API key)

### Run the Sepolia Workflow

```bash
mkdir oak-chain-workspace
cd oak-chain-workspace

git clone https://github.com/somarc/oak-chain-infra.git
git clone https://github.com/somarc/jackrabbit-oak.git

cd oak-chain-infra
./modes/sepolia/validators/lifecycle/start-cluster.sh --build --fresh
```

## Make a Test Payment

### Using ethers.js

```javascript
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const contractAddress = '0x7fcEc350268F5482D04eb4B229A0679374906732';
const abi = [
  'function payForProposal(bytes32 proposalId, uint8 tier) payable',
];

const contract = new ethers.Contract(contractAddress, abi, signer);
const proposalId = ethers.keccak256(
  ethers.toUtf8Bytes(`proposal:${Date.now()}`)
);

// Pay for EXPRESS tier
const tx = await contract.payForProposal(
  proposalId,
  1, // Tier enum: 0=Standard, 1=Express, 2=Priority
  { value: ethers.parseEther('0.002') }
);

console.log('Payment tx:', tx.hash);
await tx.wait();
console.log('Payment confirmed!');
```

Oak validators expect a contract payment transaction hash, not a plain ETH transfer.
Reuse the same `proposalId` when you call `POST /v1/propose-write`.

## Verify Payment

### Check Transaction

```bash
# Using curl + Infura
curl https://sepolia.infura.io/v3/${INFURA_API_KEY} \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_getTransactionReceipt",
    "params": ["0xYourTxHash"],
    "id": 1
  }'
```

### Etherscan

View transactions on [sepolia.etherscan.io](https://sepolia.etherscan.io)

## Tier Prices (Sepolia)

| Tier | Price (ETH) | Price (Wei) | Price (USDC) |
|------|-------------|-------------|--------------|
| PRIORITY | 0.01 | 10000000000000000 | 32.50 |
| EXPRESS | 0.002 | 2000000000000000 | 6.50 |
| STANDARD | 0.001 | 1000000000000000 | 3.25 |

## Complete Test Flow

```javascript
async function testSepoliaWrite() {
  // 1. Connect wallet
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  });
  const wallet = accounts[0];
  
  // 2. Make payment
  const proposalId = ethers.keccak256(
    ethers.toUtf8Bytes(`proposal:${Date.now()}`)
  );
  const paymentTx = await contract.payForProposal(
    proposalId,
    1,
    { value: ethers.parseEther('0.002') }
  );
  
  // 3. Wait for confirmation
  console.log('Payment tx:', paymentTx.hash);
  await paymentTx.wait();
  
  // 4. Sign content
  const content = { title: 'Sepolia Test!' };
  const message = JSON.stringify({ content, timestamp: Date.now() });
  
  const signature = await window.ethereum.request({
    method: 'personal_sign',
    params: [message, wallet],
  });
  
  // 5. Submit to validator
  const response = await fetch('http://localhost:8090/v1/propose-write', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      proposalId,
      walletAddress: wallet,
      message,
      paymentTier: 'express',
      ethereumTxHash: paymentTx.hash,
      signature,
    }),
  });
  
  console.log('Write result:', await response.json());
}
```

## Troubleshooting

### "Payment not found"

- Wait for transaction confirmation (1-2 blocks)
- Verify transaction on Etherscan
- Check validator is in Sepolia mode
- Check the validator is using the same contract address configured in `scripts/local-development/config/sepolia.env`

### "Insufficient funds"

- Get more test ETH from faucet
- Check wallet balance on Etherscan

### "Invalid API key"

- Verify INFURA_API_KEY is set
- Check Infura project is active
- Confirm the project has Sepolia enabled

## Next Steps

- [API Reference](/guide/api) - Full endpoint docs
- [Authentication](/guide/auth) - Wallet integration
- [Run a Validator](/operators/) - Production setup
