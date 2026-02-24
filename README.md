# Oak Chain Documentation

> Distributed Content Repository - Ethereum meets Oak

**Live Site**: https://somarc.github.io/oak-chain-docs

## What is Oak Chain?

Oak Chain bridges Ethereum's economic security with Apache Jackrabbit Oak's enterprise content model:

- **Aeron Cluster** for Raft consensus
- **Ethereum payments** for economic security  
- **Oak segments** for content storage
- **IPFS** for binary storage

## Why Teams Start Here

If you run Oak or AEM-backed content, the main risk is simple: writes can be hard to attribute and trust can be operator-dependent.

Oak Chain keeps your existing Oak mental model while adding signed, economically authorized, validator-replicated writes.

## 5-Minute Micro-Win

1. Open the docs home: https://somarc.github.io/oak-chain-docs
2. Jump to the [Developer Guide](https://somarc.github.io/oak-chain-docs/guide/)
3. Run a local 3-validator cluster and verify leader/follower state
4. Submit one signed write and confirm replicated durability

Most teams miss this because they evaluate blockchain as a replacement stack. Oak Chain is designed as an extension path.

## Local Development

```bash
npm install
npm run dev
```

Then open the local dev server URL shown in terminal.

## Build

```bash
npm run build
npm run preview
```

## Next Step

Start with the [Developer Guide](https://somarc.github.io/oak-chain-docs/guide/) to get a local proof before changing any production architecture.

## License

Apache 2.0
