/**
 * @lucidui/ir
 *
 * Lucid IR (Intermediate Representation) - The core protocol for AI-to-UI generation.
 *
 * This package defines the JSON Schema that AI generates, which renderers then
 * convert to actual UI. The consumer is AI, not developers.
 *
 * ## Core Concept
 *
 * ```
 * AI Agent Events → Lucid IR (this package) → Renderers → UI
 * ```
 *
 * ## Main Types
 *
 * - `LucidConversation`: A conversation message container
 * - `LucidBlock`: Content blocks within a conversation (text, tool, thinking, etc.)
 * - `LucidRenderer`: Interface for implementing renderers
 *
 * @example
 * ```typescript
 * import type { LucidConversation, LucidBlock } from '@lucidui/ir'
 *
 * const conversation: LucidConversation = {
 *   id: 'conv-1',
 *   role: 'assistant',
 *   status: 'streaming',
 *   blocks: [
 *     { id: 'b1', type: 'text', status: 'streaming', content: { text: 'Hello...' } }
 *   ],
 *   timestamp: Date.now()
 * }
 * ```
 *
 * @see {@link https://github.com/Deepractice/Lucid-UI} for full documentation
 */

// ============================================================================
// Core Types
// ============================================================================

/**
 * Conversation roles
 */
export type ConversationRole = 'user' | 'assistant' | 'system'

/**
 * Status for conversations and blocks
 */
export type ContentStatus = 'streaming' | 'completed' | 'error'

/**
 * Block types supported by Lucid IR
 */
export type BlockType = 'text' | 'tool' | 'thinking' | 'image' | 'file' | 'error'

// ============================================================================
// Block Content Types
// ============================================================================

/**
 * Content for text blocks
 */
export interface TextBlockContent {
  text: string
}

/**
 * Status for tool execution
 */
export type ToolStatus = 'pending' | 'running' | 'success' | 'error'

/**
 * Content for tool/function call blocks
 */
export interface ToolBlockContent {
  /** Tool/function name */
  name: string
  /** Input parameters */
  input: unknown
  /** Output result (when completed) */
  output?: unknown
  /** Execution status */
  status: ToolStatus
  /** Error message (when status is 'error') */
  error?: string
}

/**
 * Content for thinking/reasoning blocks
 */
export interface ThinkingBlockContent {
  reasoning: string
}

/**
 * Content for image blocks
 */
export interface ImageBlockContent {
  url: string
  alt?: string
  width?: number
  height?: number
}

/**
 * Content for file attachment blocks
 */
export interface FileBlockContent {
  name: string
  /** MIME type */
  type: string
  url: string
  size?: number
}

/**
 * Content for error blocks
 */
export interface ErrorBlockContent {
  code: string
  message: string
  details?: unknown
}

/**
 * Union type for all block content types
 */
export type BlockContent =
  | TextBlockContent
  | ToolBlockContent
  | ThinkingBlockContent
  | ImageBlockContent
  | FileBlockContent
  | ErrorBlockContent

// ============================================================================
// Main Types
// ============================================================================

/**
 * A content block within a conversation.
 *
 * Blocks represent different types of content that can appear in a message:
 * - `text`: Markdown text content
 * - `tool`: Tool/function call and result
 * - `thinking`: AI reasoning process
 * - `image`: Image content
 * - `file`: File attachment
 * - `error`: Error message
 *
 * @example
 * ```typescript
 * const textBlock: LucidBlock = {
 *   id: 'block-1',
 *   type: 'text',
 *   status: 'streaming',
 *   content: { text: 'Hello, I am thinking...' }
 * }
 *
 * const toolBlock: LucidBlock = {
 *   id: 'block-2',
 *   type: 'tool',
 *   status: 'completed',
 *   content: {
 *     name: 'search',
 *     input: { query: 'weather' },
 *     output: { results: [...] },
 *     status: 'success'
 *   }
 * }
 * ```
 */
