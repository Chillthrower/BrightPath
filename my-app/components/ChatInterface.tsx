import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import VoiceRecorder from "./VoiceRecorder"

export default function ChatInterface() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([])
  const [inputText, setInputText] = useState('')

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, { text: inputText, isUser: true }])
      setTimeout(() => {
        setMessages(prev => [...prev, { text: `You said: ${inputText}`, isUser: false }])
      }, 1000)
      setInputText('')
    }
  }

  const handleTranscript = (transcript: string) => {
    setInputText(transcript)
  }

  return (
    <div className="bg-gradient-to-b from-blue-100 via-yellow-100 to-pink-100 rounded-3xl p-6 h-[500px] flex flex-col border-4 border-green-200 shadow-lg">
      <div className="flex-grow overflow-y-auto mb-4 p-4 bg-white bg-opacity-50 rounded-2xl">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: message.isUser ? 2 : -2 }}
            transition={{ duration: 0.5 }}
            className={`mb-2 p-3 rounded-2xl ${
              message.isUser ? 'bg-blue-200 ml-auto' : 'bg-green-200'
            } max-w-[80%] font-comic text-lg shadow-md transform`}
          >
            {message.text}
          </motion.div>
        ))}
      </div>
      <div className="flex flex-col space-y-4">
        <div className="flex">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question here..."
            className="flex-grow mr-2 border-4 border-blue-200 font-comic text-lg rounded-full px-4 py-2 bg-white"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} className="bg-gradient-to-r from-pink-300 to-yellow-300 hover:from-blue-300 hover:to-green-300 font-comic text-lg rounded-full px-6 text-white transform transition-transform duration-200 hover:scale-105">Send</Button>
        </div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <VoiceRecorder onTranscript={handleTranscript} />
        </motion.div>
      </div>
    </div>
  )
}

