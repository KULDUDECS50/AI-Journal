import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { JournalView } from '@/components/journal-view'
import type { JournalEntry, AIResponses } from '@/lib/types'

interface JournalEntryPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function JournalEntryPage({ params }: JournalEntryPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: entry, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !entry) {
    notFound()
  }

  const journalEntry = entry as JournalEntry

  return (
    <div className="max-w-4xl mx-auto">
      <JournalView entry={journalEntry} />
    </div>
  )
}
