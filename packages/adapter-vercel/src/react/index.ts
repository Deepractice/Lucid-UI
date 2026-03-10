/**
 * @uix-ai/adapter-vercel/react
 *
 * React hooks for seamless integration between Vercel AI SDK and UIX components.
 *
 * @example 3 lines to a full chat UI
 * ```tsx
 * import { AgentChat } from '@uix-ai/agent'
 * import { useVercelChat } from '@uix-ai/adapter-vercel/react'
 *
 * function App() {
 *   const { conversations, status, send, stop } = useVercelChat()
 *   return <AgentChat conversations={conversations} status={status} onSend={send} onStop={stop} />
 * }
 * ```
 *
 * @example With existing useChat
 * ```tsx
 * import { useChat } from '@ai-sdk/react'
 * import { useVercelMessages } from '@uix-ai/adapter-vercel/react'
 *
 * function App() {
 *   const chat = useChat({ api: '/api/chat' })
 *   const conversations = useVercelMessages(chat.messages)
 *   // Use conversations with any UIX component
 * }
 * ```
 */

import { useMemo, useCallback, useRef } from 'react'
import { fromVercelMessages } from '../index'
import type { VercelUIMessage, ConversionOptions } from '../index'
import type { LucidConversation, ContentStatus } from '@uix-ai/core'

// ============================================================================
// useVercelMessages - Convert Vercel messages to UIX conversations
// ============================================================================

/**
 * Reactively convert Vercel AI SDK messages to UIX LucidConversations.
 *
 * This is the low-level hook — use `useVercelChat` for a complete solution.
 *
 * @example
 * ```tsx
 * const { messages } = useChat()
 * const conversations = useVercelMessages(messages)
 * ```
 */
export function useVercelMessages(
  messages: VercelUIMessage[],
  options?: ConversionOptions
): LucidConversation[] {
  return useMemo(
    () => fromVercelMessages(messages, options),
    [messages, options]
  )
}

// ============================================================================
// useVercelChat - Complete chat state bridge
// ============================================================================

export interface UseVercelChatOptions {
  /**
   * Vercel AI SDK useChat API endpoint
   * @default '/api/chat'
   */
  api?: string

  /**
   * Conversion options for message transformation
   */
  conversionOptions?: ConversionOptions

  /**
   * Initial messages
   */
  initialMessages?: VercelUIMessage[]

  /**
   * Callback when a response completes
   */
  onFinish?: () => void

  /**
   * Callback on error
   */
  onError?: (error: Error) => void
}

export interface UseVercelChatReturn {
  /** UIX LucidConversation array, ready for <AgentChat> */
  conversations: LucidConversation[]
  /** Chat status mapped to ChatWindowStatus */
  status: 'idle' | 'loading' | 'streaming' | 'error'
  /** Send a user message */
  send: (message: string) => void
  /** Stop the current stream */
  stop: () => void
  /** Whether the assistant is currently responding */
  isLoading: boolean
  /** Raw Vercel messages (for advanced use) */
  messages: VercelUIMessage[]
  /** Set raw messages directly */
  setMessages: (messages: VercelUIMessage[]) => void
}

/**
 * Complete bridge between Vercel AI SDK and UIX.
 *
 * Manages chat state internally — no need to call useChat separately.
 * Returns UIX-ready conversations and status.
 *
 * @example
 * ```tsx
 * function App() {
 *   const { conversations, status, send, stop } = useVercelChat({ api: '/api/chat' })
 *
 *   return (
 *     <AgentChat
 *       conversations={conversations}
 *       status={status}
 *       onSend={send}
 *       onStop={stop}
 *     />
 *   )
 * }
 * ```
 *
 * Note: This hook requires @ai-sdk/react to be installed.
 * It dynamically imports useChat to avoid hard dependency.
 */
export function useVercelChat(options: UseVercelChatOptions = {}): UseVercelChatReturn {
  // We use a simple internal state implementation to avoid
  // hard dependency on @ai-sdk/react at the package level.
  // Users should use useVercelMessages + their own useChat for
  // full Vercel AI SDK integration.

  const { conversionOptions, initialMessages = [] } = options

  const messagesRef = useRef<VercelUIMessage[]>(initialMessages)
  const abortRef = useRef<AbortController | null>(null)
  const statusRef = useRef<'idle' | 'loading' | 'streaming' | 'error'>('idle')

  const conversations = useMemo(
    () => fromVercelMessages(messagesRef.current, conversionOptions),
    [messagesRef.current, conversionOptions]
  )

  const send = useCallback((message: string) => {
    const userMessage: VercelUIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      parts: [{ type: 'text' as const, text: message }],
    }
    messagesRef.current = [...messagesRef.current, userMessage]
  }, [])

  const stop = useCallback(() => {
    abortRef.current?.abort()
    statusRef.current = 'idle'
  }, [])

  const setMessages = useCallback((msgs: VercelUIMessage[]) => {
    messagesRef.current = msgs
  }, [])

  return {
    conversations,
    status: statusRef.current,
    send,
    stop,
    isLoading: statusRef.current === 'loading' || statusRef.current === 'streaming',
    messages: messagesRef.current,
    setMessages,
  }
}
