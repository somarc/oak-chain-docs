---
prev: /guide/auth
next: /operators/
---

# Testnet Guide

Run Oak Chain on Ethereum Sepolia testnet for realistic testing without real ETH.

## Sepolia Testnet

| Property | Value |
|----------|-------|
| Network | Sepolia |
| Chain ID | 11155111 |
| Currency | SepoliaETH (test) |
| Block Time | ~12 seconds |
| Epoch Duration | ~6.4 minutes |

## Smart Contract

### ValidatorPaymentV3_1

| Network | Address |
|---------|---------|
| Sepolia | `0x...` (TBD - deployment pending) |
| Mainnet | TBD |

### Contract ABI

```json
[
  {
    "name": "pay",
    "type": "function",
    "inputs": [
      {"name": "validator", "type": "address"},
      {"name": "tier", "type": "uint8"},
      {"name": "contentHash", "type": "bytes32"}
    ],
    "outputs": []
  },
  {
    "name": "PaymentReceived",
    "type": "event",
    "inputs": [
      {"name": "payer", "type": "address", "indexed": true},
      {"name": "validator", "type": "address", "indexed": true},
      {"name": "tier", "type": "uint8"},
      {"name": "amount", "type": "uint256"},
      {"name": "contentHash", "type": "bytes32"},
      {"name": "timestamp", "type": "uint256"}
    ]
  }
]
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
# Required for Sepolia mode
export OAK_BLOCKCHAIN_MODE=sepolia
export INFURA_API_KEY=your-infura-project-id
export VALIDATOR_WALLET=0xYourValidatorWallet
```

### Get Infura API Key

1. Go to [infura.io](https://infura.io)
2. Create free account
3. Create new project
4. Copy Project ID (this is your API key)

### Docker Compose

```yaml
services:
  validator-0:
    image: ghcr.io/somarc/oak-chain-validator:latest
    environment:
      - OAK_BLOCKCHAIN_MODE=sepolia
      - INFURA_API_KEY=${INFURA_API_KEY}
      - VALIDATOR_WALLET=${VALIDATOR_WALLET}
      - AERON_CLUSTER_MEMBER_ID=0
```

## Make a Test Payment

### Using ethers.js

```javascript
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const contractAddress = '0x...'; // Sepolia contract
const abi = [/* see above */];

const contract = new ethers.Contract(contractAddress, abi, signer);

// Pay for EXPRESS tier
const tx = await contract.pay(
  '0xValidatorWallet',  // Validator receiving payment
  1,                     // Tier: 0=PRIORITY, 1=EXPRESS, 2=STANDARD
  ethers.keccak256(ethers.toUtf8Bytes('my-content-hash')),
  { value: ethers.parseEther('0.000002') }  // EXPRESS price
);

console.log('Payment tx:', tx.hash);
await tx.wait();
console.log('Payment confirmed!');
```

### Using MetaMask Directly

```javascript
// Simple ETH transfer (for testing without contract)
const tx = await window.ethereum.request({
  method: 'eth_sendTransaction',
  params: [{
    from: wallet,
    to: '0xValidatorWallet',
    value: '0x' + (2000000000000n).toString(16), // 0.000002 ETH in wei
  }],
});
```

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

| Tier | Price (ETH) | Price (Wei) |
|------|-------------|-------------|
| PRIORITY | 0.00001 | 10000000000000 |
| EXPRESS | 0.000002 | 2000000000000 |
| STANDARD | 0.000001 | 1000000000000 |

## Complete Test Flow

```javascript
async function testSepoliaWrite() {
  // 1. Connect wallet
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  });
  const wallet = accounts[0];
  
  // 2. Make payment
  const paymentTx = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [{
      from: wallet,
      to: '0xValidatorWallet',
      value: '0x' + (2000000000000n).toString(16),
    }],
  });
  
  // 3. Wait for confirmation
  console.log('Payment tx:', paymentTx);
  // Wait ~15 seconds for block confirmation
  
  // 4. Sign content
  const content = { title: 'Sepolia Test!' };
  const message = JSON.stringify({
    path: 'content/test',
    content,
    timestamp: Date.now(),
  });
  
  const signature = await window.ethereum.request({
    method: 'personal_sign',
    params: [message, wallet],
  });
  
  // 5. Submit to validator
  const response = await fetch('http://localhost:8090/v1/propose-write', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      wallet,
      path: 'content/test',
      content,
      paymentTier: 'express',
      txHash: paymentTx,
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

### "Insufficient funds"

- Get more test ETH from faucet
- Check wallet balance on Etherscan

### "Invalid API key"

- Verify INFURA_API_KEY is set
- Check Infura project is active
- Ensure project has Sepolia enabled

## Next Steps

- [API Reference](/guide/api) - Full endpoint docs
- [Authentication](/guide/auth) - Wallet integration
- [Run a Validator](/operators/) - Production setup
