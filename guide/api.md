---
prev: /segment-gc
next: /guide/auth
---

# API Reference

Complete reference for the Oak Chain HTTP API.

## Base URL

```
http://localhost:8090   # Local development
https://validator.oak-chain.io   # Production (future)
```

## Authentication

All write operations require:
1. **Ethereum wallet signature** - Content signed with your private key
2. **Payment transaction** - ETH payment to smart contract

Read operations are public.

---

## Endpoints

### Health & Status

#### `GET /health`

Check validator health.

**Response**
```json
{
  "status": "healthy",
  "role": "LEADER",
  "peers": 2,
  "lastCommit": "2026-01-10T12:00:00Z"
}
```

#### `GET /v1/status`

Get detailed cluster status.

**Response**
```json
{
  "role": "LEADER",
  "term": 42,
  "peers": ["validator-1", "validator-2"],
  "epoch": 12345,
  "commitIndex": 98765,
  "lastApplied": 98765
}
```

#### `GET /v1/cluster/state`

Get full cluster state including peer details.

**Response**
```json
{
  "role": "LEADER",
  "term": 42,
  "commitIndex": 12345,
  "lastApplied": 12345,
  "peers": [
    {"id": 1, "state": "FOLLOWER", "matchIndex": 12345},
    {"id": 2, "state": "FOLLOWER", "matchIndex": 12340}
  ]
}
```

---

### Content Operations

#### `POST /v1/propose-write`

Propose a content write to the cluster.

**Request Body**
```json
{
  "wallet": "0x742d35Cc6634c0532925a3b844bc9e7595f0beb",
  "organization": "MyBrand",
  "path": "content/pages/hello-world",
  "content": {
    "jcr:primaryType": "nt:unstructured",
    "title": "Hello World",
    "body": "Welcome to Oak Chain!"
  },
  "paymentTier": "express",
  "txHash": "0xabc123...",
  "signature": "0xdef456..."
}
```

**Parameters**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `wallet` | string | Yes | Ethereum wallet address (0x...) |
| `organization` | string | No | Organization/brand scope |
| `path` | string | Yes | Content path (relative to wallet scope) |
| `content` | object | Yes | JSON content to store |
| `paymentTier` | string | Yes | `priority`, `express`, or `standard` |
| `txHash` | string | Yes* | Payment transaction hash (*mock mode: optional) |
| `signature` | string | Yes | Content signature from wallet |

**Response (Success)**
```json
{
  "status": "accepted",
  "path": "/oak-chain/74/2d/35/0x742d35Cc.../MyBrand/content/pages/hello-world",
  "commitIndex": 12346,
  "tier": "express",
  "estimatedFinality": "2026-01-10T12:06:24Z"
}
```

**Response (Error)**
```json
{
  "status": "rejected",
  "error": "INVALID_SIGNATURE",
  "message": "Signature does not match wallet address"
}
```

#### `POST /v1/propose-delete`

Propose content deletion.

**Request Body**
```json
{
  "wallet": "0x742d35Cc6634c0532925a3b844bc9e7595f0beb",
  "organization": "MyBrand",
  "path": "content/pages/old-page",
  "paymentTier": "standard",
  "txHash": "0xabc123...",
  "signature": "0xdef456..."
}
```

**Response**
```json
{
  "status": "accepted",
  "path": "/oak-chain/74/2d/35/0x742d35Cc.../MyBrand/content/pages/old-page",
  "action": "delete",
  "commitIndex": 12347
}
```

#### `GET /api/content/{path}`

Read content at a path.

**Example**
```bash
curl http://localhost:8090/api/content/oak-chain/74/2d/35/0x742d35Cc.../MyBrand/content/pages/hello-world
```

**Response**
```json
{
  "jcr:primaryType": "nt:unstructured",
  "title": "Hello World",
  "body": "Welcome to Oak Chain!",
  "jcr:created": "2026-01-10T12:00:00Z",
  "jcr:createdBy": "0x742d35Cc..."
}
```

---

### Real-Time Streaming

#### `GET /v1/feed`

Server-Sent Events stream of all writes.

**Query Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `wallet` | string | Filter by wallet address |
| `org` | string | Filter by organization (requires wallet) |
| `prefix` | string | Filter by path prefix |

**Example**
```bash
curl -N "http://localhost:8090/v1/feed?wallet=0x742d35Cc..."
```

**Events**
```
event: write
data: {"path":"/oak-chain/74/2d/35/0xWALLET/org/content/page","timestamp":1704844800,"wallet":"0x742d35Cc...","tier":"express"}

event: delete
data: {"path":"/oak-chain/74/2d/35/0xWALLET/org/content/old","timestamp":1704844801,"wallet":"0x742d35Cc..."}

event: heartbeat
data: {"timestamp":1704844810}
```

---

### Segments (Advanced)

#### `GET /segments/{segmentId}`

Fetch a raw Oak segment (for HTTP segment transfer).

**Response**: Binary TAR segment data

#### `GET /journal.log`

Get the Oak journal (for sync).

**Response**: Journal entries

---

## Content Structure & Style Guides

### Why Structure Matters

Oak Chain stores content flexibly—you can write any JSON structure. However, **consistent structure within your namespace is critical** for:

- **Query performance**: Oak indexes require consistent property names
- **Content discoverability**: Queries fail if properties are inconsistent
- **Cross-wallet queries**: Aggregations need common structure patterns
- **Tooling compatibility**: AEM tools expect consistent content models

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

-- But fails if some content uses 'type', others use 'contentType', others have neither
-- Result: Only finds content with consistent structure, misses everything else
```

**Indexes require consistency** - without it, queries are slow or fail entirely.

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
| `GET /v1/feed` | 10 connections per IP |
| `GET /api/content/*` | 1000/min per IP |

---

## SDK Examples

### JavaScript

```javascript
import { OakChainClient } from '@oak-chain/sdk';

const client = new OakChainClient({
  endpoint: 'http://localhost:8090',
  wallet: window.ethereum, // MetaMask
});

// Write content
const result = await client.write({
  organization: 'MyBrand',
  path: 'content/pages/hello',
  content: { title: 'Hello!' },
  tier: 'express',
});

console.log('Written to:', result.path);
```

### cURL

```bash
# Write content (mock mode)
curl -X POST http://localhost:8090/v1/propose-write \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "0x742d35Cc6634c0532925a3b844bc9e7595f0beb",
    "organization": "MyBrand",
    "path": "content/pages/hello",
    "content": {"title": "Hello!"},
    "paymentTier": "standard",
    "signature": "mock"
  }'

# Read content
curl http://localhost:8090/api/content/oak-chain/74/2d/35/0x742d35Cc.../MyBrand/content/pages/hello
```

---

## Next Steps

- [Authentication](/guide/auth) - Wallet connection guide
- [Economic Tiers](/guide/economics) - Payment details
- [Content Paths](/guide/paths) - Path structure and namespace organization
