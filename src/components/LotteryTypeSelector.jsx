import React, { useState } from 'react'
import './LotteryTypeSelector.css'

const LotteryTypeSelector = ({ selectedType, onTypeChange }) => {
  const lotteryTypes = [
    {
      id: 'classic',
      name: 'Classic Lottery',
      icon: '🎫',
      description: 'Traditional lottery with ticket purchases',
      available: true,
      comingSoon: false
    },
    {
      id: 'grid100',
      name: 'Grid 100',
      icon: '🎯',
      description: 'Bet on 100 cells, winner determined by hash',
      available: true,
      comingSoon: false
    },
    {
      id: 'mega',
      name: 'Mega Jackpot',
      icon: '💎',
      description: 'Massive jackpot with progressive prizes',
      available: false,
      comingSoon: true
    },
    {
      id: 'nft',
      name: 'NFT Lottery',
      icon: '🖼️',
      description: 'Win unique NFTs and digital collectibles',
      available: false,
      comingSoon: true
    },
    {
      id: 'speed',
      name: 'Speed Draw',
      icon: '⚡',
      description: 'Quick draws every 5 minutes',
      available: false,
      comingSoon: true
    },
    {
      id: 'vip',
      name: 'VIP Exclusive',
      icon: '👑',
      description: 'Exclusive lottery for VIP players',
      available: false,
      comingSoon: true
    }
  ]

  const handleTypeSelect = (type) => {
    if (type.available) {
      onTypeChange(type.id)
    }
  }

  return (
    <div className="lottery-type-selector">
      <h3 className="selector-title">Choose Your Game</h3>
      <div className="lottery-types-grid">
        {lotteryTypes.map((type) => (
          <div
            key={type.id}
            className={`lottery-type-card ${
              selectedType === type.id ? 'active' : ''
            } ${!type.available ? 'locked' : ''}`}
            onClick={() => handleTypeSelect(type)}
          >
            <div className="card-header">
              <span className="type-icon">{type.icon}</span>
              {!type.available && <span className="lock-icon">🔒</span>}
            </div>
            <h4 className="type-name">{type.name}</h4>
            <p className="type-description">{type.description}</p>
            {!type.available && (
              <div className="coming-soon-badge">Coming Soon</div>
            )}
            {type.available && selectedType === type.id && (
              <div className="active-indicator">
                <div className="pulse-dot"></div>
                <span>Active</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LotteryTypeSelector

