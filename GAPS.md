# Documentation Gaps & Future Improvements

> **Status**: Active tracking  
> **Last Updated**: January 15, 2026

This file tracks gaps for production readiness.

---

## Core Consensus Stability (BLOCKING)

Must be stable before GraphQL, SDK, or other features.

| Component | Status | Gap | Priority |
|-----------|--------|-----|----------|
| **Aeron Raft Cluster** | ✅ Works | Dynamic membership changes | Medium |
| **Write Proposal Flow** | ⚠️ Partial | Full smart contract payment verification (Web3j polling) | **HIGH** |
| **Segment Replication** | ✅ Works | — | — |
| **Payment Verification** | ⚠️ Mock only | Sepolia end-to-end, mainnet contract deploy | **HIGH** |
| **GC (Garbage Collection)** | ⚠️ Designed | Implementation incomplete, payment enforcement | **HIGH** |
| **Binary Storage (IPFS)** | ⚠️ Partial | Full upload/verify flow from author | Medium |
| **Dashboard/API** | ✅ Works | — | — |

### Stability Criteria

| Milestone | Definition |
|-----------|------------|
| **Alpha** | Mock mode works end-to-end locally |
| **Beta** | Sepolia payment verification passes |
| **RC** | Load testing survives, GC implemented |
| **1.0** | Mainnet contract deployed, 3+ validators running |

---

## Infrastructure Gaps

| Gap | Description | Effort |
|-----|-------------|--------|
| **Docker Images** | No published Docker images yet - docs say "coming soon" | CI/CD pipeline |
| **Smart Contract Address** | Testnet guide has TBD for Sepolia contract address | Deploy contract |
| **SDK Package** | `oak-chain-sdk/` exists but not published to npm | Publish + docs |
| **Production URL** | API reference shows `validator.oak-chain.io` (future) | Deploy infra |

---

## Feature Gaps (Post-Stability)

| Gap | Description | Effort | ADR |
|-----|-------------|--------|-----|
| **GraphQL API** | Oak-native GraphQL - schema from JCR structure | `graphql-java` + handlers | ADR 050 |
| **Access Control** | FAQ mentions ACLs as roadmap | Design + implement | — |
| **Content Versioning** | FAQ mentions versioning as roadmap | Design + implement | — |

### Deferred (Post-Mainnet)

| Gap | Description | Notes |
|-----|-------------|-------|
| **Version 1.0 Release** | Merge feature branch to main, tag as `oak-chain-v1.0.0` | Keep fork lineage (preserves commit history, ADR context) |
| **Video Tutorials** | No video content for visual learners | After stable |
| **Interactive Examples** | No live playground/sandbox | After stable |
| **Translations** | English only | Community-driven |
| **Performance Benchmarks** | No throughput/latency numbers | After load testing |
| **Case Studies** | No real-world usage examples | After mainnet validators |
| **Comparison Pages** | vs IPFS, vs Arweave, vs Ceramic | Marketing phase |

---

## Technical Accuracy

### Needs Verification

- [ ] API endpoint paths match actual implementation
- [ ] Error codes match actual server responses
- [ ] Payment tier prices match smart contract
- [ ] Epoch timing matches Beacon Chain spec
- [ ] Rate limits match actual server config

### Needs Code Examples Tested

- [ ] JavaScript signing flow
- [ ] MetaMask connection
- [ ] WalletConnect integration
- [ ] ethers.js payment code
- [ ] SSE streaming client

---

## UX Improvements

### Navigation

- [ ] Add breadcrumbs
- [ ] Add "On this page" anchor links (partially done)
- [ ] Add previous/next page navigation
- [ ] Add related pages suggestions

### Search

- [ ] Verify local search indexes all pages
- [ ] Add search analytics to find gaps
- [ ] Consider Algolia for better search

### Mobile

- [ ] Test all pages on mobile
- [ ] Verify mermaid diagrams render on mobile
- [ ] Check code block horizontal scroll

---

## Missing Diagrams

| Page | Needed Diagram |
|------|----------------|
| Architecture | Full system diagram (all components) |
| Paths | Visual path tree structure |
| Testnet | Payment flow sequence diagram |
| Auth | Token/session lifecycle |

---

## API Reference Gaps

### Undocumented Endpoints

- [ ] `GET /segments/{id}` - needs more detail
- [ ] `GET /journal.log` - needs format documentation
- [ ] `GET /manifest` - not documented at all
- [ ] Dashboard endpoints - not documented

### Missing Response Examples

- [ ] Pagination responses
- [ ] Bulk operation responses
- [ ] Streaming reconnection handling

---

## Operator Guide Gaps

### Missing Sections

- [ ] Backup and restore procedures
- [ ] Disaster recovery
- [ ] Scaling guidelines
- [ ] Cost estimation calculator
- [ ] Security hardening checklist
- [ ] Log analysis guide
- [ ] Alerting setup (PagerDuty, etc.)

### Configuration Reference

- [ ] Full environment variable list
- [ ] JVM tuning options
- [ ] Aeron tuning parameters
- [ ] Oak segment store config

---

## Community & Ecosystem

### Missing Pages

- [ ] Ecosystem / integrations page
- [ ] Showcase of projects using Oak Chain
- [ ] Community resources (Discord, forum)
- [ ] Events / talks / presentations

### External Links Needed

- [ ] Link to Aeron documentation
- [ ] Link to Oak documentation
- [ ] Link to Ethereum docs
- [ ] Link to IPFS docs

---

## Maintenance Tasks

### Regular Updates Needed

- [ ] Changelog after each release
- [ ] FAQ as questions come in
- [ ] Testnet info if contracts redeploy
- [ ] Price updates if tiers change

### Automation Opportunities

- [ ] Auto-generate API docs from OpenAPI spec
- [ ] Auto-update changelog from git tags
- [ ] Link checker CI job
- [ ] Screenshot automation for UI changes

---

## Review Checklist

When addressing gaps, verify:

- [ ] Content is accurate and tested
- [ ] Links work (internal and external)
- [ ] Code examples run successfully
- [ ] Diagrams render correctly
- [ ] Mobile view looks good
- [ ] Search indexes the new content

---

## Notes

*Add notes here as gaps are discovered or addressed*

- 2026-01-10: Initial gap analysis after 100/100 push
- 2026-01-15: Updated audience framing across docs
  - Operators page: Added "Who This Is For" section, clarified modes (MOCK/SEPOLIA/MAINNET)
  - Guide index: Reframed as "Developer Guide", added audience section
  - AEM integration: Already has proper framing about the integration gap
  - Added economics teaser to operators page
- 2026-01-15: Created OpenAPI test suite (`local-development/tests/test-openapi.sh`)
- 2026-01-15: Reorganized local-development folder structure (tests/, load-tests/, utils/, etc.)