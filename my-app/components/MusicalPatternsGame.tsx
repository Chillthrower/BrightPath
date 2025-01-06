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
  const [gameData, setGameData] = useState(() => {
    // Retrieve the game data from localStorage or initialize it if not present
    const storedGameData = localStorage.getItem('MusicalPatternsGame')
    return storedGameData
      ? JSON.parse(storedGameData)
      : { score: 0, totalCorrect: 0, totalIncorrect: 0 }
  })
  const [gameOver, setGameOver] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(30) // 30 seconds timer for the entire level
  const [timerActive, setTimerActive] = useState<boolean>(false)

  useEffect(() => {
    generatePattern()
  }, [currentLevel])

  useEffect(() => {
    // Save game data to localStorage every time it changes
    localStorage.setItem('MusicalPatternsGame', JSON.stringify(gameData))
  }, [gameData])

  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeRemaining === 0) {
      handleGameOver()
    }
  }, [timerActive, timeRemaining])

  const generatePattern = () => {
    setTimeRemaining(30) // Reset the timer for the new level
    const newPattern = Array.from({ length: levels[currentLevel].patternLength }, () =>
      instruments[Math.floor(Math.random() * instruments.length)]
    )
    setPattern(newPattern)
    setPlayerPattern([])
    setIsPlaying(true)
    playPattern(newPattern)
    setTimerActive(true) // Start the timer when a new pattern is generated
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
    if (isPlaying || timeRemaining === 0) return

    const newPlayerPattern = [...playerPattern, instrument]
    setPlayerPattern(newPlayerPattern)

    if (newPlayerPattern.length === pattern.length) {
      const correct = newPlayerPattern.every((instrument, index) => instrument === pattern[index])
      setIsCorrect(correct)

      if (correct) {
        const newGameData = {
          ...gameData,
          score: gameData.score + 1,
          totalCorrect: gameData.totalCorrect + 1,
        }
        setGameData(newGameData)

        setFeedback('Correct! Great job!')
        if (gameData.score + 1 === 3 && currentLevel < levels.length - 1) {
          setCurrentLevel(currentLevel + 1)
          setGameData(prev => ({ ...prev, score: 0 })) // Reset score after completing level
        } else if (gameData.score + 1 === 3 && currentLevel === levels.length - 1) {
          setGameOver(true)
          triggerConfetti()
        } else {
          setTimeout(generatePattern, 1500)
        }
      } else {
        const newGameData = {
          ...gameData,
          totalIncorrect: gameData.totalIncorrect + 1,
        }
        setGameData(newGameData)
        setFeedback('Oops! Try again!')
        setTimeout(() => {
          setIsCorrect(null)
          generatePattern()
        }, 1500)
      }
    }
  }

  const handleGameOver = () => {
    setGameOver(true)
    setTimerActive(false)
    triggerConfetti()
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
        <p className="text-xl">Score: {gameData.score}/3</p>
        <p className="text-xl">Correct: {gameData.totalCorrect}</p>
        <p className="text-xl">Incorrect: {gameData.totalIncorrect}</p>
        <p className="text-xl">Time Remaining: {timeRemaining}s</p>
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
              disabled={isPlaying || timeRemaining === 0}
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
          disabled={isPlaying || timeRemaining === 0}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {gameData.score === 0 ? 'Start Game' : 'Next Pattern'}
        </Button>
      )}
    </div>
  )
}
