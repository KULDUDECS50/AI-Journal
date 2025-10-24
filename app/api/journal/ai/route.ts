import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIMessage } from '@/lib/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_PROMPT = `You are a warm, empathetic AI journaling companion. Your role is to:
- Help users explore their thoughts and feelings through gentle, open-ended questions
- Provide validation and affirmation without judgment
- Recognize patterns in their experiences
- Encourage self-reflection and personal growth
- Use therapeutic techniques like reflective listening and Socratic questioning
- Keep responses concise (2-4 sentences typically)
- Never give direct advice or act as a therapist
- Be conversational and human-like in tone
- Remember context from the current journaling session

When responding:
- If "Go Deeper" action: Ask ONE specific, personalized follow-up question based on what they just wrote. Help them explore the deeper meaning, emotions, or patterns beneath their words.
- If "Talk More" action: Provide supportive acknowledgment and invite them to continue sharing. Create a safe space for them to express more.

Examples of good "Go Deeper" questions:
- "What do you think is really underneath that frustration?"
- "How did that make you feel in your body?"
- "What would it mean if you couldn't control this situation?"
- "When have you felt this way before?"

Examples of good "Talk More" responses:
- "I'm here to listen. What else is on your mind about this?"
- "That sounds really important. Tell me more about how you're feeling."
- "I hear you. What other thoughts are coming up for you?"

Be warm, empathetic, and genuinely curious about their inner world.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, messages, action } = body as {
      content: string
      messages: AIMessage[]
      action: 'deeper' | 'more'
    }

    if (!content || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    })

    // Build conversation history
    const history = []

    // Add journal content as first user message
    history.push({
      role: 'user',
      parts: [{ text: `Here's what I just wrote in my journal:\n\n${content}` }],
    })

    // Add previous AI conversation if exists
    if (messages && messages.length > 0) {
      messages.forEach(msg => {
        history.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })
      })
    }

    // Add action-specific instruction
    const actionInstruction = action === 'deeper'
      ? 'Ask me one thoughtful follow-up question to help me go deeper into my thoughts and feelings.'
      : 'Acknowledge what I shared and invite me to continue sharing more.'

    // Start chat with history
    const chat = model.startChat({ history })

    // Send the action instruction
    const result = await chat.sendMessage(actionInstruction)
    const response = result.response
    const aiResponse = response.text()

    return NextResponse.json({ message: aiResponse })

  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
}
