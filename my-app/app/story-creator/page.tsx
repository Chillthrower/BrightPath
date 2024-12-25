'use client'

import React, { useRef, useState } from 'react'
import Background from '../components/Background'
import Sidebar from '../components/Sidebar'
import DrawableCanvas from '../components/DrawableCanvas'
import StoryInput from '../components/StoryInput'
import Book from '../components/Book'
import { motion, AnimatePresence } from 'framer-motion'

export default function StoryCreator() {
  const bookRef = useRef<HTMLDivElement>(null)
  const [showBook, setShowBook] = useState(false)

  const handleSubmit = () => {
    setShowBook(true)
    setTimeout(() => {
      bookRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-blue-200">
      <Background />
      <Sidebar />
      <main className="relative z-10 p-8 ml-10">
        <h1 className="text-5xl font-bold text-blue-800 mb-8 font-serif">Story Creator</h1>
        <div className="flex flex-col items-center space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Draw Your Story</h2>
            <DrawableCanvas />
          </div>
          <div className="w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Tell Your Story</h2>
            <StoryInput onSubmit={handleSubmit} />
          </div>
        </div>
        <AnimatePresence>
          {showBook && (
            <motion.div 
              ref={bookRef}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
              className="mt-16"
            >
              <h2 className="text-3xl font-bold text-blue-800 mb-8 font-serif text-center">Your Storybook</h2>
              <Book />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

