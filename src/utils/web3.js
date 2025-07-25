import { ethers } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'
import { NEXUS_TESTNET_CONFIG, isNexusTestnet, GAS_SETTINGS } from '../config/nexus.js'

class Web3Service {
  constructor() {
    this.provider = null
    this.signer = null
    this.account = null
    this.chainId = null
  }

  // Detect and connect to MetaMask
  async detectProvider() {
    const provider = await detectEthereumProvider()
    if (provider) {
      this.provider = new ethers.BrowserProvider(provider)
      return true
    }
    return false
  }

  // Add Nexus Testnet to MetaMask
  async addNexusNetwork() {
    if (!window.ethereum) {
      throw new Error('MetaMask not detected')
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [NEXUS_TESTNET_CONFIG],
      })
      return true
    } catch (error) {
      console.error('Failed to add Nexus network:', error)
      throw error
    }
  }

  // Switch to Nexus Testnet
  async switchToNexus() {
    if (!window.ethereum) {
      throw new Error('MetaMask not detected')
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NEXUS_TESTNET_CONFIG.chainId }],
      })
      return true
    } catch (error) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        return await this.addNexusNetwork()
      }
      throw error
    }
  }

  // Connect wallet
  async connectWallet() {
    try {
      const hasProvider = await this.detectProvider()
      if (!hasProvider) {
        throw new Error('MetaMask not installed')
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      this.account = accounts[0]
      this.signer = await this.provider.getSigner()

      // Get current chain ID
      const network = await this.provider.getNetwork()
      this.chainId = Number(network.chainId)

      // Check if we're on Nexus Testnet
      if (!isNexusTestnet(this.chainId)) {
        // Try to switch to Nexus
        await this.switchToNexus()
        // Refresh network info
        const newNetwork = await this.provider.getNetwork()
        this.chainId = Number(newNetwork.chainId)
      }

      // Set up event listeners
      this.setupEventListeners()

      return {
        account: this.account,
        chainId: this.chainId,
        isNexusTestnet: isNexusTestnet(this.chainId)
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  // Setup event listeners for account and network changes
  setupEventListeners() {
    if (!window.ethereum) return

    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        this.disconnect()
      } else {
        this.account = accounts[0]
        window.dispatchEvent(new CustomEvent('accountChanged', { detail: accounts[0] }))
      }
    })

    window.ethereum.on('chainChanged', (chainId) => {
      this.chainId = parseInt(chainId, 16)
      window.dispatchEvent(new CustomEvent('chainChanged', { detail: this.chainId }))
      // Reload page to reset state
      window.location.reload()
    })
  }

  // Disconnect wallet
  disconnect() {
    this.provider = null
    this.signer = null
    this.account = null
    this.chainId = null
  }

  // Get account balance
  async getBalance(address = null) {
    if (!this.provider) {
      throw new Error('Provider not connected')
    }

    const account = address || this.account
    if (!account) {
      throw new Error('No account specified')
    }

    const balance = await this.provider.getBalance(account)
    return ethers.formatEther(balance)
  }

  // Get contract instance
  getContract(address, abi) {
    if (!this.signer) {
      throw new Error('Signer not available')
    }
    return new ethers.Contract(address, abi, this.signer)
  }

  // Send transaction with proper gas settings
  async sendTransaction(contract, method, params = [], value = '0') {
    try {
      const gasEstimate = await contract[method].estimateGas(...params, {
        value: ethers.parseEther(value.toString())
      })

      const tx = await contract[method](...params, {
        value: ethers.parseEther(value.toString()),
        gasLimit: gasEstimate * 120n / 100n, // Add 20% buffer
        maxFeePerGas: GAS_SETTINGS.maxFeePerGas,
        maxPriorityFeePerGas: GAS_SETTINGS.maxPriorityFeePerGas,
      })

      return tx
    } catch (error) {
      console.error('Transaction failed:', error)
      throw error
    }
  }

  // Format address for display
  formatAddress(address) {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Check if wallet is connected
  isConnected() {
    return !!(this.provider && this.account && this.signer)
  }

  // Get current network info
  async getNetworkInfo() {
    if (!this.provider) return null
    
    const network = await this.provider.getNetwork()
    return {
      chainId: Number(network.chainId),
      name: network.name,
      isNexusTestnet: isNexusTestnet(Number(network.chainId))
    }
  }
}

// Create singleton instance
export const web3Service = new Web3Service()

// Utility functions
export const formatEther = ethers.formatEther
export const parseEther = ethers.parseEther
export const formatAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default web3Service

