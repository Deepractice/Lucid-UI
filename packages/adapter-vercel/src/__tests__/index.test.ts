import { describe, it, expect } from 'vitest'
import {
  convertPartToBlock,
  fromVercelMessage,
  fromVercelMessages,
  convertBlockToParts,
  toVercelMessage,
  toVercelMessages,
  type VercelTextPart,
  type VercelReasoningPart,
  type VercelFilePart,
  type VercelSourceUrlPart,
  type VercelToolPart,
  type VercelStepStartPart,
  type VercelUIMessage,
  type VercelMessagePart,
} from '../index'
import type {
  LucidBlock,
  LucidConversation,
  TextBlockContent,
  ThinkingBlockContent,
  FileBlockContent,
  SourceBlockContent,
  ToolBlockContent,
} from '@uix/core'

// Helper to get deterministic IDs in tests
let idCounter = 0
const testGenerateId = () => `test-block-${++idCounter}`
const opts = { generateBlockId: testGenerateId }

function resetIds() {
  idCounter = 0
}

// ============================================================================
// convertPartToBlock
// ============================================================================

describe('convertPartToBlock', () => {
  beforeEach(resetIds)

  it('converts a text part to a text block', () => {
    const part: VercelTextPart = { type: 'text', text: 'Hello world' }
    const block = convertPartToBlock(part, opts)

    expect(block).not.toBeNull()
    expect(block!.type).toBe('text')
    expect(block!.status).toBe('completed')
    expect((block!.content as TextBlockContent).text).toBe('Hello world')
  })

  it('converts a streaming text part to a streaming text block', () => {
    const part: VercelTextPart = { type: 'text', text: 'partial', state: 'streaming' }
    const block = convertPartToBlock(part, opts)

    expect(block!.status).toBe('streaming')
  })

  it('converts a reasoning part to a thinking block', () => {
    const part: VercelReasoningPart = { type: 'reasoning', text: 'Let me think...' }
    const block = convertPartToBlock(part, opts)

    expect(block).not.toBeNull()
    expect(block!.type).toBe('thinking')
    expect(block!.status).toBe('completed')
    expect((block!.content as ThinkingBlockContent).reasoning).toBe('Let me think...')
  })

  it('converts a streaming reasoning part to a streaming thinking block', () => {
    const part: VercelReasoningPart = { type: 'reasoning', text: 'thinking...', state: 'streaming' }
    const block = convertPartToBlock(part, opts)

    expect(block!.status).toBe('streaming')
  })

  it('converts a file part to a file block', () => {
    const part: VercelFilePart = {
      type: 'file',
      mediaType: 'image/png',
      filename: 'screenshot.png',
      url: 'https://example.com/img.png',
    }
    const block = convertPartToBlock(part, opts)

    expect(block).not.toBeNull()
    expect(block!.type).toBe('file')
    expect(block!.status).toBe('completed')
    const content = block!.content as FileBlockContent
    expect(content.name).toBe('screenshot.png')
    expect(content.type).toBe('image/png')
    expect(content.url).toBe('https://example.com/img.png')
  })

  it('uses default filename when filename is missing on file part', () => {
    const part: VercelFilePart = {
      type: 'file',
      mediaType: 'application/pdf',
      url: 'https://example.com/doc.pdf',
    }
    const block = convertPartToBlock(part, opts)
    expect((block!.content as FileBlockContent).name).toBe('file')
  })

  it('converts a source-url part to a source block', () => {
    const part: VercelSourceUrlPart = {
      type: 'source-url',
      sourceId: 'src-1',
      url: 'https://example.com',
      title: 'Example',
    }
    const block = convertPartToBlock(part, opts)

    expect(block).not.toBeNull()
    expect(block!.type).toBe('source')
    expect(block!.status).toBe('completed')
    const content = block!.content as SourceBlockContent
    expect(content.sourceId).toBe('src-1')
    expect(content.sourceType).toBe('url')
    expect(content.title).toBe('Example')
    expect(content.url).toBe('https://example.com')
  })

  it('uses url as title fallback for source-url part without title', () => {
    const part: VercelSourceUrlPart = {
      type: 'source-url',
      sourceId: 'src-2',
      url: 'https://fallback.com',
    }
    const block = convertPartToBlock(part, opts)
    expect((block!.content as SourceBlockContent).title).toBe('https://fallback.com')
  })

  it('converts a tool part with correct status mapping', () => {
    const states: Array<{ input: VercelToolPart['state']; expectedTool: string; expectedBlock: string }> = [
      { input: 'input-streaming', expectedTool: 'streaming', expectedBlock: 'streaming' },
      { input: 'input-available', expectedTool: 'ready', expectedBlock: 'completed' },
      { input: 'approval-requested', expectedTool: 'approval-required', expectedBlock: 'completed' },
      { input: 'approval-responded', expectedTool: 'approved', expectedBlock: 'completed' },
      { input: 'output-available', expectedTool: 'success', expectedBlock: 'completed' },
      { input: 'output-error', expectedTool: 'error', expectedBlock: 'error' },
      { input: 'output-denied', expectedTool: 'denied', expectedBlock: 'completed' },
    ]

    for (const { input, expectedTool, expectedBlock } of states) {
      resetIds()
      const part: VercelToolPart = {
        type: 'tool-myTool',
        toolCallId: 'tc-1',
        state: input,
        input: { foo: 'bar' },
      }
      const block = convertPartToBlock(part, opts)

      expect(block).not.toBeNull()
      expect(block!.type).toBe('tool')
      expect(block!.status).toBe(expectedBlock)
      const content = block!.content as ToolBlockContent
      expect(content.status).toBe(expectedTool)
      expect(content.name).toBe('myTool')
      expect(content.input).toEqual({ foo: 'bar' })
    }
  })

  it('extracts tool name from dynamic-tool type using toolName', () => {
    const part: VercelToolPart = {
      type: 'dynamic-tool',
      toolName: 'dynamicSearch',
      toolCallId: 'tc-2',
      state: 'output-available',
    }
    const block = convertPartToBlock(part, opts)
    expect((block!.content as ToolBlockContent).name).toBe('dynamicSearch')
  })

  it('uses "unknown" for dynamic-tool without toolName', () => {
    const part: VercelToolPart = {
      type: 'dynamic-tool',
      toolCallId: 'tc-3',
      state: 'output-available',
    }
    const block = convertPartToBlock(part, opts)
    expect((block!.content as ToolBlockContent).name).toBe('unknown')
  })

  it('includes approval info on tool blocks', () => {
    const part: VercelToolPart = {
      type: 'tool-deploy',
      toolCallId: 'tc-4',
      state: 'approval-requested',
      approval: { id: 'appr-1', approved: undefined, reason: 'Needs confirmation' },
    }
    const block = convertPartToBlock(part, opts)
    const content = block!.content as ToolBlockContent
    expect(content.approval).toEqual({
      id: 'appr-1',
      approved: undefined,
      reason: 'Needs confirmation',
    })
  })

  it('returns null for step-start part', () => {
    const part: VercelStepStartPart = { type: 'step-start' }
    const block = convertPartToBlock(part, opts)
    expect(block).toBeNull()
  })

  it('returns null for unknown part type', () => {
    const part: VercelMessagePart = { type: 'some-unknown-type' }
    const block = convertPartToBlock(part, opts)
    expect(block).toBeNull()
  })
})

