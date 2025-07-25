# 🛠️ Developer Guide - Nexus Lottery DApp

This guide provides technical documentation for developers working with the Nexus Lottery DApp.

## 🏗️ Architecture Overview

### Frontend Architecture
```
src/
├── components/          # React components
│   ├── LotteryTypeSelector.jsx
│   ├── Grid100Lottery.jsx
│   └── ui/             # Reusable UI components
├── config/             # Configuration files
│   ├── nexus.js        # Network and contract config
│   └── NexusLottery.json # Contract ABI
├── services/           # Business logic layer
│   └── lotteryService.js
├── utils/              # Utility functions
│   └── web3.js         # Web3 integration
├── hooks/              # Custom React hooks
├── lib/                # Shared libraries
└── assets/             # Static assets
```

### Web3 Integration Layer
```
Web3 Service (web3.js)
├── Provider Detection
├── Wallet Connection
├── Network Management
└── Transaction Handling

Lottery Service (lotteryService.js)
├── Contract Interaction
├── Event Listening
├── Data Formatting
└── Error Handling
```

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git
- MetaMask browser extension
- Basic knowledge of React and Web3

### Environment Setup
```bash
# Clone the repository
git clone https://github.com/kolerto99/nexus-lottery-dapp.git
cd nexus-lottery-dapp

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Scripts
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
}
```

## 🌐 Web3 Integration

### Network Configuration
```javascript
// src/config/nexus.js
export const NEXUS_TESTNET_CONFIG = {
  chainId: '0xF64', // 3940 in hex
  chainName: 'Nexus Testnet III',
  nativeCurrency: {
    name: 'Nexus Token',
    symbol: 'NEX',
    decimals: 18,
  },
  rpcUrls: ['https://testnet3.rpc.nexus.xyz'],
  blockExplorerUrls: ['https://testnet3.explorer.nexus.xyz'],
};
```

### Contract Integration
```javascript
// Contract address on Nexus Testnet III
export const CONTRACT_ADDRESSES = {
  LOTTERY: '0xCAfEBc845Ad14d60174f3E87A9A01ccE135D58cf',
};

// Usage in service
const contract = web3Service.getContract(
  CONTRACT_ADDRESSES.LOTTERY,
  CONTRACT_ABIS.LOTTERY
);
```

### Wallet Connection Flow
```javascript
// 1. Detect MetaMask
const hasProvider = await web3Service.detectProvider();

// 2. Request account access
const accounts = await window.ethereum.request({
  method: 'eth_requestAccounts',
});

// 3. Check/switch network
if (!isNexusTestnet(chainId)) {
  await web3Service.switchToNexus();
}

// 4. Setup event listeners
web3Service.setupEventListeners();
```

## 🎲 Smart Contract Interface

### Contract Methods
```javascript
// Read methods
await contract.getCurrentLottery();
await contract.getUserTicketCount(lotteryId, userAddress);
await contract.getUserWinnings(userAddress);

// Write methods
await contract.buyTickets(lotteryId, ticketCount, { value: totalCost });
await contract.withdrawWinnings();
await contract.completeLottery(lotteryId);
```

### Event Handling
```javascript
// Listen for contract events
contract.on('TicketPurchased', (lotteryId, buyer, ticketNumber, amount) => {
  console.log('Ticket purchased:', { lotteryId, buyer, ticketNumber, amount });
});

contract.on('LotteryCompleted', (lotteryId, winner, prizeAmount) => {
  console.log('Lottery completed:', { lotteryId, winner, prizeAmount });
});
```

### Gas Management
```javascript
// Estimate gas with buffer
const gasEstimate = await contract.buyTickets.estimateGas(lotteryId, count, {
  value: ethers.parseEther(totalCost.toString())
});

// Send transaction with proper gas settings
const tx = await contract.buyTickets(lotteryId, count, {
  value: ethers.parseEther(totalCost.toString()),
  gasLimit: gasEstimate * 120n / 100n, // 20% buffer
  maxFeePerGas: GAS_SETTINGS.maxFeePerGas,
  maxPriorityFeePerGas: GAS_SETTINGS.maxPriorityFeePerGas,
});
```

## 🎨 UI Components

### Component Structure
```jsx
// LotteryTypeSelector.jsx
const LotteryTypeSelector = ({ selectedType, onTypeChange }) => {
  const lotteryTypes = [
    {
      id: 'classic',
      name: 'Classic Lottery',
      description: 'Traditional lottery with ticket purchases',
      icon: '🎫',
      status: 'active'
    },
    // ... more types
  ];

  return (
    <div className="lottery-types">
      {lotteryTypes.map(type => (
        <LotteryCard 
          key={type.id}
          type={type}
          isSelected={selectedType === type.id}
          onClick={() => onTypeChange(type.id)}
        />
      ))}
    </div>
  );
};
```

### Styling System
```css
/* CSS Custom Properties for theming */
:root {
  --primary-cyan: #00d4ff;
  --accent-magenta: #ff0080;
  --success-green: #00ff88;
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
}

/* Glass morphism effect */
.card {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
}

/* Neon glow effect */
.neon-border {
  box-shadow: 
    0 0 5px var(--primary-cyan),
    0 0 10px var(--primary-cyan),
    0 0 15px var(--primary-cyan);
}
```

## 🔄 State Management

