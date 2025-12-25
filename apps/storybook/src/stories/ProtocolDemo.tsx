import { useState, useEffect, useCallback } from 'react'
import type { LucidConversation, LucidBlock } from '@uix/core'

// ============================================================================
// Types
// ============================================================================

interface AIEvent {
  id: string
  type: 'message_start' | 'content_block_start' | 'content_block_delta' | 'content_block_stop' | 'message_stop'
  data: Record<string, unknown>
  timestamp: number
}

// ============================================================================
// Mock Data
// ============================================================================

const mockEvents: Omit<AIEvent, 'id' | 'timestamp'>[] = [
  { type: 'message_start', data: { role: 'assistant' } },
  { type: 'content_block_start', data: { type: 'thinking', index: 0 } },
  { type: 'content_block_delta', data: { type: 'thinking_delta', thinking: 'Let me analyze this request...' } },
  { type: 'content_block_stop', data: { index: 0 } },
  { type: 'content_block_start', data: { type: 'tool_use', index: 1, name: 'search', id: 'tool_1' } },
  { type: 'content_block_delta', data: { type: 'input_json_delta', partial_json: '{"query": "UIX IR"}' } },
  { type: 'content_block_stop', data: { index: 1 } },
  { type: 'content_block_start', data: { type: 'text', index: 2 } },
  { type: 'content_block_delta', data: { type: 'text_delta', text: 'Based on my research, ' } },
  { type: 'content_block_delta', data: { type: 'text_delta', text: '**UIX IR** is an intermediate representation ' } },
  { type: 'content_block_delta', data: { type: 'text_delta', text: 'that bridges AI output and UI rendering.' } },
  { type: 'content_block_stop', data: { index: 2 } },
  { type: 'message_stop', data: {} },
]

// ============================================================================
// Event Panel
// ============================================================================