export interface LucidBlock<T extends BlockType = BlockType> {
  /** Unique identifier for the block */
  id: string
  /** Block type */
  type: T
  /** Current status (streaming, completed, error) */
  status: ContentStatus
  /** Block content (varies by type) */
  content: T extends 'text'
    ? TextBlockContent
    : T extends 'tool'
      ? ToolBlockContent
      : T extends 'thinking'
        ? ThinkingBlockContent
        : T extends 'image'
          ? ImageBlockContent
          : T extends 'file'
            ? FileBlockContent
            : T extends 'error'
              ? ErrorBlockContent
              : BlockContent
}

/**
 * A conversation message containing blocks.
 *
 * Represents a single message in the conversation, which can contain
 * multiple blocks of different types. This allows for rich content
 * like text mixed with tool calls.
 *
 * @example
 * ```typescript
 * const conversation: LucidConversation = {
 *   id: 'conv-1',
 *   role: 'assistant',
 *   status: 'completed',
 *   blocks: [
 *     { id: 'b1', type: 'thinking', status: 'completed', content: { reasoning: 'Let me search...' } },
 *     { id: 'b2', type: 'tool', status: 'completed', content: { name: 'search', ... } },
 *     { id: 'b3', type: 'text', status: 'completed', content: { text: 'Based on my search...' } }
 *   ],
 *   timestamp: 1703145600000
 * }
 * ```
 */
export interface LucidConversation {
  /** Unique identifier for the conversation */
  id: string
  /** Role of the message sender */
  role: ConversationRole
  /** Current status of the conversation */
  status: ContentStatus
  /** Content blocks */
  blocks: LucidBlock[]
  /** Unix timestamp in milliseconds */
  timestamp: number
}

// ============================================================================
// Renderer Interface
// ============================================================================

/**
 * Interface for implementing Lucid IR renderers.
 *
 * Renderers convert Lucid IR to actual UI. The default renderer is React,
 * but this interface allows for other implementations (A2UI, MCP Apps, etc.)
 *
 * @typeParam T - The output type of the renderer (e.g., React.ReactNode)
 *
 * @example
 * ```typescript
 * import type { LucidRenderer, LucidConversation } from '@lucidui/ir'
 *
 * class ReactRenderer implements LucidRenderer<React.ReactNode> {
 *   render(conversations: LucidConversation[]): React.ReactNode {
 *     return conversations.map(conv => <ConversationComponent key={conv.id} {...conv} />)
 *   }
 *
 *   renderBlock(block: LucidBlock): React.ReactNode {
 *     switch (block.type) {
 *       case 'text': return <TextBlock {...block} />
 *       case 'tool': return <ToolBlock {...block} />
 *       // ...
 *     }
 *   }
 * }
 * ```
 */
export interface LucidRenderer<T> {
  /** Render a list of conversations */
  render(conversations: LucidConversation[]): T
  /** Render a single block (optional, for granular control) */
  renderBlock?(block: LucidBlock): T
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if a block is a text block
 */
export function isTextBlock(block: LucidBlock): block is LucidBlock<'text'> {
  return block.type === 'text'
}

/**
 * Type guard to check if a block is a tool block
 */
export function isToolBlock(block: LucidBlock): block is LucidBlock<'tool'> {
  return block.type === 'tool'
}

/**
 * Type guard to check if a block is a thinking block
 */
export function isThinkingBlock(block: LucidBlock): block is LucidBlock<'thinking'> {
  return block.type === 'thinking'
}

/**
 * Type guard to check if a block is an image block
 */
export function isImageBlock(block: LucidBlock): block is LucidBlock<'image'> {
  return block.type === 'image'
}

/**
 * Type guard to check if a block is a file block
 */
export function isFileBlock(block: LucidBlock): block is LucidBlock<'file'> {
  return block.type === 'file'
}

/**
 * Type guard to check if a block is an error block
 */
export function isErrorBlock(block: LucidBlock): block is LucidBlock<'error'> {
  return block.type === 'error'
}

/**
 * Type guard to check if content is streaming
 */
export function isStreaming(item: { status: ContentStatus }): boolean {
  return item.status === 'streaming'
}

/**
 * Type guard to check if content has completed
 */
export function isCompleted(item: { status: ContentStatus }): boolean {
  return item.status === 'completed'
}

/**
 * Type guard to check if content has errored
 */
export function isError(item: { status: ContentStatus }): boolean {
  return item.status === 'error'
}
