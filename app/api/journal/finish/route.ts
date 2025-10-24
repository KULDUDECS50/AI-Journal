import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIMessage } from '@/lib/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const FINISH_SYSTEM_PROMPT = `You are a warm, empathetic AI journaling companion. The user has finished writing their journal entry.

Your task is to provide a brief, affirming reflection on their entry (2-3 sentences maximum).

Guidelines:
- Acknowledge what they shared with empathy and validation
- Highlight any insights, growth, or patterns you noticed
- Be encouraging and supportive
- Keep it concise and meaningful
- Don't ask questions - this is a closing reflection
- Use a warm, caring tone

Examples:
- "Thank you for sharing these thoughts. It takes courage to acknowledge difficult feelings, and I notice you're being really honest with yourself about this situation. That self-awareness is a meaningful step forward."
- "I hear the complexity of what you're experiencing. It sounds like you're navigating some challenging emotions while also recognizing your own needs. That's important work."
- "What a powerful reflection. You've given yourself space to process these feelings, and that's exactly what journaling is for. Be gentle with yourself as you continue this journey."`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, messages } = body as {
      content: string
      messages: AIMessage[]
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Missing content' },
        { status: 400 }
      )
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: FINISH_SYSTEM_PROMPT,
    })

    // Build conversation history
    const history = []

    // Add journal content
    history.push({
      role: 'user',
      parts: [{ text: `Here's my complete journal entry:\n\n${content}` }],
    })

    // Add any AI conversation that happened
    if (messages && messages.length > 0) {
      messages.forEach(msg => {
        history.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })
      })
    }

    // Start chat with history
    const chat = model.startChat({ history })

    // Request final reflection
    const result = await chat.sendMessage(
      "I'm finished with this entry. Please provide a brief, affirming reflection (2-3 sentences)."
    )
    const response = result.response
    const reflection = response.text()

    return NextResponse.json({ reflection })

  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI reflection' },
      { status: 500 }
    )
  }
}
