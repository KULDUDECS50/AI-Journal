# AI Journal - AI-Powered Journaling App

A modern, AI-powered journaling web application built with Next.js, featuring an interactive journaling experience with AI-guided insights powered by Claude. This app helps users write, reflect, and receive personalized guidance to support mental health and personal growth.

## Features

### Core Features
- **AI-Powered Journaling Companion**: Interactive conversations with Claude AI that helps you explore your thoughts and feelings
- **Beautiful Dashboard**: View all your journal entries with stats, streaks, and insights
- **Voice Input**: Speech-to-text functionality for hands-free journaling
- **Auto-Save**: Automatic draft saving every 30 seconds
- **Mood Tracking**: Optional mood indicators for each entry
- **Secure & Private**: End-to-end encryption with Supabase authentication

### AI Interactions
- **Go Deeper**: AI asks thoughtful follow-up questions to help explore feelings
- **Talk More**: AI provides supportive acknowledgment and invites continued sharing
- **Finish Entry**: AI provides affirming reflection when you complete an entry

### User Experience
- Clean, calming UI with soft earth tones
- Mobile-responsive design
- Dark mode support
- Real-time word count
- Entry search and filtering
- Journaling streaks and statistics

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: React Hooks + Zustand
- **Animations**: Framer Motion

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **AI**: Anthropic Claude API (Sonnet 4.5)
- **Voice-to-Text**: Web Speech API

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- A Supabase account and project
- An Anthropic API key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-journal.git
cd ai-journal
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your credentials
3. Go to SQL Editor and run the schema from `supabase/schema.sql`

### 4. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Anthropic Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Where to get these:**
- **Supabase URL & Anon Key**: Supabase Dashboard > Project Settings > API
- **Anthropic API Key**: [console.anthropic.com](https://console.anthropic.com) > API Keys

### 5. Run Database Migration

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Click "Run" to execute the migration

This will create:
- `journal_entries` table
- Row-level security policies
- Indexes for performance
- Helper functions for streaks

### 6. Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ai-journal/
├── app/
│   ├── (app)/              # Authenticated app routes
│   │   ├── dashboard/      # Main dashboard
│   │   ├── journal/        # Journal pages
│   │   └── layout.tsx      # App layout with navbar
│   ├── (auth)/             # Authentication routes
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   └── layout.tsx      # Auth layout
│   ├── api/                # API routes
│   │   └── journal/        # Journal API endpoints
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── entry-card.tsx      # Journal entry card
│   ├── journal-interface.tsx # Main journaling UI
│   ├── journal-view.tsx    # View journal entry
│   ├── navbar.tsx          # Navigation bar
│   ├── stats-overview.tsx  # Dashboard stats
│   └── voice-input.tsx     # Voice recording component
├── lib/
│   ├── supabase/           # Supabase client setup
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utility functions
├── supabase/
│   └── schema.sql          # Database schema
├── middleware.ts           # Next.js middleware
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Usage Guide

### Creating Your First Entry

1. **Sign up** for an account
2. Click **"New Entry"** from the dashboard
3. **Write** about what's on your mind
4. Use **"Go Deeper"** to get AI questions that help you explore further
5. Use **"Talk More"** for supportive acknowledgment
6. Try **"Voice Input"** to speak your thoughts
7. Click **"Finish Entry"** when done to get an affirming AI reflection

### Using Voice Input

1. Click the **"Voice Input"** button
2. Allow microphone permissions
3. Click **"Start Recording"**
4. Speak your thoughts (transcription appears in real-time)
5. Click **"Stop Recording"** when done
6. Review and edit the transcript
7. Click **"Use Transcript"** to add it to your entry

### Viewing Your Entries

- All entries appear on the **Dashboard**
- Click any entry card to view the full entry and AI conversation
- See your **stats**: total entries, current streak, weekly count, total words

## API Endpoints

### POST `/api/journal/ai`
Handles "Go Deeper" and "Talk More" actions.

**Request Body:**
```json
{
  "content": "journal entry text",
  "messages": [...previous AI messages],
  "action": "deeper" | "more"
}
```

**Response:**
```json
{
  "message": "AI response text"
}
```

### POST `/api/journal/finish`
Provides closing reflection when finishing an entry.

**Request Body:**
```json
{
  "content": "journal entry text",
  "messages": [...AI conversation]
}
```

**Response:**
```json
{
  "reflection": "AI reflection text"
}
```

## Database Schema

### `journal_entries` Table
```sql
id              UUID (Primary Key)
user_id         UUID (Foreign Key -> auth.users)
content         TEXT
ai_responses    JSONB
created_at      TIMESTAMP
updated_at      TIMESTAMP
mood            TEXT (nullable)
tags            TEXT[] (nullable)
word_count      INTEGER
is_finished     BOOLEAN
```

## Security & Privacy

- **Row-Level Security (RLS)**: Users can only access their own entries
- **Encrypted at Rest**: Supabase encrypts all data
- **HTTPS Only**: All traffic is encrypted
- **No Data Sharing**: Journal content is never shared with third parties
- **No Training Data**: Your entries are not used to train AI models

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Environment Variables for Production

Make sure to set these in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_APP_URL` (your production URL)

## Customization

### Change Color Scheme
Edit the CSS variables in `app/globals.css`:
```css
:root {
  --primary: 165 60% 45%;  /* Main brand color */
  --secondary: 30 15% 92%; /* Secondary color */
  /* ... more colors */
}
```

### Modify AI Behavior
Edit the system prompts in:
- `app/api/journal/ai/route.ts` - For "Go Deeper" and "Talk More"
- `app/api/journal/finish/route.ts` - For closing reflections

### Add New Features
- Mood tracking UI is ready but minimal - enhance in `components/entry-card.tsx`
- Tags are supported in the database - add UI for managing them
- Implement entry export (PDF/text) functionality
- Add email reminders for daily journaling

## Troubleshooting

### Voice Input Not Working
- Check browser compatibility (Chrome/Edge work best)
- Ensure microphone permissions are granted
- Try using HTTPS (required for Web Speech API)

### AI Responses Failing
- Verify your `ANTHROPIC_API_KEY` is correct
- Check API usage limits in Anthropic console
- Review error logs in browser console

### Supabase Connection Issues
- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure RLS policies are properly configured

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [Anthropic Claude](https://www.anthropic.com/)
- Database & Auth by [Supabase](https://supabase.com/)
- Icons from [Lucide](https://lucide.dev/)

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@yourapp.com (update with your email)

---

**Made with care for mental health and personal growth** 🌱
