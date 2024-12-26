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
  { name: 'Easy', questions: 5 },
  { name: 'Medium', questions: 7 },
  { name: 'Hard', questions: 10 },
]

const allQuestions = [
  {
    question: "Choose the correct form of the verb: She _____ to the store yesterday.",
    options: ["go", "goes", "went", "gone"],
    answer: "went",
    difficulty: "Easy"
  },
  {
    question: "Which sentence is grammatically correct?",
    options: [
      "The cat is laying on the bed.",
      "The cat is lying on the bed.",
      "The cat is lieing on the bed.",
      "The cat is lays on the bed."
    ],
    answer: "The cat is lying on the bed.",
    difficulty: "Medium"
  },
  {
    question: "Identify the correct use of the apostrophe:",
    options: ["Its raining outside.", "The dog wagged it's tail.", "The book's cover is red.", "The tree's are tall."],
    answer: "The book's cover is red.",
    difficulty: "Easy"
  },
  {
    question: "Choose the correct comparative form: This book is _____ than that one.",
    options: ["good", "gooder", "more good", "better"],
    answer: "better",
    difficulty: "Easy"
  },
  {
    question: "Identify the sentence with correct subject-verb agreement:",
    options: [
      "The team are playing well.",
      "The team is playing well.",
      "The team were playing well.",
      "The team have playing well."
    ],
    answer: "The team is playing well.",
    difficulty: "Medium"
  },
  {
    question: "Which sentence uses the correct form of the pronoun?",
    options: [
      "Between you and I, the secret is safe.",
      "Between you and me, the secret is safe.",
      "Between we, the secret is safe.",
      "Between us, the secret is safe."
    ],
    answer: "Between you and me, the secret is safe.",
    difficulty: "Hard"
  },
  {
    question: "Choose the correct spelling:",
    options: ["recieve", "receive", "receeve", "receve"],
    answer: "receive",
    difficulty: "Easy"
  },
  {
    question: "Identify the sentence with the correct use of a semicolon:",
    options: [
      "I love cooking; and baking.",
      "I love cooking, and baking.",
      "I love cooking; I also enjoy baking.",
      "I love cooking and; baking."
    ],
    answer: "I love cooking; I also enjoy baking.",
    difficulty: "Hard"
  },
  {
    question: "Which sentence uses the correct form of the verb 'lay' or 'lie'?",
    options: [
      "I'm going to lay down for a nap.",
      "I'm going to lie down for a nap.",
      "I laid on the beach yesterday.",
      "The book is laying on the table."
    ],
    answer: "I'm going to lie down for a nap.",
    difficulty: "Hard"
  },
  {
    question: "Choose the correct word to complete the sentence: The project was _____ by the team.",
    options: ["undertook", "undertaken", "undertaking", "undertakes"],
    answer: "undertaken",
    difficulty: "Medium"
  }
]

export default function EnglishGrammarGame() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [questions, setQuestions] = useState<typeof allQuestions>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  useEffect(() => {
    startNewGame()
  }, [currentLevel])

  const startNewGame = () => {
    const gameQuestions = allQuestions
      .filter(q => q.difficulty === levels[currentLevel].name)
      .sort(() => 0.5 - Math.random())
      .slice(0, levels[currentLevel].questions)
    setQuestions(gameQuestions)
    setCurrentQuestion(0)
    setScore(0)
    setGameOver(false)
    setSelectedAnswer(null)
    setIsCorrect(null)
  }

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer)
    const correct = answer === questions[currentQuestion].answer
    setIsCorrect(correct)
    if (correct) {
      setScore(score + 1)
    }
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setIsCorrect(null)
      } else {
        endGame()
      }
    }, 1500)
  }

  const endGame = () => {
    setGameOver(true)
    if (score === questions.length && currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1)
    } else if (score === questions.length && currentLevel === levels.length - 1) {
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
      <h2 className="text-3xl font-bold mb-4 text-blue-600">English Grammar Game</h2>
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl">Level: {levels[currentLevel].name}</p>
        <p className="text-xl">Score: {score}/{questions.length}</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">How to Play</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How to Play English Grammar Game</DialogTitle>
              <DialogDescription>
                1. Read the question carefully.<br/>
                2. Choose the correct answer from the options provided.<br/>
                3. Get instant feedback on your answer.<br/>
                4. Complete all questions to finish the game.<br/>
                5. Advance to harder levels by answering all questions correctly.<br/>
                6. Win the game by completing all levels!<br/>
                Have fun and improve your English grammar skills!
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      {!gameOver ? (
        <div className="mb-8">
          <p className="text-xl mb-4">{questions[currentQuestion]?.question}</p>
          <div className="grid grid-cols-2 gap-4">
            {questions[currentQuestion]?.options.map((option, index) => (
              <motion.button
                key={index}
                className={`p-4 rounded-lg text-white font-bold ${
                  selectedAnswer === option
                    ? isCorrect
                      ? 'bg-green-500'
                      : 'bg-red-500'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
                onClick={() => handleAnswerClick(option)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={selectedAnswer !== null}
              >
                {option}
              </motion.button>
            ))}
          </div>
          {isCorrect !== null && (
            <p className={`text-xl mt-4 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect. The correct answer is: ' + questions[currentQuestion].answer}
            </p>
          )}
        </div>
      ) : (
        <div>
          <p className="text-xl mb-4">
            Game Over! Your score: {score}/{questions.length}
          </p>
          {score === questions.length && currentLevel === levels.length - 1 ? (
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
              {score === questions.length ? 'Next Level' : 'Play Again'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

