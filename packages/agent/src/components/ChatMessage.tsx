/**
 * ChatMessage - State machine component for AI messages
 *
 * High-level component that automatically handles the complete lifecycle
 * of an AI message: thinking → streaming → complete → error
 *
 * One line of code handles all states:
 *
 * @example Basic usage
 * ```tsx
 * <ChatMessage
 *   role="assistant"
 *   status="streaming"
 *   stream={asyncIterator}
 *   avatar="/claude.png"
 *   name="Claude"
 * />
 * ```
 *
 * @example With status transitions
 * ```tsx
 * const [status, setStatus] = useState<MessageStatus>('thinking')
 * const [stream, setStream] = useState<AsyncIterable<string>>()
 *
 * // When AI starts responding
 * setStatus('streaming')
 * setStream(response.body)
 *
 * <ChatMessage
 *   role="assistant"
 *   status={status}
 *   stream={stream}
 *   onComplete={() => setStatus('complete')}
 *   onError={() => setStatus('error')}
 * />
 * ```
 *
 * @example Composable children override
 * ```tsx
 * <ChatMessage role="assistant" status="complete">
 *   <Markdown>{content}</Markdown>
 * </ChatMessage>
 * ```
 */

import * as React from 'react'
import { cn } from '../utils'
import { Avatar, AvatarImage, AvatarFallback, type AvatarAnimationStatus } from './Avatar'
import { StreamText } from './StreamText'
import { type MessageRole } from './MessageAvatar'

// ============================================================================
// Types
// ============================================================================

/**
 * Message lifecycle status
 */
export type MessageStatus = 'thinking' | 'streaming' | 'complete' | 'error'

// Re-export MessageRole for convenience (source: MessageAvatar)
export type { MessageRole } from './MessageAvatar'

export interface ChatMessageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onError'> {
  /**
   * Message role
   */
  role: MessageRole
  /**
   * Current message status (drives state machine)
   */
  status?: MessageStatus
  /**
   * Stream source for streaming status
   */
  stream?: AsyncIterable<string> | ReadableStream<string>
  /**
   * Static content (for complete status or user messages)
   */
  content?: string
  /**
   * Avatar image URL
   */
  avatar?: string
  /**
   * Agent/user name
   */
  name?: string
  /**
   * Timestamp
   */
  timestamp?: string | Date
  /**
   * Custom thinking label
   */
  thinkingLabel?: string
  /**
   * Called when streaming completes
   */
  onComplete?: () => void
  /**
   * Called on streaming error
   */
  onError?: (error: Error) => void
  /**
   * Custom content renderer (overrides default rendering)
   */
  children?: React.ReactNode
}

// ============================================================================
// Constants
// ============================================================================

const roleColors: Record<MessageRole, string> = {
  user: 'bg-primary-500 text-white',
  assistant: 'bg-gray-100 text-gray-900',
  system: 'bg-gray-50 text-gray-500',
  tool: 'bg-amber-50 text-amber-900',
  error: 'bg-red-50 text-red-900',
}

const roleBubbleRadius: Record<MessageRole, string> = {
  user: 'rounded-2xl rounded-br-sm',
  assistant: 'rounded-2xl rounded-bl-sm',
  system: 'rounded-full',
  tool: 'rounded-xl',
  error: 'rounded-xl',
}

/**
 * Map MessageStatus to Avatar animation status
 */
const statusToAvatarAnimation: Record<MessageStatus, AvatarAnimationStatus> = {
  thinking: 'thinking',
  streaming: 'responding',
  complete: 'idle',
  error: 'idle',
}

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Thinking dots indicator (inline version)
 */
