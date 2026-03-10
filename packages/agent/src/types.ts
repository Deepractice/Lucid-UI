/**
 * Shared types for @uix-ai/agent components
 *
 * This file is the single source of truth for shared types.
 * Import from here instead of individual component files.
 */

// ============================================================================
// Message Types
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
 * Message lifecycle status
 */
export type MessageStatus = 'idle' | 'thinking' | 'streaming' | 'complete' | 'error'

// ============================================================================
// Avatar Types
// ============================================================================

/**
 * Avatar size options
 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Avatar color variants
 */
export type AvatarVariant =
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'

/**
 * AI-specific dynamic status for avatar animations
 */
export type AvatarAnimationStatus =
  | 'idle'
  | 'thinking'      // Pulse animation
  | 'planning'      // Breathing glow
  | 'responding'    // Ping ripple
  | 'tool-calling'  // Spinning ring

/**
 * Online/presence status
 */
export type PresenceStatus = 'online' | 'offline' | 'busy'

/**
 * Image loading status
 */
export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

// ============================================================================
// Mention Types
// ============================================================================

/**
 * Agent data for @mention
 */
export interface MentionAgent {
  id: string
  name: string
  avatar?: string
  description?: string
  status?: PresenceStatus
}

// ============================================================================
// Stream Types
// ============================================================================

/**
 * Stream source type
 */
export type StreamSource =
  | AsyncIterable<string>
  | ReadableStream<string>
  | string

// ============================================================================
// ThinkingIndicator Types
// ============================================================================

/**
 * Thinking animation variant
 */
export type ThinkingVariant = 'dots' | 'pulse' | 'bounce' | 'wave' | 'spinner'

// ============================================================================
// Conversation Types (for ChatList)
// ============================================================================

/**
 * Agent associated with a conversation
 */
export interface ConversationAgent {
  id: string
  name: string
  avatar?: string
}

/**
 * Conversation item data structure
 */
export interface Conversation {
  /** Unique identifier */
  id: string
  /** Conversation title */
  title: string
  /** Last message preview */
  lastMessage?: string
  /** Last active time */
  lastActiveAt?: Date | string
  /** Unread message count */
  unreadCount?: number
  /** Is pinned */
  pinned?: boolean
  /** Associated agent */
  agent?: ConversationAgent
  /** Tags */
  tags?: string[]
}

// ============================================================================
// ChatWindow Types
// ============================================================================

/**
 * Agent info for ChatWindowHeader
 */
export interface ChatWindowAgent {
  id: string
  name: string
  avatar?: string
  status?: PresenceStatus
  description?: string
}

/**
 * ChatWindow status
 */
export type ChatWindowStatus = 'idle' | 'loading' | 'streaming' | 'error'
