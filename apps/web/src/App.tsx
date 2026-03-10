import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import type { LucidConversation, LucidBlock } from '@uix-ai/core'

// ============================================================================
// Theme Context
// ============================================================================

type Theme = 'dark' | 'light'
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'light',
  toggle: () => {}
})

const useTheme = () => useContext(ThemeContext)

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('uix-theme') as Theme
      return saved || 'dark'
    }
    return 'dark'
  })

  const toggle = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('uix-theme', next)
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

// ============================================================================
// Types
// ============================================================================

type ProtocolSource = 'anthropic' | 'ag-ui' | 'vercel'

interface AIEvent {
  id: string
  type: string
  data: Record<string, unknown>
  timestamp: number
}

interface ProtocolConfig {
  name: string
  label: string
  adapter: string
  color: string
  description: string
  mockEvents: Omit<AIEvent, 'id' | 'timestamp'>[]
  processEvent: (event: AIEvent, prev: LucidConversation | null) => LucidConversation | null
}

// ============================================================================
// Mock Data - Anthropic Events
// ============================================================================

const anthropicEvents: Omit<AIEvent, 'id' | 'timestamp'>[] = [
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
// Mock Data - AG-UI Protocol Events
// ============================================================================

const agUIEvents: Omit<AIEvent, 'id' | 'timestamp'>[] = [
  { type: 'RunStarted', data: { threadId: 'thread-1', runId: 'run-1' } },
  { type: 'TextMessageStart', data: { messageId: 'msg-1', role: 'assistant' } },
  { type: 'ToolCallStart', data: { toolCallId: 'tc-1', toolCallName: 'search', parentMessageId: 'msg-1' } },
  { type: 'ToolCallArgs', data: { toolCallId: 'tc-1', delta: '{"query": "UIX protocol"}' } },
  { type: 'ToolCallEnd', data: { toolCallId: 'tc-1' } },
  { type: 'TextMessageContent', data: { messageId: 'msg-1', delta: 'Based on my research, ' } },
  { type: 'TextMessageContent', data: { messageId: 'msg-1', delta: '**UIX IR** is an intermediate representation ' } },
  { type: 'TextMessageContent', data: { messageId: 'msg-1', delta: 'that bridges AI output and UI rendering.' } },
  { type: 'TextMessageEnd', data: { messageId: 'msg-1' } },
  { type: 'RunFinished', data: { threadId: 'thread-1', runId: 'run-1', outcome: 'success' } },
]

// ============================================================================
// Mock Data - Vercel AI SDK Messages (parts-based)
// ============================================================================

const vercelEvents: Omit<AIEvent, 'id' | 'timestamp'>[] = [
  { type: 'message', data: { role: 'assistant', status: 'streaming' } },
  { type: 'part', data: { type: 'reasoning', text: 'Let me analyze this request...', state: 'streaming' } },
  { type: 'part', data: { type: 'reasoning', text: 'Let me analyze this request...', state: 'done' } },
  { type: 'part', data: { type: 'tool-search', toolCallId: 'tc-1', state: 'input-available', input: { query: 'UIX IR' } } },
  { type: 'part', data: { type: 'tool-search', toolCallId: 'tc-1', state: 'output-available', input: { query: 'UIX IR' }, output: '3 results found' } },
  { type: 'part', data: { type: 'text', text: 'Based on my research, ', state: 'streaming' } },
  { type: 'part', data: { type: 'text', text: 'Based on my research, **UIX IR** is an intermediate representation ', state: 'streaming' } },
  { type: 'part', data: { type: 'text', text: 'Based on my research, **UIX IR** is an intermediate representation that bridges AI output and UI rendering.', state: 'done' } },
  { type: 'message', data: { role: 'assistant', status: 'done' } },
]

// ============================================================================
// Event Processors
// ============================================================================

function processAnthropicEvent(event: AIEvent, prev: LucidConversation | null): LucidConversation | null {
  if (!prev) {
    if (event.type === 'message_start') {
      return { id: `conv-${Date.now()}`, role: 'assistant', status: 'streaming', blocks: [], timestamp: Date.now() }
    }
    return null
  }
  const updated = { ...prev, blocks: [...prev.blocks] }
  switch (event.type) {
    case 'content_block_start': {
      const blockType = event.data.type as string
      const newBlock: LucidBlock = {
        id: `block-${event.data.index}`,
        type: blockType === 'thinking' ? 'thinking' : blockType === 'tool_use' ? 'tool' : 'text',
        status: 'streaming',
        content: blockType === 'thinking' ? { reasoning: '' } :
                 blockType === 'tool_use' ? { name: event.data.name as string, input: {}, status: 'running' } :
                 { text: '' }
      } as LucidBlock
      updated.blocks.push(newBlock)
      break
    }
    case 'content_block_delta': {
      const lastBlock = updated.blocks[updated.blocks.length - 1]
      if (lastBlock) {
        if (event.data.type === 'thinking_delta') (lastBlock.content as { reasoning: string }).reasoning += event.data.thinking
        else if (event.data.type === 'text_delta') (lastBlock.content as { text: string }).text += event.data.text
        else if (event.data.type === 'input_json_delta') {
          try { (lastBlock.content as { input: unknown }).input = JSON.parse(event.data.partial_json as string) } catch {}
        }
      }
      break
    }
    case 'content_block_stop': {
      const blockIndex = event.data.index as number
      if (updated.blocks[blockIndex]) {
        updated.blocks[blockIndex] = { ...updated.blocks[blockIndex], status: 'completed' }
        if (updated.blocks[blockIndex].type === 'tool') (updated.blocks[blockIndex].content as { status: string }).status = 'success'
      }
      break
    }
    case 'message_stop':
      updated.status = 'completed'
      break
  }
  return updated
}

function processAGUIEvent(event: AIEvent, prev: LucidConversation | null): LucidConversation | null {
  if (event.type === 'RunStarted') return null
  if (event.type === 'TextMessageStart') {
    return { id: event.data.messageId as string, role: 'assistant', status: 'streaming', blocks: [
      { id: `text-${Date.now()}`, type: 'text', status: 'streaming', content: { text: '' } }
    ], timestamp: Date.now() }
  }
  if (!prev) return null
  const updated = { ...prev, blocks: [...prev.blocks] }

  switch (event.type) {
    case 'ToolCallStart': {
      updated.blocks.push({
        id: event.data.toolCallId as string,
        type: 'tool',
        status: 'streaming',
        content: { name: event.data.toolCallName as string, input: {}, status: 'running' }
      } as LucidBlock)
      break
    }
    case 'ToolCallArgs': {
      const tool = updated.blocks.find(b => b.id === event.data.toolCallId)
      if (tool) {
        try { (tool.content as { input: unknown }).input = JSON.parse(event.data.delta as string) } catch {}
      }
      break
    }
    case 'ToolCallEnd': {
      const tool = updated.blocks.find(b => b.id === event.data.toolCallId)
      if (tool) {
        tool.status = 'completed';
        (tool.content as { status: string }).status = 'success'
      }
      break
    }
    case 'TextMessageContent': {
      const textBlock = updated.blocks.find(b => b.type === 'text')
      if (textBlock) (textBlock.content as { text: string }).text += event.data.delta as string
      break
    }
    case 'TextMessageEnd': {
      const textBlock = updated.blocks.find(b => b.type === 'text')
      if (textBlock) textBlock.status = 'completed'
      updated.status = 'completed'
      break
    }
    case 'RunFinished':
      updated.status = 'completed'
      break
  }
  return updated
}

function processVercelEvent(event: AIEvent, prev: LucidConversation | null): LucidConversation | null {
  if (event.type === 'message' && !prev) {
    return { id: `conv-${Date.now()}`, role: 'assistant', status: 'streaming', blocks: [], timestamp: Date.now() }
  }
  if (event.type === 'message' && prev && event.data.status === 'done') {
    return { ...prev, status: 'completed' }
  }
  if (!prev) return null
  const updated = { ...prev, blocks: [...prev.blocks] }

  if (event.type === 'part') {
    const partType = event.data.type as string
    if (partType === 'reasoning') {
      const existing = updated.blocks.find(b => b.type === 'thinking')
      if (existing) {
        (existing.content as { reasoning: string }).reasoning = event.data.text as string
        existing.status = event.data.state === 'done' ? 'completed' : 'streaming'
      } else {
        updated.blocks.push({
          id: `thinking-${Date.now()}`, type: 'thinking',
          status: event.data.state === 'done' ? 'completed' : 'streaming',
          content: { reasoning: event.data.text as string }
        } as LucidBlock)
      }
    } else if (partType === 'text') {
      const existing = updated.blocks.find(b => b.type === 'text')
      if (existing) {
        (existing.content as { text: string }).text = event.data.text as string
        existing.status = event.data.state === 'done' ? 'completed' : 'streaming'
      } else {
        updated.blocks.push({
          id: `text-${Date.now()}`, type: 'text',
          status: event.data.state === 'done' ? 'completed' : 'streaming',
          content: { text: event.data.text as string }
        } as LucidBlock)
      }
    } else if (partType.startsWith('tool-')) {
      const toolName = partType.replace('tool-', '')
      const existing = updated.blocks.find(b => b.type === 'tool' && (b.content as { name: string }).name === toolName)
      const state = event.data.state as string
      const toolStatus = state === 'output-available' ? 'success' : state === 'output-error' ? 'error' : 'running'
      if (existing) {
        (existing.content as { status: string }).status = toolStatus
        if (event.data.input) (existing.content as { input: unknown }).input = event.data.input
        if (event.data.output) (existing.content as { output: unknown }).output = event.data.output
        existing.status = state.includes('output') ? 'completed' : 'streaming'
      } else {
        updated.blocks.push({
          id: event.data.toolCallId as string, type: 'tool', status: 'streaming',
          content: { name: toolName, input: event.data.input ?? {}, status: toolStatus }
        } as LucidBlock)
      }
    }
  }
  return updated
}

// ============================================================================
// Protocol Configurations
// ============================================================================

const protocols: Record<ProtocolSource, ProtocolConfig> = {
  anthropic: {
    name: 'Anthropic',
    label: 'Anthropic Events',
    adapter: '@uix-ai/core (direct)',
    color: 'amber',
    description: 'Claude API streaming events',
    mockEvents: anthropicEvents,
    processEvent: processAnthropicEvent,
  },
  'ag-ui': {
    name: 'AG-UI',
    label: 'AG-UI Protocol',
    adapter: '@uix-ai/adapter-agui',
    color: 'green',
    description: 'Agent-User Interaction Protocol (CopilotKit / Google / Microsoft)',
    mockEvents: agUIEvents,
    processEvent: processAGUIEvent,
  },
  vercel: {
    name: 'Vercel AI SDK',
    label: 'Vercel AI SDK',
    adapter: '@uix-ai/adapter-vercel',
    color: 'blue',
    description: 'Vercel AI SDK 4.x / 6.x message parts',
    mockEvents: vercelEvents,
    processEvent: processVercelEvent,
  },
}

// ============================================================================
// Event Panel Component
// ============================================================================

function EventPanel({
  events,
  activeIndex,
  protocol,
  showHeader = true
}: {
  events: AIEvent[]
  activeIndex: number
  protocol: ProtocolConfig
  showHeader?: boolean
}) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="flex flex-col h-full">
      {showHeader && (
        <div className={`flex items-center gap-2 px-4 py-3 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className={`text-sm font-medium ${isDark ? 'text-white/90' : 'text-gray-800'}`}>{protocol.label}</h2>
          <span className={`text-xs ml-auto font-mono ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
            → {protocol.adapter}
          </span>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 code-scrollbar">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`
              p-3 rounded-lg border transition-all duration-300
              ${index === activeIndex
                ? `border-blue-500/50 bg-blue-500/10 animate-pulse-glow`
                : index < activeIndex
                  ? `${isDark ? 'border-white/5 bg-white/5' : 'border-gray-200 bg-gray-100'} opacity-60`
                  : `${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'} opacity-30`
              }
              ${index <= activeIndex ? 'animate-fade-in-up' : ''}
            `}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`
                text-xs font-mono px-1.5 py-0.5 rounded
                ${event.type.includes('start') ? 'bg-green-500/20 text-green-600' :
                  event.type.includes('stop') ? 'bg-red-500/20 text-red-600' :
                  'bg-blue-500/20 text-blue-600'}
              `}>
                {event.type}
              </span>
              <span className={`text-xs font-mono ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <pre className={`text-xs font-mono overflow-hidden text-ellipsis ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
              {JSON.stringify(event.data, null, 0).slice(0, 50)}
              {JSON.stringify(event.data).length > 50 ? '...' : ''}
            </pre>
          </div>
        ))}
        {events.length === 0 && (
          <div className={`text-center py-8 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
            Waiting for events...
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// IR Panel Component
// ============================================================================

function IRPanel({ conversation, showHeader = true }: { conversation: LucidConversation | null; showHeader?: boolean }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const jsonString = conversation
    ? JSON.stringify(conversation, null, 2)
    : '// UIX IR will appear here...'

  return (
    <div className="flex flex-col h-full">
      {showHeader && (
        <div className={`flex items-center gap-2 px-4 py-3 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <h2 className={`text-sm font-medium ${isDark ? 'text-white/90' : 'text-gray-800'}`}>UIX IR</h2>
          <span className={`text-xs ml-auto font-mono ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
            @uix-ai/core
          </span>
        </div>
      )}
      <div className="flex-1 overflow-auto p-4 code-scrollbar">
        <pre className="text-xs font-mono leading-relaxed">
          <code className={isDark ? 'text-white/80' : 'text-gray-700'}>
            {jsonString.split('\n').map((line, i) => (
              <div
                key={i}
                className={`
                  ${line.includes('"status": "streaming"') ? 'text-yellow-600 bg-yellow-500/10' : ''}
                  ${line.includes('"status": "completed"') ? 'text-green-600' : ''}
                  ${line.includes('"type":') ? 'text-blue-600' : ''}
                `}
              >
                <span className={`select-none mr-4 ${isDark ? 'text-white/20' : 'text-gray-300'}`}>{String(i + 1).padStart(3, ' ')}</span>
                {line}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}

// ============================================================================
// Rendered UI Panel Component
// ============================================================================

function RenderedPanel({ conversation, showHeader = true }: { conversation: LucidConversation | null; showHeader?: boolean }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (!conversation) {
    return (
      <div className="flex flex-col h-full">
        {showHeader && (
          <div className={`flex items-center gap-2 px-4 py-3 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <h2 className={`text-sm font-medium ${isDark ? 'text-white/90' : 'text-gray-800'}`}>Rendered UI</h2>
          </div>
        )}
        <div className={`flex-1 flex items-center justify-center ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
          UI will render here...
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {showHeader && (
        <div className={`flex items-center gap-2 px-4 py-3 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <h2 className={`text-sm font-medium ${isDark ? 'text-white/90' : 'text-gray-800'}`}>Rendered UI</h2>
          <span className={`text-xs ml-auto font-mono ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
            @uix-ai/stream
          </span>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 code-scrollbar">
        {conversation.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
        {conversation.status === 'streaming' && (
          <span className={`inline-block w-2 h-4 animate-cursor ${isDark ? 'bg-white/80' : 'bg-gray-800'}`} />
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Block Renderer Component
// ============================================================================

function BlockRenderer({ block }: { block: LucidBlock }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  switch (block.type) {
    case 'thinking':
      return (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-500">💭</span>
            <span className="text-xs font-medium text-amber-600">Thinking</span>
            {block.status === 'streaming' && (
              <span className="text-xs text-amber-500/50 animate-pulse">...</span>
            )}
          </div>
          <p className={`text-sm italic ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
            {(block.content as { reasoning: string }).reasoning}
          </p>
        </div>
      )

    case 'tool':
      const toolContent = block.content as { name: string; input: unknown; status: string }
      return (
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-500">🔧</span>
            <span className="text-xs font-medium text-blue-600">{toolContent.name}</span>
            <span className={`
              text-xs px-1.5 py-0.5 rounded
              ${toolContent.status === 'running' ? 'bg-yellow-500/20 text-yellow-600 animate-pulse' :
                toolContent.status === 'success' ? 'bg-green-500/20 text-green-600' :
                isDark ? 'bg-white/10 text-white/50' : 'bg-gray-100 text-gray-500'}
            `}>
              {toolContent.status}
            </span>
          </div>
          <pre className={`text-xs font-mono p-2 rounded ${isDark ? 'text-white/50 bg-black/20' : 'text-gray-600 bg-gray-100'}`}>
            {JSON.stringify(toolContent.input, null, 2)}
          </pre>
        </div>
      )

    case 'text':
      const textContent = block.content as { text: string }
      // Simple markdown-like rendering
      const strongClass = isDark ? 'text-white font-semibold' : 'text-gray-900 font-semibold'
      const rendered = textContent.text
        .replace(/\*\*(.*?)\*\*/g, `<strong class="${strongClass}">$1</strong>`)
      return (
        <div className="animate-fade-in-up">
          <p
            className={`text-sm leading-relaxed ${isDark ? 'text-white/80' : 'text-gray-700'}`}
            dangerouslySetInnerHTML={{ __html: rendered }}
          />
        </div>
      )

    default:
      return null
  }
}

// ============================================================================
// Flow Indicator Component
// ============================================================================

function FlowIndicator({ active }: { active: boolean }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="flex flex-col items-center justify-center px-2">
      <div className="relative h-32 w-8 flex items-center justify-center">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`
                w-1.5 h-1.5 rounded-full bg-blue-500
                ${active ? 'animate-flow-right' : 'opacity-20'}
              `}
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
        <svg className={`w-6 h-6 ${isDark ? 'text-white/20' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  )
}

// ============================================================================
// Theme Toggle Button
// ============================================================================

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      className={`
        p-2 rounded-lg transition-colors
        ${isDark
          ? 'bg-white/10 hover:bg-white/20 text-white'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
      `}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  )
}

// ============================================================================
// Main App Content Component
// ============================================================================

function AppContent() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [events, setEvents] = useState<AIEvent[]>([])
  const [activeEventIndex, setActiveEventIndex] = useState(-1)
  const [conversation, setConversation] = useState<LucidConversation | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [activeProtocol, setActiveProtocol] = useState<ProtocolSource>('anthropic')

  const protocol = protocols[activeProtocol]

  // Run simulation
  const runSimulation = useCallback(async (proto?: ProtocolSource) => {
    const config = protocols[proto ?? activeProtocol]
    setIsRunning(true)
    setEvents([])
    setConversation(null)
    setActiveEventIndex(-1)

    let conv: LucidConversation | null = null
    for (let i = 0; i < config.mockEvents.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600))

      const event: AIEvent = {
        ...config.mockEvents[i],
        id: `event-${i}`,
        timestamp: Date.now()
      }

      setEvents(prev => [...prev, event])
      setActiveEventIndex(i)
      conv = config.processEvent(event, conv)
      setConversation(conv ? { ...conv } : null)
    }

    setIsRunning(false)
  }, [activeProtocol])

  const switchProtocol = useCallback((proto: ProtocolSource) => {
    if (isRunning) return
    setActiveProtocol(proto)
    setEvents([])
    setConversation(null)
    setActiveEventIndex(-1)
    // Auto-run after switching
    setTimeout(() => runSimulation(proto), 300)
  }, [isRunning, runSimulation])

  // Auto-run on mount
  useEffect(() => {
    const timer = setTimeout(runSimulation, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`min-h-screen transition-colors overflow-x-hidden ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`border-b backdrop-blur-sm fixed top-0 left-0 right-0 z-50 ${isDark ? 'border-white/10 bg-gray-950/80' : 'border-gray-200 bg-white/80'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className={`p-0.5 rounded-lg border shadow-sm ${isDark ? 'border-white/20 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="UIX" className="w-7 h-7 rounded-md" />
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-lg font-semibold animate-breathe ${isDark ? 'text-white' : 'text-gray-900'}`}>UIX</h1>
              <p className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>AI-to-UI Intermediate Representation</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <a
              href="/storybook/"
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              Components
            </a>
            <a
              href="https://github.com/Deepractice/UIX"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              title="View on GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero + Protocol Demo */}
      <div className="pt-14">
            {/* Hero Section */}
            <section className={`py-16 sm:py-24 ${isDark ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950' : 'bg-gradient-to-b from-white via-gray-50 to-white'}`}>
              <div className="max-w-5xl mx-auto px-4 lg:px-6 text-center">
                <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  The Last Mile
                  <br />
                  <span className={isDark ? 'text-white/80' : 'text-gray-700'}>from </span>
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">AI</span>
                  <span className={isDark ? 'text-white/80' : 'text-gray-700'}> to </span>
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">Human</span>
                </h1>
                <p className={`mt-6 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  AI-to-UI IR Protocol Layer
                  <br />
                  one protocol that bridges Vercel AI SDK, AG-UI, A2UI, and every future agent protocol
                </p>

                {/* Install Command */}
                <div className={`mt-10 inline-flex items-center gap-3 px-5 py-3 rounded-xl border font-mono text-sm ${isDark ? 'bg-white/5 border-white/10 text-white/80' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                  <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>$</span>
                  <code>pnpm add @uix-ai/agent</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('pnpm add @uix-ai/agent')
                      const btn = document.getElementById('copy-btn')
                      if (btn) { btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = '' }, 1500) }
                    }}
                    className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${isDark ? 'text-white/40 hover:text-white/70' : 'text-gray-400 hover:text-gray-600'}`}
                    title="Copy to clipboard"
                  >
                    <span id="copy-btn" className="text-xs"></span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>

                {/* Code Example */}
                <div className={`mt-10 max-w-2xl mx-auto text-left rounded-xl border overflow-hidden shadow-2xl ${isDark ? 'bg-gray-900 border-white/10 shadow-blue-500/5' : 'bg-gray-900 border-gray-700 shadow-gray-400/20'}`}>
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border-b border-white/10">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    <span className="text-xs text-white/40 ml-2 font-mono">App.tsx</span>
                  </div>
                  <pre className="p-5 text-sm font-mono leading-relaxed overflow-x-auto"><code className="text-white/80">{
`import { `}<span className="text-blue-400">AgentChat</span>{` } from '@uix-ai/agent'
import { `}<span className="text-green-400">useAGUI</span>{` } from '@uix-ai/adapter-agui/react'

const { conversations, send } = `}<span className="text-green-400">useAGUI</span>{`({ url: `}<span className="text-amber-400">'/api/agent'</span>{` })
return <`}<span className="text-blue-400">AgentChat</span>{` `}<span className="text-purple-400">{`conversations={conversations} onSend={send}`}</span>{` />`}
                  </code></pre>
                </div>
                <p className={`mt-3 text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                  3 lines of code. Any protocol. Full chat UI.
                </p>

                {/* Protocol Badges */}
                <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
                  {[
                    { name: 'Vercel AI SDK', active: true },
                    { name: 'AG-UI', active: true },
                    { name: 'A2UI', active: true },
                    { name: 'Anthropic', active: true },
                  ].map(({ name, active }) => (
                    <span
                      key={name}
                      className={`
                        px-4 py-1.5 rounded-full text-xs font-medium border transition-colors
                        ${active
                          ? isDark ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'
                          : isDark ? 'bg-white/5 border-white/10 text-white/30' : 'bg-gray-50 border-gray-200 text-gray-400'
                        }
                      `}
                    >
                      {name}
                    </span>
                  ))}
                </div>

                {/* GitHub + npm links */}
                <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
                  <a
                    href="https://github.com/Deepractice/UIX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all
                      ${isDark
                        ? 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm'}
                    `}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    Star on GitHub
                  </a>
                  <a
                    href="https://www.npmjs.com/package/@uix-ai/core"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all
                      ${isDark
                        ? 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm'}
                    `}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
                    </svg>
                    npm
                  </a>
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section className={`py-16 sm:py-20 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
              <div className="max-w-5xl mx-auto px-4 lg:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      title: 'One Component',
                      description: '3 lines to a full AI chat UI',
                      icon: (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      ),
                    },
                    {
                      title: 'Multi-Protocol',
                      description: 'Adapters for every major AI protocol',
                      icon: (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      ),
                    },
                    {
                      title: 'Type-Safe IR',
                      description: 'JSON Schema validated intermediate representation',
                      icon: (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      ),
                    },
                    {
                      title: 'Streaming Native',
                      description: 'Built for real-time AI responses',
                      icon: (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      ),
                    },
                  ].map(({ title, description, icon }) => (
                    <div
                      key={title}
                      className={`
                        group p-6 rounded-xl border transition-all duration-200
                        ${isDark
                          ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                          : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-md'}
                      `}
                    >
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center mb-4
                        ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}
                      `}>
                        {icon}
                      </div>
                      <h3 className={`text-base font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                        {description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 lg:px-6 pt-6 pb-2">
            {/* Introduction */}
            <div className={`mb-4 p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h2 className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    UIX Protocol Playground
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                    One IR, multiple protocols — switch between Anthropic, AG-UI, and Vercel AI SDK to see how UIX unifies them all.
                  </p>
                </div>
                <button
                  onClick={() => runSimulation()}
                  disabled={isRunning}
                  className={`
                    hidden sm:block flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${isRunning
                      ? isDark ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'}
                  `}
                >
                  {isRunning ? 'Running...' : 'Run Demo'}
                </button>
              </div>

              {/* Protocol Selector Tabs */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {(Object.keys(protocols) as ProtocolSource[]).map((key) => {
                  const p = protocols[key]
                  const isActive = activeProtocol === key
                  return (
                    <button
                      key={key}
                      onClick={() => switchProtocol(key)}
                      disabled={isRunning}
                      className={`
                        px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                        ${isActive
                          ? isDark
                            ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                            : 'bg-blue-50 border-blue-200 text-blue-700'
                          : isDark
                            ? 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'
                            : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                        }
                        ${isRunning ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                      `}
                    >
                      {p.name}
                    </button>
                  )
                })}
              </div>
              <p className={`text-xs mt-2 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                {protocol.description} → {protocol.adapter} → UIX IR → Rendered UI
              </p>

              <button
                onClick={() => runSimulation()}
                disabled={isRunning}
                className={`
                  sm:hidden w-full mt-4 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isRunning
                    ? isDark ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'}
                `}
              >
                {isRunning ? 'Running...' : 'Run Demo'}
              </button>
            </div>

            {/* Architecture Overview - Mobile Only */}
            <div className={`lg:hidden mb-6 p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
              <div className="flex flex-col items-center gap-2 text-sm">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className={isDark ? 'text-green-400' : 'text-green-700'}>AI Agent Events</span>
                </div>
                <span className={`text-lg ${isDark ? 'text-white/30' : 'text-gray-300'}`}>↓</span>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className={isDark ? 'text-blue-400' : 'text-blue-700'}>UIX IR</span>
                </div>
                <span className={`text-lg ${isDark ? 'text-white/30' : 'text-gray-300'}`}>↓</span>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className={isDark ? 'text-purple-400' : 'text-purple-700'}>Rendered UI</span>
                </div>
              </div>
            </div>

            {/* Three Column Layout - Desktop */}
            <div className="hidden lg:grid grid-cols-[1fr,auto,1.2fr,auto,1fr] gap-0 h-[calc(100vh-240px)] min-h-[300px]">
              <div className={`rounded-l-xl border overflow-hidden ${isDark ? 'border-white/10 bg-gray-900/50' : 'border-gray-200 bg-white'}`}>
                <EventPanel events={events} activeIndex={activeEventIndex} protocol={protocol} />
              </div>
              <FlowIndicator active={isRunning} />
              <div className={`border-y overflow-hidden ${isDark ? 'border-white/10 bg-gray-900/50' : 'border-gray-200 bg-white'}`}>
                <IRPanel conversation={conversation} />
              </div>
              <FlowIndicator active={isRunning} />
              <div className={`rounded-r-xl border overflow-hidden ${isDark ? 'border-white/10 bg-gray-900/50' : 'border-gray-200 bg-white'}`}>
                <RenderedPanel conversation={conversation} />
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden space-y-4">
              {/* Events Panel */}
              <div className={`rounded-xl border overflow-hidden h-[300px] ${isDark ? 'border-white/10 bg-gray-900/50' : 'border-gray-200 bg-white'}`}>
                <EventPanel events={events} activeIndex={activeEventIndex} protocol={protocol} />
              </div>

              {/* Flow Arrow */}
              <div className="flex justify-center">
                <div className={`flex items-center gap-2 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                  <span>↓</span>
                  <span className="text-xs">transforms to</span>
                  <span>↓</span>
                </div>
              </div>

              {/* IR Panel */}
              <div className={`rounded-xl border overflow-hidden h-[350px] ${isDark ? 'border-white/10 bg-gray-900/50' : 'border-gray-200 bg-white'}`}>
                <IRPanel conversation={conversation} />
              </div>

              {/* Flow Arrow */}
              <div className="flex justify-center">
                <div className={`flex items-center gap-2 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                  <span>↓</span>
                  <span className="text-xs">renders as</span>
                  <span>↓</span>
                </div>
              </div>

              {/* Rendered Panel */}
              <div className={`rounded-xl border overflow-hidden h-[300px] ${isDark ? 'border-white/10 bg-gray-900/50' : 'border-gray-200 bg-white'}`}>
                <RenderedPanel conversation={conversation} />
              </div>
            </div>

            {/* Related Packages - Hidden on desktop for compact view */}
            <div className={`lg:hidden mt-6 p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-sm font-medium mb-4 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                Related Packages
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>📦</span>
                    <span className={`font-mono text-sm ${isDark ? 'text-white/80' : 'text-gray-800'}`}>@uix-ai/core</span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                    Core IR types and type guards
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>📦</span>
                    <span className={`font-mono text-sm ${isDark ? 'text-white/80' : 'text-gray-800'}`}>@uix-ai/stream</span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                    Streaming markdown renderer
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>📦</span>
                    <span className={`font-mono text-sm ${isDark ? 'text-white/80' : 'text-gray-800'}`}>@uix-ai/lucid-react</span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                    React components library
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>📦</span>
                    <span className={`font-mono text-sm ${isDark ? 'text-white/80' : 'text-gray-800'}`}>@uix-ai/adapter-agui</span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                    AG-UI protocol adapter
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>📦</span>
                    <span className={`font-mono text-sm ${isDark ? 'text-white/80' : 'text-gray-800'}`}>@uix-ai/adapter-vercel</span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                    Vercel AI SDK 4.x / 6.x adapter
                  </p>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className={`border-t mt-2 py-2 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <div className={`max-w-7xl mx-auto px-6 text-center text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
              <p>
                Powered by{' '}
                <a href="https://deepractice.ai" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isDark ? 'hover:text-white/60' : 'hover:text-gray-600'}`}>
                  Deepractice
                </a>
                {' · '}
                Author{' '}
                <a href="https://github.com/deepracticexc" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isDark ? 'hover:text-white/60' : 'hover:text-gray-600'}`}>
                  Cliff Yang
                </a>
                {' · '}
                <a href="https://github.com/Deepractice/UIX/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isDark ? 'hover:text-white/60' : 'hover:text-gray-600'}`}>
                  MIT License
                </a>
              </p>
            </div>
          </footer>
        </div>
    </div>
  )
}

// ============================================================================
// Main App Component
// ============================================================================

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
