import { describe, it, expect, beforeEach } from 'vitest'
import {
  fromA2UIPayload,
  fromA2UIPayloads,
  toA2UIPayload,
  type A2UIPayload,
  type A2UIComponent,
  type A2UIConversionOptions,
} from '../index'
import type {
  LucidConversation,
  LucidBlock,
  TextBlockContent,
  ImageBlockContent,
  ErrorBlockContent,
} from '@uix/core'

// Deterministic IDs for testing
let blockIdCounter = 0
const testGenerateBlockId = (componentId: string) => `test-block-${componentId}-${++blockIdCounter}`
const testGenerateConversationId = (surfaceId: string) => `test-conv-${surfaceId}`

function testOptions(): A2UIConversionOptions {
  blockIdCounter = 0
  return {
    generateBlockId: testGenerateBlockId,
    generateConversationId: testGenerateConversationId,
  }
}

// ============================================================================
// Helper to build payloads
// ============================================================================

function makePayload(
  components: A2UIComponent[],
  surfaceId = 'surface-1',
  version = 'v0.10'
): A2UIPayload {
  return {
    version,
    updateComponents: {
      surfaceId,
      components,
    },
  }
}

// ============================================================================
// fromA2UIPayload - Text Components
// ============================================================================

describe('fromA2UIPayload', () => {
  describe('text components', () => {
    it('converts a simple Text component to a text block', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['t1'] },
        { id: 't1', component: 'Text', text: 'Hello World' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv).not.toBeNull()
      expect(conv!.blocks).toHaveLength(1)
      expect(conv!.blocks[0].type).toBe('text')
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('Hello World')
    })

    it('converts multiple Text components in order', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['t1', 't2', 't3'] },
        { id: 't1', component: 'Text', text: 'First' },
        { id: 't2', component: 'Text', text: 'Second' },
        { id: 't3', component: 'Text', text: 'Third' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv!.blocks).toHaveLength(3)
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('First')
      expect((conv!.blocks[1].content as TextBlockContent).text).toBe('Second')
      expect((conv!.blocks[2].content as TextBlockContent).text).toBe('Third')
    })

    it('handles dynamic string binding with path', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['t1'] },
        { id: 't1', component: 'Text', text: { path: 'user.name' } },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('{{user.name}}')
    })

    it('handles dynamic string binding with call', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['t1'] },
        { id: 't1', component: 'Text', text: { call: 'formatDate', args: { format: 'iso' } } },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('{{formatDate(...)}}')
    })

    it('uses custom resolveValue when provided', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['t1'] },
        { id: 't1', component: 'Text', text: { path: 'greeting' } },
      ])

      const opts = testOptions()
      opts.resolveValue = (v) => {
        if (typeof v === 'object' && v !== null && 'path' in v) return `RESOLVED:${v.path}`
        return String(v)
      }

      const conv = fromA2UIPayload(payload, opts)
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('RESOLVED:greeting')
    })

    it('handles undefined/null text as empty string', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['t1'] },
        { id: 't1', component: 'Text' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('')
    })
  })

  // ============================================================================
  // Image Components
  // ============================================================================

  describe('image components', () => {
    it('converts an Image component to an image block', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['img1'] },
        { id: 'img1', component: 'Image', url: 'https://example.com/photo.png' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv!.blocks).toHaveLength(1)
      expect(conv!.blocks[0].type).toBe('image')
      const content = conv!.blocks[0].content as ImageBlockContent
      expect(content.url).toBe('https://example.com/photo.png')
      expect(content.alt).toBe('img1')
    })

    it('handles Image with dynamic URL binding', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['img1'] },
        { id: 'img1', component: 'Image', url: { path: 'data.imageUrl' } },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      const content = conv!.blocks[0].content as ImageBlockContent
      expect(content.url).toBe('{{data.imageUrl}}')
    })
  })

  // ============================================================================
  // Container Components
  // ============================================================================

  describe('container components', () => {
    it('flattens Row container - children become blocks, container is skipped', () => {
      const payload = makePayload([
        { id: 'root', component: 'Row', children: ['t1', 't2'] },
        { id: 't1', component: 'Text', text: 'Left' },
        { id: 't2', component: 'Text', text: 'Right' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv!.blocks).toHaveLength(2)
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('Left')
      expect((conv!.blocks[1].content as TextBlockContent).text).toBe('Right')
    })

    it('flattens nested containers (Column inside Row)', () => {
      const payload = makePayload([
        { id: 'root', component: 'Row', children: ['col1', 'col2'] },
        { id: 'col1', component: 'Column', children: ['t1'] },
        { id: 'col2', component: 'Column', children: ['t2', 't3'] },
        { id: 't1', component: 'Text', text: 'A' },
        { id: 't2', component: 'Text', text: 'B' },
        { id: 't3', component: 'Text', text: 'C' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv!.blocks).toHaveLength(3)
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('A')
      expect((conv!.blocks[1].content as TextBlockContent).text).toBe('B')
      expect((conv!.blocks[2].content as TextBlockContent).text).toBe('C')
    })

    it('flattens Card container using child property', () => {
      const payload = makePayload([
        { id: 'root', component: 'Card', child: 't1' },
        { id: 't1', component: 'Text', text: 'Card content' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv!.blocks).toHaveLength(1)
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('Card content')
    })

    it('flattens Modal container using child property', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['modal1'] },
        { id: 'modal1', component: 'Modal', child: 't1' },
        { id: 't1', component: 'Text', text: 'Modal body' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv!.blocks).toHaveLength(1)
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('Modal body')
    })

    it('flattens List container', () => {
      const payload = makePayload([
        { id: 'root', component: 'List', children: ['item1', 'item2'] },
        { id: 'item1', component: 'Text', text: 'Item 1' },
        { id: 'item2', component: 'Text', text: 'Item 2' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv!.blocks).toHaveLength(2)
    })

    it('handles Tabs container with tab titles and children', () => {
      const payload = makePayload([
        {
          id: 'root',
          component: 'Tabs',
          tabs: [
            { title: 'Tab A', child: 'content-a' },
            { title: 'Tab B', child: 'content-b' },
          ],
        },
        { id: 'content-a', component: 'Text', text: 'Content A' },
        { id: 'content-b', component: 'Text', text: 'Content B' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      // Should produce: tab title "Tab A", content A, tab title "Tab B", content B
      expect(conv!.blocks).toHaveLength(4)
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('**Tab A**')
      expect((conv!.blocks[1].content as TextBlockContent).text).toBe('Content A')
      expect((conv!.blocks[2].content as TextBlockContent).text).toBe('**Tab B**')
      expect((conv!.blocks[3].content as TextBlockContent).text).toBe('Content B')
    })

    it('handles template children (data-bound) by returning empty', () => {
      const payload = makePayload([
        {
          id: 'root',
          component: 'List',
          children: { path: 'items', componentId: 'item-template' },
        },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      // Template children can't be resolved without data model
      expect(conv!.blocks).toHaveLength(0)
    })
  })

  // ============================================================================
  // Input & Interactive Components
  // ============================================================================

  describe('input and interactive components', () => {
    it('converts Button component with event action', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['btn1'] },
        {
          id: 'btn1',
          component: 'Button',
          text: 'Submit',
          action: { event: { name: 'submit' } },
        },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv!.blocks).toHaveLength(1)
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe(
        '[Button: Submit] (action:submit)'
      )
    })

    it('converts Button component with functionCall action', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['btn1'] },
        {
          id: 'btn1',
          component: 'Button',
          text: 'Run',
          action: { functionCall: { name: 'runTask' } },
        },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe(
        '[Button: Run] (call:runTask)'
      )
    })

    it('converts Button without action', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['btn1'] },
        { id: 'btn1', component: 'Button', text: 'Click Me' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('[Button: Click Me]')
    })

    it('converts Button with no text - falls back to component id', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['btn-empty'] },
        { id: 'btn-empty', component: 'Button' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('[Button: btn-empty]')
    })

    it('converts TextField component', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['field1'] },
        { id: 'field1', component: 'TextField', label: 'Name', value: 'John' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe(
        '[TextField: Name] value="John"'
      )
    })

    it('converts TextField with no label - falls back to id', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['field1'] },
        { id: 'field1', component: 'TextField' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('[TextField: field1]')
    })

    it('converts CheckBox component', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['cb1'] },
        { id: 'cb1', component: 'CheckBox', label: 'Accept Terms' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('[CheckBox: Accept Terms]')
    })

    it('converts DateTimeInput component', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['dt1'] },
        { id: 'dt1', component: 'DateTimeInput', label: 'Start Date' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe(
        '[DateTimeInput: Start Date]'
      )
    })

    it('converts ChoicePicker with options', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['cp1'] },
        {
          id: 'cp1',
          component: 'ChoicePicker',
          label: 'Color',
          options: [
            { label: 'Red', value: 'red' },
            { label: 'Blue', value: 'blue' },
          ],
        },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe(
        '[ChoicePicker: Color] options=[Red, Blue]'
      )
    })

    it('converts ChoicePicker without options', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['cp1'] },
        { id: 'cp1', component: 'ChoicePicker', label: 'Pick' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('[ChoicePicker: Pick]')
    })

    it('converts Slider component with custom range', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['s1'] },
        { id: 's1', component: 'Slider', label: 'Volume', min: 0, max: 10 },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe(
        '[Slider: Volume] range=[0, 10]'
      )
    })

    it('converts Slider with default range when min/max not set', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['s1'] },
        { id: 's1', component: 'Slider', label: 'Level' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe(
        '[Slider: Level] range=[0, 100]'
      )
    })

    it('converts Divider component', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['d1'] },
        { id: 'd1', component: 'Divider' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('---')
    })
  })

  // ============================================================================
  // Display Components (Video, Audio, Icon)
  // ============================================================================

  describe('display components', () => {
    it('converts Video component', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['v1'] },
        { id: 'v1', component: 'Video', url: 'https://example.com/video.mp4' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe(
        '[Video: https://example.com/video.mp4]'
      )
    })

    it('converts AudioPlayer component', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['a1'] },
        { id: 'a1', component: 'AudioPlayer', url: 'https://example.com/audio.mp3' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe(
        '[Audio: https://example.com/audio.mp3]'
      )
    })

    it('converts Icon component', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['i1'] },
        { id: 'i1', component: 'Icon', name: 'check_circle' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('[Icon: check_circle]')
    })
  })

  // ============================================================================
  // Conversation Metadata
  // ============================================================================

  describe('conversation metadata', () => {
    it('sets role to assistant', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['t1'] },
        { id: 't1', component: 'Text', text: 'Hi' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv!.role).toBe('assistant')
    })

    it('sets status to completed', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['t1'] },
        { id: 't1', component: 'Text', text: 'Hi' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv!.status).toBe('completed')
    })

    it('uses custom conversation ID generator', () => {
      const payload = makePayload(
        [
          { id: 'root', component: 'Column', children: ['t1'] },
          { id: 't1', component: 'Text', text: 'Hi' },
        ],
        'my-surface'
      )

      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv!.id).toBe('test-conv-my-surface')
    })

    it('uses custom block ID generator', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['t1'] },
        { id: 't1', component: 'Text', text: 'Hi' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv!.blocks[0].id).toBe('test-block-t1-1')
    })

    it('sets timestamp', () => {
      const before = Date.now()
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['t1'] },
        { id: 't1', component: 'Text', text: 'Hi' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      const after = Date.now()
      expect(conv!.timestamp).toBeGreaterThanOrEqual(before)
      expect(conv!.timestamp).toBeLessThanOrEqual(after)
    })
  })

  // ============================================================================
  // Edge Cases
  // ============================================================================

  describe('edge cases', () => {
    it('returns null for payload without updateComponents', () => {
      const payload: A2UIPayload = {
        version: 'v0.10',
        createSurface: { surfaceId: 's1' },
      }

      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv).toBeNull()
    })

    it('returns null for deleteSurface payload', () => {
      const payload: A2UIPayload = {
        version: 'v0.10',
        deleteSurface: { surfaceId: 's1' },
      }

      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv).toBeNull()
    })

    it('returns null for updateDataModel payload', () => {
      const payload: A2UIPayload = {
        version: 'v0.10',
        updateDataModel: { surfaceId: 's1', path: '/foo', value: 42 },
      }

      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv).toBeNull()
    })

    it('handles empty components array', () => {
      const payload = makePayload([])

      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv).not.toBeNull()
      expect(conv!.blocks).toHaveLength(0)
    })

    it('handles components with no root - converts all non-container linearly', () => {
      const payload = makePayload([
        { id: 't1', component: 'Text', text: 'One' },
        { id: 't2', component: 'Text', text: 'Two' },
        { id: 'col1', component: 'Column', children: ['t1', 't2'] },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      // Column should be filtered out; only Text components remain
      expect(conv!.blocks).toHaveLength(2)
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('One')
      expect((conv!.blocks[1].content as TextBlockContent).text).toBe('Two')
    })

    it('handles unknown/custom component types', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['custom1'] },
        { id: 'custom1', component: 'MyCustomWidget' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv!.blocks).toHaveLength(1)
      expect(conv!.blocks[0].type).toBe('text')
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe(
        '[MyCustomWidget: custom1]'
      )
    })

    it('handles circular references in component tree (visited set prevents infinite loop)', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['a', 'b'] },
        { id: 'a', component: 'Text', text: 'A', children: ['b'] },
        { id: 'b', component: 'Text', text: 'B', children: ['a'] },
      ])

      // Should not hang or crash
      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv).not.toBeNull()
      // 'a' is visited first producing block, 'b' is visited next producing block
      // circular refs back to already-visited nodes are skipped
      expect(conv!.blocks).toHaveLength(2)
    })

    it('handles missing child references gracefully', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['t1', 'nonexistent'] },
        { id: 't1', component: 'Text', text: 'Exists' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      expect(conv!.blocks).toHaveLength(1)
      expect((conv!.blocks[0].content as TextBlockContent).text).toBe('Exists')
    })

    it('sets all block statuses to completed', () => {
      const payload = makePayload([
        { id: 'root', component: 'Column', children: ['t1', 'img1'] },
        { id: 't1', component: 'Text', text: 'Hello' },
        { id: 'img1', component: 'Image', url: 'https://example.com/img.png' },
      ])

      const conv = fromA2UIPayload(payload, testOptions())
      for (const block of conv!.blocks) {
        expect(block.status).toBe('completed')
      }
    })

    it('works with default options (no custom generators)', () => {
      const payload = makePayload(
        [
          { id: 'root', component: 'Column', children: ['t1'] },
          { id: 't1', component: 'Text', text: 'Default options' },
        ],
        'surf-default'
      )

      const conv = fromA2UIPayload(payload)
      expect(conv).not.toBeNull()
      expect(conv!.id).toBe('a2ui-conv-surf-default')
      expect(conv!.blocks).toHaveLength(1)
      expect(conv!.blocks[0].id).toContain('a2ui-block-t1')
    })
  })
})

