/**
 * @uix/adapter-agui
 *
 * Adapter to convert AG-UI protocol events to UIX Lucid IR format.
 *
 * AG-UI (Agent-User Interaction Protocol) is an open, event-based protocol
 * that standardizes how AI agent backends connect to frontend applications.
 *
 * This adapter converts AG-UI's streaming events into UIX LucidConversation
 * and LucidBlock structures for rendering with UIX components.
 *
 * @see https://docs.ag-ui.com
 *
 * @example
 * ```typescript
 * import { AGUIEventProcessor } from '@uix/adapter-agui'
 * import { MessageList } from '@uix/agent'
 *
 * function Chat() {
 *   const processor = new AGUIEventProcessor()
 *   // Feed AG-UI events from your agent backend
 *   processor.processEvent(event)
 *   const conversations = processor.getConversations()
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
} from '@uix/core'

// ============================================================================
// AG-UI Protocol Event Types
// ============================================================================

/**
 * AG-UI base event interface
 */
export interface AGUIBaseEvent {
  type: string
  timestamp?: number
  rawEvent?: unknown
}

// -- Lifecycle Events --

export interface AGUIRunStartedEvent extends AGUIBaseEvent {
  type: 'RunStarted'
  threadId: string
  runId: string
  parentRunId?: string
  input?: unknown
}

export interface AGUIRunFinishedEvent extends AGUIBaseEvent {
  type: 'RunFinished'
  threadId: string
  runId: string
  result?: unknown
  outcome?: 'success' | 'interrupt'
  interrupt?: unknown
}

export interface AGUIRunErrorEvent extends AGUIBaseEvent {
  type: 'RunError'
  message: string
  code?: string
}

export interface AGUIStepStartedEvent extends AGUIBaseEvent {
  type: 'StepStarted'
  stepName: string
}

export interface AGUIStepFinishedEvent extends AGUIBaseEvent {
  type: 'StepFinished'
  stepName: string
}

// -- Text Message Events --

export interface AGUITextMessageStartEvent extends AGUIBaseEvent {
  type: 'TextMessageStart'
  messageId: string
  role: 'developer' | 'system' | 'assistant' | 'user' | 'tool'
}

export interface AGUITextMessageContentEvent extends AGUIBaseEvent {
  type: 'TextMessageContent'
  messageId: string
  delta: string
}

export interface AGUITextMessageEndEvent extends AGUIBaseEvent {
  type: 'TextMessageEnd'
  messageId: string
}

// -- Tool Call Events --

export interface AGUIToolCallStartEvent extends AGUIBaseEvent {
  type: 'ToolCallStart'
  toolCallId: string
  toolCallName: string
  parentMessageId?: string
}

export interface AGUIToolCallArgsEvent extends AGUIBaseEvent {
  type: 'ToolCallArgs'
  toolCallId: string
  delta: string
}

export interface AGUIToolCallEndEvent extends AGUIBaseEvent {
  type: 'ToolCallEnd'
  toolCallId: string
}

export interface AGUIToolCallResultEvent extends AGUIBaseEvent {
  type: 'ToolCallResult'
  messageId: string
  toolCallId: string
  content: unknown
  role?: 'tool'
}

// -- State Events --

export interface AGUIStateSnapshotEvent extends AGUIBaseEvent {
  type: 'StateSnapshot'
  snapshot: Record<string, unknown>
}

export interface AGUIStateDeltaEvent extends AGUIBaseEvent {
  type: 'StateDelta'
  delta: Array<{
    op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test'
    path: string
    value?: unknown
    from?: string
  }>
}

export interface AGUIMessagesSnapshotEvent extends AGUIBaseEvent {
  type: 'MessagesSnapshot'
  messages: unknown[]
}

// -- Reasoning Events --

export interface AGUIReasoningMessageStartEvent extends AGUIBaseEvent {
  type: 'ReasoningMessageStart'
  messageId: string
  role: 'assistant'
}

export interface AGUIReasoningMessageContentEvent extends AGUIBaseEvent {
  type: 'ReasoningMessageContent'
  messageId: string
  delta: string
}

