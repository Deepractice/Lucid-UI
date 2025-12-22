/**
 * @uix/adapter-vercel
 *
 * Adapter to convert Vercel AI SDK messages to UIX Lucid IR format.
 *
 * This package provides utilities to seamlessly integrate Vercel AI SDK
 * with UIX rendering components.
 *
 * @example
 * ```typescript
 * import { useChat } from '@ai-sdk/react'
 * import { fromVercelMessages } from '@uix/adapter-vercel'
 * import { MessageList } from '@uix/agent'
 *
 * function Chat() {
 *   const { messages } = useChat()
 *   const conversations = fromVercelMessages(messages)
 *
 *   return <MessageList conversations={conversations} />
 * }
 * ```
 */

import type {
  LucidConversation,
  LucidBlock,
  ContentStatus,
  ToolStatus,
  TextBlockContent,
  ToolBlockContent,
  ThinkingBlockContent,
  FileBlockContent,
  SourceBlockContent,
  ToolApproval,
} from '@uix/core'

// ============================================================================
// Vercel AI SDK Types (simplified for adapter use)
// ============================================================================

/**
 * Vercel AI SDK message part types we support
 */
export interface VercelTextPart {
  type: 'text'
  text: string
  state?: 'streaming' | 'done'
}

export interface VercelReasoningPart {
  type: 'reasoning'
  text: string
  state?: 'streaming' | 'done'
}

export interface VercelFilePart {
  type: 'file'
  mediaType: string
  filename?: string
  url: string
}

export interface VercelSourceUrlPart {
  type: 'source-url'
  sourceId: string
  url: string
  title?: string
}

export interface VercelSourceDocumentPart {
  type: 'source-document'
  sourceId: string
  mediaType: string
  title: string
  filename?: string
}

export interface VercelToolPart {
  type: `tool-${string}` | 'dynamic-tool'
  toolName?: string
  toolCallId: string
  state:
    | 'input-streaming'
    | 'input-available'
    | 'approval-requested'
    | 'approval-responded'
    | 'output-available'
    | 'output-error'
    | 'output-denied'
  input?: unknown
  output?: unknown
  errorText?: string
  approval?: {
    id: string
    approved?: boolean
    reason?: string
  }
}

export type VercelMessagePart =
  | VercelTextPart
  | VercelReasoningPart
  | VercelFilePart
  | VercelSourceUrlPart
  | VercelSourceDocumentPart
  | VercelToolPart
  | { type: string; [key: string]: unknown }

export interface VercelUIMessage {
  id: string
  role: 'system' | 'user' | 'assistant'
  metadata?: unknown
  parts: VercelMessagePart[]
}

// ============================================================================
// Conversion Options
// ============================================================================

export interface ConversionOptions {
  /**
   * Custom ID generator for blocks
   * @default () => crypto.randomUUID()
   */
  generateBlockId?: () => string

  /**
   * Whether to include metadata in converted messages
   * @default false
   */
  includeMetadata?: boolean

  /**
   * Filter function to exclude certain parts
   */
  filterPart?: (part: VercelMessagePart) => boolean
}

// ============================================================================
// Conversion Functions
// ============================================================================

let blockIdCounter = 0

function defaultGenerateBlockId(): string {
  return `block-${Date.now()}-${++blockIdCounter}`
}

/**
 * Convert Vercel tool state to UIX ToolStatus
 */
function convertToolState(state: VercelToolPart['state']): ToolStatus {
  switch (state) {
    case 'input-streaming':
      return 'streaming'
    case 'input-available':
      return 'ready'
    case 'approval-requested':
      return 'approval-required'
    case 'approval-responded':
      return 'approved'
    case 'output-available':
      return 'success'
    case 'output-error':
      return 'error'
    case 'output-denied':
      return 'denied'
    default:
      return 'pending'
  }
}

/**
 * Extract tool name from Vercel tool part
 */
function extractToolName(part: VercelToolPart): string {
  if (part.type === 'dynamic-tool') {
    return part.toolName ?? 'unknown'
  }
  // Extract name from "tool-{name}" format
  return part.type.replace(/^tool-/, '')
}

