import { ethers } from 'ethers'
import { web3Service } from '../utils/web3.js'
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '../config/nexus.js'

class LotteryService {
  constructor() {
    this.contract = null
  }

  // Initialize contract
  initContract() {
    if (!CONTRACT_ADDRESSES.LOTTERY) {
      throw new Error('Lottery contract address not set')
    }

    if (!web3Service.isConnected()) {
      throw new Error('Web3 not connected')
    }

    this.contract = web3Service.getContract(
      CONTRACT_ADDRESSES.LOTTERY,
      CONTRACT_ABIS.LOTTERY
    )

    return this.contract
  }

  // Get current lottery
  async getCurrentLottery() {
    try {
      if (!this.contract) this.initContract()

      const totalLotteries = await this.contract.getTotalLotteries()
      if (totalLotteries === 0n) {
        return null
      }

      const currentLotteryId = totalLotteries
      const lottery = await this.contract.getLottery(currentLotteryId)

      return {
        id: Number(lottery.id),
        ticketPrice: ethers.formatEther(lottery.ticketPrice),
        maxTickets: Number(lottery.maxTickets),
        endTime: Number(lottery.endTime),
        totalTickets: Number(lottery.totalTickets),
        prizePool: ethers.formatEther(lottery.prizePool),
        winner: lottery.winner,
        isActive: lottery.isActive,
        isCompleted: lottery.isCompleted,
      }
    } catch (error) {
      console.error('Failed to get current lottery:', error)
      throw error
    }
  }

  // Buy tickets
  async buyTickets(lotteryId, ticketCount) {
    try {
      if (!this.contract) this.initContract()

      const lottery = await this.contract.getLottery(lotteryId)
      const ticketPrice = lottery.ticketPrice
      const totalCost = ticketPrice * BigInt(ticketCount)

      const tx = await web3Service.sendTransaction(
        this.contract,
        'buyTickets',
        [lotteryId, ticketCount],
        ethers.formatEther(totalCost)
      )

      return tx
    } catch (error) {
      console.error('Failed to buy tickets:', error)
      throw error
    }
  }

  // Get user ticket count for lottery
  async getUserTicketCount(lotteryId, userAddress = null) {
    try {
      if (!this.contract) this.initContract()

      const address = userAddress || web3Service.account
      if (!address) {
        throw new Error('No user address provided')
      }

      const count = await this.contract.getUserTicketCount(lotteryId, address)
      return Number(count)
    } catch (error) {
      console.error('Failed to get user ticket count:', error)
      throw error
    }
  }

  // Get user winnings
  async getUserWinnings(userAddress = null) {
    try {
      if (!this.contract) this.initContract()

      const address = userAddress || web3Service.account
      if (!address) {
        throw new Error('No user address provided')
      }

      const winnings = await this.contract.getUserWinnings(address)
      return ethers.formatEther(winnings)
    } catch (error) {
      console.error('Failed to get user winnings:', error)
      throw error
    }
  }

  // Withdraw winnings
  async withdrawWinnings() {
    try {
      if (!this.contract) this.initContract()

      const tx = await web3Service.sendTransaction(
        this.contract,
        'withdrawWinnings',
        []
      )

      return tx
    } catch (error) {
      console.error('Failed to withdraw winnings:', error)
      throw error
    }
  }

  // Complete lottery (if conditions are met)
  async completeLottery(lotteryId) {
    try {
      if (!this.contract) this.initContract()

      const canComplete = await this.contract.canCompleteLottery(lotteryId)
      if (!canComplete) {
        throw new Error('Lottery cannot be completed yet')
      }

      const tx = await web3Service.sendTransaction(
        this.contract,
        'completeLottery',
        [lotteryId]
      )

      return tx
    } catch (error) {
      console.error('Failed to complete lottery:', error)
      throw error
    }
  }

  // Get lottery history
  async getLotteryHistory(limit = 10) {
    try {
      if (!this.contract) this.initContract()

      const totalLotteries = await this.contract.getTotalLotteries()
      const lotteries = []

      const start = Math.max(1, Number(totalLotteries) - limit + 1)
      const end = Number(totalLotteries)

      for (let i = end; i >= start; i--) {
        const lottery = await this.contract.getLottery(i)
        
        if (lottery.isCompleted) {
          lotteries.push({
            id: Number(lottery.id),
            ticketPrice: ethers.formatEther(lottery.ticketPrice),
            maxTickets: Number(lottery.maxTickets),
            totalTickets: Number(lottery.totalTickets),
            prizePool: ethers.formatEther(lottery.prizePool),
            winner: lottery.winner,
            isCompleted: lottery.isCompleted,
          })
        }
      }

      return lotteries
    } catch (error) {
      console.error('Failed to get lottery history:', error)
      throw error
    }
  }

  // Get global statistics
  async getGlobalStatistics() {
    try {
      if (!this.contract) this.initContract()

      const totalLotteries = await this.contract.getTotalLotteries()
      let totalParticipants = 0
      let totalPrizePool = 0n
      let activeDraws = 0

      // Calculate statistics from all lotteries
      for (let i = 1; i <= Number(totalLotteries); i++) {
        const lottery = await this.contract.getLottery(i)
        
        if (lottery.isCompleted) {
          totalParticipants += Number(lottery.totalTickets)
          totalPrizePool += lottery.prizePool
        } else if (lottery.isActive) {
          activeDraws++
        }
      }

      return {
        lotteriesCompleted: Number(totalLotteries) - activeDraws,
        participants: totalParticipants,
        totalPrizePool: ethers.formatEther(totalPrizePool),
        activeDraws: activeDraws,
      }
    } catch (error) {
      console.error('Failed to get global statistics:', error)
      throw error
    }
  }