export interface AGUIReasoningMessageEndEvent extends AGUIBaseEvent {
  type: 'ReasoningMessageEnd'
  messageId: string
}

/**
 * Union of all supported AG-UI event types
 */
export type AGUIEvent =
  | AGUIRunStartedEvent
  | AGUIRunFinishedEvent
  | AGUIRunErrorEvent
  | AGUIStepStartedEvent
  | AGUIStepFinishedEvent
  | AGUITextMessageStartEvent
  | AGUITextMessageContentEvent
  | AGUITextMessageEndEvent
  | AGUIToolCallStartEvent
  | AGUIToolCallArgsEvent
  | AGUIToolCallEndEvent
  | AGUIToolCallResultEvent
  | AGUIStateSnapshotEvent
  | AGUIStateDeltaEvent
  | AGUIMessagesSnapshotEvent
  | AGUIReasoningMessageStartEvent
  | AGUIReasoningMessageContentEvent
  | AGUIReasoningMessageEndEvent
  | AGUIBaseEvent

// ============================================================================
// Processor Options
// ============================================================================

export interface AGUIProcessorOptions {
  /**
   * Custom ID generator for blocks
   * @default () => `block-${Date.now()}-${counter}`
   */
  generateBlockId?: () => string

  /**
   * Callback when conversations are updated
   */
  onUpdate?: (conversations: LucidConversation[]) => void
}

// ============================================================================
// Internal State Types
// ============================================================================

interface MessageState {
  conversationId: string
  role: 'user' | 'assistant' | 'system'
  textBlockId: string | null
  textContent: string
  thinkingBlockId: string | null
  thinkingContent: string
  toolBlocks: Map<string, { blockId: string; name: string; argsJson: string }>
  status: ContentStatus
  timestamp: number
}

// ============================================================================
// AG-UI Event Processor
// ============================================================================

let blockIdCounter = 0

function defaultGenerateBlockId(): string {
  return `agui-block-${Date.now()}-${++blockIdCounter}`
}

/**
 * Map AG-UI role to UIX ConversationRole
 */
function mapRole(role: string): 'user' | 'assistant' | 'system' {
  switch (role) {
    case 'user':
      return 'user'
    case 'system':
    case 'developer':
      return 'system'
    case 'assistant':
    case 'tool':
    default:
      return 'assistant'
  }
}

/**
 * Stateful processor that converts AG-UI streaming events to UIX LucidConversations.
 *
 * AG-UI uses a streaming event model (start → content/delta → end) while UIX
 * uses a snapshot model (LucidConversation[]). This processor accumulates
 * events and maintains the current conversation state.
 *
 * @example
 * ```typescript
 * const processor = new AGUIEventProcessor({
 *   onUpdate: (conversations) => setConversations(conversations)
 * })
 *
 * // Connect to AG-UI event source
 * eventSource.onmessage = (event) => {
 *   processor.processEvent(JSON.parse(event.data))
 * }
 * ```
 */
export class AGUIEventProcessor {
  private messages: Map<string, MessageState> = new Map()
  private messageOrder: string[] = []
  private generateId: () => string
  private onUpdate?: (conversations: LucidConversation[]) => void
  private currentRunId: string | null = null

  constructor(options: AGUIProcessorOptions = {}) {
    this.generateId = options.generateBlockId ?? defaultGenerateBlockId
    this.onUpdate = options.onUpdate
  }

