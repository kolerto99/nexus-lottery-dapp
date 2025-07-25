import React, { useState, useEffect } from 'react';
import './App.css';
import { web3Service, formatAddress } from './utils/web3.js';
import { lotteryService } from './services/lotteryService.js';
import { NEXUS_TESTNET_CONFIG } from './config/nexus.js';
import LotteryTypeSelector from './components/LotteryTypeSelector';
import Grid100Lottery from './components/Grid100Lottery';

function App() {
  // UI state
  const [activeTab, setActiveTab] = useState('lottery');
  const [selectedLotteryType, setSelectedLotteryType] = useState('classic');

  // Web3 state
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Lottery state
  const [currentLottery, setCurrentLottery] = useState(null);
  const [userTickets, setUserTickets] = useState(0);
  const [userWinnings, setUserWinnings] = useState('0');
  const [ticketCount, setTicketCount] = useState(1);
  const [lotteryHistory, setLotteryHistory] = useState([]);
  const [globalStats, setGlobalStats] = useState({
    lotteriesCompleted: 0,
    participants: 0,
    totalPrizePool: '0',
    activeDraws: 0
  });
  const [userStats, setUserStats] = useState({
    lotteryParticipations: 0,
    ticketsPurchased: 0,
    wins: 0,
    totalWinnings: '0'
  });

  // Notifications
  const [notifications, setNotifications] = useState([]);

  // Add notification
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError('');

      const result = await web3Service.connectWallet();
      
      setAccount(result.account);
      setIsConnected(true);
      setIsCorrectNetwork(result.isNexusTestnet);

      if (!result.isNexusTestnet) {
        addNotification('Please switch to Nexus Testnet III', 'warning');
      } else {
        addNotification('Wallet connected successfully!', 'success');
        await loadUserData();
        await loadLotteryData();
      }

    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setError(error.message);
      addNotification(`Failed to connect: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Load user data
  const loadUserData = async () => {
    try {
      if (!web3Service.isConnected()) return;

      const balance = await web3Service.getBalance();
      setBalance(balance);

      if (currentLottery) {
        const tickets = await lotteryService.getUserTicketCount(currentLottery.id);
        setUserTickets(tickets);
      }

    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  // Load lottery data
  const loadLotteryData = async () => {
    try {
      const lottery = await lotteryService.getCurrentLottery();
      setCurrentLottery(lottery);

      if (lottery && web3Service.isConnected()) {
        const tickets = await lotteryService.getUserTicketCount(lottery.id);
        setUserTickets(tickets);
      }

    } catch (error) {
      console.error('Failed to load lottery data:', error);
    }
  };

  // Buy tickets
  const buyTickets = async () => {
    try {
      if (!currentLottery) {
        addNotification('No active lottery available', 'error');
        return;
      }

      setIsLoading(true);
      addNotification(`Buying ${ticketCount} ticket(s)...`, 'info');

      const tx = await lotteryService.buyTickets(currentLottery.id, ticketCount);
      addNotification('Transaction sent! Waiting for confirmation...', 'info');

      await tx.wait();
      addNotification('Tickets purchased successfully!', 'success');

      // Reload data
      await loadUserData();
      await loadLotteryData();

    } catch (error) {
      console.error('Failed to buy tickets:', error);
      addNotification(`Failed to buy tickets: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize on component mount
  useEffect(() => {
    const init = async () => {
      // Check if already connected
      if (window.ethereum && window.ethereum.selectedAddress) {
        try {
          await connectWallet();
        } catch (error) {
          console.error('Auto-connect failed:', error);
        }
      }
      
      // Load lottery data even without connection
      try {
        await loadLotteryData();
      } catch (error) {
        console.error('Failed to load initial lottery data:', error);
      }
    };

    init();
  }, []);

  // Listen for account changes
  useEffect(() => {
    const handleAccountChanged = (account) => {
      setAccount(account);
      loadUserData();
    };

    const handleChainChanged = (chainId) => {
      setIsCorrectNetwork(chainId === 3940);
      if (chainId === 3940) {
        loadUserData();
        loadLotteryData();
      }
    };

    window.addEventListener('accountChanged', handleAccountChanged);
    window.addEventListener('chainChanged', handleChainChanged);

    return () => {
      window.removeEventListener('accountChanged', handleAccountChanged);
      window.removeEventListener('chainChanged', handleChainChanged);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'lottery':
        return (
          <div className="lottery-content">
            <LotteryTypeSelector 
              selectedType={selectedLotteryType}
              onTypeChange={setSelectedLotteryType}
            />
            
            {selectedLotteryType === 'classic' && (
              <div className="lottery-grid">
                <div className="card wallet-card">
                  <div className="card-header">
                    <span className="card-icon">💳</span>
                    <h3>Wallet</h3>
                  </div>
                  <div className="wallet-info">
                    <div className="wallet-item">
                      <span className="label">Address:</span>
                      <span className="value">{isConnected ? formatAddress(account) : 'Not connected'}</span>
                    </div>
                    <div className="wallet-item">
                      <span className="label">Balance:</span>
                      <span className="value">{balance} NEX</span>
                    </div>
                    <div className="wallet-item">
                      <span className="label">My Tickets:</span>
                      <span className="value">{userTickets}</span>
                    </div>
                  </div>
                </div>

                <div className="card lottery-card">
                  <div className="card-header">
                    <span className="card-icon">🎲</span>
                    <h3>Current Lottery #{currentLottery ? currentLottery.id : 'N/A'}</h3>
                  </div>
                  <div className="lottery-info">
                    {currentLottery ? (
                      <>
                        <div className="lottery-item">
                          <span className="label">Ticket Price:</span>
                          <span className="value">{currentLottery.ticketPrice} NEX</span>
                        </div>
                        <div className="lottery-item">
                          <span className="label">Prize Pool:</span>
                          <span className="value">{currentLottery.prizePool} NEX</span>
                        </div>
                        <div className="lottery-item">
                          <span className="label">Tickets Sold:</span>
                          <span className="value">{currentLottery.totalTickets}/{currentLottery.maxTickets}</span>
                        </div>
                        {isConnected && isCorrectNetwork && (
                          <div className="buy-tickets-section">
                            <div className="ticket-input">
                              <label>Tickets to buy:</label>
                              <input 
                                type="number" 
                                min="1" 
                                max="10" 
                                value={ticketCount}
                                onChange={(e) => setTicketCount(parseInt(e.target.value) || 1)}
                              />
                            </div>
                            <button 
                              className="buy-tickets-btn"
                              onClick={buyTickets}
                              disabled={isLoading}
                            >
                              {isLoading ? 'Buying...' : `Buy ${ticketCount} Ticket(s)`}
                            </button>
                            <div className="total-cost">
                              Total: {(parseFloat(currentLottery.ticketPrice) * ticketCount).toFixed(4)} NEX
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p>No active lottery available</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {selectedLotteryType === 'grid100' && (
              <Grid100Lottery />
            )}
          </div>
        );
      case 'history':
        return (
          <div className="content-section">
            <h2>Lottery History</h2>
            <p>No lottery history available</p>
          </div>
        );
      case 'statistics':
        return (
          <div className="content-section">
            <h2>Statistics</h2>
            <p>No statistics available</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      {/* Animated background */}
      <div className="background">
        <div className="stars"></div>
        <div className="central-sphere"></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <img src="/nexus_logo_dark.svg" alt="Nexus" className="logo" />
          <span className="logo-text">NEXUS LOTTERY</span>
        </div>
        <button 
          className="connect-wallet-btn"
          onClick={connectWallet}
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : (isConnected ? formatAddress(account) : 'Connect Wallet')}
        </button>
      </header>

      {/* Main title */}
      <div className="main-title">
        <h1>NEXUS LOTTERY</h1>
        <p>Decentralized lottery powered by zkVM with provable fairness</p>
      </div>

      {/* Statistics cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-number">0</div>
          <div className="stat-label">LOTTERIES COMPLETED</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-number">0</div>
          <div className="stat-label">PARTICIPANTS</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-number">0</div>
          <div className="stat-label">TOTAL PRIZE POOL</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-number">0</div>
          <div className="stat-label">ACTIVE DRAWS</div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'lottery' ? 'active lottery-tab' : ''}`}
          onClick={() => setActiveTab('lottery')}
        >
          LOTTERY
        </button>
        <button 
          className={`nav-tab ${activeTab === 'history' ? 'active history-tab' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          HISTORY
        </button>
        <button 
          className={`nav-tab ${activeTab === 'statistics' ? 'active statistics-tab' : ''}`}
          onClick={() => setActiveTab('statistics')}
        >
          STATISTICS
        </button>
      </div>

      {/* Main content */}
      <main className="main-content">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-section">
          <h3>⚡ Nexus zkVM Advantages</h3>
        </div>
        <div className="advantages-grid">
          <div className="advantage-item">
            <h4>PROVABLE FAIRNESS</h4>
            <p>Zero-knowledge proofs guarantee fairness of every draw</p>
          </div>
          <div className="advantage-item">
            <h4>VERIFIABILITY</h4>
            <p>Anyone can independently verify lottery results</p>
          </div>
          <div className="advantage-item">
            <h4>SCALABILITY</h4>
            <p>Efficient computation through folding technology</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            Powered by Nexus zkVM ⚡ Provably Fair • Decentralized • {' '}
            <a 
              href="https://faucet.nexus.xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-link"
            >
              Faucet
            </a>
            {' • '}
            <a 
              href="https://explorer.nexus.xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-link"
            >
              Explorer
            </a>
          </p>
        </div>
      </footer>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map(notification => (
            <div key={notification.id} className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