  // Get user statistics
  async getUserStatistics(userAddress = null) {
    try {
      if (!this.contract) this.initContract()

      const address = userAddress || web3Service.account
      if (!address) {
        throw new Error('No user address provided')
      }

      const totalLotteries = await this.contract.getTotalLotteries()
      let lotteryParticipations = 0
      let ticketsPurchased = 0
      let wins = 0
      let totalWinnings = 0n

      // Calculate user statistics from all lotteries
      for (let i = 1; i <= Number(totalLotteries); i++) {
        const userTicketCount = await this.contract.getUserTicketCount(i, address)
        
        if (Number(userTicketCount) > 0) {
          lotteryParticipations++
          ticketsPurchased += Number(userTicketCount)

          // Check if user won this lottery
          const lottery = await this.contract.getLottery(i)
          if (lottery.isCompleted && lottery.winner.toLowerCase() === address.toLowerCase()) {
            wins++
            totalWinnings += lottery.prizePool
          }
        }
      }

      return {
        lotteryParticipations,
        ticketsPurchased,
        wins,
        totalWinnings: ethers.formatEther(totalWinnings),
      }
    } catch (error) {
      console.error('Failed to get user statistics:', error)
      throw error
    }
  }

  // Listen to contract events
  setupEventListeners(callbacks = {}) {
    if (!this.contract) this.initContract()

    // Listen for ticket purchases
    if (callbacks.onTicketPurchased) {
      this.contract.on('TicketPurchased', (lotteryId, buyer, ticketNumber, amount, event) => {
        callbacks.onTicketPurchased({
          lotteryId: Number(lotteryId),
          buyer,
          ticketNumber: Number(ticketNumber),
          amount: ethers.formatEther(amount),
          transactionHash: event.transactionHash,
        })
      })
    }

    // Listen for lottery completions
    if (callbacks.onLotteryCompleted) {
      this.contract.on('LotteryCompleted', (lotteryId, winner, prizeAmount, event) => {
        callbacks.onLotteryCompleted({
          lotteryId: Number(lotteryId),
          winner,
          prizeAmount: ethers.formatEther(prizeAmount),
          transactionHash: event.transactionHash,
        })
      })
    }

    // Listen for lottery creations
    if (callbacks.onLotteryCreated) {
      this.contract.on('LotteryCreated', (lotteryId, ticketPrice, maxTickets, endTime, event) => {
        callbacks.onLotteryCreated({
          lotteryId: Number(lotteryId),
          ticketPrice: ethers.formatEther(ticketPrice),
          maxTickets: Number(maxTickets),
          endTime: Number(endTime),
          transactionHash: event.transactionHash,
        })
      })
    }
  }

  // Remove event listeners
  removeEventListeners() {
    if (this.contract) {
      this.contract.removeAllListeners()
    }
  }

  // Check if lottery can be completed
  async canCompleteLottery(lotteryId) {
    try {
      if (!this.contract) this.initContract()
      return await this.contract.canCompleteLottery(lotteryId)
    } catch (error) {
      console.error('Failed to check if lottery can be completed:', error)
      return false
    }
  }

  // Admin methods
  async isOwner() {
    try {
      if (!this.contract) this.initContract()
      const owner = await this.contract.owner()
      const currentAccount = await web3Service.getCurrentAccount()
      return owner.toLowerCase() === currentAccount.toLowerCase()
    } catch (error) {
      console.error('Failed to check owner status:', error)
      return false
    }
  }

  async createLottery(ticketPrice, maxTickets, durationHours) {
    try {
      if (!this.contract) this.initContract()
      
      const ticketPriceWei = ethers.parseEther(ticketPrice.toString())
      const durationSeconds = parseInt(durationHours) * 3600
      
      const tx = await this.contract.createLottery(
        ticketPriceWei,
        parseInt(maxTickets),
        durationSeconds
      )
      
      return tx
    } catch (error) {
      console.error('Failed to create lottery:', error)
      throw error
    }
  }

  async completeLottery(lotteryId) {
    try {
      if (!this.contract) this.initContract()
      
      const tx = await this.contract.completeLottery(lotteryId)
      return tx
    } catch (error) {
      console.error('Failed to complete lottery:', error)
      throw error
    }
  }

  async getAdminStatistics() {
    try {
      if (!this.contract) this.initContract()
      
      // For now, return mock data since we need to implement these in the contract
      return {
        totalRevenue: '0.0000',
        activeLotteries: 1,
        pendingWithdrawals: '0.0000'
      }
    } catch (error) {
      console.error('Failed to get admin statistics:', error)
      return {
        totalRevenue: '0.0000',
        activeLotteries: 0,
        pendingWithdrawals: '0.0000'
      }
    }
  }

  async withdrawOwnerFunds() {
    try {
      if (!this.contract) this.initContract()
      
      const tx = await this.contract.withdrawOwnerFunds()
      return tx
    } catch (error) {
      console.error('Failed to withdraw owner funds:', error)
      throw error
    }
  }

  async pauseLottery() {
    try {
      if (!this.contract) this.initContract()
      
      const tx = await this.contract.pause()
      return tx
    } catch (error) {
      console.error('Failed to pause lottery:', error)
      throw error
    }
  }

  async unpauseLottery() {
    try {
      if (!this.contract) this.initContract()
      
      const tx = await this.contract.unpause()
      return tx
    } catch (error) {
      console.error('Failed to unpause lottery:', error)
      throw error
    }
  }
}

// Create singleton instance
export const lotteryService = new LotteryService()

export default lotteryService