  /**
   * Process a single AG-UI event and update internal state
   */
  processEvent(event: AGUIEvent): void {
    switch (event.type) {
      case 'RunStarted':
        this.handleRunStarted(event as AGUIRunStartedEvent)
        break
      case 'RunFinished':
        this.handleRunFinished(event as AGUIRunFinishedEvent)
        break
      case 'RunError':
        this.handleRunError(event as AGUIRunErrorEvent)
        break
      case 'TextMessageStart':
        this.handleTextMessageStart(event as AGUITextMessageStartEvent)
        break
      case 'TextMessageContent':
        this.handleTextMessageContent(event as AGUITextMessageContentEvent)
        break
      case 'TextMessageEnd':
        this.handleTextMessageEnd(event as AGUITextMessageEndEvent)
        break
      case 'ToolCallStart':
        this.handleToolCallStart(event as AGUIToolCallStartEvent)
        break
      case 'ToolCallArgs':
        this.handleToolCallArgs(event as AGUIToolCallArgsEvent)
        break
      case 'ToolCallEnd':
        this.handleToolCallEnd(event as AGUIToolCallEndEvent)
        break
      case 'ToolCallResult':
        this.handleToolCallResult(event as AGUIToolCallResultEvent)
        break
      case 'ReasoningMessageStart':
        this.handleReasoningStart(event as AGUIReasoningMessageStartEvent)
        break
      case 'ReasoningMessageContent':
        this.handleReasoningContent(event as AGUIReasoningMessageContentEvent)
        break
      case 'ReasoningMessageEnd':
        this.handleReasoningEnd(event as AGUIReasoningMessageEndEvent)
        break
      default:
        // Unknown events are silently ignored
        break
    }

    this.onUpdate?.(this.getConversations())
  }

  /**
   * Process multiple AG-UI events in order
   */
  processEvents(events: AGUIEvent[]): void {
    for (const event of events) {
      this.processEvent(event)
    }
  }

  /**
   * Get the current state as UIX LucidConversations
   */
  getConversations(): LucidConversation[] {
    return this.messageOrder.map((msgId) => {
      const state = this.messages.get(msgId)!
      return this.buildConversation(state)
    })
  }

  /**
   * Reset all state
   */
  reset(): void {
    this.messages.clear()
    this.messageOrder = []
    this.currentRunId = null
  }

  // -- Lifecycle Handlers --

  private handleRunStarted(event: AGUIRunStartedEvent): void {
    this.currentRunId = event.runId
  }

  private handleRunFinished(_event: AGUIRunFinishedEvent): void {
    // Mark all streaming messages as completed
    for (const state of this.messages.values()) {
      if (state.status === 'streaming') {
        state.status = 'completed'
      }
    }
    this.currentRunId = null
  }

  private handleRunError(event: AGUIRunErrorEvent): void {
    // Find the last assistant message or create an error conversation
    const lastAssistant = this.findLastAssistantMessage()
    if (lastAssistant) {
      lastAssistant.status = 'error'
    }
  }

  // -- Text Message Handlers --

  private handleTextMessageStart(event: AGUITextMessageStartEvent): void {
    const blockId = this.generateId()
    const state: MessageState = {
      conversationId: event.messageId,
      role: mapRole(event.role),
      textBlockId: blockId,
      textContent: '',
      thinkingBlockId: null,
      thinkingContent: '',
      toolBlocks: new Map(),
      status: 'streaming',
      timestamp: event.timestamp ?? Date.now(),
    }
    this.messages.set(event.messageId, state)
    this.messageOrder.push(event.messageId)
  }

  private handleTextMessageContent(event: AGUITextMessageContentEvent): void {
    const state = this.messages.get(event.messageId)
    if (!state) return
    state.textContent += event.delta
  }

  private handleTextMessageEnd(event: AGUITextMessageEndEvent): void {
    const state = this.messages.get(event.messageId)
    if (!state) return
    state.status = 'completed'
  }

  // -- Tool Call Handlers --

  private handleToolCallStart(event: AGUIToolCallStartEvent): void {
    // Attach tool to parent message or last assistant message
    const parentId = event.parentMessageId ?? this.findLastAssistantMessageId()
    if (!parentId) return

    const state = this.messages.get(parentId)
    if (!state) return

    state.toolBlocks.set(event.toolCallId, {
      blockId: this.generateId(),
      name: event.toolCallName,
      argsJson: '',
    })
  }

  private handleToolCallArgs(event: AGUIToolCallArgsEvent): void {
    const tool = this.findToolBlock(event.toolCallId)
    if (!tool) return
    tool.argsJson += event.delta
  }

