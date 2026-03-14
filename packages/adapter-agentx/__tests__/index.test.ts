import { describe, it, expect } from 'vitest'
import {
  fromAgentXState,
  fromAgentXConversations,
  convertBlock,
  convertConversation,
  toAgentXConversation,
  toAgentXConversations,
  type AgentXPresentationState,
  type AgentXConversation,
  type AgentXTextBlock,
  type AgentXToolBlock,
  type AgentXImageBlock,
} from '../src/index'
import type { LucidConversation, LucidBlock } from '@uix-ai/core'

// ============================================================================
// Block Conversion Tests
// ============================================================================

describe('convertBlock', () => {
  it('converts text block', () => {
    const block: AgentXTextBlock = { type: 'text', content: 'Hello world' }
    const result = convertBlock(block)

    expect(result.type).toBe('text')
    expect(result.status).toBe('completed')
    expect(result.content).toEqual({ text: 'Hello world' })
    expect(result.id).toBeTruthy()
  })

  it('converts completed tool block', () => {
    const block: AgentXToolBlock = {
      type: 'tool',
      toolUseId: 'tc_123',
      toolName: 'bash',
      toolInput: { command: 'ls' },
      toolResult: 'file1.txt\nfile2.txt',
      status: 'completed',
    }
    const result = convertBlock(block)

    expect(result.type).toBe('tool')
    expect(result.status).toBe('completed')
    expect(result.content).toEqual({
      name: 'bash',
      input: { command: 'ls' },
      output: 'file1.txt\nfile2.txt',
      status: 'success',
      error: undefined,
    })
  })

  it('converts pending tool block', () => {
    const block: AgentXToolBlock = {
      type: 'tool',
      toolUseId: 'tc_456',
      toolName: 'search',
      toolInput: {},
      status: 'pending',
    }
    const result = convertBlock(block)

    expect(result.type).toBe('tool')
    expect(result.status).toBe('streaming')
    expect(result.content).toMatchObject({
      name: 'search',
      status: 'pending',
    })
  })

  it('converts running tool block', () => {
    const block: AgentXToolBlock = {
      type: 'tool',
      toolUseId: 'tc_789',
      toolName: 'fetch',
      toolInput: { url: 'https://example.com' },
      status: 'running',
    }
    const result = convertBlock(block)

    expect(result.status).toBe('streaming')
    expect(result.content).toMatchObject({ status: 'running' })
  })

  it('converts error tool block', () => {
    const block: AgentXToolBlock = {
      type: 'tool',
      toolUseId: 'tc_err',
      toolName: 'bash',
      toolInput: { command: 'rm -rf /' },
      toolResult: 'Permission denied',
      status: 'error',
    }
    const result = convertBlock(block)

    expect(result.status).toBe('completed')
    expect(result.content).toMatchObject({
      status: 'error',
      error: 'Permission denied',
    })
  })

  it('converts image block', () => {
    const block: AgentXImageBlock = {
      type: 'image',
      url: 'https://example.com/img.png',
      alt: 'A screenshot',
    }
    const result = convertBlock(block)

    expect(result.type).toBe('image')
    expect(result.status).toBe('completed')
    expect(result.content).toEqual({
      url: 'https://example.com/img.png',
      alt: 'A screenshot',
    })
  })

  it('uses custom ID generator', () => {
    let counter = 0
    const block: AgentXTextBlock = { type: 'text', content: 'test' }
    const result = convertBlock(block, {
      generateId: () => `custom-${++counter}`,
    })

    expect(result.id).toBe('custom-1')
  })
})

// ============================================================================
// Conversation Conversion Tests
// ============================================================================

describe('convertConversation', () => {
  it('converts user conversation', () => {
    const conv: AgentXConversation = {
      role: 'user',
      blocks: [{ type: 'text', content: 'Hello' }],
    }
    const result = convertConversation(conv)

    expect(result.role).toBe('user')
    expect(result.status).toBe('completed')
    expect(result.blocks).toHaveLength(1)
    expect(result.blocks[0].type).toBe('text')
    expect(result.id).toBeTruthy()
    expect(result.timestamp).toBeGreaterThan(0)
  })

  it('converts completed assistant conversation', () => {
    const conv: AgentXConversation = {
      role: 'assistant',
      blocks: [
        { type: 'text', content: 'Here is the result:' },
        {
          type: 'tool',
          toolUseId: 'tc_1',
          toolName: 'bash',
          toolInput: { command: 'echo hi' },
          toolResult: 'hi',
          status: 'completed',
        },
      ],
      isStreaming: false,
    }
    const result = convertConversation(conv)

    expect(result.role).toBe('assistant')
    expect(result.status).toBe('completed')
    expect(result.blocks).toHaveLength(2)
    expect(result.blocks[0].type).toBe('text')
    expect(result.blocks[1].type).toBe('tool')
  })

  it('converts streaming assistant conversation', () => {
    const conv: AgentXConversation = {
      role: 'assistant',
      blocks: [{ type: 'text', content: 'Thinking...' }],
      isStreaming: true,
    }
    const result = convertConversation(conv)

    expect(result.role).toBe('assistant')
    expect(result.status).toBe('streaming')
  })

  it('converts error conversation to error block', () => {
    const conv: AgentXConversation = {
      role: 'error',
      message: 'Connection failed',
    }
    const result = convertConversation(conv)

    expect(result.role).toBe('assistant')
    expect(result.status).toBe('error')
    expect(result.blocks).toHaveLength(1)
    expect(result.blocks[0].type).toBe('error')
    expect(result.blocks[0].content).toEqual({
      code: 'AGENTX_ERROR',
      message: 'Connection failed',
    })
  })
})

