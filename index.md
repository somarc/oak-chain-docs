---
layout: home
next: /thesis

hero:
  name: "Oak Chain"
  text: "Ethereum Finality, Oak Familiarity"
  tagline: Keep JCR and Sling. Add cryptographic attribution, economic authorization, and validator-backed durability.
  image:
    src: /oak-chain.svg
    alt: Oak Chain
  actions:
    - theme: brand
      text: The Thesis
      link: /thesis
    - theme: alt
      text: How It Works
      link: /how-it-works
    - theme: alt
      text: Run a Validator
      link: /operators/

features:
  - icon: 🧱
    title: Same Developer Surface
    details: JCR API, Sling patterns, and Oak segment semantics stay intact.
    link: /architecture
  - icon: ✍️
    title: Wallet-Signed Writes
    details: Every write is signed and attributable. Wallet identity is the namespace boundary.
    link: /guide/auth
  - icon: ⛽
    title: Economic Authorization
    details: ETH payment proofs gate write acceptance. Access control becomes on-chain economics.
    link: /guide/economics
  - icon: 🗳️
    title: Consensus Replication
    details: Raft-based validator agreement turns accepted writes into durable shared state.
    link: /guide/consensus
  - icon: 📦
    title: Segment + CID Storage
    details: Metadata stays in Oak segments; binaries resolve via content-addressed CIDs.
    link: /guide/binaries
  - icon: 📡
    title: Observable Operations
    details: Live queue, epoch, durability, and validator signals expose system reality.
    link: /guide/primary-signals
---

<div class="signal-strip">
  <span class="signal-chip">Wallet-authored content</span>
  <span class="signal-chip">Epoch-aware finality</span>
  <span class="signal-chip">Raft replicated durability</span>
  <span class="signal-chip">Oak-compatible runtime</span>
</div>

## Two Axioms

<div class="axiom-grid">

<div class="axiom">

### Axiom 1: Ethereum Is Durable Settlement Infrastructure

When BlackRock, Visa, and JPMorgan route meaningful value through Ethereum rails, they are treating it as production infrastructure.

**For Oak Chain, this is not a hypothesis. The base asset is ETH.**

</div>

<div class="axiom">

### Axiom 2: Oak Already Runs Critical Content Workloads

Oak is the repository core behind Adobe Experience Manager (AEM), which runs content, assets, and experience delivery for major enterprises worldwide.

That includes global commerce catalogs, marketing sites, customer portals, regulated content workflows, and high-traffic public experiences. In practice, a large share of enterprise-grade web and content operations already depend on Oak's data model and operational behavior.

**Oak Chain does not replace Oak. It extends Oak with signed writes and economic policy.**

</div>

</div>

<div class="center-link">
  <a href="/thesis">Read the full thesis →</a>
</div>

---

## The Bridge in One View

Oak Chain combines Ethereum's payment/finality model with Oak's content model.

| What You Know | What's New |
|---------------|------------|
| Same JCR API | Wallet = namespace |
| Same Sling patterns | ETH payments = authorization |
| Same TAR segments | Raft consensus = replication |
| Same content model | Validators = decentralized storage |

---

## Why This Matters Now

<div class="moment-grid">
  <div class="moment">
    <h4>Institutions moved first</h4>
    <p>Ethereum rails now support high-value settlement and tokenized assets in production environments.</p>
  </div>
  <div class="moment">
    <h4>Content infrastructure stayed centralized</h4>
    <p>Most content systems still rely on trusted operators and revocable access boundaries.</p>
  </div>
  <div class="moment">
    <h4>Oak Chain is the integration layer</h4>
    <p>The same Oak development model, now combined with signatures, payment proofs, and validator consensus.</p>
  </div>
</div>

---

## Interactive System Graph

<FlowGraph flow="architecture" :height="340" />

<div class="center-link compact">
  <a href="/how-it-works">See all interactive flows →</a>
</div>

---

## Protocol Path

<div class="path-grid">
  <div class="path-step"><strong>1.</strong> Author signs write intent</div>
  <div class="path-step"><strong>2.</strong> Payment proof is submitted</div>
  <div class="path-step"><strong>3.</strong> Leader verifies auth + economics</div>
  <div class="path-step"><strong>4.</strong> Proposal enters epoch queue</div>
  <div class="path-step"><strong>5.</strong> Validators replicate via consensus</div>
  <div class="path-step"><strong>6.</strong> State persists in Oak + CID graph</div>
</div>

Every accepted write is signed, economically authorized, replicated, and durable.

---

