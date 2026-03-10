# Next.js + Vercel AI SDK + UIX

A complete chat application using Next.js App Router, Vercel AI SDK for streaming, and UIX for the chat interface.

## Prerequisites

- Node.js 18+
- An Anthropic API key (set as `ANTHROPIC_API_KEY` environment variable)

## Setup

```bash
# Create a new Next.js project (if starting fresh)
npx create-next-app@latest my-chat-app --typescript --tailwind --app
cd my-chat-app

# Install dependencies
npm install ai @ai-sdk/anthropic @ai-sdk/react @uix-ai/agent @uix-ai/adapter-vercel @uix-ai/core
```

## Project Structure

```
app/
  api/chat/route.ts   # Streaming API endpoint
  page.tsx            # Chat UI
```

## Step 1: Create the API Route

Create `app/api/chat/route.ts` to handle streaming chat requests:

```typescript
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: 'You are a helpful assistant.',
    messages,
  })

  return result.toDataStreamResponse()
}
```

## Step 2: Create the Chat Page

Create `app/page.tsx` with the UIX chat interface:

```tsx
'use client'

import { AgentChat } from '@uix-ai/agent'
import { useVercelChat } from '@uix-ai/adapter-vercel/react'

export default function ChatPage() {
  const { conversations, status, send, stop } = useVercelChat({
    api: '/api/chat',
  })

  return (
    <div className="h-screen">
      <AgentChat
        conversations={conversations}
        status={status}
        onSend={send}
        onStop={stop}
        agent={{ id: 'claude', name: 'Claude', status: 'online' }}
        placeholder="Ask me anything..."
      />
    </div>
  )
}
```

## Step 3: Set Environment Variables

Create a `.env.local` file in your project root:

```
ANTHROPIC_API_KEY=sk-ant-...
```

## Step 4: Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start chatting.

## Using an Existing useChat Instance

If you already use `useChat` from `@ai-sdk/react`, you can use the lower-level `useVercelMessages` hook instead:

```tsx
'use client'

import { useChat } from '@ai-sdk/react'
import { useVercelMessages } from '@uix-ai/adapter-vercel/react'
import { AgentChat } from '@uix-ai/agent'

export default function ChatPage() {
  const chat = useChat({ api: '/api/chat' })
  const conversations = useVercelMessages(chat.messages)

  return (
    <div className="h-screen">
      <AgentChat
        conversations={conversations}
        status={chat.isLoading ? 'streaming' : 'idle'}
        onSend={(msg) => chat.append({ role: 'user', content: msg })}
        onStop={chat.stop}
      />
    </div>
  )
}
```