// ============================================================================
// fromVercelMessage
// ============================================================================

describe('fromVercelMessage', () => {
  beforeEach(resetIds)

  it('converts parts to blocks and sets conversation fields', () => {
    const message: VercelUIMessage = {
      id: 'msg-1',
      role: 'assistant',
      parts: [
        { type: 'text', text: 'Hello' } as VercelTextPart,
        { type: 'reasoning', text: 'Thinking' } as VercelReasoningPart,
      ],
    }
    const conversation = fromVercelMessage(message, opts)

    expect(conversation.id).toBe('msg-1')
    expect(conversation.role).toBe('assistant')
    expect(conversation.blocks).toHaveLength(2)
    expect(conversation.blocks[0].type).toBe('text')
    expect(conversation.blocks[1].type).toBe('thinking')
  })

  it('infers streaming status when any block is streaming', () => {
    const message: VercelUIMessage = {
      id: 'msg-2',
      role: 'assistant',
      parts: [
        { type: 'text', text: 'Done', state: 'done' } as VercelTextPart,
        { type: 'text', text: 'Still going', state: 'streaming' } as VercelTextPart,
      ],
    }
    const conversation = fromVercelMessage(message, opts)
    expect(conversation.status).toBe('streaming')
  })

  it('infers completed status when all blocks are completed', () => {
    const message: VercelUIMessage = {
      id: 'msg-3',
      role: 'user',
      parts: [{ type: 'text', text: 'Hi' } as VercelTextPart],
    }
    const conversation = fromVercelMessage(message, opts)
    expect(conversation.status).toBe('completed')
  })

  it('infers error status from tool error blocks', () => {
    const message: VercelUIMessage = {
      id: 'msg-4',
      role: 'assistant',
      parts: [
        {
          type: 'tool-failing',
          toolCallId: 'tc-err',
          state: 'output-error',
          errorText: 'Something went wrong',
        } as VercelToolPart,
      ],
    }
    const conversation = fromVercelMessage(message, opts)
    expect(conversation.status).toBe('error')
  })

  it('streaming takes priority over error in status inference', () => {
    const message: VercelUIMessage = {
      id: 'msg-5',
      role: 'assistant',
      parts: [
        {
          type: 'tool-a',
          toolCallId: 'tc-e1',
          state: 'output-error',
        } as VercelToolPart,
        { type: 'text', text: 'loading', state: 'streaming' } as VercelTextPart,
      ],
    }
    const conversation = fromVercelMessage(message, opts)
    expect(conversation.status).toBe('streaming')
  })

  it('skips parts filtered out by filterPart option', () => {
    const message: VercelUIMessage = {
      id: 'msg-6',
      role: 'assistant',
      parts: [
        { type: 'text', text: 'Keep' } as VercelTextPart,
        { type: 'reasoning', text: 'Skip this' } as VercelReasoningPart,
      ],
    }
    const conversation = fromVercelMessage(message, {
      ...opts,
      filterPart: (p) => p.type !== 'reasoning',
    })
    expect(conversation.blocks).toHaveLength(1)
    expect(conversation.blocks[0].type).toBe('text')
  })

  it('skips null blocks (e.g. step-start)', () => {
    const message: VercelUIMessage = {
      id: 'msg-7',
      role: 'assistant',
      parts: [
        { type: 'step-start' } as VercelStepStartPart,
        { type: 'text', text: 'After step' } as VercelTextPart,
      ],
    }
    const conversation = fromVercelMessage(message, opts)
    expect(conversation.blocks).toHaveLength(1)
    expect(conversation.blocks[0].type).toBe('text')
  })
})

