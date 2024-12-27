import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, Square } from 'lucide-react'

interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void;
}

export default function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('')
          onTranscript(transcript)
        }
      }
    }
  }, [onTranscript])

  const startRecording = () => {
    if (recognitionRef.current !== null) {
      recognitionRef.current.start()
      setIsRecording(true)
    } else {
      console.error('SpeechRecognition is not initialized.')
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current !== null) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      console.error('SpeechRecognition is not initialized.')
    }
  }

  return (
    <div className="mt-4 flex justify-center">
      {!isSupported ? (
        <div className="text-red-500 font-comic">
          Speech Recognition is not supported in your browser.
        </div>
      ) : (
        <motion.div
          animate={{ scale: isRecording ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={isRecording ? stopRecording : startRecording}
            className={`rounded-full p-4 ${
              isRecording ? 'bg-pink-300 hover:bg-pink-400' : 'bg-blue-300 hover:bg-blue-400'
            } font-comic text-2xl text-white shadow-lg`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={isRecording ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.5, repeat: isRecording ? Infinity : 0 }}
          >
            {isRecording ? <Square size={24} /> : <Mic size={24} />}
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}
