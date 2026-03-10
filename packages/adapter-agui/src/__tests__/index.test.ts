import { describe, it, expect, beforeEach } from 'vitest'
import {
  AGUIEventProcessor,
  fromAGUIEvents,
  type AGUIEvent,
  type AGUIRunStartedEvent,
  type AGUIRunFinishedEvent,
  type AGUIRunErrorEvent,
  type AGUITextMessageStartEvent,
  type AGUITextMessageContentEvent,
  type AGUITextMessageEndEvent,
  type AGUIToolCallStartEvent,
  type AGUIToolCallArgsEvent,
  type AGUIToolCallEndEvent,
  type AGUIToolCallResultEvent,
  type AGUIReasoningMessageStartEvent,
  type AGUIReasoningMessageContentEvent,
  type AGUIReasoningMessageEndEvent,
} from '../index'
import type { TextBlockContent, ToolBlockContent, ThinkingBlockContent } from '@uix-ai/core'

// Deterministic IDs for testing
let idCounter = 0
const testGenerateId = () => `test-${++idCounter}`

function createProcessor() {
  idCounter = 0
  return new AGUIEventProcessor({ generateBlockId: testGenerateId })
}

// ============================================================================
// AGUIEventProcessor - Text Messages
// ============================================================================

describe('AGUIEventProcessor', () => {
  describe('text message lifecycle', () => {
    it('processes TextMessageStart/Content/End to create a conversation with a text block', () => {
      const processor = createProcessor()

      processor.processEvent({
        type: 'TextMessageStart',
        messageId: 'msg-1',
        role: 'assistant',
      } as AGUITextMessageStartEvent)

      processor.processEvent({
        type: 'TextMessageContent',
        messageId: 'msg-1',
        delta: 'Hello ',
      } as AGUITextMessageContentEvent)

      processor.processEvent({
        type: 'TextMessageContent',
        messageId: 'msg-1',
        delta: 'world!',
      } as AGUITextMessageContentEvent)

      // Before end, status should be streaming
      let conversations = processor.getConversations()
      expect(conversations).toHaveLength(1)
      expect(conversations[0].id).toBe('msg-1')
      expect(conversations[0].role).toBe('assistant')
      expect(conversations[0].status).toBe('streaming')
      expect(conversations[0].blocks).toHaveLength(1)
      expect(conversations[0].blocks[0].type).toBe('text')
      expect((conversations[0].blocks[0].content as TextBlockContent).text).toBe('Hello world!')

      processor.processEvent({
        type: 'TextMessageEnd',
        messageId: 'msg-1',
      } as AGUITextMessageEndEvent)

      // After end, status should be completed
      conversations = processor.getConversations()
      expect(conversations[0].status).toBe('completed')
    })

    it('maps role "user" to "user"', () => {
      const processor = createProcessor()
      processor.processEvent({
        type: 'TextMessageStart',
        messageId: 'msg-u',
        role: 'user',
      } as AGUITextMessageStartEvent)
      expect(processor.getConversations()[0].role).toBe('user')
    })

    it('maps role "developer" to "system"', () => {
      const processor = createProcessor()
      processor.processEvent({
        type: 'TextMessageStart',
        messageId: 'msg-d',
        role: 'developer',
      } as AGUITextMessageStartEvent)
      expect(processor.getConversations()[0].role).toBe('system')
    })

    it('maps role "system" to "system"', () => {
      const processor = createProcessor()
      processor.processEvent({
        type: 'TextMessageStart',
        messageId: 'msg-s',
        role: 'system',
      } as AGUITextMessageStartEvent)
      expect(processor.getConversations()[0].role).toBe('system')
    })

    it('maps role "tool" to "assistant"', () => {
      const processor = createProcessor()
      processor.processEvent({
        type: 'TextMessageStart',
        messageId: 'msg-t',
        role: 'tool',
      } as AGUITextMessageStartEvent)
      expect(processor.getConversations()[0].role).toBe('assistant')
    })

    it('ignores content events for unknown message IDs', () => {
      const processor = createProcessor()
      processor.processEvent({
        type: 'TextMessageContent',
        messageId: 'nonexistent',
        delta: 'ghost',
      } as AGUITextMessageContentEvent)
      expect(processor.getConversations()).toHaveLength(0)
    })
  })

  // ============================================================================
  // Tool Calls
  // ============================================================================

  describe('tool call lifecycle', () => {
    it('processes ToolCallStart/Args/End/Result to create tool blocks', () => {
      const processor = createProcessor()

      // Create a parent assistant message first
      processor.processEvent({
        type: 'TextMessageStart',
        messageId: 'msg-1',
        role: 'assistant',
      } as AGUITextMessageStartEvent)

      processor.processEvent({
        type: 'TextMessageContent',
        messageId: 'msg-1',
        delta: 'Let me search.',
      } as AGUITextMessageContentEvent)

      // Start tool call
      processor.processEvent({
        type: 'ToolCallStart',
        toolCallId: 'tc-1',
        toolCallName: 'web_search',
        parentMessageId: 'msg-1',
      } as AGUIToolCallStartEvent)

      // Stream arguments
      processor.processEvent({
        type: 'ToolCallArgs',
        toolCallId: 'tc-1',
        delta: '{"query":',
      } as AGUIToolCallArgsEvent)

      processor.processEvent({
        type: 'ToolCallArgs',
        toolCallId: 'tc-1',
        delta: '"test"}',
      } as AGUIToolCallArgsEvent)

      // End tool call input
      processor.processEvent({
        type: 'ToolCallEnd',
        toolCallId: 'tc-1',
      } as AGUIToolCallEndEvent)

      let conversations = processor.getConversations()
      expect(conversations).toHaveLength(1)

      // Should have text block + tool block
      const blocks = conversations[0].blocks
      expect(blocks).toHaveLength(2)

      const toolBlock = blocks.find((b) => b.type === 'tool')!
      expect(toolBlock).toBeDefined()
      const toolContent = toolBlock.content as ToolBlockContent
      expect(toolContent.name).toBe('web_search')
      expect(toolContent.input).toEqual({ query: 'test' })
      expect(toolContent.status).toBe('running')

      // Provide result
      processor.processEvent({
        type: 'ToolCallResult',
        messageId: 'msg-1',
        toolCallId: 'tc-1',
        content: { results: ['result1', 'result2'] },
      } as AGUIToolCallResultEvent)

      conversations = processor.getConversations()
      const updatedToolBlock = conversations[0].blocks.find((b) => b.type === 'tool')!
      const updatedContent = updatedToolBlock.content as ToolBlockContent
      expect(updatedContent.status).toBe('success')
      expect(updatedContent.output).toEqual({ results: ['result1', 'result2'] })
      expect(updatedToolBlock.status).toBe('completed')
    })

    it('attaches tool to last assistant message when no parentMessageId', () => {
      const processor = createProcessor()

      processor.processEvent({
        type: 'TextMessageStart',
        messageId: 'msg-a',
        role: 'assistant',
      } as AGUITextMessageStartEvent)

      // Tool call without parentMessageId
      processor.processEvent({
        type: 'ToolCallStart',
        toolCallId: 'tc-auto',
        toolCallName: 'calculator',
      } as AGUIToolCallStartEvent)

      const conversations = processor.getConversations()
      const toolBlock = conversations[0].blocks.find((b) => b.type === 'tool')
      expect(toolBlock).toBeDefined()
      expect((toolBlock!.content as ToolBlockContent).name).toBe('calculator')
    })

    it('handles non-JSON tool args gracefully', () => {
      const processor = createProcessor()

      processor.processEvent({
        type: 'TextMessageStart',
        messageId: 'msg-b',
        role: 'assistant',
      } as AGUITextMessageStartEvent)

      processor.processEvent({
        type: 'ToolCallStart',
        toolCallId: 'tc-bad',
        toolCallName: 'tool',
        parentMessageId: 'msg-b',
      } as AGUIToolCallStartEvent)

      processor.processEvent({
        type: 'ToolCallArgs',
        toolCallId: 'tc-bad',
        delta: 'not valid json',
      } as AGUIToolCallArgsEvent)

      processor.processEvent({
        type: 'ToolCallEnd',
        toolCallId: 'tc-bad',
      } as AGUIToolCallEndEvent)

      const conversations = processor.getConversations()
      const toolBlock = conversations[0].blocks.find((b) => b.type === 'tool')!
      // Should fall back to raw string
      expect((toolBlock.content as ToolBlockContent).input).toBe('not valid json')
    })
  })

  // ============================================================================
  // Reasoning / Thinking
  // ============================================================================

  describe('reasoning message lifecycle', () => {
    it('processes ReasoningMessageStart/Content/End to create a thinking block', () => {
      const processor = createProcessor()

      // Need an existing message to attach reasoning to
      processor.processEvent({
        type: 'TextMessageStart',
        messageId: 'msg-r',
        role: 'assistant',
      } as AGUITextMessageStartEvent)

      processor.processEvent({
        type: 'ReasoningMessageStart',
        messageId: 'msg-r',
        role: 'assistant',
      } as AGUIReasoningMessageStartEvent)

      processor.processEvent({
        type: 'ReasoningMessageContent',
        messageId: 'msg-r',
        delta: 'Let me think about ',
      } as AGUIReasoningMessageContentEvent)

      processor.processEvent({
        type: 'ReasoningMessageContent',
        messageId: 'msg-r',
        delta: 'this carefully.',
      } as AGUIReasoningMessageContentEvent)

      processor.processEvent({
        type: 'ReasoningMessageEnd',
        messageId: 'msg-r',
      } as AGUIReasoningMessageEndEvent)

      const conversations = processor.getConversations()
      expect(conversations).toHaveLength(1)

      // Thinking block should appear first
      const thinkingBlock = conversations[0].blocks.find((b) => b.type === 'thinking')
      expect(thinkingBlock).toBeDefined()
      expect((thinkingBlock!.content as ThinkingBlockContent).reasoning).toBe(
        'Let me think about this carefully.'
      )
    })

    it('thinking block appears before text block in output', () => {
      const processor = createProcessor()

      processor.processEvent({
        type: 'TextMessageStart',
        messageId: 'msg-order',
        role: 'assistant',
      } as AGUITextMessageStartEvent)

      processor.processEvent({
        type: 'TextMessageContent',
        messageId: 'msg-order',
        delta: 'Answer text',
      } as AGUITextMessageContentEvent)

      processor.processEvent({
        type: 'ReasoningMessageStart',
        messageId: 'msg-order',
        role: 'assistant',
      } as AGUIReasoningMessageStartEvent)

      processor.processEvent({
        type: 'ReasoningMessageContent',
        messageId: 'msg-order',
        delta: 'Reasoning',
      } as AGUIReasoningMessageContentEvent)

      const conversations = processor.getConversations()
      const blocks = conversations[0].blocks
      expect(blocks[0].type).toBe('thinking')
      expect(blocks[1].type).toBe('text')
    })
  })

  // ============================================================================
  // Run Lifecycle
  // ============================================================================

  describe('run lifecycle', () => {
    it('RunFinished marks all streaming messages as completed', () => {
      const processor = createProcessor()

      processor.processEvent({
        type: 'RunStarted',
        threadId: 'thread-1',
        runId: 'run-1',
      } as AGUIRunStartedEvent)

      processor.processEvent({
        type: 'TextMessageStart',
        messageId: 'msg-1',
        role: 'assistant',
      } as AGUITextMessageStartEvent)

      processor.processEvent({
        type: 'TextMessageContent',
        messageId: 'msg-1',
        delta: 'Still streaming...',
      } as AGUITextMessageContentEvent)

      // Message is still streaming
      expect(processor.getConversations()[0].status).toBe('streaming')

      processor.processEvent({
        type: 'RunFinished',
        threadId: 'thread-1',
        runId: 'run-1',
      } as AGUIRunFinishedEvent)

      // After RunFinished, should be completed
      expect(processor.getConversations()[0].status).toBe('completed')
    })

    it('RunError marks last assistant message as error', () => {
      const processor = createProcessor()

      processor.processEvent({
        type: 'TextMessageStart',
        messageId: 'msg-e1',
        role: 'user',
      } as AGUITextMessageStartEvent)

      processor.processEvent({
        type: 'TextMessageEnd',
        messageId: 'msg-e1',
      } as AGUITextMessageEndEvent)

      processor.processEvent({
        type: 'TextMessageStart',
        messageId: 'msg-e2',
        role: 'assistant',
      } as AGUITextMessageStartEvent)

      processor.processEvent({
        type: 'TextMessageContent',
        messageId: 'msg-e2',
        delta: 'Processing...',
      } as AGUITextMessageContentEvent)

      processor.processEvent({
        type: 'RunError',
        message: 'Internal error',
        code: '500',
      } as AGUIRunErrorEvent)

      const conversations = processor.getConversations()
      // User message should remain completed
      expect(conversations[0].status).toBe('completed')
      // Assistant message should be marked as error
      expect(conversations[1].status).toBe('error')
    })

    it('RunError with no assistant message does not crash', () => {
      const processor = createProcessor()
      // Should not throw
      processor.processEvent({
        type: 'RunError',
        message: 'Error before any messages',
      } as AGUIRunErrorEvent)
      expect(processor.getConversations()).toHaveLength(0)
    })
  })

  // ============================================================================
  // reset()
  // ============================================================================

  describe('reset', () => {
    it('clears all state', () => {
      const processor = createProcessor()

      processor.processEvent({
        type: 'RunStarted',
        threadId: 't1',
        runId: 'r1',
      } as AGUIRunStartedEvent)

      processor.processEvent({
        type: 'TextMessageStart',
        messageId: 'msg-1',
        role: 'assistant',
      } as AGUITextMessageStartEvent)

      processor.processEvent({
        type: 'TextMessageContent',
        messageId: 'msg-1',
        delta: 'Some text',
      } as AGUITextMessageContentEvent)

      expect(processor.getConversations()).toHaveLength(1)

      processor.reset()

      expect(processor.getConversations()).toHaveLength(0)
    })
  })

  // ============================================================================
  // onUpdate callback
  // ============================================================================

  describe('onUpdate callback', () => {
    it('calls onUpdate after each event', () => {
      const updates: number[] = []
      idCounter = 0
      const processor = new AGUIEventProcessor({
        generateBlockId: testGenerateId,
        onUpdate: (convs) => updates.push(convs.length),
      })

      processor.processEvent({
        type: 'TextMessageStart',
        messageId: 'msg-cb',
        role: 'assistant',
      } as AGUITextMessageStartEvent)

      processor.processEvent({
        type: 'TextMessageContent',
        messageId: 'msg-cb',
        delta: 'hi',
      } as AGUITextMessageContentEvent)

      // onUpdate called for each event
      expect(updates).toHaveLength(2)
      expect(updates[0]).toBe(1)
      expect(updates[1]).toBe(1)
    })
  })

  // ============================================================================
  // Unknown events
  // ============================================================================

  describe('unknown events', () => {
    it('silently ignores unknown event types', () => {
      const processor = createProcessor()
      processor.processEvent({ type: 'SomeFutureEvent' } as any)
      expect(processor.getConversations()).toHaveLength(0)
    })
  })

  // ============================================================================
  // Multiple messages
  // ============================================================================

  describe('multiple messages', () => {
    it('maintains correct ordering of multiple messages', () => {
      const processor = createProcessor()

      processor.processEvent({
        type: 'TextMessageStart',
        messageId: 'msg-1',
        role: 'user',
      } as AGUITextMessageStartEvent)
      processor.processEvent({
        type: 'TextMessageContent',
        messageId: 'msg-1',
        delta: 'Question',
      } as AGUITextMessageContentEvent)
      processor.processEvent({
        type: 'TextMessageEnd',
        messageId: 'msg-1',
      } as AGUITextMessageEndEvent)

      processor.processEvent({
        type: 'TextMessageStart',
        messageId: 'msg-2',
        role: 'assistant',
      } as AGUITextMessageStartEvent)
      processor.processEvent({
        type: 'TextMessageContent',
        messageId: 'msg-2',
        delta: 'Answer',
      } as AGUITextMessageContentEvent)
      processor.processEvent({
        type: 'TextMessageEnd',
        messageId: 'msg-2',
      } as AGUITextMessageEndEvent)

      const conversations = processor.getConversations()
      expect(conversations).toHaveLength(2)
      expect(conversations[0].id).toBe('msg-1')
      expect(conversations[0].role).toBe('user')
      expect(conversations[1].id).toBe('msg-2')
      expect(conversations[1].role).toBe('assistant')
    })
  })
})

