# Integration Guide

Integrate with Oak Chain's decentralized content repository. This guide covers architecture options, API access, and deployment considerations.

> **Important Distinction**: Oak ≠ AEM. Oak is the open-source content repository. AEM is Adobe's product built on Oak. This project builds on Oak directly—AEM integration depends on Adobe's acceptance of custom Oak bundles.

## Overview

Oak Chain exposes content via multiple integration paths:

| Integration Path | Availability | Use Case |
|------------------|--------------|----------|
| **REST/GraphQL API** | ✅ Available | Any client (web, mobile, headless) |
| **SSE Streaming** | ✅ Available | Real-time content updates, EDS delivery |
| **Sling Author** | ✅ Available | JCR-native authoring (our tier, not AEM) |
| **AEM Composite Mount** | ⚠️ Blocked | Requires Adobe acceptance of oak-segment-http |

<FlowGraph flow="aem-integration" :height="280" />

### The AEM Integration Gap

Direct integration with existing AEM instances (AMS, on-prem, AEMaaCS) via `oak-segment-http` composite mount is currently **blocked by Oak security restrictions** in AEM. Adobe controls the Oak bundles in AEM, and injecting custom persistence layers is not permitted.

**This does not diminish the project.** Oak Chain stands on its own with:
- Full JCR authoring via Sling
- API access for any consumer
- SSE streaming for delivery tiers
- IPFS binary storage

AEM integration remains a future possibility contingent on Adobe's roadmap.

---

## Architecture: JCR is Truth

Oak Chain follows the same principle as traditional AEM: **JCR is the source of truth**. All content authoring happens via JCR API (Sling, AEM, Composum). EDS is a delivery optimization layer that consumes content changes via SSE.

<FlowGraph flow="two-models" :height="340" />

| Layer | Role | Technology | What's Stored |
|-------|------|------------|---------------|
| **Authoring** | Content creation via JCR API | Sling/AEM Author → Validators | — |
| **Storage (Structured)** | Consensus-replicated Oak segments | Validator cluster (Raft) | Content nodes + CIDs (46 bytes) |
| **Storage (Binaries)** | IPFS binary hosting | Author-owned or Validator-hosted IPFS | Actual binary files |
| **Delivery** | Edge-optimized content serving | EDS (aem.live) via SSE subscription | Cached content + binaries |

### Binary Storage: IPFS

Validators store **CIDs only** (content-addressed hashes, 46 bytes each), not the binaries themselves. Binaries are stored in IPFS.

**Two hosting models:**

| Model | Who Hosts IPFS | Best For |
|-------|----------------|----------|
| **Author-owned** | Author runs/pins their own IPFS node | Full control, existing IPFS infrastructure |
| **Validator-hosted** | Validators offer IPFS hosting as a service | Convenience, CDN-optimized placement |

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  BINARY FLOW: Truth → Provenance → Edge                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Author uploads binary to IPFS                                              │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────┐     CID (46 bytes)      ┌─────────────────┐            │
│  │ IPFS            │ ──────────────────────► │   Validators    │            │
│  │ (author-owned   │                         │   (Oak segments)│            │
│  │  or validator-  │                         │   Store: CIDs   │            │
│  │  hosted)        │                         │   NOT binaries  │            │
│  └────────┬────────┘                         └─────────────────┘            │
│           │                                                                 │
│           │ Served via IPFS gateway / edge                                  │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │ Edge CDN        │  CID = perfect cache key (immutable)                   │
│  │                 │  User can verify: hash(binary) === CID                 │
│  └─────────────────┘                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

See [Binary Storage Guide](/guide/binaries) for implementation details.

### The SSE Integration

Validators emit Server-Sent Events when content changes. EDS (or any delivery tier) subscribes to these events for cache invalidation:

```
Author writes → Validators consensus → SSE event emitted → EDS invalidates → Fresh content at edge
```

This guide focuses on **API-based integration** — the path that works today for any consumer.

---

## Planning & Prerequisites

### Technical Requirements

| Requirement | Version | Notes |
|-------------|---------|-------|
| Oak | 1.50+ | Check `oak-core` bundle version |
| Java | 11+ | JDK, not JRE |
| AEM | 6.5 SP15+ or AEMaaCS | Earlier versions require assessment |
| Network | HTTPS outbound | Firewall rules for validator endpoints |

