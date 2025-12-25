import * as React from 'react'
import { cn } from '../utils'
import { AgentAvatar } from './AgentAvatar'

export interface ChatBubbleProps {
  /**
   * Message role
   */
  role: 'user' | 'assistant' | 'system'
  /**
   * Avatar image URL (for assistant)
   */
  avatar?: string
  /**
   * Agent/user name
   */
  name?: string
  /**
   * Message content
   */
  children: React.ReactNode
  /**
   * Timestamp
   */
  timestamp?: string | Date
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * ChatBubble Component
 *
 * @deprecated Use `ChatMessageSimple` instead. ChatBubble will be removed in a future version.
 *
 * ChatMessageSimple provides the same functionality but is built on the composable
 * ChatMessage primitives, ensuring consistent styling and behavior.
 *
 * @example Migration
 * ```tsx
 * // Before (deprecated)
 * <ChatBubble role="assistant" avatar="/claude.png" name="Claude">
 *   Hello!
 * </ChatBubble>
 *
 * // After (recommended)
 * <ChatMessageSimple
 *   role="assistant"
 *   avatar="/claude.png"
 *   name="Claude"
 *   content="Hello!"
 * />
 * ```
 */
export function ChatBubble({
  role,
  avatar,
  name,
  children,
  timestamp,
  className,
}: ChatBubbleProps) {
  const isUser = role === 'user'
  const isSystem = role === 'system'

  if (isSystem) {
    return (
      <div className={cn('flex justify-center my-4', className)}>
        <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
          {children}
        </div>
      </div>
    )
  }

  const formattedTime = timestamp
    ? typeof timestamp === 'string'
      ? timestamp
      : timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div
      className={cn(
        'flex gap-3 my-4',
        isUser ? 'flex-row-reverse' : 'flex-row',
        className
      )}
    >
      {/* Avatar (only for assistant) */}
      {!isUser && (
        <div className="flex-shrink-0">
          <AgentAvatar
            src={avatar}
            name={name || 'AI'}
            size="md"
          />
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
          <span className="text-sm font-medium text-gray-900 mb-1">
            {name}
          </span>
        )}

        {/* Bubble */}
        <div
          className={cn(
            'px-4 py-3 rounded-2xl',
            isUser
              ? 'bg-primary-500 text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
          )}
        >
          {children}
        </div>

        {/* Timestamp */}
        {formattedTime && (
          <span className="text-xs text-gray-400 mt-1">
            {formattedTime}
          </span>
        )}
      </div>
    </div>
  )
}
