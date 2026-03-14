/**
 * @uix-ai/adapter-agentx
 *
 * Anti-Corruption Layer (ACL) adapter that converts AgentX Presentation state
 * to UIX Lucid IR format.
 *
 * AgentX Presentation produces its own Block/Conversation types optimized for
 * its internal reducer. This adapter translates them into UIX IR
 * (LucidConversation / LucidBlock) so any UIX-compatible renderer can display them.
 *
 * @example
 * ```typescript
 * import { fromAgentXState } from '@uix-ai/adapter-agentx'
 *
 * // Subscribe to AgentX Presentation updates
 * presentation.onUpdate((state) => {
 *   const conversations = fromAgentXState(state)
 *   // Render with any UIX-compatible renderer
 * })
 * ```
 *
 * @see https://github.com/Deepractice/AgentX
 * @see https://github.com/Deepractice/UIX
 */

import type {
  LucidConversation,
  LucidBlock,
  ContentStatus,
  ToolStatus,
  TextBlockContent,
  ToolBlockContent,
  ImageBlockContent,
  ErrorBlockContent,
} from '@uix-ai/core'

// ============================================================================
// AgentX Presentation Types (self-contained, no runtime dependency)
//
// These mirror the types from agentxjs/presentation/types.ts.
// We declare them locally to avoid a hard dependency on the agentxjs package,
// following the adapter pattern: depend on abstractions, not implementations.
// ============================================================================

/**
 * AgentX text block
 */
export interface AgentXTextBlock {
  type: 'text'
  content: string
}

/**
 * AgentX tool block
 */
export interface AgentXToolBlock {
  type: 'tool'
  toolUseId: string
  toolName: string
  toolInput: Record<string, unknown>
  toolResult?: string
  status: 'pending' | 'running' | 'completed' | 'error'
}

/**
 * AgentX image block
 */
export interface AgentXImageBlock {
  type: 'image'
  url: string
  alt?: string
}

export type AgentXBlock = AgentXTextBlock | AgentXToolBlock | AgentXImageBlock

/**
 * AgentX user conversation
 */
export interface AgentXUserConversation {
  role: 'user'
  blocks: AgentXBlock[]
}

/**
 * AgentX token usage
 */
export interface AgentXTokenUsage {
  inputTokens: number
  outputTokens: number
}

/**
 * AgentX assistant conversation
 */
export interface AgentXAssistantConversation {
  role: 'assistant'
  blocks: AgentXBlock[]
  isStreaming: boolean
  usage?: AgentXTokenUsage
}

/**
 * AgentX error conversation
 */
export interface AgentXErrorConversation {
  role: 'error'
  message: string
}

export type AgentXConversation =
  | AgentXUserConversation
  | AgentXAssistantConversation
  | AgentXErrorConversation

/**
 * AgentX PresentationState — the complete UI state from AgentX's reducer
 */
export interface AgentXPresentationState {
  conversations: AgentXConversation[]
  streaming: AgentXAssistantConversation | null
  status: 'idle' | 'thinking' | 'responding' | 'executing'
}

// ============================================================================
// Conversion Options
// ============================================================================

export interface ConversionOptions {
  /**
   * Custom ID generator for conversations and blocks.
   * @default () => `${prefix}-${Date.now()}-${counter++}`
   */
  generateId?: () => string

  /**
   * Base timestamp for conversations.
   * Each conversation gets an incrementing timestamp from this base.
   * @default Date.now()
   */
  baseTimestamp?: number
}

// ============================================================================
// ID Generation
// ============================================================================

let idCounter = 0

function defaultGenerateId(): string {
  return `ax-${Date.now()}-${++idCounter}`
}

// ============================================================================
// Block Conversion
// ============================================================================

/**
 * Convert AgentX tool status to UIX ToolStatus
 */
function convertToolStatus(status: AgentXToolBlock['status']): ToolStatus {
  switch (status) {
    case 'pending':
      return 'pending'
    case 'running':
      return 'running'
    case 'completed':
      return 'success'
    case 'error':
      return 'error'
  }
}

/**
 * Convert a single AgentX Block to a UIX LucidBlock
 */
