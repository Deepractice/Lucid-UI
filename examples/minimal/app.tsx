import React, { useState, useCallback } from 'react'
import { AgentChat } from '@uix-ai/agent'
import type { LucidConversation } from '@uix-ai/core'

/**
 * Minimal UIX example -- no adapters, no backend.
 *
 * Demonstrates manually constructing LucidConversation objects
 * and rendering them with AgentChat. This is the lowest-level
 * way to use UIX and shows the raw IR format.
 */

// Helper to create a text conversation turn
function createTextConversation(
  id: string,
  role: 'user' | 'assistant',
  text: string
): LucidConversation {
  return {
    id,
    role,
    status: 'completed',
    blocks: [
      {
        id: `block-${id}`,
        type: 'text',
        status: 'completed',
        content: { text },
      },
    ],
    timestamp: Date.now(),
  }
}

// Static seed conversations to demonstrate the IR format
const initialConversations: LucidConversation[] = [
  createTextConversation('1', 'user', 'What is UIX?'),
  {
    id: '2',
    role: 'assistant',
    status: 'completed',
    blocks: [
      {
        id: 'block-2-thinking',
        type: 'thinking',
        status: 'completed',
        content: { reasoning: 'The user is asking about UIX. Let me explain the core concept.' },
      },
      {
        id: 'block-2-text',
        type: 'text',
        status: 'completed',
        content: {
          text: 'UIX is a universal rendering layer for AI agent interfaces. It defines a Lucid IR (intermediate representation) that any AI backend can target, and provides React components to render it.\n\nThe key insight: separate the data format from the rendering, so you can switch backends without rewriting your UI.',
        },
      },
    ],
    timestamp: Date.now(),
  },
  createTextConversation('3', 'user', 'Can you show me the block types?'),
  {
    id: '4',
    role: 'assistant',
    status: 'completed',
    blocks: [
      {
        id: 'block-4-text',
        type: 'text',
        status: 'completed',
        content: { text: 'Here are some examples of different block types:' },
      },
      {
        id: 'block-4-tool',
        type: 'tool',
        status: 'completed',
        content: {
          name: 'get_weather',
          input: { city: 'San Francisco' },
          output: { temperature: 18, condition: 'foggy' },
          status: 'completed',
        },
      },
      {
        id: 'block-4-source',
        type: 'source',
        status: 'completed',
        content: {
          title: 'UIX Documentation',
          url: 'https://github.com/example/uix',
          excerpt: 'UIX provides a universal IR for AI chat interfaces.',
        },
      },
    ],
    timestamp: Date.now(),
  },
]

export default function App() {
  const [conversations, setConversations] = useState<LucidConversation[]>(initialConversations)
  const [nextId, setNextId] = useState(5)

  const handleSend = useCallback(
    (message: string) => {
      // Add the user message
      const userConv = createTextConversation(String(nextId), 'user', message)

      // Simulate a simple echo response from the "assistant"
      const assistantConv = createTextConversation(
        String(nextId + 1),
        'assistant',
        `You said: "${message}"\n\nThis is a static response. In a real app, you would connect to a backend using an adapter like @uix-ai/adapter-vercel or @uix-ai/adapter-agui.`
      )

      setConversations((prev) => [...prev, userConv, assistantConv])
      setNextId((id) => id + 2)
    },
    [nextId]
  )

  return (
    <div className="h-screen">
      <AgentChat
        conversations={conversations}
        status="idle"
        onSend={handleSend}
        agent={{
          id: 'demo',
          name: 'Minimal Demo',
          status: 'online',
        }}
        placeholder="Type a message to see the echo response..."
        emptyState={{
          title: 'Minimal UIX',
          description: 'No adapters, no backend. Just LucidConversation objects and AgentChat.',
        }}
      />
    </div>
  )
}