function ThinkingDots({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-gray-500">
      <span className="flex items-center gap-1">
        <span
          className="w-1.5 h-1.5 bg-secondary-500 rounded-full animate-bounce"
          style={{ animationDelay: '0ms', animationDuration: '600ms' }}
        />
        <span
          className="w-1.5 h-1.5 bg-secondary-500 rounded-full animate-bounce"
          style={{ animationDelay: '150ms', animationDuration: '600ms' }}
        />
        <span
          className="w-1.5 h-1.5 bg-secondary-500 rounded-full animate-bounce"
          style={{ animationDelay: '300ms', animationDuration: '600ms' }}
        />
      </span>
      {label && <span className="text-sm">{label}</span>}
    </span>
  )
}

/**
 * Error display
 */
function ErrorDisplay({ message }: { message?: string }) {
  return (
    <span className="text-red-500 flex items-center gap-2">
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{message || 'Something went wrong'}</span>
    </span>
  )
}

// ============================================================================
// Component
// ============================================================================

/**
 * ChatMessage Component
 *
 * State machine component that handles the complete AI message lifecycle.
 * Automatically renders appropriate UI for each status:
 * - thinking: Animated dots with optional label
 * - streaming: StreamText with cursor
 * - complete: Static content
 * - error: Error message with icon
 */
export const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  (
    {
      role,
      status = 'complete',
      stream,
      content,
      avatar,
      name,
      timestamp,
      thinkingLabel,
      onComplete,
      onError,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [errorMessage, setErrorMessage] = React.useState<string>()
    const isUser = role === 'user'
    const isSystem = role === 'system'

    const handleError = React.useCallback(
      (error: Error) => {
        setErrorMessage(error.message)
        onError?.(error)
      },
      [onError]
    )

    // Format timestamp
    const formattedTime = timestamp
      ? typeof timestamp === 'string'
        ? timestamp
        : timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : null

    // System messages are centered
    if (isSystem) {
      return (
        <div ref={ref} className={cn('flex justify-center my-4', className)} {...props}>
          <div className={cn('text-sm px-4 py-2', roleColors[role], roleBubbleRadius[role])}>
            {children || content}
          </div>
        </div>
      )
    }

    // Render message content based on status
    const renderContent = () => {
      // Custom children override everything
      if (children) {
        return children
      }

      switch (status) {
        case 'thinking':
          return <ThinkingDots label={thinkingLabel} />

        case 'streaming':
          return (
            <StreamText
              stream={stream}
              cursor
              onComplete={onComplete}
              onError={handleError}
            />
          )

        case 'error':
          return <ErrorDisplay message={errorMessage} />

        case 'complete':
        default:
          return <span className="whitespace-pre-wrap">{content}</span>
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex gap-3 my-4',
          isUser ? 'flex-row-reverse' : 'flex-row',
          className
        )}
        {...props}
      >
        {/* Avatar (not for user) */}
        {!isUser && (
          <div className="flex-shrink-0">
            <Avatar
              size="md"
              role={role === 'tool' ? 'tool' : 'assistant'}
              status={statusToAvatarAnimation[status]}
            >
              {avatar && <AvatarImage src={avatar} alt={name} />}
              <AvatarFallback>{name?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
            </Avatar>
          </div>
        )}

        {/* Message content */}
        <div
          className={cn(
            'flex flex-col max-w-[70%]',
            isUser ? 'items-end' : 'items-start'
          )}
        >
          {/* Name */}
          {name && !isUser && (
            <span className="text-sm font-medium text-gray-900 mb-1">{name}</span>
          )}

          {/* Bubble */}
          <div
            className={cn('px-4 py-3', roleColors[role], roleBubbleRadius[role])}
            aria-busy={status === 'thinking' || status === 'streaming'}
            aria-live={status === 'streaming' ? 'polite' : undefined}
          >
            {renderContent()}
          </div>

          {/* Timestamp */}
          {formattedTime && status === 'complete' && (
            <span className="text-xs text-gray-400 mt-1">{formattedTime}</span>
          )}
        </div>
      </div>
    )
  }
)
ChatMessage.displayName = 'ChatMessage'

// ============================================================================
// Exports
// ============================================================================

export { ThinkingDots, ErrorDisplay }
