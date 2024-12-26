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

const levels = [
  { 
    name: 'Level 1', 
    sentences: [
      { text: "The cat is sleeping on the bed.", correct: true },
      { text: "She don't like ice cream.", correct: false },
      { text: "They are going to the park.", correct: true },
    ],
    time: 60
  },
  { 
    name: 'Level 2', 
    sentences: [
      { text: "Neither of the students have finished their homework.", correct: false },
      { text: "The team is practicing for the big game.", correct: true },
      { text: "Every one of the apples are ripe.", correct: false },
    ],
    time: 90
  },
  { 
    name: 'Level 3', 
    sentences: [
      { text: "If I were you, I would study harder.", correct: true },
      { text: "The data show that the experiment was successful.", correct: true },
      { text: "She is one of the only people who understands the problem.", correct: false },
    ],
    time: 120
  },
]

export default function GrammarDetectiveGame() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [currentSentence, setCurrentSentence] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(levels[currentLevel].time)
  const [gameOver, setGameOver] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !gameOver) {
      endGame()
    }
  }, [timeLeft, gameOver])

  useEffect(() => {
    startNewLevel()
  }, [currentLevel])

  const startNewLevel = () => {
    setCurrentSentence(0)
    setScore(0)
    setTimeLeft(levels[currentLevel].time)
    setGameOver(false)
    setFeedback(null)
  }

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect === levels[currentLevel].sentences[currentSentence].correct) {
      setScore(score + 1)
      setFeedback('Correct!')
    } else {
      setFeedback('Incorrect. Try again!')
    }

    if (currentSentence + 1 < levels[currentLevel].sentences.length) {
      setCurrentSentence(currentSentence + 1)
    } else {
      if (currentLevel < levels.length - 1) {
        setCurrentLevel(currentLevel + 1)
      } else {
        endGame()
      }
    }
  }

  const endGame = () => {
    setGameOver(true)
    if (score === levels[currentLevel].sentences.length && currentLevel === levels.length - 1) {
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
      <h2 className="text-3xl font-bold mb-4 text-blue-600">Grammar Detective Game</h2>
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl">{levels[currentLevel].name}</p>
        <p className="text-xl">Score: {score}/{levels[currentLevel].sentences.length}</p>
        <p className="text-xl">Time: {timeLeft}s</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">How to Play</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How to Play Grammar Detective Game</DialogTitle>
              <DialogDescription>
                1. Read the sentence carefully.<br/>
                2. Decide if the sentence is grammatically correct or incorrect.<br/>
                3. Click 'Correct' or 'Incorrect' based on your decision.<br/>
                4. Complete all sentences in each level to advance.<br/>
                5. There are 3 levels with increasing difficulty.<br/>
                6. Win the game by completing all levels before time runs out!<br/>
                Have fun and improve your grammar skills!
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      {!gameOver ? (
        <div className="mb-8">
          <div className="text-2xl mb-4">{levels[currentLevel].sentences[currentSentence].text}</div>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => handleAnswer(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Correct
            </Button>
            <Button 
              onClick={() => handleAnswer(false)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Incorrect
            </Button>
          </div>
          {feedback && (
            <div className={`mt-4 text-xl ${feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'}`}>
              {feedback}
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className="text-xl mb-4">
            Game Over! Your final score: {score}/{levels[currentLevel].sentences.length}
          </p>
          {score === levels[currentLevel].sentences.length && currentLevel === levels.length - 1 ? (
            <motion.div
              className="text-2xl font-bold text-green-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              🎉 Congratulations! You've completed all levels! 🎉
            </motion.div>
          ) : (
            <Button 
              onClick={() => {
                setCurrentLevel(0)
                startNewLevel()
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Play Again
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

