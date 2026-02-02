---
prev: /segment-gc
next: /guide/auth
---

# API Reference

Authoritative, full mapping of the Oak Chain validator HTTP API.

**Source of truth:** `public/openapi.yaml`. The API browser UI at `/api-browser` is generated from live validator state and should match this page.

## Base URL

```
http://localhost:8090             # Local development
https://validators.oak-chain.io   # Production (future)
https://sepolia.validators.oak-chain.io  # Testnet (future)
```

## Authentication

All write operations require:
1. **Ethereum wallet signature** (signed message)
2. **Payment transaction hash** (Ethereum payment)

Read operations are public.

---

## Endpoints (By Category)

### Health
- `GET /health`
- `GET /health/deep`
- `GET /health/cluster`
- `GET /metrics` (Prometheus)
- `GET /api/metrics` (JSON; local/dev only)

### Content
- `GET /api/explore?path=/...`
- `GET /v1/wallets/content?wallet=0x...&page=&pageSize=`
- `GET /v1/wallets/stats?wallet=0x...`

### Write (form-encoded or multipart)
- `POST /v1/propose-write`
- `POST /v1/propose-delete`
- `GET /v1/proposals/{proposalId}/status`
- `GET /v1/proposals/pending/count`

### Binary
- `POST /v1/binary/declare-intent`
- `GET /v1/binary/check-intent/{sessionId}`
- `POST /v1/binary/complete-upload`
- `GET /api/blob/{blobId}`
- `GET /api/cid/{blobId}`
- `GET /api/cid/reverse/{cid}`
- `GET /api/cid/stats`
- `GET /api/cid/gateway/{blobId}` (redirect)

### Streaming (SSE)
- `GET /v1/events/stream`
- `GET /v1/events/recent`
- `GET /v1/events/stats`

### Cluster & Consensus
- `GET /v1/consensus/status`
- `GET /v1/head`
- `GET /v1/peers`
- `GET /v1/ngrok-url`
- `GET /v1/blockchain/config`
- `GET /v1/aeron/cluster-state`
- `GET /v1/aeron/raft-metrics`
- `GET /v1/aeron/node-status`
- `GET /v1/aeron/leadership-history`
- `GET /v1/aeron/replication-lag`
- `POST /v1/follower/head-update` (internal)

### GC & Fragmentation
- `GET /v1/gc/estimate?wallet=0x...`
- `GET /v1/gc/status`
- `GET /v1/gc/account/{wallet}`
- `POST /v1/gc/account/{wallet}/pay`
- `POST /v1/gc/account/{wallet}/set-limit`
- `POST /v1/gc/account/{wallet}/execute-pending`
- `GET /v1/fragmentation/metrics`
- `GET /v1/fragmentation/metrics/{wallet}`
- `GET /v1/fragmentation/top`
- `GET /v1/compaction/proposals`
- `POST /v1/propose-gc`
- `POST /v1/gc/execute`
- `POST /v1/gc/trigger`

### Segments (Advanced)
- `GET /api/segments/recent`
- `GET /api/segments/tars`

### Mock Mode (Local Dev)
- `POST /api/mock/advance-epoch?epochs=N`
- `POST /api/mock/set-epoch-offset?offset=N`
- `GET /api/mock/epoch-status`

### Internal / UI
- `GET /api-browser`
- `POST /v1/chat` (if oak-segment-agentic enabled)

---

## Request Formats (Write/Delete)

**Write**: `application/x-www-form-urlencoded` or `multipart/form-data`

Required fields:
- `walletAddress`
- `signature`
- `message`
- `ethereumTxHash`

Optional fields:
- `contentType` (default `page`)
- `paymentTier` (`standard`, `express`, `priority`)
- `organization`
- `intentToken`
- `ipfsCid`
- `clientId`
- `file` (multipart binary)

**Delete**: `application/x-www-form-urlencoded`

Required fields:
- `walletAddress`
- `signature`
- `contentPath`
- `ethereumTxHash`

Optional fields:
- `clientId`

---

## OpenAPI Spec

