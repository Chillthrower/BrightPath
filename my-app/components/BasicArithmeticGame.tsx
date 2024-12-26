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

const levels = [
  { name: 'Level 1', operations: ['+', '-'], maxNumber: 10, questions: 5, time: 60 },
  { name: 'Level 2', operations: ['+', '-', '*'], maxNumber: 20, questions: 7, time: 90 },
  { name: 'Level 3', operations: ['+', '-', '*', '/'], maxNumber: 50, questions: 10, time: 120 },
]

export default function BasicArithmeticGame() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
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
    generateQuestion()
  }, [currentLevel])

  const generateQuestion = () => {
    const { operations, maxNumber } = levels[currentLevel]
    const operation = operations[Math.floor(Math.random() * operations.length)]
    let num1 = Math.floor(Math.random() * maxNumber) + 1
    let num2 = Math.floor(Math.random() * maxNumber) + 1

    if (operation === '/') {
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1
      num1 = num1 * num2
    }

    setQuestion(`${num1} ${operation} ${num2} = ?`)
    setAnswer('')
    setFeedback(null)
  }

  const handleSubmit = () => {
    const correctAnswer = eval(question.replace('=', '').replace('?', ''))
    const isCorrect = parseInt(answer) === correctAnswer
    setFeedback(isCorrect ? 'Correct!' : 'Incorrect. Try again!')
    if (isCorrect) {
      setScore(score + 1)
      if (score + 1 === levels[currentLevel].questions) {
        if (currentLevel < levels.length - 1) {
          setCurrentLevel(currentLevel + 1)
          setScore(0)
          setTimeLeft(levels[currentLevel + 1].time)
        } else {
          endGame()
        }
      } else {
        setTimeout(generateQuestion, 1500)
      }
    } else {
      setTimeout(() => setFeedback(null), 1500)
    }
    setAnswer('')
  }

  const endGame = () => {
    setGameOver(true)
    if (score === levels[currentLevel].questions && currentLevel === levels.length - 1) {
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
      <h2 className="text-3xl font-bold mb-4 text-blue-600">Basic Arithmetic Adventure</h2>
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl">{levels[currentLevel].name}</p>
        <p className="text-xl">Score: {score}/{levels[currentLevel].questions}</p>
        <p className="text-xl">Time: {timeLeft}s</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">How to Play</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How to Play Basic Arithmetic Adventure</DialogTitle>
              <DialogDescription>
                1. Solve the arithmetic problem presented.<br/>
                2. Type your answer in the input field.<br/>
                3. Click 'Submit' to check your answer.<br/>
                4. Complete all questions in each level to advance.<br/>
                5. There are 3 levels with increasing difficulty.<br/>
                6. Win the game by completing all levels before time runs out!<br/>
                Have fun and improve your math skills!
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      {!gameOver ? (
        <div className="mb-8">
          <div className="text-3xl mb-4">{question}</div>
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="border-2 border-gray-300 rounded px-4 py-2 mb-4"
          />
          <Button 
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-4"
          >
            Submit
          </Button>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mt-4 text-xl ${feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'}`}
            >
              {feedback}
              {feedback.includes('Correct') ? <CheckCircle className="inline ml-2" /> : <XCircle className="inline ml-2" />}
            </motion.div>
          )}
        </div>
      ) : (
        <div>
          <p className="text-xl mb-4">
            Game Over! Your final score: {score}/{levels[currentLevel].questions}
          </p>
          {score === levels[currentLevel].questions && currentLevel === levels.length - 1 ? (
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
                setScore(0)
                setTimeLeft(levels[0].time)
                setGameOver(false)
                generateQuestion()
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

