"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Loader2, Sparkles, MessageCircle, CheckCircle, Mic, MicOff } from "lucide-react"
import { formatDate, formatTime, calculateWordCount } from "@/lib/utils"
import { VoiceInput } from "@/components/voice-input"
import type { AIMessage } from "@/lib/types"

interface JournalInterfaceProps {
  content: string
  setContent: (content: string) => void
  messages: AIMessage[]
  setMessages: (messages: AIMessage[]) => void
  onFinish: () => void
  isLoading: boolean
}

export function JournalInterface({
  content,
  setContent,
  messages,
  setMessages,
  onFinish,
  isLoading,
}: JournalInterfaceProps) {
  const [aiLoading, setAiLoading] = useState(false)
  const [showVoiceInput, setShowVoiceInput] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const wordCount = calculateWordCount(content)
  const now = new Date()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleAIAction = async (action: 'deeper' | 'more') => {
    if (!content.trim()) return

    setAiLoading(true)

    try {
      const response = await fetch('/api/journal/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          messages,
          action,
        }),
      })

      const data = await response.json()

      if (data.message) {
        const aiMessage: AIMessage = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toISOString(),
        }

        setMessages([...messages, aiMessage])
      }
    } catch (error) {
      console.error('AI request failed:', error)
    } finally {
      setAiLoading(false)
    }
  }

  const handleVoiceTranscript = (transcript: string) => {
    setContent(content + (content ? ' ' : '') + transcript)
    setShowVoiceInput(false)
    textareaRef.current?.focus()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Journal Entry</h1>
            <p className="text-sm text-muted-foreground">
              {formatDate(now)} • {formatTime(now)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </div>
          </div>
        </div>
      </Card>

      {/* Messages / Conversation */}
      {messages.length > 0 && (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <Card
              key={index}
              className={`p-4 ${
                message.role === 'assistant'
                  ? 'bg-primary/5 border-primary/20'
                  : 'bg-muted/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-full p-2 ${
                  message.role === 'assistant'
                    ? 'bg-primary/10'
                    : 'bg-muted'
                }`}>
                  {message.role === 'assistant' ? (
                    <Sparkles className="h-4 w-4 text-primary" />
                  ) : (
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium">
                    {message.role === 'assistant' ? 'AI Companion' : 'You'}
                  </p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Writing Area */}
      <Card className="p-6">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing about what's on your mind..."
          className="min-h-[300px] text-base leading-relaxed resize-none border-0 focus-visible:ring-0 p-0"
          disabled={isLoading}
        />
      </Card>

      {/* Voice Input */}
      {showVoiceInput && (
        <Card className="p-6">
          <VoiceInput
            onTranscript={handleVoiceTranscript}
            onClose={() => setShowVoiceInput(false)}
          />
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => handleAIAction('deeper')}
            disabled={!content.trim() || aiLoading || isLoading}
            variant="default"
          >
            {aiLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Go Deeper
              </>
            )}
          </Button>

          <Button
            onClick={() => handleAIAction('more')}
            disabled={!content.trim() || aiLoading || isLoading}
            variant="outline"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Talk More
          </Button>

          <Button
            onClick={() => setShowVoiceInput(!showVoiceInput)}
            disabled={aiLoading || isLoading}
            variant="outline"
          >
            {showVoiceInput ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Cancel Voice
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Voice Input
              </>
            )}
          </Button>
        </div>

        <Button
          onClick={onFinish}
          disabled={!content.trim() || aiLoading || isLoading}
          variant="secondary"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Finish Entry
            </>
          )}
        </Button>
      </div>

      <div ref={messagesEndRef} />
    </div>
  )
}