// ============================================================================
// fromAGUIEvents (convenience function)
// ============================================================================

describe('fromAGUIEvents', () => {
  it('processes a batch of events and returns conversations', () => {
    const events: AGUIEvent[] = [
      { type: 'RunStarted', threadId: 't1', runId: 'r1' } as AGUIRunStartedEvent,
      { type: 'TextMessageStart', messageId: 'msg-1', role: 'assistant' } as AGUITextMessageStartEvent,
      { type: 'TextMessageContent', messageId: 'msg-1', delta: 'Hello from AG-UI!' } as AGUITextMessageContentEvent,
      { type: 'TextMessageEnd', messageId: 'msg-1' } as AGUITextMessageEndEvent,
      { type: 'RunFinished', threadId: 't1', runId: 'r1' } as AGUIRunFinishedEvent,
    ]

    idCounter = 0
    const conversations = fromAGUIEvents(events, { generateBlockId: testGenerateId })

    expect(conversations).toHaveLength(1)
    expect(conversations[0].status).toBe('completed')
    expect(conversations[0].role).toBe('assistant')
    expect(conversations[0].blocks).toHaveLength(1)
    expect((conversations[0].blocks[0].content as TextBlockContent).text).toBe('Hello from AG-UI!')
  })

  it('returns empty array for empty events', () => {
    const conversations = fromAGUIEvents([])
    expect(conversations).toEqual([])
  })

  it('handles full tool call flow', () => {
    const events: AGUIEvent[] = [
      { type: 'TextMessageStart', messageId: 'msg-1', role: 'assistant' } as AGUITextMessageStartEvent,
      { type: 'TextMessageContent', messageId: 'msg-1', delta: 'Searching...' } as AGUITextMessageContentEvent,
      {
        type: 'ToolCallStart',
        toolCallId: 'tc-1',
        toolCallName: 'search',
        parentMessageId: 'msg-1',
      } as AGUIToolCallStartEvent,
      { type: 'ToolCallArgs', toolCallId: 'tc-1', delta: '{"q":"test"}' } as AGUIToolCallArgsEvent,
      { type: 'ToolCallEnd', toolCallId: 'tc-1' } as AGUIToolCallEndEvent,
      {
        type: 'ToolCallResult',
        messageId: 'msg-1',
        toolCallId: 'tc-1',
        content: ['found it'],
      } as AGUIToolCallResultEvent,
      { type: 'TextMessageEnd', messageId: 'msg-1' } as AGUITextMessageEndEvent,
    ]

    idCounter = 0
    const conversations = fromAGUIEvents(events, { generateBlockId: testGenerateId })

    expect(conversations).toHaveLength(1)
    const blocks = conversations[0].blocks
    expect(blocks).toHaveLength(2) // text + tool

    const toolBlock = blocks.find((b) => b.type === 'tool')!
    expect(toolBlock).toBeDefined()
    const content = toolBlock.content as ToolBlockContent
    expect(content.name).toBe('search')
    expect(content.input).toEqual({ q: 'test' })
    expect(content.output).toEqual(['found it'])
    expect(content.status).toBe('success')
  })
})
