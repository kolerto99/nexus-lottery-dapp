# Contributing to Nexus Lottery DApp

Thank you for your interest in contributing to the Nexus Lottery DApp! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide detailed information** including:
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and MetaMask version
   - Screenshots if applicable

### Suggesting Features

1. **Open a discussion** first to gauge interest
2. **Describe the use case** and benefits
3. **Consider implementation complexity**
4. **Align with project goals** and Nexus ecosystem

### Code Contributions

#### Prerequisites

- Node.js 18+ and npm
- Git knowledge
- Basic understanding of React and Web3
- MetaMask for testing

#### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/nexus-lottery-dapp.git
cd nexus-lottery-dapp

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests (when available)
npm test
```

#### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards below
   - Write meaningful commit messages
   - Test your changes thoroughly

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**
   - Use the PR template
   - Describe your changes clearly
   - Link related issues

## 📝 Coding Standards

### JavaScript/React

- **Use functional components** with hooks
- **Follow ESLint configuration** provided
- **Use meaningful variable names**
- **Add JSDoc comments** for complex functions
- **Handle errors gracefully**

```javascript
// Good
const handleWalletConnection = async () => {
  try {
    const result = await web3Service.connectWallet();
    setAccount(result.account);
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    setError(error.message);
  }
};

// Bad
const connect = () => {
  web3Service.connectWallet().then(r => setAccount(r.account));
};
```

### CSS

- **Use CSS custom properties** for theming
- **Follow BEM methodology** for class naming
- **Mobile-first responsive design**
- **Consistent spacing** using rem units

```css
/* Good */
.lottery-card {
  --card-bg: rgba(255, 255, 255, 0.1);
  background: var(--card-bg);
  backdrop-filter: blur(10px);
}

.lottery-card__header {
  padding: 1rem;
}

/* Bad */
.card {
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
}
```

### Web3 Integration

- **Always handle errors** in async Web3 calls
- **Validate user inputs** before blockchain interactions
- **Use proper gas estimation**
- **Implement loading states**

```javascript
// Good
const buyTickets = async (count) => {
  try {
    setIsLoading(true);
    
    if (count <= 0 || count > 10) {
      throw new Error('Invalid ticket count');
    }
    
    const tx = await lotteryService.buyTickets(lotteryId, count);
    await tx.wait();
    
    addNotification('Tickets purchased successfully!', 'success');
  } catch (error) {
    addNotification(`Failed to buy tickets: ${error.message}`, 'error');
  } finally {
    setIsLoading(false);
  }
};
```

## 🧪 Testing Guidelines

### Manual Testing

1. **Test wallet connection** with different states
2. **Verify responsive design** on various devices
3. **Test error scenarios** (network issues, insufficient funds)
4. **Validate form inputs** and edge cases

### Automated Testing (Future)

- Unit tests for utility functions
- Integration tests for Web3 interactions
- E2E tests for critical user flows

## 📚 Documentation

### Code Documentation

- **Add JSDoc comments** for public functions
- **Document complex algorithms**
- **Explain Web3 integration patterns**
- **Update README** for new features

### User Documentation

- **Update user guide** for new features
- **Add troubleshooting** for common issues
- **Include screenshots** for UI changes
- **Maintain deployment docs**

## 🔒 Security Considerations

### Code Security

- **Never expose private keys** or sensitive data
- **Validate all user inputs** on frontend
- **Use official Web3 libraries** only
- **Follow Web3 security best practices**

### Smart Contract Interaction

- **Validate contract addresses** before interaction
- **Check network compatibility**
- **Handle transaction failures gracefully**
- **Implement proper error messages**

## 🎨 Design Guidelines

### Visual Design

- **Follow Nexus design language** (cosmic theme, neon colors)
- **Maintain consistent spacing** and typography
- **Use glass morphism effects** appropriately
- **Ensure accessibility** (contrast, focus states)

### User Experience

- **Provide clear feedback** for all actions
- **Show loading states** for async operations
- **Handle error states** gracefully
- **Maintain responsive design**

## 📋 Pull Request Guidelines

### PR Requirements

- [ ] **Descriptive title** and description
- [ ] **Link to related issue** (if applicable)
- [ ] **Screenshots** for UI changes
- [ ] **Testing instructions** provided
- [ ] **Documentation updated** (if needed)

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Tested on testnet
- [ ] Responsive design verified

## Screenshots
(If applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

## 🚀 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Release Checklist

1. **Update version** in package.json
2. **Update CHANGELOG.md**
3. **Test thoroughly** on testnet
4. **Create release tag**
5. **Deploy to production**

## 🤔 Questions?

- **GitHub Discussions** for general questions
- **GitHub Issues** for bugs and feature requests
- **Discord/Telegram** for real-time chat (if available)

## 🙏 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **Special thanks** in documentation

Thank you for contributing to the Nexus ecosystem! 🚀

