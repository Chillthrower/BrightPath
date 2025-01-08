'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  { name: 'Level 2', operations: ['+', '-', '*'], maxNumber: 15, questions: 7, time: 90 },
  { name: 'Level 3', operations: ['+', '-', '*'], maxNumber: 20, questions: 10, time: 120 },
]

export default function BasicArithmeticGame() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(levels[currentLevel].time)
  const [gameOver, setGameOver] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [incorrectAnswers, setIncorrectAnswers] = useState(0)

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

    if (operation === '*') {
      num1 = Math.floor(Math.random() * 5) + 1 // Smaller multipliers for simplicity
      num2 = Math.floor(Math.random() * 5) + 1
    }

    setQuestion(`${num1} ${operation} ${num2} = ?`)
    setAnswer('')
    setFeedback(null)
  }

  const handleSubmit = () => {
    const correctAnswer = eval(question.replace('=', '').replace('?', ''))
    const isCorrect = parseInt(answer) === correctAnswer

    if (isCorrect) {
      setFeedback('Correct!')
      setCorrectAnswers(correctAnswers + 1)
      setScore(score + 1)
    } else {
      setFeedback('Incorrect. Try again!')
      setIncorrectAnswers(incorrectAnswers + 1)
    }

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
    setAnswer('')
  }

  const endGame = () => {
    setGameOver(true)
    storeGameData()
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

  const storeGameData = () => {
    
      const ttoday = new Date();
      const year = ttoday.getFullYear();
      const month = String(ttoday.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(ttoday.getDate()).padStart(2, '0');
      const today = `${year}-${month}-${day}`;
    const gameData = {
      level: levels[currentLevel].name,
      score,
      correctAnswers,
      incorrectAnswers,
      totalQuestions: levels[currentLevel].questions,
      timestamp: new Date().toISOString(),
    };

    // Get existing data from localStorage
    const storedData = JSON.parse(localStorage.getItem('arithmeticGameScores') || '{}');

    // If data for today exists, update it; otherwise, create new
    const updatedData = {
      ...storedData,
      [today]: [{ ...gameData, updatedAt: new Date().toISOString() }],
    };

    localStorage.setItem('arithmeticGameScores', JSON.stringify(updatedData));
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
                Solve the arithmetic problems to progress through levels. Answer all questions correctly before time runs out to win!
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
          <p className="text-xl mb-4">Correct Answers: {correctAnswers}</p>
          <p className="text-xl mb-4">Incorrect Answers: {incorrectAnswers}</p>
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
        </div>
      )}
    </div>
  )
}
