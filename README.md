# 🎲 Nexus Lottery DApp

> Decentralized lottery application powered by Nexus zkVM with provable fairness

[![Live Demo](https://img.shields.io/badge/Live%20Demo-89.34.219.168-00d4ff?style=for-the-badge)](http://89.34.219.168)
[![Nexus Testnet](https://img.shields.io/badge/Network-Nexus%20Testnet%20III-ff0080?style=for-the-badge)](https://testnet3.explorer.nexus.xyz)
[![License](https://img.shields.io/badge/License-MIT-00ff88?style=for-the-badge)](LICENSE)

## 🌟 Overview

Nexus Lottery is a fully decentralized lottery application built on **Nexus Testnet III** using **zkVM technology** for provable fairness. The application features a modern cosmic-themed interface inspired by the official Nexus design language.

### ✨ Key Features

- 🎯 **Multiple Lottery Types** - Classic, Grid 100, and upcoming game modes
- 🔒 **Provable Fairness** - Zero-knowledge proofs guarantee fair draws
- 💳 **MetaMask Integration** - Seamless wallet connection and transactions
- 🌐 **Responsive Design** - Works perfectly on desktop and mobile
- ⚡ **Real-time Updates** - Live lottery data and transaction status
- 🎨 **Nexus Design Language** - Official cosmic theme with animations

## 🚀 Live Demo

**🌐 [Try it now: http://89.34.219.168](http://89.34.219.168)**

### 🎮 How to Use

1. **Connect Wallet** - Click "Connect Wallet" to link your MetaMask
2. **Get Test Tokens** - Use the [Faucet](https://faucet.nexus.xyz) to get NEX tokens
3. **Choose Lottery** - Select "Classic Lottery" (currently active)
4. **Buy Tickets** - Purchase tickets with NEX tokens
5. **Track Results** - Monitor your tickets and winnings

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom animations and glass effects
- **Responsive Design** - Mobile-first approach

### Web3 Integration
- **ethers.js v6** - Ethereum library for blockchain interaction
- **MetaMask** - Wallet connection and transaction signing
- **Nexus Testnet III** - zkVM-powered blockchain network

### Smart Contract
- **Contract Address**: `0xCAfEBc845Ad14d60174f3E87A9A01ccE135D58cf`
- **Network**: Nexus Testnet III (Chain ID: 3940)
- **Features**: Ticket purchasing, fair drawing, automatic payouts

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MetaMask browser extension
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/nexus-lottery-dapp.git
cd nexus-lottery-dapp

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Setup

The application is pre-configured for Nexus Testnet III:

```javascript
// Network Configuration
Chain ID: 3940 (0xF64)
RPC URL: https://testnet3.rpc.nexus.xyz
Explorer: https://testnet3.explorer.nexus.xyz
```

## 🎨 Design System

### Color Palette
- **Primary Cyan**: `#00d4ff` - Nexus brand color
- **Accent Magenta**: `#ff0080` - Interactive elements
- **Success Green**: `#00ff88` - Positive actions
- **Background**: Dark cosmic theme with animated particles

### Typography
- **Font Family**: Inter, system fonts
- **Letter Spacing**: Increased for futuristic feel
- **Font Weights**: 300, 400, 600, 700

### Effects
- **Glass Morphism** - Backdrop blur with transparency
- **Neon Borders** - Glowing cyan accents
- **Particle Animation** - Floating cosmic particles
- **3D Planet** - Animated central sphere

## 🔒 Security

### Security Audit Status: ✅ APPROVED

The application has undergone a comprehensive security audit:

- **Risk Level**: Low (2/10)
- **Testnet Environment**: No real financial risk
- **Wallet Security**: No access to private keys
- **Transaction Safety**: All transactions require user confirmation

### Best Practices
- Uses official MetaMask detection library
- Implements proper error handling
- Validates all user inputs
- Follows Web3 security standards

[📋 View Full Security Report](docs/SECURITY.md)

## 📁 Project Structure

```
nexus-lottery-dapp/
├── public/                 # Static assets
│   ├── nexus_logo_dark.svg
│   └── favicon.ico
├── src/
│   ├── components/         # React components
│   │   ├── LotteryTypeSelector.jsx
│   │   └── Grid100Lottery.jsx
│   ├── config/            # Configuration files
│   │   └── nexus.js       # Network and contract config
│   ├── services/          # Business logic
│   │   └── lotteryService.js
│   ├── utils/             # Utility functions
│   │   └── web3.js        # Web3 integration
│   ├── App.jsx            # Main application component
│   ├── App.css            # Global styles
│   └── main.jsx           # Application entry point
├── docs/                  # Documentation
├── README.md
└── package.json
```

## 🎯 Features in Detail

### 🎲 Classic Lottery
- **Ticket Price**: 0.01 NEX per ticket
- **Max Tickets**: Configurable per lottery
- **Drawing**: Automatic when conditions are met
- **Prizes**: Winner takes the entire prize pool

### 🎮 Grid 100 (Coming Soon)
- **100-cell grid** betting system
- **Multiple winners** possible
- **Hash-based** random selection

### 📊 Statistics & History
- **Personal Stats**: Tickets purchased, wins, total winnings
- **Global Stats**: Total participants, prize pools, completed lotteries
- **Transaction History**: Complete audit trail

## 🌐 Deployment

### Production Deployment

The application is deployed using Nginx with optimized configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/nexus-lottery;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # SPA routing
    try_files $uri $uri/ /index.html;
}
```

### Docker Support (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use ESLint configuration provided
- Follow React best practices
- Write meaningful commit messages
- Add tests for new features

## 📚 Documentation

- [📖 User Guide](docs/USER_GUIDE.md) - How to use the application
- [🔧 Developer Guide](docs/DEVELOPER.md) - Technical documentation
- [🔒 Security Report](docs/SECURITY.md) - Security audit results
- [🚀 Deployment Guide](docs/DEPLOYMENT.md) - Production setup

## 🔗 Links

### Official Nexus Resources
- [🌐 Nexus Website](https://nexus.xyz)
- [📖 Nexus Documentation](https://docs.nexus.xyz)
- [🔍 Testnet Explorer](https://testnet3.explorer.nexus.xyz)
- [💧 Testnet Faucet](https://faucet.nexus.xyz)

### Application Links
- [🎲 Live Demo](http://89.34.219.168)
- [📊 Contract on Explorer](https://testnet3.explorer.nexus.xyz/address/0xCAfEBc845Ad14d60174f3E87A9A01ccE135D58cf)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Nexus Labs** - For the amazing zkVM technology and design inspiration
- **MetaMask** - For seamless Web3 wallet integration
- **React Team** - For the excellent frontend framework
- **ethers.js** - For robust Ethereum interaction library

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/nexus-lottery-dapp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/nexus-lottery-dapp/discussions)
- **Email**: support@your-domain.com

---

<div align="center">

**Built with ❤️ for the Nexus ecosystem**

[![Nexus](https://img.shields.io/badge/Powered%20by-Nexus%20zkVM-00d4ff?style=for-the-badge)](https://nexus.xyz)
[![React](https://img.shields.io/badge/Built%20with-React-61dafb?style=for-the-badge)](https://reactjs.org)
[![Web3](https://img.shields.io/badge/Web3-Enabled-ff0080?style=for-the-badge)](https://ethereum.org)

</div>

