import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import PeekingCharacters from './PeekingCharacters'

const pages = [
  { content: "Chapter 1: The Adventure Begins", image: "/placeholder.svg" },
  { content: "It was a bright and sunny day in the magical forest.", image: "/placeholder.svg" },
  { content: "The friends gathered around the old oak tree.", image: "/placeholder.svg" },
  { content: "Suddenly, they heard a mysterious sound.", image: "/placeholder.svg" },
]

export default function Book() {
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('right')

  const turnPage = (direction: 'left' | 'right') => {
    if (isFlipping) return
    setIsFlipping(true)
    setFlipDirection(direction)
    const newPage = direction === 'left' ? Math.max(0, currentPage - 2) : Math.min(pages.length - 2, currentPage + 2)
    setTimeout(() => {
      setCurrentPage(newPage)
      setIsFlipping(false)
    }, 600)
  }

  return (
    <div className="book-wrapper py-16 px-8">
      <style jsx global>{`
        .book-wrapper {
          perspective: 1500px;
        }
        .book {
          position: relative;
          transform-style: preserve-3d;
          transform: rotateX(10deg);
        }
        .book-page {
          position: absolute;
          top: 0;
          width: 50%;
          height: 100%;
          transform-origin: center;
          transform-style: preserve-3d;
          transition: transform 0.6s ease;
        }
        .book-page-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #fff;
          backface-visibility: hidden;
          padding: 20px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }
        .book-page-back {
          transform: rotateY(180deg);
        }
        .page-fold {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 50%;
          background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.5));
          transform-origin: left;
          transition: transform 0.6s ease;
        }
      `}</style>

      <div className="flex items-center justify-center gap-8">
        <button
          onClick={() => turnPage('left')}
          disabled={currentPage === 0 || isFlipping}
          className="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={40} />
        </button>

        <div className="book w-[800px] h-[500px] bg-yellow-100 rounded-lg shadow-2xl overflow-hidden relative">
          <PeekingCharacters />
          {/* Left page */}
          <div className="absolute left-0 w-[400px] h-full bg-white p-8">
            <div className="prose prose-lg">
              <p>{pages[currentPage].content}</p>
            </div>
          </div>

          {/* Right page */}
          <div className="absolute left-[400px] w-[400px] h-full bg-white p-8">
            <div className="w-full h-full relative">
              <Image
                src={pages[currentPage + 1].image}
                alt="Story illustration"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Animated flipping page */}
          <AnimatePresence>
            {isFlipping && (
              <motion.div
                className="book-page"
                initial={{ 
                  rotateY: flipDirection === 'right' ? 0 : -180,
                  x: flipDirection === 'right' ? '100%' : '0%'
                }}
                animate={{ 
                  rotateY: flipDirection === 'right' ? -180 : 0,
                  x: flipDirection === 'right' ? '0%' : '100%'
                }}
                exit={{ 
                  rotateY: flipDirection === 'right' ? -180 : 0,
                  x: flipDirection === 'right' ? '0%' : '100%'
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <div className="book-page-content">
                  {flipDirection === 'right' ? (
                    <div className="prose prose-lg">
                      <p>{pages[currentPage + 2]?.content || "The End"}</p>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <Image
                        src={pages[currentPage - 1]?.image || "/placeholder.svg"}
                        alt="Story illustration"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <motion.div 
                    className="page-fold"
                    initial={{ transform: 'scaleX(0)' }}
                    animate={{ transform: 'scaleX(1)' }}
                    exit={{ transform: 'scaleX(0)' }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                </div>
                <div className="book-page-content book-page-back">
                  {flipDirection === 'right' ? (
                    <div className="w-full h-full relative">
                      <Image
                        src={pages[currentPage + 1].image}
                        alt="Story illustration"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="prose prose-lg">
                      <p>{pages[currentPage].content}</p>
                    </div>
                  )}
                  <motion.div 
                    className="page-fold"
                    initial={{ transform: 'scaleX(1)' }}
                    animate={{ transform: 'scaleX(0)' }}
                    exit={{ transform: 'scaleX(1)' }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => turnPage('right')}
          disabled={currentPage >= pages.length - 2 || isFlipping}
          className="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={40} />
        </button>
      </div>
    </div>
  )
}