export function convertBlock(
  block: AgentXBlock,
  options: ConversionOptions = {}
): LucidBlock {
  const generateId = options.generateId ?? defaultGenerateId

  switch (block.type) {
    case 'text':
      return {
        id: generateId(),
        type: 'text',
        status: 'completed',
        content: {
          text: block.content,
        } as TextBlockContent,
      }

    case 'tool': {
      const toolStatus = convertToolStatus(block.status)
      const isTerminal = block.status === 'completed' || block.status === 'error'

      return {
        id: generateId(),
        type: 'tool',
        status: isTerminal ? 'completed' : 'streaming',
        content: {
          name: block.toolName,
          input: block.toolInput,
          output: block.toolResult,
          status: toolStatus,
          error: block.status === 'error' ? block.toolResult : undefined,
        } as ToolBlockContent,
      }
    }

    case 'image':
      return {
        id: generateId(),
        type: 'image',
        status: 'completed',
        content: {
          url: block.url,
          alt: block.alt,
        } as ImageBlockContent,
      }
  }
}

// ============================================================================
// Conversation Conversion
// ============================================================================

/**
 * Convert a single AgentX Conversation to a UIX LucidConversation
 */
export function convertConversation(
  conversation: AgentXConversation,
  options: ConversionOptions = {}
): LucidConversation {
  const generateId = options.generateId ?? defaultGenerateId
  const timestamp = options.baseTimestamp ?? Date.now()

  // Error conversation → conversation with an error block
  if (conversation.role === 'error') {
    return {
      id: generateId(),
      role: 'assistant',
      status: 'error',
      blocks: [
        {
          id: generateId(),
          type: 'error',
          status: 'error',
          content: {
            code: 'AGENTX_ERROR',
            message: conversation.message,
          } as ErrorBlockContent,
        },
      ],
      timestamp,
    }
  }

  // User or assistant conversation
  const blocks: LucidBlock[] = conversation.blocks.map(
    (block) => convertBlock(block, options)
  )

  const isStreaming =
    conversation.role === 'assistant' && conversation.isStreaming

  // Infer status: if any block is streaming, conversation is streaming
  let status: ContentStatus = 'completed'
  if (isStreaming) {
    status = 'streaming'
  } else {
    for (const block of blocks) {
      if (block.status === 'error') {
        status = 'error'
        break
      }
    }
  }

  return {
    id: generateId(),
    role: conversation.role === 'user' ? 'user' : 'assistant',
    status,
    blocks,
    timestamp,
  }
}

// ============================================================================
// Main Conversion Functions
// ============================================================================

/**
 * Convert AgentX PresentationState to UIX LucidConversations.
 *
 * This is the primary conversion function. It handles:
 * - All completed conversations
 * - The current streaming conversation (if any)
 * - Error conversations (converted to error blocks)
 * - Timestamp generation for ordering
 *
 * @example
 * ```typescript
 * import { fromAgentXState } from '@uix-ai/adapter-agentx'
 *
 * presentation.onUpdate((state) => {
 *   const conversations = fromAgentXState(state)
 *   // Render with assistant-ui, UIX agent components, or any UIX-compatible renderer
 * })
 * ```
 */
export function fromAgentXState(
  state: AgentXPresentationState,
  options: ConversionOptions = {}
): LucidConversation[] {
  const baseTimestamp = options.baseTimestamp ?? Date.now()
  const results: LucidConversation[] = []

  // Convert completed conversations
  for (let i = 0; i < state.conversations.length; i++) {
    results.push(
      convertConversation(state.conversations[i], {
        ...options,
        baseTimestamp: baseTimestamp + i,
      })
    )
  }

  // Convert streaming conversation (if active)
  if (state.streaming) {
    results.push(
      convertConversation(state.streaming, {
        ...options,
        baseTimestamp: baseTimestamp + state.conversations.length,
      })
    )
  }

  return results
}

/**
 * Convert an array of AgentX Conversations to UIX LucidConversations.
 *
 * Use this when you have raw conversations (e.g. from message history)
 * rather than the full PresentationState.
 *
 * @example
 * ```typescript
 * import { fromAgentXConversations } from '@uix-ai/adapter-agentx'
 *
 * const history = messagesToConversations(messages) // AgentX helper
 * const lucidConversations = fromAgentXConversations(history)
 * ```
 */