function EventPanel({ events, activeIndex }: { events: AIEvent[]; activeIndex: number }) {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-medium text-gray-700">AI Events</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`p-2 rounded border text-xs transition-all ${
              index === activeIndex
                ? 'border-blue-400 bg-blue-50'
                : index < activeIndex
                  ? 'border-gray-200 bg-gray-50 opacity-60'
                  : 'border-gray-100 opacity-30'
            }`}
          >
            <span className={`font-mono px-1 py-0.5 rounded text-[10px] ${
              event.type.includes('start') ? 'bg-green-100 text-green-700' :
              event.type.includes('stop') ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {event.type}
            </span>
          </div>
        ))}
        {events.length === 0 && (
          <div className="text-center py-4 text-gray-400 text-xs">Waiting...</div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// IR Panel
// ============================================================================

function IRPanel({ conversation }: { conversation: LucidConversation | null }) {
  const json = conversation ? JSON.stringify(conversation, null, 2) : '// UIX IR...'

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <span className="text-xs font-medium text-gray-700">UIX IR</span>
        <span className="text-[10px] ml-auto font-mono text-gray-400">@uix/core</span>
      </div>
      <div className="flex-1 overflow-auto p-2">
        <pre className="text-[10px] font-mono leading-relaxed text-gray-600">
          {json.split('\n').slice(0, 20).map((line, i) => (
            <div key={i} className={
              line.includes('"status": "streaming"') ? 'text-yellow-600' :
              line.includes('"status": "completed"') ? 'text-green-600' :
              line.includes('"type":') ? 'text-blue-600' : ''
            }>
              {line}
            </div>
          ))}
          {json.split('\n').length > 20 && <div className="text-gray-400">...</div>}
        </pre>
      </div>
    </div>
  )
}

// ============================================================================
// Rendered Panel
// ============================================================================

function RenderedPanel({ conversation }: { conversation: LucidConversation | null }) {
  if (!conversation) {
    return (
      <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-xs font-medium text-gray-700">Rendered UI</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400 text-xs">
          Waiting...
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200">
        <div className="w-2 h-2 rounded-full bg-purple-500" />
        <span className="text-xs font-medium text-gray-700">Rendered UI</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {conversation.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </div>
  )
}

function BlockRenderer({ block }: { block: LucidBlock }) {
  switch (block.type) {
    case 'thinking':
      return (
        <div className="p-2 rounded bg-amber-50 border border-amber-200 text-xs">
          <div className="flex items-center gap-1 mb-1">
            <span>💭</span>
            <span className="font-medium text-amber-700">Thinking</span>
          </div>
          <p className="italic text-gray-600">
            {(block.content as { reasoning: string }).reasoning}
          </p>
        </div>
      )
    case 'tool':
      const tool = block.content as { name: string; input: unknown; status: string }
      return (
        <div className="p-2 rounded bg-blue-50 border border-blue-200 text-xs">
          <div className="flex items-center gap-1 mb-1">
            <span>🔧</span>
            <span className="font-medium text-blue-700">{tool.name}</span>
            <span className={`ml-1 px-1 rounded text-[10px] ${
              tool.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {tool.status}
            </span>
          </div>
          <pre className="font-mono text-[10px] text-gray-600 bg-white/50 p-1 rounded">
            {JSON.stringify(tool.input)}
          </pre>
        </div>
      )
    case 'text':
      const text = (block.content as { text: string }).text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      return (
        <p className="text-xs text-gray-700" dangerouslySetInnerHTML={{ __html: text }} />
      )
    default:
      return null
  }
}

// ============================================================================
// Main Component
// ============================================================================

export function ProtocolDemo() {
  const [events, setEvents] = useState<AIEvent[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [conversation, setConversation] = useState<LucidConversation | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const processEvent = useCallback((event: AIEvent) => {
    setConversation(prev => {
      if (!prev) {
        if (event.type === 'message_start') {
          return { id: `conv-${Date.now()}`, role: 'assistant', status: 'streaming', blocks: [], timestamp: Date.now() }
        }
        return null
      }

      const updated = { ...prev, blocks: [...prev.blocks] }

      switch (event.type) {
        case 'content_block_start': {
          const type = event.data.type as string
          const newBlock: LucidBlock = {
            id: `block-${event.data.index}`,
            type: type === 'thinking' ? 'thinking' : type === 'tool_use' ? 'tool' : 'text',
            status: 'streaming',
            content: type === 'thinking' ? { reasoning: '' } :
                     type === 'tool_use' ? { name: event.data.name as string, input: {}, status: 'running' } :
                     { text: '' }
          } as LucidBlock
          updated.blocks.push(newBlock)
          break
        }
        case 'content_block_delta': {
          const last = updated.blocks[updated.blocks.length - 1]
          if (last) {
            if (event.data.type === 'thinking_delta') {
              (last.content as { reasoning: string }).reasoning += event.data.thinking
            } else if (event.data.type === 'text_delta') {
              (last.content as { text: string }).text += event.data.text
            } else if (event.data.type === 'input_json_delta') {
              try { (last.content as { input: unknown }).input = JSON.parse(event.data.partial_json as string) } catch {}
            }
          }
          break
        }
        case 'content_block_stop': {
          const idx = event.data.index as number
          if (updated.blocks[idx]) {
            updated.blocks[idx] = { ...updated.blocks[idx], status: 'completed' }
            if (updated.blocks[idx].type === 'tool') {
              (updated.blocks[idx].content as { status: string }).status = 'success'
            }
          }
          break
        }
        case 'message_stop':
          updated.status = 'completed'
          break
      }
      return updated
    })
  }, [])

  const runDemo = useCallback(async () => {
    setIsRunning(true)
    setEvents([])
    setConversation(null)
    setActiveIndex(-1)

    for (let i = 0; i < mockEvents.length; i++) {
      await new Promise(r => setTimeout(r, 500))
      const event: AIEvent = { ...mockEvents[i], id: `e-${i}`, timestamp: Date.now() }
      setEvents(prev => [...prev, event])
      setActiveIndex(i)
      processEvent(event)
    }
    setIsRunning(false)
  }, [processEvent])

  useEffect(() => {
    const t = setTimeout(runDemo, 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="bg-gray-100 p-4 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Protocol Demo</h3>
          <p className="text-xs text-gray-500">AI Events → UIX IR → Rendered UI</p>
        </div>
        <button
          onClick={runDemo}
          disabled={isRunning}
          className={`px-3 py-1.5 rounded text-xs font-medium transition ${
            isRunning ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-500'
          }`}
        >
          {isRunning ? 'Running...' : 'Run Demo'}
        </button>
      </div>

      {/* Flow Diagram */}
      <div className="flex items-center justify-center gap-2 mb-4 text-xs">
        <span className="px-2 py-1 rounded bg-green-100 text-green-700">AI Events</span>
        <span className="text-gray-400">→</span>
        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">UIX IR</span>
        <span className="text-gray-400">→</span>
        <span className="px-2 py-1 rounded bg-purple-100 text-purple-700">UI</span>
      </div>

      {/* Three Columns */}
      <div className="grid grid-cols-3 gap-3 h-[280px]">
        <EventPanel events={events} activeIndex={activeIndex} />
        <IRPanel conversation={conversation} />
        <RenderedPanel conversation={conversation} />
      </div>
    </div>
  )
}

export default ProtocolDemo
