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

Ethereum is no longer a speculative side system. It is an active settlement layer for stablecoins, tokenized assets, and institutional transaction flows.

Major financial and payment operators now use Ethereum-adjacent rails in production, while validators and stakers secure the network with globally distributed economic weight. The result is a settlement substrate that keeps operating under real-world load, with transparent state and predictable execution rules.

**For Oak Chain, this is an architectural constant: the base asset is ETH.**

</div>

<div class="axiom">

### Axiom 2: Oak Already Runs Critical Content Workloads

Oak is the repository core behind Adobe Experience Manager (AEM), the platform many enterprises use to run content, assets, and digital experience delivery at scale.

That includes global commerce catalogs, marketing sites, customer portals, regulated content workflows, and high-traffic public properties. A large share of enterprise web and content operations already depends on Oak's data model and operational behavior.

**Oak Chain does not replace Oak. It extends Oak with signed writes and economic policy.**

</div>

</div>

<div class="center-link">
  <a href="/thesis">Read the full thesis →</a>
</div>

---

## The Bridge in One View

Oak Chain combines Ethereum's payment/finality model with Oak's content model.

<div class="bridge-frame">
  <div class="bridge-head">
    <div>What stays familiar</div>
    <div>What is introduced</div>
  </div>
  <div class="bridge-row">
    <div class="bridge-old">JCR API</div>
    <div class="bridge-new">Wallet-scoped namespace ownership</div>
  </div>
  <div class="bridge-row">
    <div class="bridge-old">Sling authoring patterns</div>
    <div class="bridge-new">ETH-backed authorization path</div>
  </div>
  <div class="bridge-row">
    <div class="bridge-old">Oak TAR segment model</div>
    <div class="bridge-new">Raft validator replication</div>
  </div>
  <div class="bridge-row">
    <div class="bridge-old">Content and asset semantics</div>
    <div class="bridge-new">CID-linked binary durability</div>
  </div>
</div>

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

<div class="bottom-gallery">
  <figure class="gallery-card">
    <img src="/ethereum-ethos.jpeg" alt="Like gravity. Like oxygen. Some things should just work. For everyone. Forever." />
    <figcaption>Ethereum as core infrastructure.</figcaption>
  </figure>
  <figure class="gallery-card">
    <img src="/oak-chain-logo.jpeg" alt="Oak Chain" />
    <figcaption>Oak Chain: Jackrabbit Oak meets Ethereum-native economics.</figcaption>
  </figure>
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

.bridge-frame {
  border: 1px solid rgba(128, 134, 238, 0.26);
  border-radius: 12px;
  background: linear-gradient(150deg, rgba(14, 19, 39, 0.9), rgba(54, 65, 118, 0.22));
  overflow: hidden;
  margin: 1.2rem 0 0.8rem;
}

.bridge-head,
.bridge-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.bridge-head > div {
  padding: 0.85rem 1rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #d7dcff;
  background: rgba(98, 126, 234, 0.12);
  border-bottom: 1px solid rgba(128, 134, 238, 0.2);
}

.bridge-head > div:first-child,
.bridge-row > div:first-child {
  border-right: 1px solid rgba(128, 134, 238, 0.2);
}

.bridge-row > div {
  padding: 0.9rem 1rem;
}

.bridge-row + .bridge-row > div {
  border-top: 1px solid rgba(128, 134, 238, 0.15);
}

.bridge-old {
  color: #d3d8ff;
  background: rgba(26, 35, 72, 0.45);
}

.bridge-new {
  color: #edf0ff;
  background: linear-gradient(145deg, rgba(76, 92, 176, 0.24), rgba(33, 41, 80, 0.46));
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

.bottom-gallery {
  margin-top: 3rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.gallery-card {
  margin: 0;
  border: 1px solid rgba(127, 133, 244, 0.28);
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(145deg, rgba(14, 19, 36, 0.92), rgba(57, 70, 125, 0.26));
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.3);
}

.gallery-card img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  display: block;
}

.gallery-card figcaption {
  margin: 0;
  padding: 0.7rem 0.85rem 0.8rem;
  color: #a9b0dd;
  font-size: 0.88rem;
  border-top: 1px solid rgba(127, 133, 244, 0.18);
}
</style>