/**
 * Infer block status from part state
 */
function inferBlockStatus(part: VercelMessagePart): ContentStatus {
  if ('state' in part) {
    if (part.state === 'streaming' || part.state === 'input-streaming') {
      return 'streaming'
    }
    if (part.state === 'output-error') {
      return 'error'
    }
  }
  return 'completed'
}

/**
 * Convert a single Vercel message part to a UIX block
 */
export function convertPartToBlock(
  part: VercelMessagePart,
  options: ConversionOptions = {}
): LucidBlock | null {
  const generateId = options.generateBlockId ?? defaultGenerateBlockId

  // Text part
  if (part.type === 'text') {
    const textPart = part as VercelTextPart
    return {
      id: generateId(),
      type: 'text',
      status: textPart.state === 'streaming' ? 'streaming' : 'completed',
      content: {
        text: textPart.text,
      } as TextBlockContent,
    }
  }

  // Reasoning part -> Thinking block
  if (part.type === 'reasoning') {
    const reasoningPart = part as VercelReasoningPart
    return {
      id: generateId(),
      type: 'thinking',
      status: reasoningPart.state === 'streaming' ? 'streaming' : 'completed',
      content: {
        reasoning: reasoningPart.text,
      } as ThinkingBlockContent,
    }
  }

  // File part
  if (part.type === 'file') {
    const filePart = part as VercelFilePart
    return {
      id: generateId(),
      type: 'file',
      status: 'completed',
      content: {
        name: filePart.filename ?? 'file',
        type: filePart.mediaType,
        url: filePart.url,
      } as FileBlockContent,
    }
  }

  // Source URL part
  if (part.type === 'source-url') {
    const sourcePart = part as VercelSourceUrlPart
    return {
      id: generateId(),
      type: 'source',
      status: 'completed',
      content: {
        sourceId: sourcePart.sourceId,
        sourceType: 'url',
        title: sourcePart.title ?? sourcePart.url,
        url: sourcePart.url,
      } as SourceBlockContent,
    }
  }

  // Source Document part
  if (part.type === 'source-document') {
    const sourcePart = part as VercelSourceDocumentPart
    return {
      id: generateId(),
      type: 'source',
      status: 'completed',
      content: {
        sourceId: sourcePart.sourceId,
        sourceType: 'document',
        title: sourcePart.title,
        mediaType: sourcePart.mediaType,
        filename: sourcePart.filename,
      } as SourceBlockContent,
    }
  }

  // Tool parts (tool-* or dynamic-tool)
  if (part.type.startsWith('tool-') || part.type === 'dynamic-tool') {
    const toolPart = part as VercelToolPart
    const toolStatus = convertToolState(toolPart.state)

    let approval: ToolApproval | undefined
    if (toolPart.approval) {
      approval = {
        id: toolPart.approval.id,
        approved: toolPart.approval.approved,
        reason: toolPart.approval.reason,
      }
    }

    return {
      id: generateId(),
      type: 'tool',
      status: inferBlockStatus(part),
      content: {
        name: extractToolName(toolPart),
        input: toolPart.input ?? {},
        output: toolPart.output,
        status: toolStatus,
        error: toolPart.errorText,
        approval,
      } as ToolBlockContent,
    }
  }

  // Unknown part types are skipped
  return null
}

/**
 * Convert a Vercel UI message to a UIX LucidConversation
 */
export function fromVercelMessage(
  message: VercelUIMessage,
  options: ConversionOptions = {}
): LucidConversation {
  const filterPart = options.filterPart ?? (() => true)

  const blocks: LucidBlock[] = []

  for (const part of message.parts) {
    if (!filterPart(part)) continue

    const block = convertPartToBlock(part, options)
    if (block) {
      blocks.push(block)
    }
  }

  // Infer conversation status from blocks
  let status: ContentStatus = 'completed'
  for (const block of blocks) {
    if (block.status === 'streaming') {
      status = 'streaming'
      break
    }
    if (block.status === 'error') {
      status = 'error'
      // Don't break, streaming takes priority
    }
  }

  return {
    id: message.id,
    role: message.role,
    status,
    blocks,
    timestamp: Date.now(),
  }
}