### Supported Platforms

- Adobe Experience Manager (on-prem, AMS, AEMaaCS)
- Apache Sling
- Other Oak-based CMS/CRM systems

### Project Planning

| Phase | Duration | Activities |
|-------|----------|------------|
| **Assessment** | 1-2 weeks | Architecture review, network planning, security assessment |
| **Development** | 2-4 weeks | Bundle deployment, configuration, local testing |
| **Staging** | 2-4 weeks | Integration testing, performance validation, UAT |
| **Production** | 1-2 weeks | Phased rollout, monitoring, stabilization |

---

## Implementation

### Phase 1: Bundle Deployment

Deploy `oak-segment-http-{version}.jar` to your AEM instance. The deployment method depends on your platform:

**On-Premises AEM**:
```bash
# Deploy via Felix console
curl -u admin:admin -F file=@oak-segment-http-1.50.0.jar \
  http://localhost:4502/system/console/bundles

# Or place in crx-quickstart/install/ and restart
```

**AEMaaCS / Cloud Manager**:
```
ui.apps/src/main/content/jcr_root/apps/{project}/install/
└── oak-segment-http-1.50.0.jar
```

**AMS (Managed Services)**:
- Coordinate with Adobe Support for custom bundle approval
- Deploy via Cloud Manager after approval

### Phase 2: OSGi Configuration

Create the composite mount configuration. This tells Oak to mount `/oak-chain` from the validator cluster.

**Configuration file** (`org.apache.jackrabbit.oak.composite.CompositeNodeStore.cfg.json`):

```json
{
  "mounts": [
    {
      "name": "oak-chain",
      "readOnly": true,
      "paths": ["/oak-chain"],
      "persistence": "http",
      "httpEndpoint": "https://validators.oak-chain.io"
    }
  ]
}
```

**Environment-specific endpoints**:
| Environment | Endpoint |
|-------------|----------|
| Development | `http://localhost:8090` |
| Staging | `https://staging.validators.oak-chain.io` |
| Production | `https://validators.oak-chain.io` |

### Phase 3: Validation

After deployment, verify the mount is active:

**Via JCR API**:
```java
Session session = resourceResolver.adaptTo(Session.class);
if (session.nodeExists("/oak-chain")) {
    Node oakChainRoot = session.getNode("/oak-chain");
    log.info("Oak Chain mount active: {}", oakChainRoot.getPath());
} else {
    log.error("Oak Chain mount not available - check configuration");
}
```

**Via Sling ResourceResolver**:
```java
Resource oakChainContent = resourceResolver.getResource("/oak-chain/0x742d.../content/page");
if (oakChainContent != null) {
    ValueMap props = oakChainContent.getValueMap();
    String title = props.get("jcr:title", String.class);
    log.info("Oak Chain content accessible: {}", title);
}
```

**Via curl** (for quick checks):
```bash
curl -u admin:admin http://localhost:4502/oak-chain.json
```

---

## Configuration Reference

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OAK_CHAIN_ENDPOINT` | Validator cluster URL | `https://validators.oak-chain.io` |
| `OAK_CHAIN_TIMEOUT` | HTTP timeout (ms) | `30000` |
| `OAK_CHAIN_CACHE_SIZE` | Segment cache size (MB) | `256` |
| `OAK_CHAIN_RETRY_COUNT` | Retry attempts | `3` |

### OSGi Configuration

**Full configuration** (`org.apache.jackrabbit.oak.segment.http.HttpPersistence.cfg.json`):

```json
{
  "endpoint": "https://validators.oak-chain.io",
  "timeout": 30000,
  "cacheSize": 268435456,
  "retryCount": 3,
  "retryDelay": 1000,
  "connectionPoolSize": 10,
  "validateCertificates": true
}
```

---

## Binary Storage

Oak Chain stores **CIDs only** (46 bytes), not binaries. Binaries live at the author's source.

<FlowGraph flow="binary-flow" :height="300" />

### How It Works

1. **Oak Chain** stores the CID (content-addressed hash)
2. **Author** hosts the binary (IPFS, Azure Blob, or pinning service)
3. **Edge CDN** caches the binary globally
4. **User** can verify binary integrity against the CID

