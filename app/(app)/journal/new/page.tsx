"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { JournalInterface } from "@/components/journal-interface"
import { useToast } from "@/components/ui/use-toast"
import type { AIMessage } from "@/lib/types"

export default function NewJournalPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [entryId, setEntryId] = useState<string | null>(null)
  const [content, setContent] = useState("")
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!content && !entryId) return

    const autoSave = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      if (entryId) {
        // Update existing entry
        await supabase
          .from('journal_entries')
          .update({
            content,
            ai_responses: { messages },
            updated_at: new Date().toISOString(),
            word_count: content.trim().split(/\s+/).filter(w => w.length > 0).length,
          })
          .eq('id', entryId)
      } else if (content.trim()) {
        // Create new entry
        const { data, error } = await supabase
          .from('journal_entries')
          .insert({
            user_id: user.id,
            content,
            ai_responses: { messages },
            word_count: content.trim().split(/\s+/).filter(w => w.length > 0).length,
            is_finished: false,
          })
          .select()
          .single()

        if (data && !error) {
          setEntryId(data.id)
        }
      }
    }

    const interval = setInterval(autoSave, 30000)
    return () => clearInterval(interval)
  }, [content, messages, entryId])

  const handleFinish = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get AI reflection
      const response = await fetch('/api/journal/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, messages }),
      })

      const data = await response.json()

      if (data.reflection) {
        const aiMessage: AIMessage = {
          role: 'assistant',
          content: data.reflection,
          timestamp: new Date().toISOString(),
        }

        const updatedMessages = [...messages, aiMessage]

        // Save final entry
        if (entryId) {
          await supabase
            .from('journal_entries')
            .update({
              content,
              ai_responses: { messages: updatedMessages },
              is_finished: true,
              updated_at: new Date().toISOString(),
              word_count: content.trim().split(/\s+/).filter(w => w.length > 0).length,
            })
            .eq('id', entryId)
        } else {
          await supabase
            .from('journal_entries')
            .insert({
              user_id: user.id,
              content,
              ai_responses: { messages: updatedMessages },
              word_count: content.trim().split(/\s+/).filter(w => w.length > 0).length,
              is_finished: true,
            })
        }

        toast({
          title: "Entry saved!",
          description: "Your journal entry has been saved successfully.",
        })

        router.push('/dashboard')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <JournalInterface
        content={content}
        setContent={setContent}
        messages={messages}
        setMessages={setMessages}
        onFinish={handleFinish}
        isLoading={isLoading}
      />
    </div>
  )
}
