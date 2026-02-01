---
layout: home
next: /thesis

hero:
  name: "Oak Chain"
  text: "When Ethereum Meets Oak"
  tagline: Two planetary-scale systems. One inevitable convergence.
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
  - icon: 🔐
    title: Same Oak, New Ownership
    details: JCR API, Sling patterns, TAR segments. Everything you know. But your Ethereum wallet is your namespace.
    link: /architecture
  - icon: 💰
    title: Pay to Publish
    details: No access control lists. No admin approvals. Pay ETH, get writes. Economic security replaces bureaucratic security.
    link: /guide/economics
  - icon: ♾️
    title: Replicated Forever
    details: Raft consensus across validators. Your content survives any single company, server, or jurisdiction.
    link: /guide/consensus
  - icon: 🌳
    title: Enterprise-Grade Storage
    details: Oak's proven segment store. Immutable TAR files, append-only journal, cryptographic checksums.
    link: /architecture
  - icon: 📦
    title: IPFS Binaries
    details: Content-addressed binaries. Validators store CIDs, authors own storage. Global availability.
    link: /guide/binaries
  - icon: 🔄
    title: Real-Time Streaming
    details: Server-Sent Events for content discovery. Subscribe to the live feed of all writes.
    link: /guide/streaming
---

## The Two Axioms

<div class="axiom-grid">

<div class="axiom">

### Axiom 1: Ethereum Is Physics

When BlackRock puts billions into BUIDL, when Visa settles USDC directly, when JPMorgan routes Onyx through Ethereum rails: these aren't bets. They're irreversible commitments.

**This project treats Ethereum's dominance as physics, not opinion.**

</div>

<div class="axiom">

### Axiom 2: Oak Is Entrenched

Jackrabbit Oak already stores the majority of the planet's high-stakes digital experiences. Fortune 500 commerce. Healthcare records. Government services. Financial portals.

**We don't replace it. We upgrade it into something planetary.**

</div>

</div>

<div style="text-align: center; margin: 2rem 0;">
  <a href="/oak-chain-docs/thesis" style="color: #8C8DFC; font-weight: 500;">Read the full thesis →</a>
</div>

---

## The Bridge

Oak Chain brings Ethereum's economic finality to Oak's content model.

| What You Know | What's New |
|---------------|------------|
| Same JCR API | Wallet = namespace |
| Same Sling patterns | ETH payments = authorization |
| Same TAR segments | Raft consensus = replication |
| Same content model | Validators = decentralized storage |

---

## Interactive Architecture

<FlowGraph flow="architecture" :height="340" />

<div style="text-align: center; margin: 1rem 0 2rem;">
  <a href="/oak-chain-docs/how-it-works" style="color: #8C8DFC; font-weight: 500;">See all interactive flows →</a>
</div>

---

## The Model

1. **Author signs** content with Ethereum wallet
2. **Author pays** via smart contract (ETH)
3. **Leader validates** payment on Ethereum
4. **Cluster replicates** via Raft consensus
5. **Content persists** in Oak segment store
6. **Binaries stored** in IPFS (CID in Oak)

Every write is cryptographically signed, economically backed, and replicated.

---

## Quick Links

- [**The Thesis**](/thesis) - Why this exists
- [**How It Works**](/how-it-works) - Technical flows
- [**Architecture**](/architecture) - The five layers
- [**Developer Guide**](/guide/) - Build on Oak Chain
- [**Run a Validator**](/operators/) - Join the network and earn

---

<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 3rem;">
  <img src="/ethereum-ethos.jpeg" alt="Like gravity. Like oxygen. Some things should just work. For everyone. Forever." style="max-width: 500px; border-radius: 8px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);" />
</div>

<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 3rem;">
  <img src="/oak-chain-logo.jpeg" alt="Oak Chain" style="max-width: 400px; border-radius: 12px; box-shadow: 0 8px 32px rgba(98, 126, 234, 0.3);" />
  <p style="color: #888; margin-top: 1rem; font-style: italic;">Jackrabbit Oak meets Blockchain</p>
</div>

<style>
.axiom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.axiom {
  background: linear-gradient(135deg, rgba(98, 126, 234, 0.1), rgba(140, 141, 252, 0.05));
  border: 1px solid rgba(98, 126, 234, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
}

.axiom h3 {
  color: #8C8DFC;
  margin-top: 0;
}
</style>
