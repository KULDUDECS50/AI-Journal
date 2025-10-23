"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, getRelativeTime, getEntryPreview, calculateWordCount } from "@/lib/utils"
import { Calendar, MessageCircle } from "lucide-react"
import type { JournalEntry, AIResponses } from "@/lib/types"

interface EntryCardProps {
  entry: JournalEntry
}

const moodEmojis = {
  great: "😊",
  good: "🙂",
  okay: "😐",
  bad: "😕",
  terrible: "😢",
}

export function EntryCard({ entry }: EntryCardProps) {
  const preview = getEntryPreview(entry.content, 120)
  const wordCount = entry.word_count || calculateWordCount(entry.content)
  const aiResponses = entry.ai_responses as AIResponses | null
  const messageCount = aiResponses?.messages?.length || 0

  return (
    <Link href={`/journal/${entry.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                {getRelativeTime(entry.created_at)}
              </p>
            </div>
            {entry.mood && (
              <span className="text-2xl" title={entry.mood}>
                {moodEmojis[entry.mood as keyof typeof moodEmojis]}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm leading-relaxed line-clamp-4 text-foreground/90">
            {preview}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{wordCount} words</span>
            {messageCount > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  {messageCount}
                </span>
              </>
            )}
          </div>
          {!entry.is_finished && (
            <Badge variant="secondary" className="text-xs">
              Draft
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
