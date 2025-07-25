import NexusLotteryArtifact from './NexusLottery.json'

// Nexus Testnet III Configuration
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
  websocketUrls: ['wss://testnet3.rpc.nexus.xyz'],
  faucetUrl: 'https://faucets.alchemy.com/faucets/nexus-testnet'
}

// Contract addresses (deployed on Nexus Testnet III)
export const CONTRACT_ADDRESSES = {
  LOTTERY: '0xCAfEBc845Ad14d60174f3E87A9A01ccE135D58cf', // Real deployed contract
}

// Contract ABIs
export const CONTRACT_ABIS = {
  LOTTERY: NexusLotteryArtifact.abi,
}

// Network validation
export const isNexusTestnet = (chainId) => {
  return parseInt(chainId, 16) === 3940 || chainId === 3940 || chainId === '3940'
}

// Gas settings for Nexus
export const GAS_SETTINGS = {
  gasLimit: 500000,
  maxFeePerGas: '20000000000', // 20 gwei
  maxPriorityFeePerGas: '2000000000', // 2 gwei
}