// ============================================================================
// fromVercelMessages
// ============================================================================

describe('fromVercelMessages', () => {
  beforeEach(resetIds)

  it('converts an array of messages to conversations', () => {
    const messages: VercelUIMessage[] = [
      { id: 'u1', role: 'user', parts: [{ type: 'text', text: 'Hi' } as VercelTextPart] },
      { id: 'a1', role: 'assistant', parts: [{ type: 'text', text: 'Hello!' } as VercelTextPart] },
    ]
    const conversations = fromVercelMessages(messages, opts)

    expect(conversations).toHaveLength(2)
    expect(conversations[0].id).toBe('u1')
    expect(conversations[0].role).toBe('user')
    expect(conversations[1].id).toBe('a1')
    expect(conversations[1].role).toBe('assistant')
  })

  it('returns empty array for empty input', () => {
    expect(fromVercelMessages([])).toEqual([])
  })
})

// ============================================================================
// convertBlockToParts (reverse conversion)
// ============================================================================

describe('convertBlockToParts', () => {
  it('converts a text block to a text part', () => {
    const block: LucidBlock = {
      id: 'b1',
      type: 'text',
      status: 'completed',
      content: { text: 'Hello' } as TextBlockContent,
    }
    const parts = convertBlockToParts(block)

    expect(parts).toHaveLength(1)
    expect(parts[0].type).toBe('text')
    expect((parts[0] as VercelTextPart).text).toBe('Hello')
    expect((parts[0] as VercelTextPart).state).toBe('done')
  })

  it('converts a streaming text block to a streaming text part', () => {
    const block: LucidBlock = {
      id: 'b2',
      type: 'text',
      status: 'streaming',
      content: { text: 'loading...' } as TextBlockContent,
    }
    const parts = convertBlockToParts(block)
    expect((parts[0] as VercelTextPart).state).toBe('streaming')
  })

  it('converts a thinking block to a reasoning part', () => {
    const block: LucidBlock = {
      id: 'b3',
      type: 'thinking',
      status: 'completed',
      content: { reasoning: 'Deep thoughts' } as ThinkingBlockContent,
    }
    const parts = convertBlockToParts(block)

    expect(parts).toHaveLength(1)
    expect(parts[0].type).toBe('reasoning')
    expect((parts[0] as VercelReasoningPart).text).toBe('Deep thoughts')
    expect((parts[0] as VercelReasoningPart).state).toBe('done')
  })

  it('converts a file block to a file part', () => {
    const block: LucidBlock = {
      id: 'b4',
      type: 'file',
      status: 'completed',
      content: { name: 'doc.pdf', type: 'application/pdf', url: 'https://example.com/doc.pdf' } as FileBlockContent,
    }
    const parts = convertBlockToParts(block)

    expect(parts).toHaveLength(1)
    const filePart = parts[0] as VercelFilePart
    expect(filePart.type).toBe('file')
    expect(filePart.mediaType).toBe('application/pdf')
    expect(filePart.filename).toBe('doc.pdf')
    expect(filePart.url).toBe('https://example.com/doc.pdf')
  })

  it('converts a source block (url type) to a source-url part', () => {
    const block: LucidBlock = {
      id: 'b5',
      type: 'source',
      status: 'completed',
      content: {
        sourceId: 'src-1',
        sourceType: 'url',
        title: 'Example',
        url: 'https://example.com',
      } as SourceBlockContent,
    }
    const parts = convertBlockToParts(block)

    expect(parts).toHaveLength(1)
    const srcPart = parts[0] as VercelSourceUrlPart
    expect(srcPart.type).toBe('source-url')
    expect(srcPart.sourceId).toBe('src-1')
    expect(srcPart.url).toBe('https://example.com')
    expect(srcPart.title).toBe('Example')
  })

  it('converts a source block (document type) to a source-document part', () => {
    const block: LucidBlock = {
      id: 'b6',
      type: 'source',
      status: 'completed',
      content: {
        sourceId: 'src-2',
        sourceType: 'document',
        title: 'Report',
        mediaType: 'application/pdf',
        filename: 'report.pdf',
      } as SourceBlockContent,
    }
    const parts = convertBlockToParts(block)

    expect(parts).toHaveLength(1)
    expect(parts[0].type).toBe('source-document')
  })

  it('converts a tool block to a dynamic-tool part with correct status mapping', () => {
    const block: LucidBlock = {
      id: 'b7',
      type: 'tool',
      status: 'completed',
      content: {
        name: 'search',
        input: { query: 'test' },
        output: { results: [] },
        status: 'success',
      } as ToolBlockContent,
    }
    const parts = convertBlockToParts(block)

    expect(parts).toHaveLength(1)
    const toolPart = parts[0] as VercelToolPart
    expect(toolPart.type).toBe('dynamic-tool')
    expect(toolPart.toolName).toBe('search')
    expect(toolPart.toolCallId).toBe('b7')
    expect(toolPart.state).toBe('output-available')
    expect(toolPart.input).toEqual({ query: 'test' })
    expect(toolPart.output).toEqual({ results: [] })
  })

  it('converts tool block with approval info', () => {
    const block: LucidBlock = {
      id: 'b8',
      type: 'tool',
      status: 'completed',
      content: {
        name: 'deploy',
        input: {},
        status: 'approval-required',
        approval: { id: 'appr-1', approved: true, reason: 'Looks good' },
      } as ToolBlockContent,
    }
    const parts = convertBlockToParts(block)
    const toolPart = parts[0] as VercelToolPart
    expect(toolPart.approval).toEqual({ id: 'appr-1', approved: true, reason: 'Looks good' })
  })

  it('returns empty array for unknown block type', () => {
    const block: LucidBlock = {
      id: 'b9',
      type: 'unknown-type' as any,
      status: 'completed',
      content: {},
    }
    const parts = convertBlockToParts(block)
    expect(parts).toEqual([])
  })
})

