import { createClient } from '@/lib/supabase/server'
import { EntryCard } from '@/components/entry-card'
import { StatsOverview } from '@/components/stats-overview'
import { Button } from '@/components/ui/button'
import { PenLine } from 'lucide-react'
import Link from 'next/link'
import type { JournalEntry } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch journal entries
  const { data: entries, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const journalEntries = (entries as JournalEntry[]) || []

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Journal</h1>
          <p className="text-muted-foreground mt-1">
            Reflect, grow, and understand yourself better
          </p>
        </div>
        <Link href="/journal/new">
          <Button size="lg" className="w-full sm:w-auto">
            <PenLine className="h-5 w-5 mr-2" />
            New Entry
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <StatsOverview entries={journalEntries} />

      {/* Entries List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Entries</h2>

        {journalEntries.length === 0 ? (
          <div className="text-center py-16">
            <div className="rounded-full bg-primary/10 p-6 w-fit mx-auto mb-4">
              <PenLine className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No entries yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start your journaling journey by creating your first entry.
              Let AI guide you through meaningful reflection.
            </p>
            <Link href="/journal/new">
              <Button size="lg">
                <PenLine className="h-5 w-5 mr-2" />
                Write Your First Entry
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {journalEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
