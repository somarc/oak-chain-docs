---
prev: /guide/economics
next: /guide/binaries
---

# Content Paths

Oak Chain uses wallet-based namespacing with deterministic sharding.

## Why This Matters

Path design is a core contract for routing, ownership boundaries, and query behavior across the network.

## What You'll Prove

- You can derive deterministic shard paths from wallet identity.
- You can separate organization scopes under one wallet namespace.
- You can structure content for predictable indexing and retrieval.

## Next Action

Map one real wallet and organization structure to the path template below before implementing write flows.

## Path Structure

```
/oak-chain/{L1}/{L2}/{L3}/0x{wallet}/{organization}/content/...
```

| Component | Description | Example |
|-----------|-------------|---------|
| `{L1}/{L2}/{L3}` | Shard levels (first 6 hex chars) | `74/2d/35` |
| `0x{wallet}` | Full Ethereum wallet address | `0x742d35Cc...` |
| `{organization}` | Optional brand/org scope | `PixelPirates` |
| `content/` | AEM content root | Standard AEM path |

## Example

For wallet `0x742d35Cc6634c0532925a3b844bc9e7595f0beb`:

```
/oak-chain/74/2d/35/0x742d35Cc6634c0532925a3b844bc9e7595f0beb/
    ├── PixelPirates/
    │   ├── content/           ← Gaming brand content
    │   │   └── games/
    │   └── conf/              ← Gaming brand config
    ├── CryptoKitchenware/
    │   ├── content/           ← eCommerce content
    │   │   └── products/
    │   └── conf/
    └── PersonalBlog/
        └── content/           ← Personal content
            └── posts/
```

## Why This Structure?

### 1. Wallet = Namespace

Your Ethereum wallet **owns** your namespace. No one else can write to it.

```
Only 0x742d35Cc... can write to:
/oak-chain/74/2d/35/0x742d35Cc.../...
```

### 2. Sharding for Scale

The `{L1}/{L2}/{L3}` prefix enables:

- **256³ = 16.7M shards**
- **Deterministic routing**: `hash(wallet) → shard`
- **Fault isolation**: Issues contained to shard
- **Parallel processing**: Shards processed independently

### 3. Organization Scope

One wallet can own multiple brands:

```bash
# Gaming brand
/oak-chain/74/2d/35/0xWALLET/PixelPirates/content/games/nft-drop

# eCommerce brand  
/oak-chain/74/2d/35/0xWALLET/CryptoKitchenware/content/products/spatula

# Personal
/oak-chain/74/2d/35/0xWALLET/PersonalBlog/content/posts/hello-world
```

### 4. AEM Compatibility

Within each scope, standard AEM paths work:

```
{scope}/content/...     ← Content
{scope}/conf/...        ← Configuration
{scope}/apps/...        ← Components (future)
```

## Path Validation

```java
// WalletPathUtil.java
public static String getContentPath(String wallet, String org) {
    String[] levels = getShardLevels(wallet);
    return String.format("/oak-chain/%s/%s/%s/0x%s/%s/content",
        levels[0], levels[1], levels[2],
        normalize(wallet),
        org);
}
```

### Rules

| Rule | Valid | Invalid |
|------|-------|---------|
| Wallet format | `0x742d35Cc...` | `742d35Cc...` |
| Org characters | `My-Brand_123` | `My/Brand` |
| Org length | ≤ 64 chars | > 64 chars |
| Path traversal | `/content/page` | `/../secret` |

## Write Example

```bash
curl -X POST http://localhost:8090/v1/propose-write \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "walletAddress=0x742d35Cc6634c0532925a3b844bc9e7595f0beb" \
  -d "organization=PixelPirates" \
  -d "message={\"title\":\"New NFT Drop!\",\"date\":\"2026-01-10\"}" \
  -d "contentType=page" \
  -d "paymentTier=express" \
  -d "ethereumTxHash=0x..." \
  -d "signature=0x..."
```

The validator constructs the full path (content IDs are generated):
```
/oak-chain/74/2d/35/0x742d35Cc.../PixelPirates/content/page-<timestamp>
```

## Cross-Organization References

Content can reference other organizations (read-only):

```json
{
  "title": "Partnership Announcement",
  "partner": {
    "ref": "/oak-chain/ab/cd/ef/0xPARTNER.../TheirBrand/content/about"
  }
}
```

## Content Structure Within Namespaces

Each wallet/brand namespace should maintain **consistent content structure** for indexing and querying to work efficiently. See [API Reference - Content Structure](/guide/api#content-structure--style-guides) for details on namespace-level style guides.

**Key point**: Oak Chain doesn't enforce content structure at the consensus layer, but **brand maintainers should enforce consistency** within their namespace for queries to work.

## Next Steps

- [API Reference](/guide/api) - Content structure and style guides
- [Architecture](/architecture) - Full system design
- [Economics](/guide/economics) - Payment tiers