The OpenAPI spec lives at:
- `public/openapi.yaml`

It is the canonical source for schemas, request/response types, and status codes.

Fetch a raw Oak segment (for HTTP segment transfer).

**Response**: Binary TAR segment data

#### `GET /journal.log`

Get the Oak journal (for sync).

**Response**: Journal entries

---

## Content Structure & Style Guides

### Why Structure Matters

Oak Chain stores content flexibly—you can write any JSON structure. However, **consistent structure within your namespace is critical** because:

- **Queries WILL fail**: Oak's query engine aborts with read limits if indexes can't be used (inconsistent properties = no index hits = traversal limit exceeded)
- **Oak Lucene indexing**: Requires consistent property names to build effective indexes
- **Content discoverability**: Without consistent structure, queries abort rather than returning partial results
- **Cross-wallet queries**: Aggregations need common structure patterns
- **Tooling compatibility**: AEM tools expect consistent content models

**Note**: Indexing is an **upstream concern** (not handled at consensus layer). An Oak index layer may be added in time per need, but for now, namespace-level style guides ensure queries work.

### Namespace-Level Style Guides

**Each wallet/brand maintains its own style guide** for content structure. This isn't enforced at the consensus layer (Oak Chain accepts any structure), but **brand maintainers should enforce consistency** within their namespace.

**Example Style Guide** (stored at `/oak-chain/{wallet}/.style-guide`):

```json
{
  "wallet": "0x742d35Cc6634c0532925a3b844bc9e7595f0beb",
  "version": "1.0",
  "contentTypes": {
    "page": {
      "required": ["title", "body"],
      "optional": ["author", "publishedDate", "tags"],
      "properties": {
        "title": {"type": "string", "maxLength": 200},
        "body": {"type": "string"},
        "author": {"type": "string"},
        "publishedDate": {"type": "number"},
        "tags": {"type": "array", "items": {"type": "string"}}
      }
    },
    "asset": {
      "required": ["name", "ipfsCid"],
      "optional": ["mimeType", "altText", "width", "height"]
    }
  }
}
```

### How JSON Maps to JCR

When you send `message` in `POST /v1/propose-write`, the validator parses it as JSON and **materializes it into JCR nodes/properties** under the generated content path:

```
/oak-chain/{shard1}/{shard2}/{shard3}/0x{wallet}/{organization}/content/{contentType}-{timestamp}
```

**Mapping rules** (practical behavior):

- **Scalars** → **properties** on the node  
  `"title": "Hello"` → `title = "Hello"`
- **Objects** → **child nodes**  
  `"metadata": { "author": "0xabc..." }` → child node `metadata` with property `author`
- **Arrays of scalars** → **multi‑value properties**  
  `"tags": ["news","launch"]`
- **Arrays of objects** → **child nodes** (implementation-defined names like `item-0`, `item-1`)
- **JCR system fields** are honored when present:  
  `"jcr:primaryType"`, `"jcr:mixinTypes"`, `"jcr:created"`, `"jcr:lastModified"`

**Example**

`message` payload:
```json
{
  "jcr:primaryType": "nt:unstructured",
  "title": "Hello World",
  "body": "Welcome to Oak Chain!",
  "metadata": {
    "author": "0xabc...",
    "tags": ["launch", "news"]
  }
}
```

Resulting JCR structure (conceptual):
```
/oak-chain/.../content/page-<timestamp>
  - jcr:primaryType = nt:unstructured
  - title = "Hello World"
  - body = "Welcome to Oak Chain!"
  + metadata
      - author = "0xabc..."
      - tags = ["launch", "news"]
```

### Diagram (JSON → JCR)

<FlowGraph flow="json-to-jcr" :height="420" />

### Best Practices

**For Content Creators**:
1. **Check your brand's style guide** before writing content
2. **Follow required properties** - queries depend on consistency
3. **Use consistent property names** - don't mix `title` and `headline`
4. **Validate before sending** - SDK/connector can validate against style guide