### React State Pattern
```jsx
// App.jsx - Main state management
const App = () => {
  // UI state
  const [activeTab, setActiveTab] = useState('lottery');
  const [selectedLotteryType, setSelectedLotteryType] = useState('classic');

  // Web3 state
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');

  // Lottery state
  const [currentLottery, setCurrentLottery] = useState(null);
  const [userTickets, setUserTickets] = useState(0);

  // Effects for data loading
  useEffect(() => {
    if (isConnected) {
      loadUserData();
      loadLotteryData();
    }
  }, [isConnected]);
};
```

### Data Flow
```
User Action → Component → Service → Contract → Blockchain
                ↓
            State Update ← Event Listener ← Contract Event
```

## 🔒 Security Best Practices

### Input Validation
```javascript
// Validate ticket count
const validateTicketCount = (count) => {
  if (!Number.isInteger(count) || count <= 0 || count > 10) {
    throw new Error('Invalid ticket count: must be 1-10');
  }
};

// Validate addresses
const validateAddress = (address) => {
  if (!ethers.isAddress(address)) {
    throw new Error('Invalid Ethereum address');
  }
};
```

### Error Handling
```javascript
// Comprehensive error handling
const buyTickets = async (lotteryId, ticketCount) => {
  try {
    // Validation
    validateTicketCount(ticketCount);
    
    // Check lottery state
    const lottery = await lotteryService.getCurrentLottery();
    if (!lottery || !lottery.isActive) {
      throw new Error('No active lottery available');
    }

    // Execute transaction
    const tx = await lotteryService.buyTickets(lotteryId, ticketCount);
    
    // Wait for confirmation
    await tx.wait();
    
    // Update UI
    addNotification('Tickets purchased successfully!', 'success');
    
  } catch (error) {
    console.error('Failed to buy tickets:', error);
    addNotification(`Failed to buy tickets: ${error.message}`, 'error');
  }
};
```

### Transaction Safety
```javascript
// Safe transaction execution
const sendTransaction = async (contract, method, params, value = '0') => {
  try {
    // Estimate gas
    const gasEstimate = await contract[method].estimateGas(...params, {
      value: ethers.parseEther(value.toString())
    });

    // Send with proper gas settings
    const tx = await contract[method](...params, {
      value: ethers.parseEther(value.toString()),
      gasLimit: gasEstimate * 120n / 100n,
      maxFeePerGas: GAS_SETTINGS.maxFeePerGas,
      maxPriorityFeePerGas: GAS_SETTINGS.maxPriorityFeePerGas,
    });

    return tx;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
};
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Wallet connection with different states
- [ ] Network switching functionality
- [ ] Ticket purchasing flow
- [ ] Error handling scenarios
- [ ] Responsive design on various devices
- [ ] Transaction confirmation flow

### Testing Utilities
```javascript
// Mock Web3 provider for testing
const mockProvider = {
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
};

// Test wallet connection
const testWalletConnection = async () => {
  mockProvider.request.mockResolvedValue(['0x123...']);
  const result = await web3Service.connectWallet();
  expect(result.account).toBe('0x123...');
};
```

## 📦 Build and Deployment

### Build Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          web3: ['ethers', '@metamask/detect-provider'],
        },
      },
    },
  },
});
```

### Production Deployment
```bash
# Build for production
npm run build

# Deploy to server
rsync -avz dist/ user@server:/var/www/nexus-lottery/

# Configure Nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/nexus-lottery;
    index index.html;
    
    try_files $uri $uri/ /index.html;
}
```

## 🔍 Debugging

### Common Issues
1. **MetaMask not detected**
   ```javascript
   if (!window.ethereum) {
     console.error('MetaMask not installed');
     // Show installation guide
   }
   ```

2. **Wrong network**
   ```javascript
   if (!isNexusTestnet(chainId)) {
     console.warn('Wrong network, switching to Nexus Testnet');
     await web3Service.switchToNexus();
   }
   ```

3. **Transaction failures**
   ```javascript
   try {
     await tx.wait();
   } catch (error) {
     if (error.code === 'TRANSACTION_REPLACED') {
       console.log('Transaction was replaced');
     } else {
       console.error('Transaction failed:', error);
     }
   }
   ```

### Development Tools
- **React DevTools** - Component inspection
- **MetaMask** - Wallet and transaction debugging
- **Browser DevTools** - Network and console debugging
- **Nexus Explorer** - Transaction verification

## 🚀 Performance Optimization

### Code Splitting
```javascript
// Lazy load components
const Grid100Lottery = lazy(() => import('./components/Grid100Lottery'));

// Use Suspense for loading states
<Suspense fallback={<div>Loading...</div>}>
  <Grid100Lottery />
</Suspense>
```

### Memoization
```javascript
// Memoize expensive calculations
const ticketCost = useMemo(() => {
  return currentLottery ? 
    parseFloat(currentLottery.ticketPrice) * ticketCount : 0;
}, [currentLottery, ticketCount]);

// Memoize callbacks
const handleBuyTickets = useCallback(async () => {
  await buyTickets(currentLottery.id, ticketCount);
}, [currentLottery, ticketCount]);
```

## 📚 Additional Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [ethers.js Documentation](https://docs.ethers.org/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Nexus Documentation](https://docs.nexus.xyz/)

### Tools
- [MetaMask Developer Docs](https://docs.metamask.io/)
- [Nexus Testnet Explorer](https://testnet3.explorer.nexus.xyz)
- [Nexus Faucet](https://faucet.nexus.xyz)

### Community
- [Nexus Discord](https://discord.gg/nexus)
- [GitHub Discussions](https://github.com/kolerto99/nexus-lottery-dapp/discussions)

---

For questions or contributions, please see our [Contributing Guide](../CONTRIBUTING.md).