  private handleToolCallEnd(event: AGUIToolCallEndEvent): void {
    // Tool input is complete, waiting for result
    // No state change needed - tool status will update on result
  }

  private handleToolCallResult(event: AGUIToolCallResultEvent): void {
    const tool = this.findToolBlock(event.toolCallId)
    if (!tool) return
    // Tool result is stored in the block content output
    ;(tool as any).output = event.content
    ;(tool as any).hasResult = true
  }

  // -- Reasoning Handlers --

  private handleReasoningStart(event: AGUIReasoningMessageStartEvent): void {
    const state = this.messages.get(event.messageId)
    if (!state) return
    state.thinkingBlockId = this.generateId()
    state.thinkingContent = ''
  }

  private handleReasoningContent(event: AGUIReasoningMessageContentEvent): void {
    const state = this.messages.get(event.messageId)
    if (!state) return
    state.thinkingContent += event.delta
  }

  private handleReasoningEnd(event: AGUIReasoningMessageEndEvent): void {
    // Reasoning block is now complete, no explicit status change needed
    // as the block status is derived from conversation status
  }

  // -- Helpers --

  private findLastAssistantMessageId(): string | undefined {
    for (let i = this.messageOrder.length - 1; i >= 0; i--) {
      const id = this.messageOrder[i]
      const state = this.messages.get(id)
      if (state?.role === 'assistant') return id
    }
    return undefined
  }

  private findLastAssistantMessage(): MessageState | undefined {
    const id = this.findLastAssistantMessageId()
    return id ? this.messages.get(id) : undefined
  }

  private findToolBlock(
    toolCallId: string
  ): { blockId: string; name: string; argsJson: string; output?: unknown; hasResult?: boolean } | undefined {
    for (const state of this.messages.values()) {
      const tool = state.toolBlocks.get(toolCallId)
      if (tool) return tool as any
    }
    return undefined
  }

  private buildConversation(state: MessageState): LucidConversation {
    const blocks: LucidBlock[] = []

    // Add thinking block first (if present)
    if (state.thinkingBlockId && state.thinkingContent) {
      blocks.push({
        id: state.thinkingBlockId,
        type: 'thinking',
        status: state.status === 'streaming' ? 'streaming' : 'completed',
        content: {
          reasoning: state.thinkingContent,
        } as ThinkingBlockContent,
      })
    }

    // Add text block
    if (state.textBlockId && state.textContent) {
      blocks.push({
        id: state.textBlockId,
        type: 'text',
        status: state.status === 'streaming' ? 'streaming' : 'completed',
        content: {
          text: state.textContent,
        } as TextBlockContent,
      })
    }

    // Add tool blocks
    for (const [_toolCallId, tool] of state.toolBlocks) {
      let input: unknown = {}
      try {
        input = tool.argsJson ? JSON.parse(tool.argsJson) : {}
      } catch {
        input = tool.argsJson
      }

      const hasResult = (tool as any).hasResult === true
      const toolStatus: ToolStatus = hasResult ? 'success' : 'running'

      blocks.push({
        id: tool.blockId,
        type: 'tool',
        status: hasResult ? 'completed' : 'streaming',
        content: {
          name: tool.name,
          input,
          output: (tool as any).output,
          status: toolStatus,
        } as ToolBlockContent,
      })
    }

    return {
      id: state.conversationId,
      role: state.role,
      status: state.status,
      blocks,
      timestamp: state.timestamp,
    }
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Convert a batch of AG-UI events to UIX LucidConversations (stateless)
 *
 * For streaming use cases, prefer AGUIEventProcessor which maintains state.
 *
 * @example
 * ```typescript
 * const conversations = fromAGUIEvents(events)
 * ```
 */
export function fromAGUIEvents(
  events: AGUIEvent[],
  options: AGUIProcessorOptions = {}
): LucidConversation[] {
  const processor = new AGUIEventProcessor(options)
  processor.processEvents(events)
  return processor.getConversations()
}
