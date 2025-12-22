import * as React from 'react'
import { cn, throttle } from '../utils'

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
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex gap-3 my-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {!isUser && message.avatar && (
        <img
          src={message.avatar}
          alt={message.name || 'AI'}
          className="w-10 h-10 rounded-full object-cover"
        />
      )}
      <div
        className={cn(
          'max-w-[70%] px-4 py-3 rounded-2xl',
          isUser
            ? 'bg-primary-500 text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
        )}
      >
        {message.content}
      </div>
    </div>
  )
}
