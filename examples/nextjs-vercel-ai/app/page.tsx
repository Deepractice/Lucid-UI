'use client'

import { AgentChat } from '@uix/agent'
import { useVercelChat } from '@uix/adapter-vercel/react'

/**
 * Chat page using Vercel AI SDK + UIX.
 *
 * useVercelChat manages the full chat lifecycle:
 * - Sends messages to /api/chat
 * - Converts Vercel AI SDK messages to UIX LucidConversation format
 * - Tracks streaming status
 *
 * AgentChat renders the complete chat UI from the LucidConversation array.
 */
export default function ChatPage() {
  const { conversations, status, send, stop } = useVercelChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('Chat error:', error)
    },
  })

  return (
    <main className="h-screen bg-white">
      <AgentChat
        conversations={conversations}
        status={status}
        onSend={send}
        onStop={stop}
        agent={{
          id: 'claude',
          name: 'Claude',
          status: 'online',
        }}
        placeholder="Ask me anything..."
        emptyState={{
          title: 'Welcome',
          description: 'Send a message to start chatting with Claude.',
        }}
      />
    </main>
  )
}