export function fromAgentXConversations(
  conversations: AgentXConversation[],
  options: ConversionOptions = {}
): LucidConversation[] {
  const baseTimestamp = options.baseTimestamp ?? Date.now()

  return conversations.map((conv, i) =>
    convertConversation(conv, {
      ...options,
      baseTimestamp: baseTimestamp + i,
    })
  )
}

// ============================================================================
// Reverse Conversion (UIX IR → AgentX)
// ============================================================================

/**
 * Convert UIX ToolStatus to AgentX tool status
 */
function convertToolStatusToAgentX(
  status: ToolStatus
): AgentXToolBlock['status'] {
  switch (status) {
    case 'pending':
    case 'streaming':
    case 'ready':
      return 'pending'
    case 'running':
    case 'approval-required':
    case 'approved':
      return 'running'
    case 'success':
      return 'completed'
    case 'error':
    case 'denied':
      return 'error'
  }
}

/**
 * Convert a UIX LucidBlock to an AgentX Block.
 *
 * Note: AgentX only supports text, tool, and image blocks.
 * Thinking, file, error, and source blocks are converted to text.
 */
export function convertBlockToAgentX(block: LucidBlock): AgentXBlock {
  switch (block.type) {
    case 'text': {
      const content = block.content as TextBlockContent
      return {
        type: 'text',
        content: content.text,
      }
    }

    case 'tool': {
      const content = block.content as ToolBlockContent
      return {
        type: 'tool',
        toolUseId: block.id,
        toolName: content.name,
        toolInput: (content.input as Record<string, unknown>) ?? {},
        toolResult:
          content.output != null ? String(content.output) : undefined,
        status: convertToolStatusToAgentX(content.status),
      }
    }

    case 'image': {
      const content = block.content as ImageBlockContent
      return {
        type: 'image',
        url: content.url,
        alt: content.alt,
      }
    }

    // Blocks not natively supported by AgentX → fallback to text
    case 'thinking': {
      const content = block.content as { reasoning: string }
      return {
        type: 'text',
        content: content.reasoning,
      }
    }

    case 'error': {
      const content = block.content as ErrorBlockContent
      return {
        type: 'text',
        content: `Error [${content.code}]: ${content.message}`,
      }
    }

    case 'file': {
      const content = block.content as { name: string; url: string }
      return {
        type: 'text',
        content: `[File: ${content.name}](${content.url})`,
      }
    }

    case 'source': {
      const content = block.content as { title: string; url?: string }
      return {
        type: 'text',
        content: content.url
          ? `[${content.title}](${content.url})`
          : content.title,
      }
    }

    default:
      return {
        type: 'text',
        content: '',
      }
  }
}

/**
 * Convert a UIX LucidConversation to an AgentX Conversation.
 */
export function toAgentXConversation(
  conversation: LucidConversation
): AgentXConversation {
  const blocks: AgentXBlock[] = conversation.blocks.map(convertBlockToAgentX)

  if (conversation.role === 'user') {
    return {
      role: 'user',
      blocks,
    }
  }

  // Check if this is an error-only conversation
  const hasOnlyErrors = conversation.blocks.every(
    (b) => b.type === 'error'
  )
  if (hasOnlyErrors && conversation.blocks.length > 0) {
    const content = conversation.blocks[0].content as ErrorBlockContent
    return {
      role: 'error',
      message: content.message,
    }
  }

  return {
    role: 'assistant',
    blocks,
    isStreaming: conversation.status === 'streaming',
  }
}

/**
 * Convert UIX LucidConversations to AgentX Conversations.
 *
 * @example
 * ```typescript
 * import { toAgentXConversations } from '@uix-ai/adapter-agentx'
 *
 * const agentXConversations = toAgentXConversations(lucidConversations)
 * ```
 */
export function toAgentXConversations(
  conversations: LucidConversation[]
): AgentXConversation[] {
  return conversations.map(toAgentXConversation)
}