**For Brand Maintainers**:
1. **Define your style guide** early (before content creation)
2. **Store it in your namespace** at `/.style-guide` (self-documenting)
3. **Enforce client-side** - validate before sending to validators
4. **Version your style guide** - allow evolution over time

### What Happens Without Structure?

If content is unstructured chaos ("wild west slop"):

```sql
-- This query works if all content has 'contentType'
SELECT * FROM [nt:unstructured] WHERE [contentType] = 'page'

-- But FAILS if some content uses 'type', others use 'contentType', others have neither
-- Result: Oak query engine aborts with read limit exceeded (no index hits = full traversal = limit exceeded)
```

**Indexes require consistency** - without it, queries **WILL fail** (Oak aborts with read limits, not just slow).

**Oak Lucene indexing is a niche topic** - requires consistent property names to build effective indexes. Without consistency, queries can't use indexes and hit traversal limits.

### SDK Support

The Oak Chain SDK can validate content against style guides:

```javascript
import { OakChainClient } from '@oak-chain/sdk';

const client = new OakChainClient({
  endpoint: 'http://localhost:8090',
  wallet: window.ethereum,
});

// Load style guide for your wallet
const styleGuide = await client.getStyleGuide();

// Validate before writing
const validator = new StyleGuideValidator(styleGuide);
if (!validator.validate(content, 'page')) {
  throw new Error('Content doesn\'t match style guide');
}

// Write (now guaranteed to match style guide)
await client.write({...});
```

**Note**: Style guide validation is **client-side** (not enforced by validators). This keeps the consensus layer minimal while ensuring content quality.

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_WALLET` | 400 | Malformed wallet address |
| `INVALID_SIGNATURE` | 401 | Signature doesn't match wallet |
| `PAYMENT_NOT_FOUND` | 402 | Payment transaction not found |
| `PAYMENT_INSUFFICIENT` | 402 | Payment amount below tier minimum |
| `PAYMENT_EXPIRED` | 402 | Payment too old (> 2 epochs) |
| `PATH_FORBIDDEN` | 403 | Cannot write to another wallet's namespace |
| `ORG_INVALID` | 400 | Invalid organization name |
| `NOT_LEADER` | 503 | Node is not leader, retry with leader |
| `CLUSTER_UNAVAILABLE` | 503 | No quorum available |
| `CONTENT_TOO_LARGE` | 413 | Content exceeds size limit |

**Error Response Format**
```json
{
  "status": "rejected",
  "error": "ERROR_CODE",
  "message": "Human-readable description",
  "details": {
    "field": "additional context"
  }
}
```

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `POST /v1/propose-write` | 100/min per wallet |
| `GET /v1/events/stream` | 10 connections per IP |
| `GET /api/explore` | 1000/min per IP |

---

## SDK Examples

### JavaScript

```javascript
import { OakChainClient } from '@oak-chain/sdk';

const client = new OakChainClient({
  endpoint: 'http://localhost:8090',
  signer: window.ethereum, // MetaMask signer
});

// Write content
const proposal = await signWriteProposal(window.ethereum, {
  message: JSON.stringify({ title: 'Hello!' }),
  ethereumTxHash: '0x...',
  paymentTier: 'express',
  organization: 'MyBrand',
});

const result = await client.proposeWrite(proposal);
console.log('Proposal:', result.data?.proposalId);
```

### cURL

```bash
# Write content (mock mode)
curl -X POST http://localhost:8090/v1/propose-write \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "walletAddress=0x742d35Cc6634c0532925a3b844bc9e7595f0beb" \
  -d "message={\"title\":\"Hello!\"}" \
  -d "paymentTier=standard" \
  -d "ethereumTxHash=0xabc123..." \
  -d "signature=0xmock"

# Read content
curl "http://localhost:8090/api/explore?path=/oak-chain/74/2d/35/0x742d35Cc.../MyBrand/content/pages/hello"
```

---

## Next Steps

- [Authentication](/guide/auth) - Wallet connection guide
- [Economic Tiers](/guide/economics) - Payment details
- [Content Paths](/guide/paths) - Path structure and namespace organization