// ============================================================================
// fromA2UIPayloads - Batch Conversion
// ============================================================================

describe('fromA2UIPayloads', () => {
  it('converts multiple updateComponents payloads', () => {
    const payloads: A2UIPayload[] = [
      makePayload(
        [
          { id: 'root', component: 'Column', children: ['t1'] },
          { id: 't1', component: 'Text', text: 'First surface' },
        ],
        'surface-1'
      ),
      makePayload(
        [
          { id: 'root', component: 'Column', children: ['t2'] },
          { id: 't2', component: 'Text', text: 'Second surface' },
        ],
        'surface-2'
      ),
    ]

    const conversations = fromA2UIPayloads(payloads, testOptions())
    expect(conversations).toHaveLength(2)
    expect(conversations[0].id).toBe('test-conv-surface-1')
    expect(conversations[1].id).toBe('test-conv-surface-2')
  })

  it('filters out non-updateComponents payloads', () => {
    const payloads: A2UIPayload[] = [
      { version: 'v0.10', createSurface: { surfaceId: 's1' } },
      makePayload(
        [
          { id: 'root', component: 'Column', children: ['t1'] },
          { id: 't1', component: 'Text', text: 'Only this' },
        ],
        'surface-1'
      ),
      { version: 'v0.10', deleteSurface: { surfaceId: 's1' } },
    ]

    const conversations = fromA2UIPayloads(payloads, testOptions())
    expect(conversations).toHaveLength(1)
    expect((conversations[0].blocks[0].content as TextBlockContent).text).toBe('Only this')
  })

  it('returns empty array for empty payloads', () => {
    const conversations = fromA2UIPayloads([], testOptions())
    expect(conversations).toEqual([])
  })

  it('returns empty array when no payloads have updateComponents', () => {
    const payloads: A2UIPayload[] = [
      { version: 'v0.10', createSurface: { surfaceId: 's1' } },
      { version: 'v0.10', deleteSurface: { surfaceId: 's1' } },
    ]

    const conversations = fromA2UIPayloads(payloads, testOptions())
    expect(conversations).toEqual([])
  })
})