// ============================================================================
// PresentationState Conversion Tests
// ============================================================================

describe('fromAgentXState', () => {
  it('converts empty state', () => {
    const state: AgentXPresentationState = {
      conversations: [],
      streaming: null,
      status: 'idle',
    }
    const result = fromAgentXState(state)

    expect(result).toEqual([])
  })

  it('converts state with completed conversations', () => {
    const state: AgentXPresentationState = {
      conversations: [
        {
          role: 'user',
          blocks: [{ type: 'text', content: 'Hi' }],
        },
        {
          role: 'assistant',
          blocks: [{ type: 'text', content: 'Hello!' }],
          isStreaming: false,
        },
      ],
      streaming: null,
      status: 'idle',
    }
    const result = fromAgentXState(state)

    expect(result).toHaveLength(2)
    expect(result[0].role).toBe('user')
    expect(result[1].role).toBe('assistant')
    expect(result[0].status).toBe('completed')
    expect(result[1].status).toBe('completed')
  })

  it('includes streaming conversation', () => {
    const state: AgentXPresentationState = {
      conversations: [
        {
          role: 'user',
          blocks: [{ type: 'text', content: 'Tell me a story' }],
        },
      ],
      streaming: {
        role: 'assistant',
        blocks: [{ type: 'text', content: 'Once upon a time...' }],
        isStreaming: true,
      },
      status: 'responding',
    }
    const result = fromAgentXState(state)

    expect(result).toHaveLength(2)
    expect(result[0].role).toBe('user')
    expect(result[0].status).toBe('completed')
    expect(result[1].role).toBe('assistant')
    expect(result[1].status).toBe('streaming')
  })

  it('handles mixed conversation types', () => {
    const state: AgentXPresentationState = {
      conversations: [
        {
          role: 'user',
          blocks: [{ type: 'text', content: 'Do something' }],
        },
        {
          role: 'assistant',
          blocks: [
            { type: 'text', content: 'Running command...' },
            {
              type: 'tool',
              toolUseId: 'tc_1',
              toolName: 'bash',
              toolInput: { command: 'ls' },
              toolResult: 'output',
              status: 'completed',
            },
            { type: 'text', content: 'Done!' },
          ],
          isStreaming: false,
        },
        {
          role: 'error',
          message: 'Rate limit exceeded',
        },
      ],
      streaming: null,
      status: 'idle',
    }
    const result = fromAgentXState(state)

    expect(result).toHaveLength(3)
    expect(result[0].role).toBe('user')
    expect(result[1].role).toBe('assistant')
    expect(result[1].blocks).toHaveLength(3)
    expect(result[1].blocks[1].type).toBe('tool')
    expect(result[2].status).toBe('error')
    expect(result[2].blocks[0].type).toBe('error')
  })

  it('assigns incrementing timestamps', () => {
    const baseTimestamp = 1000
    const state: AgentXPresentationState = {
      conversations: [
        { role: 'user', blocks: [{ type: 'text', content: 'a' }] },
        {
          role: 'assistant',
          blocks: [{ type: 'text', content: 'b' }],
          isStreaming: false,
        },
      ],
      streaming: null,
      status: 'idle',
    }
    const result = fromAgentXState(state, { baseTimestamp })

    expect(result[0].timestamp).toBe(1000)
    expect(result[1].timestamp).toBe(1001)
  })
})

// ============================================================================
// fromAgentXConversations Tests
// ============================================================================

describe('fromAgentXConversations', () => {
  it('converts array of conversations', () => {
    const conversations: AgentXConversation[] = [
      { role: 'user', blocks: [{ type: 'text', content: 'Hello' }] },
      {
        role: 'assistant',
        blocks: [{ type: 'text', content: 'Hi' }],
        isStreaming: false,
      },
    ]
    const result = fromAgentXConversations(conversations)

    expect(result).toHaveLength(2)
    expect(result[0].role).toBe('user')
    expect(result[1].role).toBe('assistant')
  })
})

// ============================================================================
// Reverse Conversion Tests
// ============================================================================

