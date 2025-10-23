-- AI Journal Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    ai_responses JSONB DEFAULT '{"messages": []}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    mood TEXT,
    tags TEXT[],
    word_count INTEGER DEFAULT 0,
    is_finished BOOLEAN DEFAULT false
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON public.journal_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journal_entries_is_finished ON public.journal_entries(is_finished);

-- Enable Row Level Security (RLS)
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only view their own entries
CREATE POLICY "Users can view own journal entries"
    ON public.journal_entries
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own entries
CREATE POLICY "Users can insert own journal entries"
    ON public.journal_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own entries
CREATE POLICY "Users can update own journal entries"
    ON public.journal_entries
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own entries
CREATE POLICY "Users can delete own journal entries"
    ON public.journal_entries
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.journal_entries
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Optional: Create a function to calculate streaks (can be called from app)
CREATE OR REPLACE FUNCTION public.calculate_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    streak_count INTEGER := 0;
    current_date_check DATE := CURRENT_DATE;
    has_entry BOOLEAN;
BEGIN
    LOOP
        SELECT EXISTS(
            SELECT 1
            FROM public.journal_entries
            WHERE user_id = p_user_id
            AND DATE(created_at) = current_date_check
        ) INTO has_entry;

        IF NOT has_entry THEN
            -- If today has no entry but yesterday does, still count it
            IF current_date_check = CURRENT_DATE THEN
                current_date_check := current_date_check - 1;
                CONTINUE;
            END IF;
            EXIT;
        END IF;

        streak_count := streak_count + 1;
        current_date_check := current_date_check - 1;

        -- Prevent infinite loops
        IF streak_count > 1000 THEN
            EXIT;
        END IF;
    END LOOP;

    RETURN streak_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.journal_entries TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_user_streak(UUID) TO authenticated;
