export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      journal_entries: {
        Row: {
          id: string
          user_id: string
          content: string
          ai_responses: Json
          created_at: string
          updated_at: string
          mood: string | null
          tags: string[] | null
          word_count: number
          is_finished: boolean
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          ai_responses?: Json
          created_at?: string
          updated_at?: string
          mood?: string | null
          tags?: string[] | null
          word_count?: number
          is_finished?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          ai_responses?: Json
          created_at?: string
          updated_at?: string
          mood?: string | null
          tags?: string[] | null
          word_count?: number
          is_finished?: boolean
        }
      }
    }
  }
}

export type JournalEntry = Database['public']['Tables']['journal_entries']['Row']

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface AIResponses {
  messages: AIMessage[]
}

export type Mood = 'great' | 'good' | 'okay' | 'bad' | 'terrible' | null

export interface UserStats {
  totalEntries: number
  currentStreak: number
  longestStreak: number
  totalWords: number
  averageWordsPerEntry: number
}