// ============================================================================
// toA2UIPayload - Converting LucidConversation to A2UI
// ============================================================================

describe('toA2UIPayload', () => {
  describe('text blocks', () => {
    it('converts text blocks to Text components', () => {
      const conversation: LucidConversation = {
        id: 'conv-1',
        role: 'assistant',
        status: 'completed',
        blocks: [
          {
            id: 'b1',
            type: 'text',
            status: 'completed',
            content: { text: 'Hello World' } as TextBlockContent,
          },
        ],
        timestamp: Date.now(),
      }

      const payload = toA2UIPayload(conversation)
      expect(payload.version).toBe('v0.10')
      expect(payload.updateComponents).toBeDefined()
      expect(payload.updateComponents!.surfaceId).toBe('conv-1')

      const components = payload.updateComponents!.components
      // root Column + 1 Text component
      expect(components).toHaveLength(2)
      expect(components[0].id).toBe('root')
      expect(components[0].component).toBe('Column')
      expect(components[0].children).toEqual(['comp-b1'])
      expect(components[1].id).toBe('comp-b1')
      expect(components[1].component).toBe('Text')
      expect(components[1].text).toBe('Hello World')
    })

    it('converts multiple text blocks maintaining order', () => {
      const conversation: LucidConversation = {
        id: 'conv-1',
        role: 'assistant',
        status: 'completed',
        blocks: [
          { id: 'b1', type: 'text', status: 'completed', content: { text: 'First' } as TextBlockContent },
          { id: 'b2', type: 'text', status: 'completed', content: { text: 'Second' } as TextBlockContent },
        ],
        timestamp: Date.now(),
      }

      const payload = toA2UIPayload(conversation)
      const components = payload.updateComponents!.components
      expect(components).toHaveLength(3) // root + 2 text
      expect(components[0].children).toEqual(['comp-b1', 'comp-b2'])
      expect(components[1].text).toBe('First')
      expect(components[2].text).toBe('Second')
    })
  })

  describe('image blocks', () => {
    it('converts image blocks to Image components', () => {
      const conversation: LucidConversation = {
        id: 'conv-1',
        role: 'assistant',
        status: 'completed',
        blocks: [
          {
            id: 'b1',
            type: 'image',
            status: 'completed',
            content: { url: 'https://example.com/img.png', alt: 'A photo' } as ImageBlockContent,
          },
        ],
        timestamp: Date.now(),
      }

      const payload = toA2UIPayload(conversation)
      const components = payload.updateComponents!.components
      const imgComp = components.find((c) => c.component === 'Image')!
      expect(imgComp).toBeDefined()
      expect(imgComp.url).toBe('https://example.com/img.png')
    })
  })

  describe('thinking blocks', () => {
    it('converts thinking blocks to italic Text components', () => {
      const conversation: LucidConversation = {
        id: 'conv-1',
        role: 'assistant',
        status: 'completed',
        blocks: [
          {
            id: 'b1',
            type: 'thinking',
            status: 'completed',
            content: { reasoning: 'Let me consider the options' },
          },
        ],
        timestamp: Date.now(),
      }

      const payload = toA2UIPayload(conversation)
      const components = payload.updateComponents!.components
      const textComp = components.find((c) => c.id === 'comp-b1')!
      expect(textComp.component).toBe('Text')
      expect(textComp.text).toBe('*Thinking: Let me consider the options*')
    })
  })

  describe('tool blocks', () => {
    it('converts tool blocks to structured Text components', () => {
      const conversation: LucidConversation = {
        id: 'conv-1',
        role: 'assistant',
        status: 'completed',
        blocks: [
          {
            id: 'b1',
            type: 'tool',
            status: 'completed',
            content: {
              name: 'web_search',
              input: { query: 'test' },
              output: { results: ['r1'] },
              status: 'success',
            },
          },
        ],
        timestamp: Date.now(),
      }

      const payload = toA2UIPayload(conversation)
      const components = payload.updateComponents!.components
      const textComp = components.find((c) => c.id === 'comp-b1')!
      expect(textComp.component).toBe('Text')
      const text = textComp.text as string
      expect(text).toContain('**Tool: web_search**')
      expect(text).toContain('Input: `{"query":"test"}`')
      expect(text).toContain('Output: `{"results":["r1"]}`')
      expect(text).toContain('Status: success')
    })

    it('converts tool block without output', () => {
      const conversation: LucidConversation = {
        id: 'conv-1',
        role: 'assistant',
        status: 'completed',
        blocks: [
          {
            id: 'b1',
            type: 'tool',
            status: 'completed',
            content: {
              name: 'calculator',
              input: { expr: '2+2' },
              status: 'running',
            },
          },
        ],
        timestamp: Date.now(),
      }

      const payload = toA2UIPayload(conversation)
      const textComp = payload.updateComponents!.components.find((c) => c.id === 'comp-b1')!
      const text = textComp.text as string
      expect(text).toContain('**Tool: calculator**')
      expect(text).toContain('Input: `{"expr":"2+2"}`')
      expect(text).not.toContain('Output:')
      expect(text).toContain('Status: running')
    })

    it('converts tool block without input', () => {
      const conversation: LucidConversation = {
        id: 'conv-1',
        role: 'assistant',
        status: 'completed',
        blocks: [
          {
            id: 'b1',
            type: 'tool',
            status: 'completed',
            content: {
              name: 'get_time',
              input: null,
              output: '12:00',
              status: 'success',
            },
          },
        ],
        timestamp: Date.now(),
      }

      const payload = toA2UIPayload(conversation)
      const textComp = payload.updateComponents!.components.find((c) => c.id === 'comp-b1')!
      const text = textComp.text as string
      expect(text).toContain('**Tool: get_time**')
      expect(text).not.toContain('Input:')
      expect(text).toContain('Output: `"12:00"`')
    })
  })

  describe('error blocks', () => {
    it('converts error blocks to formatted Text components', () => {
      const conversation: LucidConversation = {
        id: 'conv-1',
        role: 'assistant',
        status: 'completed',
        blocks: [
          {
            id: 'b1',
            type: 'error',
            status: 'completed',
            content: { code: 'RATE_LIMIT', message: 'Too many requests' } as ErrorBlockContent,
          },
        ],
        timestamp: Date.now(),
      }

      const payload = toA2UIPayload(conversation)
      const textComp = payload.updateComponents!.components.find((c) => c.id === 'comp-b1')!
      expect(textComp.component).toBe('Text')
      expect(textComp.text).toBe('**Error [RATE_LIMIT]:** Too many requests')
    })
  })

  describe('file blocks', () => {
    it('converts file blocks to markdown link Text components', () => {
      const conversation: LucidConversation = {
        id: 'conv-1',
        role: 'assistant',
        status: 'completed',
        blocks: [
          {
            id: 'b1',
            type: 'file',
            status: 'completed',
            content: { name: 'report.pdf', url: 'https://example.com/report.pdf', type: 'application/pdf' },
          },
        ],
        timestamp: Date.now(),
      }

      const payload = toA2UIPayload(conversation)
      const textComp = payload.updateComponents!.components.find((c) => c.id === 'comp-b1')!
      expect(textComp.text).toBe('[File: report.pdf](https://example.com/report.pdf)')
    })
  })

  describe('source blocks', () => {
    it('converts source block with URL to markdown link', () => {
      const conversation: LucidConversation = {
        id: 'conv-1',
        role: 'assistant',
        status: 'completed',
        blocks: [
          {
            id: 'b1',
            type: 'source',
            status: 'completed',
            content: { title: 'Wikipedia', url: 'https://en.wikipedia.org' },
          },
        ],
        timestamp: Date.now(),
      }

      const payload = toA2UIPayload(conversation)
      const textComp = payload.updateComponents!.components.find((c) => c.id === 'comp-b1')!
      expect(textComp.text).toBe('[Source: Wikipedia](https://en.wikipedia.org)')
    })

    it('converts source block without URL to plain text', () => {
      const conversation: LucidConversation = {
        id: 'conv-1',
        role: 'assistant',
        status: 'completed',
        blocks: [
          {
            id: 'b1',
            type: 'source',
            status: 'completed',
            content: { title: 'Internal Doc' },
          },
        ],
        timestamp: Date.now(),
      }

      const payload = toA2UIPayload(conversation)
      const textComp = payload.updateComponents!.components.find((c) => c.id === 'comp-b1')!
      expect(textComp.text).toBe('Source: Internal Doc')
    })

    it('converts source block with excerpt', () => {
      const conversation: LucidConversation = {
        id: 'conv-1',
        role: 'assistant',
        status: 'completed',
        blocks: [
          {
            id: 'b1',
            type: 'source',
            status: 'completed',
            content: { title: 'Article', url: 'https://example.com', excerpt: 'Key finding here' },
          },
        ],
        timestamp: Date.now(),
      }

      const payload = toA2UIPayload(conversation)
      const textComp = payload.updateComponents!.components.find((c) => c.id === 'comp-b1')!
      expect(textComp.text).toBe(
        '[Source: Article](https://example.com)\n\n> Key finding here'
      )
    })
  })

  describe('unknown block types', () => {
    it('converts unknown block types to fallback Text components', () => {
      const conversation: LucidConversation = {
        id: 'conv-1',
        role: 'assistant',
        status: 'completed',
        blocks: [
          {
            id: 'b1',
            type: 'custom-type' as any,
            status: 'completed',
            content: {},
          },
        ],
        timestamp: Date.now(),
      }

      const payload = toA2UIPayload(conversation)
      const textComp = payload.updateComponents!.components.find((c) => c.id === 'comp-b1')!
      expect(textComp.component).toBe('Text')
      expect(textComp.text).toBe('[custom-type: b1]')
    })
  })

  describe('options', () => {
    it('uses custom surfaceId when provided', () => {
      const conversation: LucidConversation = {
        id: 'conv-1',
        role: 'assistant',
        status: 'completed',
        blocks: [
          { id: 'b1', type: 'text', status: 'completed', content: { text: 'Hi' } as TextBlockContent },
        ],
        timestamp: Date.now(),
      }

      const payload = toA2UIPayload(conversation, 'custom-surface')
      expect(payload.updateComponents!.surfaceId).toBe('custom-surface')
    })

    it('defaults surfaceId to conversation.id', () => {
      const conversation: LucidConversation = {
        id: 'my-conv-id',
        role: 'assistant',
        status: 'completed',
        blocks: [],
        timestamp: Date.now(),
      }

      const payload = toA2UIPayload(conversation)
      expect(payload.updateComponents!.surfaceId).toBe('my-conv-id')
    })

    it('uses custom version when provided', () => {
      const conversation: LucidConversation = {
        id: 'conv-1',
        role: 'assistant',
        status: 'completed',
        blocks: [],
        timestamp: Date.now(),
      }

      const payload = toA2UIPayload(conversation, undefined, 'v0.9')
      expect(payload.version).toBe('v0.9')
    })

    it('defaults version to v0.10', () => {
      const conversation: LucidConversation = {
        id: 'conv-1',
        role: 'assistant',
        status: 'completed',
        blocks: [],
        timestamp: Date.now(),
      }

      const payload = toA2UIPayload(conversation)
      expect(payload.version).toBe('v0.10')
    })
  })

  describe('empty conversation', () => {
    it('produces a payload with only a root Column and no children', () => {
      const conversation: LucidConversation = {
        id: 'conv-empty',
        role: 'assistant',
        status: 'completed',
        blocks: [],
        timestamp: Date.now(),
      }

      const payload = toA2UIPayload(conversation)
      const components = payload.updateComponents!.components
      expect(components).toHaveLength(1)
      expect(components[0].id).toBe('root')
      expect(components[0].component).toBe('Column')
      expect(components[0].children).toEqual([])
    })
  })

  describe('mixed block types', () => {
    it('converts a conversation with text, image, and error blocks', () => {
      const conversation: LucidConversation = {
        id: 'conv-mixed',
        role: 'assistant',
        status: 'completed',
        blocks: [
          { id: 'b1', type: 'text', status: 'completed', content: { text: 'Analysis:' } as TextBlockContent },
          { id: 'b2', type: 'image', status: 'completed', content: { url: 'https://chart.png', alt: 'Chart' } as ImageBlockContent },
          { id: 'b3', type: 'error', status: 'completed', content: { code: 'TIMEOUT', message: 'Request timed out' } as ErrorBlockContent },
        ],
        timestamp: Date.now(),
      }

      const payload = toA2UIPayload(conversation)
      const components = payload.updateComponents!.components
      expect(components).toHaveLength(4) // root + 3

      expect(components[0].children).toEqual(['comp-b1', 'comp-b2', 'comp-b3'])
      expect(components[1].component).toBe('Text')
      expect(components[1].text).toBe('Analysis:')
      expect(components[2].component).toBe('Image')
      expect(components[2].url).toBe('https://chart.png')
      expect(components[3].component).toBe('Text')
      expect(components[3].text).toBe('**Error [TIMEOUT]:** Request timed out')
    })
  })
})
