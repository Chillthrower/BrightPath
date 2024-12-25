import React from 'react'
import { ArrowRight } from 'lucide-react'

export default function StoryInput({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div className="flex items-center mt-4 w-full max-w-2xl">
      <textarea
        className="flex-grow p-4 border-2 border-blue-400 rounded-l-lg focus:outline-none focus:border-blue-600 font-serif text-lg"
        placeholder="Once upon a time..."
        rows={3}
      />
      <button
        onClick={onSubmit}
        className="bg-blue-500 text-white p-4 rounded-r-lg hover:bg-blue-600 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
      >
        <ArrowRight size={24} />
      </button>
    </div>
  )
}