// ============================================================================
// toVercelMessage / toVercelMessages
// ============================================================================

describe('toVercelMessage', () => {
  it('converts a LucidConversation to a VercelUIMessage', () => {
    const conversation: LucidConversation = {
      id: 'conv-1',
      role: 'assistant',
      status: 'completed',
      blocks: [
        {
          id: 'b1',
          type: 'text',
          status: 'completed',
          content: { text: 'Response' } as TextBlockContent,
        },
      ],
      timestamp: 1000,
    }
    const message = toVercelMessage(conversation)

    expect(message.id).toBe('conv-1')
    expect(message.role).toBe('assistant')
    expect(message.parts).toHaveLength(1)
    expect(message.parts[0].type).toBe('text')
    expect((message.parts[0] as VercelTextPart).text).toBe('Response')
  })

  it('converts multiple blocks into multiple parts', () => {
    const conversation: LucidConversation = {
      id: 'conv-2',
      role: 'assistant',
      status: 'completed',
      blocks: [
        {
          id: 'b1',
          type: 'thinking',
          status: 'completed',
          content: { reasoning: 'Hmm' } as ThinkingBlockContent,
        },
        {
          id: 'b2',
          type: 'text',
          status: 'completed',
          content: { text: 'Answer' } as TextBlockContent,
        },
      ],
      timestamp: 2000,
    }
    const message = toVercelMessage(conversation)
    expect(message.parts).toHaveLength(2)
    expect(message.parts[0].type).toBe('reasoning')
    expect(message.parts[1].type).toBe('text')
  })
})

describe('toVercelMessages', () => {
  it('converts an array of conversations to messages', () => {
    const conversations: LucidConversation[] = [
      {
        id: 'c1',
        role: 'user',
        status: 'completed',
        blocks: [{ id: 'b1', type: 'text', status: 'completed', content: { text: 'Hi' } as TextBlockContent }],
        timestamp: 1000,
      },
      {
        id: 'c2',
        role: 'assistant',
        status: 'completed',
        blocks: [{ id: 'b2', type: 'text', status: 'completed', content: { text: 'Hey' } as TextBlockContent }],
        timestamp: 2000,
      },
    ]
    const messages = toVercelMessages(conversations)

    expect(messages).toHaveLength(2)
    expect(messages[0].id).toBe('c1')
    expect(messages[0].role).toBe('user')
    expect(messages[1].id).toBe('c2')
    expect(messages[1].role).toBe('assistant')
  })

  it('returns empty array for empty input', () => {
    expect(toVercelMessages([])).toEqual([])
  })
})
