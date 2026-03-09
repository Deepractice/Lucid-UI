/**
 * @uix/adapter-agui/react
 *
 * React hooks for connecting to AG-UI protocol agent backends
 * and rendering with UIX components.
 *
 * @example 3 lines to a full chat UI
 * ```tsx
 * import { AgentChat } from '@uix/agent'
 * import { useAGUI } from '@uix/adapter-agui/react'
 *
 * function App() {
 *   const { conversations, status, send } = useAGUI({ url: '/api/agent' })
 *   return <AgentChat conversations={conversations} status={status} onSend={send} />
 * }
 * ```
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { AGUIEventProcessor } from '../index'
import type { AGUIEvent, AGUIProcessorOptions } from '../index'
import type { LucidConversation } from '@uix/core'

// ============================================================================
// useAGUI - Connect to AG-UI agent backend
// ============================================================================

export interface UseAGUIOptions {
  /**
   * AG-UI agent endpoint URL.
   * The hook will connect via SSE (Server-Sent Events).
   */
  url: string

  /**
   * Thread ID for conversation continuity.
   * @default auto-generated
   */
  threadId?: string

  /**
   * Custom headers for the SSE connection.
   */
  headers?: Record<string, string>

  /**
   * AG-UI event processor options.
   */
  processorOptions?: AGUIProcessorOptions

  /**
   * Auto-connect on mount.
   * @default false
   */
  autoConnect?: boolean

  /**
   * Callback when an error occurs.
   */
  onError?: (error: Error) => void

  /**
   * Callback when the run finishes.
   */
  onFinish?: () => void
}

export interface UseAGUIReturn {
  /** UIX LucidConversation array, ready for <AgentChat> */
  conversations: LucidConversation[]
  /** Chat status mapped to ChatWindowStatus */
  status: 'idle' | 'loading' | 'streaming' | 'error'
  /** Send a user message to the agent */
  send: (message: string) => void
  /** Stop the current stream */
  stop: () => void
  /** Whether the agent is currently responding */
  isLoading: boolean
  /** Reset the conversation */
  reset: () => void
  /** Error if any */
  error: Error | null
}

/**
 * Connect to an AG-UI protocol agent backend and get UIX-ready conversations.
 *
 * Handles SSE connection, event processing, and state management.
 * Returns data directly compatible with <AgentChat>.
 *
 * @example Basic usage
 * ```tsx
 * function Chat() {
 *   const { conversations, status, send, stop } = useAGUI({
 *     url: 'https://my-agent.com/api/ag-ui',
 *   })
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
 * @example With thread persistence
 * ```tsx
 * const { conversations, send } = useAGUI({
 *   url: '/api/agent',
 *   threadId: 'thread-abc-123',
 *   headers: { Authorization: 'Bearer ...' },
 * })
 * ```
 */
export function useAGUI(options: UseAGUIOptions): UseAGUIReturn {
  const { url, threadId, headers, processorOptions, onError, onFinish } = options

  const [conversations, setConversations] = useState<LucidConversation[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'streaming' | 'error'>('idle')
  const [error, setError] = useState<Error | null>(null)

  const processorRef = useRef<AGUIEventProcessor>(
    new AGUIEventProcessor({
      ...processorOptions,
      onUpdate: (convs) => setConversations([...convs]),
    })
  )
  const abortRef = useRef<AbortController | null>(null)
  const threadIdRef = useRef(threadId ?? `thread-${Date.now()}`)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const send = useCallback(
    async (message: string) => {
      // Abort any existing connection
      abortRef.current?.abort()

      const controller = new AbortController()
      abortRef.current = controller

      setStatus('loading')
      setError(null)

      // Add user message to conversations immediately
      const userConv: LucidConversation = {
        id: `user-${Date.now()}`,
        role: 'user',
        status: 'completed',
        blocks: [
          {
            id: `block-${Date.now()}`,
            type: 'text',
            status: 'completed',
            content: { text: message },
          },
        ],
        timestamp: Date.now(),
      }
      setConversations((prev) => [...prev, userConv])

      try {
        const requestHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          ...headers,
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify({
            threadId: threadIdRef.current,
            message,
          }),
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`AG-UI request failed: ${response.status} ${response.statusText}`)
        }

        if (!response.body) {
          throw new Error('No response body for SSE stream')
        }

        setStatus('streaming')

        // Parse SSE stream
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim()
              if (data === '[DONE]') continue

              try {
                const event: AGUIEvent = JSON.parse(data)
                processorRef.current.processEvent(event)
              } catch {
                // Skip malformed events
              }
            }
          }
        }

        setStatus('idle')
        onFinish?.()
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          setStatus('idle')
          return
        }

        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        setStatus('error')
        onError?.(error)
      }
    },
    [url, headers, onError, onFinish]
  )

  const stop = useCallback(() => {
    abortRef.current?.abort()
    setStatus('idle')
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    processorRef.current.reset()
    setConversations([])
    setStatus('idle')
    setError(null)
    threadIdRef.current = `thread-${Date.now()}`
  }, [])

  return {
    conversations,
    status,
    send,
    stop,
    isLoading: status === 'loading' || status === 'streaming',
    reset,
    error,
  }
}
