"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface VoiceInputProps {
  onTranscript: (transcript: string) => void
  onClose: () => void
}

export function VoiceInput({ onTranscript, onClose }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const { toast } = useToast()
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if browser supports speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (!SpeechRecognition) {
        toast({
          title: "Not supported",
          description: "Speech recognition is not supported in your browser.",
          variant: "destructive",
        })
        onClose()
        return
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event: any) => {
        let interim = ''
        let final = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            final += transcript + ' '
          } else {
            interim += transcript
          }
        }

        if (final) {
          setTranscript(prev => prev + final)
        }
        setInterimTranscript(interim)
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        toast({
          title: "Error",
          description: "Failed to recognize speech. Please try again.",
          variant: "destructive",
        })
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [toast, onClose])

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript("")
      setInterimTranscript("")
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleUseTranscript = () => {
    if (transcript.trim()) {
      onTranscript(transcript.trim())
    } else {
      onClose()
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Voice Input</h3>
        <p className="text-sm text-muted-foreground">
          {isListening ? "Listening... Speak now" : "Click the button to start recording"}
        </p>
      </div>

      {/* Transcript Display */}
      {(transcript || interimTranscript) && (
        <div className="min-h-[100px] p-4 bg-muted/50 rounded-lg">
          <p className="text-sm leading-relaxed">
            {transcript}
            {interimTranscript && (
              <span className="text-muted-foreground italic">
                {interimTranscript}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={isListening ? stopListening : startListening}
          variant={isListening ? "destructive" : "default"}
          size="lg"
        >
          {isListening ? (
            <>
              <MicOff className="h-5 w-5 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-5 w-5 mr-2" />
              Start Recording
            </>
          )}
        </Button>

        {transcript && !isListening && (
          <Button onClick={handleUseTranscript} size="lg">
            Use Transcript
          </Button>
        )}

        <Button onClick={onClose} variant="outline" size="lg">
          Cancel
        </Button>
      </div>

      {isListening && (
        <div className="flex justify-center">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse delay-75" />
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse delay-150" />
          </div>
        </div>
      )}
    </div>
  )
}
