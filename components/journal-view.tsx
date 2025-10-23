"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatTime } from "@/lib/utils"
import { ArrowLeft, Calendar, MessageCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import type { JournalEntry, AIResponses, AIMessage } from "@/lib/types"

interface JournalViewProps {
  entry: JournalEntry
}

export function JournalView({ entry }: JournalViewProps) {
  const aiResponses = entry.ai_responses as AIResponses | null
  const messages = aiResponses?.messages || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        {!entry.is_finished && (
          <Badge variant="secondary">Draft</Badge>
        )}
      </div>

      {/* Entry Info */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate(entry.created_at)} • {formatTime(entry.created_at)}
          </div>
          <div>
            {entry.word_count} {entry.word_count === 1 ? 'word' : 'words'}
          </div>
          {messages.length > 0 && (
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {messages.length} {messages.length === 1 ? 'message' : 'messages'}
            </div>
          )}
        </div>

        <div className="prose prose-sm max-w-none">
          <div className="journal-content whitespace-pre-wrap">
            {entry.content}
          </div>
        </div>
      </Card>

      {/* AI Conversation */}
      {messages.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Conversation
          </h2>
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
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {message.role === 'assistant' ? 'AI Companion' : 'You'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
