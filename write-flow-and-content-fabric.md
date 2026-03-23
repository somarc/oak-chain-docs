---
prev: /architecture-system-map
next: /project-composition
---

# Write Flow and Content Fabric

This companion visual expands the smaller inline diagrams in [How It Works](/how-it-works) and [Architecture](/architecture). It makes two things explicit:

- the real single-cluster write path from HTTP ingress to Aeron quorum commit and replica apply
- the clusters-of-clusters model where each shard stays sovereign for writes and federated for reads

## Open The Full Explainer

<div class="visual-cta-grid">
  <a class="visual-cta-card" href="/oak-chain-docs/diagrams/oak-chain-write-flow-and-content-fabric.html">
    <strong>Open the full explainer</strong>
    <span>View the complete interactive page with write flow, three-plane model, and code anchors.</span>
  </a>
  <a class="visual-cta-card" href="/oak-chain-docs/diagrams/oak-chain-write-flow-and-content-fabric.html#write-flow">
    <strong>Jump to write flow</strong>
    <span>Go directly to the consensus sequence, redirect short-circuit, and durability ladder.</span>
  </a>
  <a class="visual-cta-card" href="/oak-chain-docs/diagrams/oak-chain-write-flow-and-content-fabric.html#content-fabric">
    <strong>Jump to content fabric</strong>
    <span>Go directly to the three-plane model and the cross-cluster read fabric.</span>
  </a>
</div>

## Write Flow Plate

[![Preview of the Oak Chain write flow plate showing redirect short-circuit, local-shard commit path, hard boundaries, and the durability ladder](/diagrams/oak-chain-write-flow-plate.png)](/diagrams/oak-chain-write-flow-and-content-fabric.html#write-flow)

This view adds the boundary details that the smaller docs graph intentionally compresses:

- foreign-shard writes redirect before local queueing
- `202 Accepted` and quorum commit are different states
- queue durability, Aeron ingress, and replica apply are separate steps

## Distributed Content Fabric Plate

[![Preview of the Oak Chain distributed content fabric plate showing local Aeron-only clusters, cross-cluster read mounts, and the advisory discovery plane](/diagrams/oak-chain-content-fabric-plate.png)](/diagrams/oak-chain-write-flow-and-content-fabric.html#content-fabric)

This view makes the current clusters-of-clusters model explicit:

- each Aeron cluster owns one authoritative writable repository
- remote clusters are mounted lazily and read-only outside quorum
- discovery and SSE hints are advisory control-plane tools, not consensus

## Why This Companion Exists

- The inline `FlowGraph` plates are optimized for quick comprehension.
- The full explainer preserves the richer sequence and topology details without overloading the narrative pages.
- The screenshots here make the visual browsable inside the docs, while the HTML artifact stays available for deeper reading and sharing.

## Source Artifacts

- HTML visual: `public/diagrams/oak-chain-write-flow-and-content-fabric.html`
- Write preview: `public/diagrams/oak-chain-write-flow-plate.png`
- Fabric preview: `public/diagrams/oak-chain-content-fabric-plate.png`

<style>
.visual-cta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin: 1.5rem 0 2rem;
}

.visual-cta-card {
  display: block;
  padding: 16px 18px;
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  border: 1px solid rgba(98, 126, 234, 0.22);
  background:
    linear-gradient(180deg, rgba(98, 126, 234, 0.14) 0%, rgba(98, 126, 234, 0.06) 100%),
    rgba(15, 15, 35, 0.48);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.visual-cta-card:hover {
  transform: translateY(-2px);
  border-color: rgba(98, 126, 234, 0.45);
  box-shadow: 0 12px 28px rgba(98, 126, 234, 0.16);
}

.visual-cta-card strong {
  display: block;
  margin-bottom: 6px;
}

.visual-cta-card span {
  display: block;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.5;
}
</style>
