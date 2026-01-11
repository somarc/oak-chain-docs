# Contributing

Thank you for your interest in contributing to Oak Chain!

## Ways to Contribute

### 📝 Documentation

Found a typo? Want to clarify something? 

1. Click "Edit this page" at the bottom of any doc
2. Make your changes
3. Submit a pull request

### 🐛 Bug Reports

Found a bug? [Open an issue](https://github.com/somarc/oak-chain-docs/issues/new) with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Docker version, etc.)

### 💡 Feature Requests

Have an idea? [Open an issue](https://github.com/somarc/oak-chain-docs/issues/new) with:

- Use case description
- Proposed solution
- Alternatives considered

### 🔧 Code Contributions

Want to contribute code?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## Development Setup

### Documentation Site

```bash
# Clone the docs repo
git clone https://github.com/somarc/oak-chain-docs.git
cd oak-chain-docs

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Validator Node

```bash
# Clone the infrastructure repo
git clone https://github.com/somarc/blockchain-aem-infra.git
cd blockchain-aem-infra

# Start local cluster
docker-compose -f docker-compose/testing/3-validators-aeron.yml up -d

# View logs
docker-compose -f docker-compose/testing/3-validators-aeron.yml logs -f
```

## Code Style

### Java (Validator)

- Follow existing Oak/Jackrabbit conventions
- Use meaningful variable names
- Add Javadoc for public APIs
- Write unit tests for new code

### JavaScript (Docs/SDK)

- ESLint with default rules
- Prettier for formatting
- TypeScript preferred

### Markdown (Documentation)

- One sentence per line (easier diffs)
- Use ATX headers (`#`, `##`, `###`)
- Code blocks with language tags
- Mermaid for diagrams

## Pull Request Process

1. **Branch naming**: `feature/description` or `fix/description`
2. **Commit messages**: Clear, imperative mood ("Add feature" not "Added feature")
3. **Description**: Explain what and why
4. **Tests**: Include if applicable
5. **Review**: Wait for maintainer review

### PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactoring

## Testing
How was this tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Documentation updated
- [ ] Tests pass
```

## Community Guidelines

### Be Respectful

- Assume good intentions
- Be constructive in feedback
- Welcome newcomers

### Be Collaborative

- Share knowledge
- Help others learn
- Credit contributors

### Be Professional

- Stay on topic
- No spam or self-promotion
- Follow the code of conduct

## Recognition

Contributors are recognized in:
- Release notes
- Contributors list
- Community highlights

## Questions?

- **GitHub Issues**: For bugs and features
- **Discussions**: For questions and ideas
- **Documentation**: For how-to guides

---

## License

By contributing, you agree that your contributions will be licensed under the Apache 2.0 License.

---

Thank you for helping make Oak Chain better! 🌳⛓️
