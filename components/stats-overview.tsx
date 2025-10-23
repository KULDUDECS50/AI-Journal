"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Flame, TrendingUp, FileText } from "lucide-react"
import type { JournalEntry } from "@/lib/types"

interface StatsOverviewProps {
  entries: JournalEntry[]
}

function calculateStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const sortedDates = entries
    .map(entry => {
      const date = new Date(entry.created_at)
      date.setHours(0, 0, 0, 0)
      return date.getTime()
    })
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => b - a)

  let streak = 0
  let currentDate = today.getTime()

  for (const entryDate of sortedDates) {
    const diff = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24))

    if (diff === 0 || diff === 1) {
      streak++
      currentDate = entryDate
    } else {
      break
    }
  }

  return streak
}

function getThisWeekCount(entries: JournalEntry[]): number {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  return entries.filter(entry => {
    const entryDate = new Date(entry.created_at)
    return entryDate >= oneWeekAgo
  }).length
}

export function StatsOverview({ entries }: StatsOverviewProps) {
  const totalEntries = entries.length
  const currentStreak = calculateStreak(entries)
  const thisWeekCount = getThisWeekCount(entries)
  const totalWords = entries.reduce((sum, entry) => sum + (entry.word_count || 0), 0)

  const stats = [
    {
      title: "Total Entries",
      value: totalEntries,
      icon: BookOpen,
      description: "All time",
    },
    {
      title: "Current Streak",
      value: currentStreak,
      icon: Flame,
      description: currentStreak === 1 ? "day" : "days",
    },
    {
      title: "This Week",
      value: thisWeekCount,
      icon: TrendingUp,
      description: thisWeekCount === 1 ? "entry" : "entries",
    },
    {
      title: "Total Words",
      value: totalWords.toLocaleString(),
      icon: FileText,
      description: "Written",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