## Choose Your Route

<div class="route-grid">
  <a class="route-card" href="/guide/">
    <h3>Build on Oak Chain</h3>
    <p>Start with auth, paths, streaming, and API surfaces.</p>
    <span>Developer Guide →</span>
  </a>
  <a class="route-card" href="/operators/">
    <h3>Operate a Validator</h3>
    <p>Run nodes, monitor queue/finality signals, and validate economics.</p>
    <span>Operator Docs →</span>
  </a>
</div>

## Quick Links

- [**The Thesis**](/thesis) - Why this exists
- [**How It Works**](/how-it-works) - Technical flows
- [**Architecture**](/architecture) - The five layers
- [**Developer Guide**](/guide/) - Build on Oak Chain
- [**Run a Validator**](/operators/) - Join the network and earn

---

<div class="hero-image-block">
  <img src="/ethereum-ethos.jpeg" alt="Like gravity. Like oxygen. Some things should just work. For everyone. Forever." />
</div>

<div class="logo-block">
  <img src="/oak-chain-logo.jpeg" alt="Oak Chain" />
  <p>Jackrabbit Oak meets Ethereum-native economics</p>
</div>

<style>
:root {
  --oak-accent: #8C8DFC;
  --oak-surface: rgba(98, 126, 234, 0.08);
  --oak-border: rgba(140, 141, 252, 0.25);
}

.signal-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin: 1.25rem 0 2rem;
}

.signal-chip {
  border: 1px solid var(--oak-border);
  background: linear-gradient(135deg, rgba(98, 126, 234, 0.16), rgba(50, 56, 90, 0.35));
  color: #d8dcff;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  font-size: 0.82rem;
  letter-spacing: 0.02em;
}

.axiom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.axiom {
  background: linear-gradient(135deg, rgba(98, 126, 234, 0.1), rgba(140, 141, 252, 0.05) 45%, rgba(24, 24, 38, 0.7));
  border: 1px solid var(--oak-border);
  border-radius: 12px;
  padding: 1.65rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.axiom h3 {
  color: var(--oak-accent);
  margin-top: 0;
}

.center-link {
  display: flex;
  justify-content: center;
  margin: 1.5rem 0 2rem;
}

.center-link.compact {
  margin: 1rem 0 2rem;
}

.center-link a {
  color: var(--oak-accent);
  font-weight: 600;
}

.moment-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  margin: 1.2rem 0 0.8rem;
}

.moment {
  border: 1px solid rgba(120, 122, 210, 0.22);
  border-radius: 10px;
  padding: 1rem;
  background: rgba(20, 24, 44, 0.55);
}

.moment h4 {
  margin: 0 0 0.45rem;
  color: #cad1ff;
}

.moment p {
  margin: 0;
  font-size: 0.92rem;
  color: #b2b7dd;
}

.path-grid {
  display: grid;
  gap: 0.8rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  margin: 1.2rem 0 0.5rem;
}

.path-step {
  border-radius: 10px;
  border: 1px solid rgba(130, 135, 250, 0.24);
  background: linear-gradient(140deg, rgba(98, 126, 234, 0.12), rgba(20, 24, 44, 0.6));
  padding: 0.75rem 0.9rem;
}

.path-step strong {
  color: #d8dcff;
  margin-right: 0.2rem;
}

.route-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
  margin: 1.2rem 0 1.5rem;
}

.route-card {
  display: block;
  text-decoration: none;
  border: 1px solid rgba(132, 137, 251, 0.3);
  border-radius: 12px;
  padding: 1rem;
  background: linear-gradient(145deg, rgba(15, 19, 36, 0.9), rgba(60, 72, 128, 0.2));
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.route-card:hover {
  transform: translateY(-2px);
  border-color: rgba(171, 177, 255, 0.6);
}

.route-card h3 {
  margin: 0 0 0.5rem;
  color: #e6e9ff;
}

.route-card p {
  margin: 0 0 0.8rem;
  color: #adb4df;
}

.route-card span {
  color: var(--oak-accent);
  font-weight: 600;
}

.hero-image-block,
.logo-block {
  display: grid;
  justify-content: center;
  justify-items: center;
  margin-top: 3rem;
}

.hero-image-block img {
  max-width: 520px;
  border-radius: 10px;
  box-shadow: 0 10px 34px rgba(0, 0, 0, 0.35);
}

.logo-block img {
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(98, 126, 234, 0.3);
}

.logo-block p {
  color: #8f95be;
  margin-top: 1rem;
  font-style: italic;
}
</style>