describe('toAgentXConversation', () => {
  it('converts user conversation back', () => {
    const conv: LucidConversation = {
      id: 'conv-1',
      role: 'user',
      status: 'completed',
      blocks: [
        {
          id: 'b1',
          type: 'text',
          status: 'completed',
          content: { text: 'Hello' },
        },
      ],
      timestamp: Date.now(),
    }
    const result = toAgentXConversation(conv)

    expect(result.role).toBe('user')
    expect(result.blocks).toHaveLength(1)
    expect(result.blocks[0]).toEqual({ type: 'text', content: 'Hello' })
  })

  it('converts assistant conversation with tool block back', () => {
    const conv: LucidConversation = {
      id: 'conv-2',
      role: 'assistant',
      status: 'completed',
      blocks: [
        {
          id: 'b1',
          type: 'text',
          status: 'completed',
          content: { text: 'Let me check...' },
        },
        {
          id: 'b2',
          type: 'tool',
          status: 'completed',
          content: {
            name: 'search',
            input: { query: 'weather' },
            output: 'Sunny',
            status: 'success',
          },
        },
      ],
      timestamp: Date.now(),
    }
    const result = toAgentXConversation(conv)

    expect(result.role).toBe('assistant')
    if (result.role === 'assistant') {
      expect(result.isStreaming).toBe(false)
      expect(result.blocks).toHaveLength(2)
      expect(result.blocks[0]).toEqual({
        type: 'text',
        content: 'Let me check...',
      })
      expect(result.blocks[1]).toMatchObject({
        type: 'tool',
        toolName: 'search',
        toolInput: { query: 'weather' },
        toolResult: 'Sunny',
        status: 'completed',
      })
    }
  })

  it('converts streaming conversation back', () => {
    const conv: LucidConversation = {
      id: 'conv-3',
      role: 'assistant',
      status: 'streaming',
      blocks: [
        {
          id: 'b1',
          type: 'text',
          status: 'streaming',
          content: { text: 'Thinking...' },
        },
      ],
      timestamp: Date.now(),
    }
    const result = toAgentXConversation(conv)

    expect(result.role).toBe('assistant')
    if (result.role === 'assistant') {
      expect(result.isStreaming).toBe(true)
    }
  })

  it('converts error-only conversation to AgentX error', () => {
    const conv: LucidConversation = {
      id: 'conv-4',
      role: 'assistant',
      status: 'error',
      blocks: [
        {
          id: 'b1',
          type: 'error',
          status: 'error',
          content: { code: 'TIMEOUT', message: 'Request timed out' },
        },
      ],
      timestamp: Date.now(),
    }
    const result = toAgentXConversation(conv)

    expect(result.role).toBe('error')
    if (result.role === 'error') {
      expect(result.message).toBe('Request timed out')
    }
  })

  it('converts thinking block to text (lossy)', () => {
    const conv: LucidConversation = {
      id: 'conv-5',
      role: 'assistant',
      status: 'completed',
      blocks: [
        {
          id: 'b1',
          type: 'thinking',
          status: 'completed',
          content: { reasoning: 'Let me think about this...' },
        },
      ],
      timestamp: Date.now(),
    }
    const result = toAgentXConversation(conv)

    expect(result.role).toBe('assistant')
    if (result.role === 'assistant') {
      expect(result.blocks[0]).toEqual({
        type: 'text',
        content: 'Let me think about this...',
      })
    }
  })
})

describe('toAgentXConversations', () => {
  it('converts array of conversations', () => {
    const conversations: LucidConversation[] = [
      {
        id: '1',
        role: 'user',
        status: 'completed',
        blocks: [
          { id: 'b1', type: 'text', status: 'completed', content: { text: 'Hi' } },
        ],
        timestamp: 1000,
      },
      {
        id: '2',
        role: 'assistant',
        status: 'completed',
        blocks: [
          { id: 'b2', type: 'text', status: 'completed', content: { text: 'Hello' } },
        ],
        timestamp: 1001,
      },
    ]
    const result = toAgentXConversations(conversations)

    expect(result).toHaveLength(2)
    expect(result[0].role).toBe('user')
    expect(result[1].role).toBe('assistant')
  })
})

// ============================================================================
// Round-trip Tests
// ============================================================================

describe('round-trip conversion', () => {
  it('preserves text content through round-trip', () => {
    const original: AgentXPresentationState = {
      conversations: [
        { role: 'user', blocks: [{ type: 'text', content: 'Hello' }] },
        {
          role: 'assistant',
          blocks: [{ type: 'text', content: 'World' }],
          isStreaming: false,
        },
      ],
      streaming: null,
      status: 'idle',
    }

    const lucid = fromAgentXState(original)
    const backToAgentX = toAgentXConversations(lucid)

    expect(backToAgentX).toHaveLength(2)
    expect(backToAgentX[0].role).toBe('user')
    expect(backToAgentX[0].blocks[0]).toEqual({
      type: 'text',
      content: 'Hello',
    })
    expect(backToAgentX[1].role).toBe('assistant')
    expect(backToAgentX[1].blocks[0]).toEqual({
      type: 'text',
      content: 'World',
    })
  })
})
