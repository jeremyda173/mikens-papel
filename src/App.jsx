import { useState, useEffect } from 'react'
import './App.css'

const CHOICES = {
  PIEDRA: 'piedra',
  PAPEL: 'papel',
  TIJERA: 'tijera'
}

const EMOJIS = {
  [CHOICES.PIEDRA]: '🗿',
  [CHOICES.PAPEL]: '📄',
  [CHOICES.TIJERA]: '✂️'
}

const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const getRandomChoice = () => {
  const choices = Object.values(CHOICES)
  return choices[Math.floor(Math.random() * choices.length)]
}

function App() {
  const [playerChoice, setPlayerChoice] = useState(null)
  const [computerChoice, setComputerChoice] = useState(null)
  const [result, setResult] = useState(null)
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('rps-score')
    return savedScore ? JSON.parse(savedScore) : { player: 0, computer: 0 }
  })
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    localStorage.setItem('rps-score', JSON.stringify(score))
  }, [score])

  const determineWinner = (player, computer) => {
    if (player === computer) return 'empate'
    
    const winConditions = {
      [CHOICES.PIEDRA]: CHOICES.TIJERA,
      [CHOICES.PAPEL]: CHOICES.PIEDRA,
      [CHOICES.TIJERA]: CHOICES.PAPEL
    }
    
    return winConditions[player] === computer ? 'ganaste' : 'perdiste'
  }

  const handleChoice = (choice) => {
    setIsAnimating(true)
    setPlayerChoice(choice)
    setComputerChoice(null)
    setResult(null)
    
    setTimeout(() => {
      const computer = getRandomChoice()
      const gameResult = determineWinner(choice, computer)
      
      setComputerChoice(computer)
      setResult(gameResult)
      setIsAnimating(false)
      
      if (gameResult === 'ganaste') {
        setScore(prev => ({ ...prev, player: prev.player + 1 }))
      } else if (gameResult === 'perdiste') {
        setScore(prev => ({ ...prev, computer: prev.computer + 1 }))
      }
    }, 1000)
  }

  const resetGame = () => {
    setPlayerChoice(null)
    setComputerChoice(null)
    setResult(null)
    setIsAnimating(false)
  }

  const resetScore = () => {
    if (window.confirm('¿Resetear puntuación?')) {
      setScore({ player: 0, computer: 0 })
      resetGame()
    }
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Piedra Papel Tijera</h1>
        
        <div className="score-board">
          <div className="score-item">
            <span className="score-label">Tú</span>
            <span className="score-value">{score.player}</span>
          </div>
          <div className="score-divider">-</div>
          <div className="score-item">
            <span className="score-label">PC</span>
            <span className="score-value">{score.computer}</span>
          </div>
          <button className="reset-btn" onClick={resetScore} title="Resetear">
            <RefreshIcon />
          </button>
        </div>

        {!playerChoice ? (
          <div className="game-area">
            <h2 className="subtitle">Elige tu opción</h2>
            <div className="choices">
              {Object.values(CHOICES).map((choice) => (
                <button
                  key={choice}
                  className="choice-btn"
                  onClick={() => handleChoice(choice)}
                >
                  <span className="emoji">{EMOJIS[choice]}</span>
                  <span>{choice}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="result-area">
            <div className="battle">
              <div className={`battle-card player ${playerChoice} ${isAnimating ? 'pulse' : ''}`}>
                <div className="icon-wrapper">
                  <span className="emoji-large">{EMOJIS[playerChoice]}</span>
                </div>
                <p className="label">Tú</p>
              </div>
              
              <div className="vs">
                {isAnimating ? <span className="thinking">...</span> : 'VS'}
              </div>
              
              {computerChoice ? (
                <div className={`battle-card computer ${computerChoice}`}>
                  <div className="icon-wrapper">
                    <span className="emoji-large">{EMOJIS[computerChoice]}</span>
                  </div>
                  <p className="label">PC</p>
                </div>
              ) : (
                <div className="battle-card computer thinking">
                  <div className="icon-wrapper">
                    <span className="emoji-large thinking-emoji">🤔</span>
                  </div>
                  <p className="label">PC</p>
                </div>
              )}
            </div>

            {result && (
              <>
                <div className={`result ${result}`}>
                  {result === 'ganaste' && '🎉 ¡Ganaste!'}
                  {result === 'perdiste' && '😔 Perdiste'}
                  {result === 'empate' && '🤝 Empate'}
                </div>
                <button className="play-again-btn" onClick={resetGame}>
                  Jugar de nuevo
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
