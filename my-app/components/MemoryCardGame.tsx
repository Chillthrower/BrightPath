'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵']

const levels = [
  { name: 'Easy', pairs: 6 },
  { name: 'Medium', pairs: 8 },
  { name: 'Hard', pairs: 10 },
]

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

export default function MemoryCardGame() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    startNewGame()
  }, [currentLevel])

  const startNewGame = () => {
    const gameEmojis = emojis
      .sort(() => 0.5 - Math.random())
      .slice(0, levels[currentLevel].pairs)
    const gameCards: Card[] = [...gameEmojis, ...gameEmojis]
      .sort(() => 0.5 - Math.random())
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
    setCards(gameCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setGameOver(false)
  }

  const handleCardClick = (clickedCard: Card) => {
    if (flippedCards.length === 2 || clickedCard.isFlipped || clickedCard.isMatched) return

    const newFlippedCards = [...flippedCards, clickedCard.id]
    setFlippedCards(newFlippedCards)
    setCards(cards.map(card => 
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    ))

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)
      const [firstCardId, secondCardId] = newFlippedCards
      const firstCard = cards.find(card => card.id === firstCardId)
      const secondCard = cards.find(card => card.id === secondCardId)

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        setMatchedPairs(matchedPairs + 1)
        setCards(cards.map(card => 
          card.id === firstCardId || card.id === secondCardId
            ? { ...card, isMatched: true }
            : card
        ))
        setFlippedCards([])

        if (matchedPairs + 1 === levels[currentLevel].pairs) {
          endGame()
        }
      } else {
        setTimeout(() => {
          setCards(cards.map(card => 
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, isFlipped: false }
              : card
          ))
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const endGame = () => {
    setGameOver(true)
    setScore(score + 1)
    if (score + 1 === 3 && currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1)
      setScore(0)
    } else if (score + 1 === 3 && currentLevel === levels.length - 1) {
      triggerConfetti()
    }
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4 text-blue-600">Memory Card Game</h2>
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl">Level: {levels[currentLevel].name}</p>
        <p className="text-xl">Score: {score}/3</p>
        <p className="text-xl">Moves: {moves}</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">How to Play</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How to Play Memory Card Game</DialogTitle>
              <DialogDescription>
                1. Click on a card to flip it over.<br/>
                2. Try to find matching pairs of cards.<br/>
                3. Match all pairs to complete the game.<br/>
                4. Complete 3 games to advance to the next level.<br/>
                5. There are 3 levels: Easy, Medium, and Hard.<br/>
                6. Win the game by completing all levels!<br/>
                Have fun and improve your memory!
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mb-8">
        <div 
          className="flex justify-center flex-wrap gap-4"
          style={{ 
            maxWidth: `${Math.ceil(Math.sqrt(levels[currentLevel].pairs * 2)) * 70}px`,
            margin: '0 auto'
          }}
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              className={`w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center cursor-pointer ${
                card.isFlipped || card.isMatched ? 'bg-white' : ''
              }`}
              onClick={() => handleCardClick(card)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {card.isFlipped || card.isMatched ? (
                <span className="text-3xl">{card.emoji}</span>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
      {gameOver ? (
        <div>
          <p className="text-xl mb-4">
            Congratulations! You completed the game in {moves} moves!
          </p>
          {score === 3 && currentLevel === levels.length - 1 ? (
            <motion.div
              className="text-2xl font-bold text-green-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              🎉 Congratulations! You've completed all levels! 🎉
            </motion.div>
          ) : (
            <Button 
              onClick={startNewGame}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {score === 3 ? 'Next Level' : 'Play Again'}
            </Button>
          )}
        </div>
      ) : (
        <Button 
          onClick={startNewGame}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          New Game
        </Button>
      )}
    </div>
  )
}