/**
 * Convert an array of Vercel UI messages to UIX LucidConversations
 *
 * @example
 * ```typescript
 * import { useChat } from '@ai-sdk/react'
 * import { fromVercelMessages } from '@uix/adapter-vercel'
 *
 * function Chat() {
 *   const { messages } = useChat()
 *   const conversations = fromVercelMessages(messages)
 *   // Use conversations with UIX components
 * }
 * ```
 */
export function fromVercelMessages(
  messages: VercelUIMessage[],
  options: ConversionOptions = {}
): LucidConversation[] {
  return messages.map((msg) => fromVercelMessage(msg, options))
}

// ============================================================================
// Reverse Conversion (UIX -> Vercel)
// ============================================================================

/**
 * Convert a UIX LucidBlock to Vercel message parts
 */
export function convertBlockToParts(block: LucidBlock): VercelMessagePart[] {
  switch (block.type) {
    case 'text': {
      const content = block.content as TextBlockContent
      return [
        {
          type: 'text',
          text: content.text,
          state: block.status === 'streaming' ? 'streaming' : 'done',
        } as VercelTextPart,
      ]
    }

    case 'thinking': {
      const content = block.content as ThinkingBlockContent
      return [
        {
          type: 'reasoning',
          text: content.reasoning,
          state: block.status === 'streaming' ? 'streaming' : 'done',
        } as VercelReasoningPart,
      ]
    }

    case 'file': {
      const content = block.content as FileBlockContent
      return [
        {
          type: 'file',
          mediaType: content.type,
          filename: content.name,
          url: content.url,
        } as VercelFilePart,
      ]
    }

    case 'source': {
      const content = block.content as SourceBlockContent
      if (content.sourceType === 'url') {
        return [
          {
            type: 'source-url',
            sourceId: content.sourceId,
            url: content.url ?? '',
            title: content.title,
          } as VercelSourceUrlPart,
        ]
      } else {
        return [
          {
            type: 'source-document',
            sourceId: content.sourceId,
            mediaType: content.mediaType ?? '',
            title: content.title,
            filename: content.filename,
          } as VercelSourceDocumentPart,
        ]
      }
    }

    case 'tool': {
      const content = block.content as ToolBlockContent
      const state = convertToolStatusToVercel(content.status)

      return [
        {
          type: 'dynamic-tool',
          toolName: content.name,
          toolCallId: block.id,
          state,
          input: content.input,
          output: content.output,
          errorText: content.error,
          approval: content.approval
            ? {
                id: content.approval.id,
                approved: content.approval.approved,
                reason: content.approval.reason,
              }
            : undefined,
        } as VercelToolPart,
      ]
    }

    default:
      return []
  }
}

/**
 * Convert UIX ToolStatus to Vercel tool state
 */
function convertToolStatusToVercel(status: ToolStatus): VercelToolPart['state'] {
  switch (status) {
    case 'pending':
    case 'streaming':
      return 'input-streaming'
    case 'ready':
      return 'input-available'
    case 'approval-required':
      return 'approval-requested'
    case 'approved':
    case 'running':
      return 'approval-responded'
    case 'success':
      return 'output-available'
    case 'error':
      return 'output-error'
    case 'denied':
      return 'output-denied'
    default:
      return 'input-streaming'
  }
}

/**
 * Convert a UIX LucidConversation to a Vercel UI message
 */
export function toVercelMessage(conversation: LucidConversation): VercelUIMessage {
  const parts: VercelMessagePart[] = []

  for (const block of conversation.blocks) {
    parts.push(...convertBlockToParts(block))
  }

  return {
    id: conversation.id,
    role: conversation.role,
    parts,
  }
}

/**
 * Convert UIX LucidConversations to Vercel UI messages
 */
export function toVercelMessages(
  conversations: LucidConversation[]
): VercelUIMessage[] {
  return conversations.map(toVercelMessage)
}
