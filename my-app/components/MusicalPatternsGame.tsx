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
import { CheckCircle, XCircle } from 'lucide-react'

const instruments = ['🎹', '🎸', '🥁', '🎺']
const levels = [
  { name: 'Level 1', patternLength: 3, speed: 1000 },
  { name: 'Level 2', patternLength: 5, speed: 800 },
  { name: 'Level 3', patternLength: 7, speed: 600 },
]

export default function MusicalPatternsGame() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [pattern, setPattern] = useState<string[]>([])
  const [playerPattern, setPlayerPattern] = useState<string[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  useEffect(() => {
    generatePattern()
  }, [currentLevel])

  const generatePattern = () => {
    const newPattern = Array.from({ length: levels[currentLevel].patternLength }, () => 
      instruments[Math.floor(Math.random() * instruments.length)]
    )
    setPattern(newPattern)
    setPlayerPattern([])
    setIsPlaying(true)
    playPattern(newPattern)
  }

  const playPattern = async (patternToPlay: string[]) => {
    for (let instrument of patternToPlay) {
      setFeedback(instrument)
      await new Promise(resolve => setTimeout(resolve, levels[currentLevel].speed))
      setFeedback(null)
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    setIsPlaying(false)
  }

  const handleInstrumentClick = (instrument: string) => {
    if (isPlaying) return
    
    const newPlayerPattern = [...playerPattern, instrument]
    setPlayerPattern(newPlayerPattern)

    if (newPlayerPattern.length === pattern.length) {
      const correct = newPlayerPattern.every((instrument, index) => instrument === pattern[index])
      setIsCorrect(correct)
      if (correct) {
        setScore(score + 1)
        setFeedback('Correct! Great job!')
        if (score + 1 === 3 && currentLevel < levels.length - 1) {
          setCurrentLevel(currentLevel + 1)
          setScore(0)
        } else if (score + 1 === 3 && currentLevel === levels.length - 1) {
          setGameOver(true)
          triggerConfetti()
        } else {
          setTimeout(generatePattern, 1500)
        }
      } else {
        setFeedback('Oops! Try again!')
        setTimeout(() => {
          setIsCorrect(null)
          generatePattern()
        }, 1500)
      }
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
      <h2 className="text-3xl font-bold mb-4 text-blue-600">Musical Patterns Game</h2>
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl">{levels[currentLevel].name}</p>
        <p className="text-xl">Score: {score}/3</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">How to Play</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How to Play Musical Patterns Game</DialogTitle>
              <DialogDescription>
                1. Watch the pattern of instruments.<br/>
                2. Click the instruments in the same order to repeat the pattern.<br/>
                3. Complete 3 patterns correctly to advance to the next level.<br/>
                4. There are 3 levels with increasing difficulty.<br/>
                5. Win the game by completing all levels!<br/>
                Have fun and improve your memory and pattern recognition skills!
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mb-8">
        <div className="flex justify-center gap-4 mb-4">
          {instruments.map((instrument, index) => (
            <motion.button
              key={index}
              className="w-40 h-40 text-6xl bg-purple-200 rounded-lg shadow-lg flex items-center justify-center"
              onClick={() => handleInstrumentClick(instrument)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isPlaying}
            >
              {instrument}
            </motion.button>
          ))}
        </div>
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-2xl font-bold mb-4"
            >
              {feedback}
              {isCorrect !== null && (
                <span className="ml-2">
                  {isCorrect ? <CheckCircle className="inline text-green-500" /> : <XCircle className="inline text-red-500" />}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {gameOver ? (
        <motion.div
          className="text-2xl font-bold text-green-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🎉 Congratulations! You've completed all levels! 🎉
        </motion.div>
      ) : (
        <Button 
          onClick={generatePattern} 
          disabled={isPlaying}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {score === 0 ? 'Start Game' : 'Next Pattern'}
        </Button>
      )}
    </div>
  )
}

