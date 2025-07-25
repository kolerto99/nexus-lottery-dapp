import React, { useState, useEffect } from 'react'
import './Grid100Lottery.css'

const Grid100Lottery = ({ balance, isConnected }) => {
  const [selectedCells, setSelectedCells] = useState([])
  const [cellPrice] = useState(0.01) // Fixed price per cell in NEX
  const [isLotteryActive, setIsLotteryActive] = useState(false)
  const [winningCell, setWinningCell] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // Generate 100 cells (1-100)
  const cells = Array.from({ length: 100 }, (_, i) => i + 1)

  const handleCellClick = (cellNumber) => {
    if (isLotteryActive || isDrawing) return

    if (selectedCells.includes(cellNumber)) {
      // Remove cell if already selected
      setSelectedCells(selectedCells.filter(cell => cell !== cellNumber))
    } else {
      // Add cell if not selected
      setSelectedCells([...selectedCells, cellNumber])
    }
  }

  const getTotalCost = () => {
    return (selectedCells.length * cellPrice).toFixed(3)
  }

  const canAfford = () => {
    return parseFloat(balance) >= parseFloat(getTotalCost())
  }

  const startLottery = () => {
    if (selectedCells.length === 0 || !canAfford()) return

    setIsLotteryActive(true)
    setIsDrawing(true)

    // Simulate lottery draw (in real implementation, this would be blockchain-based)
    setTimeout(() => {
      // Generate winning cell from "hash" (first 2 digits)
      // In real implementation: const hash = await getBlockHash(); const winningNumber = parseInt(hash.substring(2, 4), 16) % 100 + 1;
      const simulatedWinningCell = Math.floor(Math.random() * 100) + 1
      setWinningCell(simulatedWinningCell)
      setIsDrawing(false)

      // Check if user won
      if (selectedCells.includes(simulatedWinningCell)) {
        // User won! In real implementation, transfer prize
        setTimeout(() => {
          alert(`🎉 Congratulations! You won with cell ${simulatedWinningCell}!`)
        }, 1000)
      }

      // Reset after 5 seconds
      setTimeout(() => {
        setIsLotteryActive(false)
        setWinningCell(null)
        setSelectedCells([])
      }, 5000)
    }, 3000)
  }

  const getCellClass = (cellNumber) => {
    let className = 'grid-cell'
    
    if (selectedCells.includes(cellNumber)) {
      className += ' selected'
    }
    
    if (winningCell === cellNumber) {
      className += ' winning'
    }
    
    if (isLotteryActive && !winningCell) {
      className += ' lottery-active'
    }

    return className
  }

  return (
    <div className="grid100-lottery">
      <div className="lottery-header">
        <h3>🎯 Grid 100 Lottery</h3>
        <p>Select cells and bet on the winning number!</p>
      </div>

      <div className="lottery-info">
        <div className="info-card">
          <span className="label">Cell Price:</span>
          <span className="value">{cellPrice} NEX</span>
        </div>
        <div className="info-card">
          <span className="label">Selected:</span>
          <span className="value">{selectedCells.length} cells</span>
        </div>
        <div className="info-card">
          <span className="label">Total Cost:</span>
          <span className="value">{getTotalCost()} NEX</span>
        </div>
        {winningCell && (
          <div className="info-card winning-info">
            <span className="label">Winning Cell:</span>
            <span className="value">#{winningCell}</span>
          </div>
        )}
      </div>

      <div className="grid-container">
        <div className="grid-100">
          {cells.map((cellNumber) => (
            <div
              key={cellNumber}
              className={getCellClass(cellNumber)}
              onClick={() => handleCellClick(cellNumber)}
            >
              {cellNumber}
            </div>
          ))}
        </div>
      </div>

      <div className="lottery-controls">
        {!isConnected ? (
          <div className="connect-message">
            <p>Connect your wallet to play</p>
          </div>
        ) : (
          <>
            <div className="selected-cells">
              {selectedCells.length > 0 && (
                <div className="selected-list">
                  <span>Selected cells: </span>
                  {selectedCells.sort((a, b) => a - b).map((cell, index) => (
                    <span key={cell} className="selected-cell-tag">
                      #{cell}
                      {index < selectedCells.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              className={`start-lottery-btn ${
                selectedCells.length === 0 || !canAfford() || isLotteryActive
                  ? 'disabled'
                  : ''
              }`}
              onClick={startLottery}
              disabled={selectedCells.length === 0 || !canAfford() || isLotteryActive}
            >
              {isDrawing ? (
                <>
                  <span className="spinner"></span>
                  Drawing...
                </>
              ) : isLotteryActive ? (
                'Lottery Active'
              ) : selectedCells.length === 0 ? (
                'Select Cells First'
              ) : !canAfford() ? (
                'Insufficient Balance'
              ) : (
                `Start Lottery (${getTotalCost()} NEX)`
              )}
            </button>
          </>
        )}
      </div>

      {isDrawing && (
        <div className="drawing-overlay">
          <div className="drawing-animation">
            <div className="cosmic-spinner"></div>
            <p>Determining winning cell...</p>
            <p className="hash-info">Using blockchain hash for fairness</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Grid100Lottery

