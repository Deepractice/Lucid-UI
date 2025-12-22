/**
 * MessageAvatar - Role-driven avatar for chat messages
 *
 * Automatically maps message role to color and symbol.
 * Based on AgentX u/a/s/t convention.
 *
 * @example Basic usage
 * ```tsx
 * <MessageAvatar role="user" />
 * <MessageAvatar role="assistant" />
 * <MessageAvatar role="tool" />
 * ```
 *
 * @example With AI status animation
 * ```tsx
 * <MessageAvatar role="assistant" status="thinking" />
 * <MessageAvatar role="assistant" status="responding" />
 * <MessageAvatar role="tool" status="tool-calling" />
 * ```
 *
 * @example With custom image
 * ```tsx
 * <MessageAvatar role="assistant" src="/claude.png" name="Claude" />
 * ```
 */

import * as React from 'react'
import { cn } from '../utils'

// ============================================================================
// Types
// ============================================================================

/**
 * Message role types following AgentX convention
 * - user: Human user messages
 * - assistant: AI assistant responses
 * - system: System messages
 * - tool: Tool execution results
 * - error: Error messages
 */
export type MessageRole = 'user' | 'assistant' | 'system' | 'tool' | 'error'

/**
 * AI-specific dynamic status for avatar animations
 * - idle: No animation (default)
 * - thinking: Pulsing animation - AI is processing
 * - responding: Breathing effect - AI is streaming response
 * - tool-calling: Spinning indicator - AI is calling tools
 */
export type AvatarStatus = 'idle' | 'thinking' | 'responding' | 'tool-calling'

export interface MessageAvatarProps {
  /**
   * Message role - determines color and default symbol
   */
  role: MessageRole
  /**
   * AI dynamic status - triggers animations
   * @default "idle"
   */
  status?: AvatarStatus
  /**
   * Custom avatar image URL (overrides default symbol)
   */
  src?: string
  /**
   * Agent/user name (used for alt text and custom initials)
   */
  name?: string
  /**
   * Custom icon component (overrides default symbol)
   */
  icon?: React.ReactNode
  /**
   * Avatar size
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Additional CSS classes
   */
  className?: string
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Role to symbol mapping (U/A/S/T/!)
 */
const roleSymbols: Record<MessageRole, string> = {
  user: 'U',
  assistant: 'A',
  system: 'S',
  tool: 'T',
  error: '!',
}

/**
 * Role to color mapping using semantic design tokens
 * - user: primary (blue) - precise commands
 * - assistant: secondary (amber/gold) - generative thinking
 * - system: muted (gray) - neutral system info
 * - tool: accent (orange) - action/execution
 * - error: destructive (red) - errors
 */
const roleColors: Record<MessageRole, string> = {
  user: 'bg-primary-500 text-white',
  assistant: 'bg-secondary-500 text-white',
  system: 'bg-gray-200 text-gray-600',
  tool: 'bg-orange-500 text-white',
  error: 'bg-red-500 text-white',
}

/**
 * Size classes for avatar container
 */
const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
}

/**
 * AI status animation classes
 * - thinking: pulse animation (scale + opacity)
 * - responding: breathing glow effect
 * - tool-calling: spinning ring indicator
 */
const statusAnimations: Record<AvatarStatus, string> = {
  idle: '',
  thinking: 'animate-pulse',
  responding: 'animate-breath',
  'tool-calling': '',
}

// ============================================================================
// Component
// ============================================================================

/**
 * MessageAvatar Component
 *
 * Role-driven avatar that automatically applies appropriate colors and symbols
 * based on the message role (user/assistant/system/tool/error).
 *
 * Design philosophy:
 * - User messages use primary color (rational blue) - precise commands
 * - Assistant messages use secondary color (sentient gold) - generative thinking
 * - System/tool messages use neutral colors
 * - Error messages use destructive red
 *
 * AI Status animations:
 * - thinking: Pulsing effect indicating AI is processing
 * - responding: Breathing glow effect during streaming
 * - tool-calling: Spinning ring indicator for tool execution
 */
export const MessageAvatar = React.forwardRef<HTMLDivElement, MessageAvatarProps>(
  ({ role, status = 'idle', src, name, icon, size = 'md', className }, ref) => {
    // Determine display content priority: image > icon > name initials > role symbol
    const symbol = roleSymbols[role]
    const displayText = name ? name.charAt(0).toUpperCase() : symbol
    const isToolCalling = status === 'tool-calling'

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full font-medium shrink-0',
          roleColors[role],
          sizeClasses[size],
          statusAnimations[status],
          className
        )}
        role="img"
        aria-label={name || role}
        aria-busy={status !== 'idle'}
      >
        {src ? (
          <img
            src={src}
            alt={name || role}
            className="w-full h-full rounded-full object-cover"
          />
        ) : icon ? (
          <span className="flex items-center justify-center">{icon}</span>
        ) : (
          <span>{displayText}</span>
        )}

        {/* Tool-calling spinning ring indicator */}
        {isToolCalling && (
          <span
            className={cn(
              'absolute inset-0 rounded-full border-2 border-transparent',
              'border-t-white/80 animate-spin'
            )}
            aria-hidden="true"
          />
        )}

        {/* Responding glow effect */}
        {status === 'responding' && (
          <span
            className={cn(
              'absolute inset-0 rounded-full',
              'animate-ping opacity-30',
              roleColors[role]
            )}
            aria-hidden="true"
          />
        )}
      </div>
    )
  }
)
MessageAvatar.displayName = 'MessageAvatar'

// ============================================================================
// Utility exports
// ============================================================================

export { roleSymbols, roleColors, sizeClasses as avatarSizeClasses, statusAnimations }
