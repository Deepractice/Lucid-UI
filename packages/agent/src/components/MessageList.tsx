import * as React from 'react'
import { cn, throttle } from '../utils'
import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageTimestamp,
} from './ChatMessage'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: React.ReactNode
  avatar?: string
  name?: string
  timestamp?: string | Date
}

export interface MessageListProps {
  /**
   * List of messages to display
   */
  messages: Message[]
  /**
   * Custom message renderer
   */
  renderMessage?: (message: Message) => React.ReactNode
  /**
   * Whether to auto-scroll to bottom on new messages
   */
  autoScroll?: boolean
  /**
   * Throttle interval in milliseconds for scroll updates during streaming.
   * Reduces re-renders when messages update frequently.
   * Set to 0 or undefined to disable throttling.
   * @default undefined (no throttling)
   */
  throttleMs?: number
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * MessageList Component
 *
 * Container for displaying a list of chat messages.
 * Supports throttled scroll updates for better performance during streaming.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <MessageList
 *   messages={messages}
 *   autoScroll
 * />
 *
 * // With throttle for streaming (recommended: 50-100ms)
 * <MessageList
 *   messages={messages}
 *   autoScroll
 *   throttleMs={50}
 * />
 * ```
 */
export function MessageList({
  messages,
  renderMessage,
  autoScroll = true,
  throttleMs,
  className,
}: MessageListProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const bottomRef = React.useRef<HTMLDivElement>(null)

  // Create throttled scroll function
  const scrollToBottom = React.useCallback(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const throttledScroll = React.useMemo(
    () =>
      throttleMs && throttleMs > 0
        ? throttle(scrollToBottom, throttleMs)
        : scrollToBottom,
    [scrollToBottom, throttleMs]
  )

  React.useEffect(() => {
    if (autoScroll) {
      throttledScroll()
    }
  }, [messages, autoScroll, throttledScroll])

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex flex-col overflow-y-auto p-4',
        className
      )}
    >
      {messages.map((message) =>
        renderMessage ? (
          <React.Fragment key={message.id}>
            {renderMessage(message)}
          </React.Fragment>
        ) : (
          <DefaultMessage key={message.id} message={message} />
        )
      )}
      <div ref={bottomRef} />
    </div>
  )
}

function DefaultMessage({ message }: { message: Message }) {
  return (
    <ChatMessage role={message.role}>
      <ChatMessageAvatar src={message.avatar} name={message.name} />
      <ChatMessageContent name={message.name}>
        {message.content}
        {message.timestamp && (
          <ChatMessageTimestamp time={message.timestamp} />
        )}
      </ChatMessageContent>
    </ChatMessage>
  )
}