### Retrieving Binaries

```java
// Binary stored as CID reference in Oak Chain
Property dataProp = node.getProperty("jcr:data");
String cidUri = dataProp.getString(); // "ipfs://QmXyz..."

// Option 1: Direct IPFS fetch
String cid = cidUri.replace("ipfs://", "");
String gatewayUrl = "https://ipfs.io/ipfs/" + cid;

// Option 2: Via IPFS client
InputStream binary = ipfsClient.cat(cid);
```

### Storage Options

| Option | SLA | Cost | Best For |
|--------|-----|------|----------|
| Self-hosted IPFS | Best-effort | ~$5/mo VPS | Dev/small scale |
| Pinata/Filebase | 99.9% | ~$20/mo/TB | Startups |
| Azure Blob + IPFS CID | 99.99% | ~$0.02/GB | Enterprise (AMS, AEMaaCS) |

---

## Platform-Specific Guides

### On-Premises AEM

1. Deploy `oak-segment-http` bundle via Felix console
2. Create OSGi config in `crx-quickstart/install/`
3. Restart AEM
4. Verify mount at `/oak-chain`

### Adobe Managed Services (AMS)

1. Request custom OSGi configuration from Adobe Support
2. Deploy bundle via Cloud Manager
3. Configure via environment-specific configs
4. Verify in Author and Publish instances

### AEMaaCS

1. Add bundle to `ui.apps/src/main/content/jcr_root/apps/{project}/install/`
2. Add OSGi config to `ui.config/src/main/content/jcr_root/apps/{project}/osgiconfig/config/`
3. Deploy via Cloud Manager pipeline
4. Verify in Cloud Manager logs

### Apache Sling

```java
// In your Sling application
@Reference
private ResourceResolverFactory resolverFactory;

public void readOakChain() throws LoginException {
    try (ResourceResolver resolver = resolverFactory.getServiceResourceResolver(null)) {
        Resource content = resolver.getResource("/oak-chain/0x742d.../content");
        // Process content...
    }
}
```

---

## Troubleshooting

### Mount Not Appearing

**Symptom**: `/oak-chain` path returns 404

**Solutions**:
1. Verify bundle is active: `/system/console/bundles` → search "oak-segment-http"
2. Check OSGi config is deployed: `/system/console/configMgr`
3. Verify network connectivity to validator endpoint
4. Check AEM error logs for connection errors

### Slow Performance

**Symptom**: Oak Chain content loads slowly

**Solutions**:
1. Increase cache size: `OAK_CHAIN_CACHE_SIZE=512`
2. Check network latency to validators
3. Enable segment prefetching
4. Consider regional validator deployment

### Certificate Errors

**Symptom**: SSL/TLS handshake failures

**Solutions**:
1. Ensure JVM trusts validator certificates
2. Add CA to Java truststore: `keytool -import -trustcacerts -file ca.crt -keystore $JAVA_HOME/lib/security/cacerts`
3. For testing only: `validateCertificates: false` (NOT for production)

---

## Security Considerations

### Read-Only Access

The Oak Chain mount is **read-only by design**. Your AEM instance cannot modify Oak Chain content—only read it.

### Network Security

- Use TLS for all connections to validators
- Configure firewall rules to allow outbound HTTPS (443)
- Consider VPN or private endpoints for sensitive deployments

### Content Verification

Oak Chain content is cryptographically signed. You can verify authenticity:

```java
// Get content signature
String signature = node.getProperty("oak:signature").getString();
String walletAddress = node.getProperty("oak:author").getString();

// Verify signature (using Web3j or similar)
boolean valid = verifySignature(content, signature, walletAddress);
```

---

## Next Steps

- [Binary Storage Guide](/guide/binaries) - Deep dive into IPFS integration
- [API Reference](/guide/api) - Full API documentation
- [Run a Validator](/operators/) - Join the network
- [FAQ](/faq) - Common questions answered

---

<div style="text-align: center; margin-top: 3rem;">
  <a href="/guide/" class="action-btn">← Back to Guide</a>
</div>

<style>
.action-btn {
  display: inline-block;
  padding: 12px 28px;
  background: linear-gradient(135deg, #4a5fd9, #627EEA);
  color: #fff;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
}
.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(98, 126, 234, 0.4);
}
</style>
