import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

/**
 * POST /api/chat
 *
 * Streaming chat endpoint using Vercel AI SDK with Anthropic's Claude.
 * Receives messages in Vercel AI SDK format and returns a streaming response.
 *
 * Required environment variable: ANTHROPIC_API_KEY
 */
export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: 'You are a helpful assistant. Be concise and clear in your responses.',
    messages,
  })

  return result.toDataStreamResponse()
}
