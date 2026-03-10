---
name: uix-components
description: UIX component library and protocol adapter skill for building AI chat interfaces. Use this skill when building AI agent UIs, chat interfaces, or integrating with AI protocols (Vercel AI SDK, AG-UI, Anthropic). Provides AgentChat component API, adapter usage patterns, and UIX IR (Intermediate Representation) type system.
---

# UIX Components — AI Chat UI in 3 Lines

You are an expert in the UIX protocol and component library. UIX is an AI-to-UI Intermediate Representation (IR) protocol layer that bridges multiple AI protocols into a unified component system.

## Core Concept

```
AI Agent Events (Vercel AI SDK / AG-UI / Anthropic / ...)
    ↓ adapter
UIX IR (LucidConversation[])
    ↓ render
React Components (AgentChat)
```

---

## Quick Start — The 3-Line Pattern

The fastest way to build an AI chat UI:

### With Vercel AI SDK
```tsx
import { AgentChat } from '@uix-ai/agent'
import { useVercelChat } from '@uix-ai/adapter-vercel/react'

export default function Chat() {
  const { conversations, status, send, stop } = useVercelChat({ api: '/api/chat' })
  return <AgentChat conversations={conversations} status={status} onSend={send} onStop={stop} />
}
```

### With AG-UI Protocol
```tsx
import { AgentChat } from '@uix-ai/agent'
import { useAGUI } from '@uix-ai/adapter-agui/react'

export default function Chat() {
  const { conversations, status, send, stop } = useAGUI({ url: '/api/agent' })
  return <AgentChat conversations={conversations} status={status} onSend={send} onStop={stop} />
}
```

### Without Any Adapter (Manual IR)
```tsx
import { AgentChat } from '@uix-ai/agent'
import type { LucidConversation } from '@uix-ai/core'

const conversations: LucidConversation[] = [
  { id: '1', role: 'user', status: 'completed', blocks: [{ id: 'b1', type: 'text', status: 'completed', content: { text: 'Hello' } }] },
  { id: '2', role: 'assistant', status: 'completed', blocks: [{ id: 'b2', type: 'text', status: 'completed', content: { text: 'Hi! How can I help?' } }] },
]

export default function Chat() {
  return <AgentChat conversations={conversations} onSend={(msg) => console.log(msg)} />
}
```

---

## UIX IR Type System

### LucidConversation
```typescript
interface LucidConversation {
  id: string
  role: 'user' | 'assistant' | 'system'
  status: 'streaming' | 'completed' | 'error'
  blocks: LucidBlock[]
  agentName?: string
  agentAvatar?: string
  timestamp?: number
}
```

### LucidBlock
```typescript
interface LucidBlock {
  id: string
  type: 'text' | 'tool' | 'thinking' | 'image' | 'file' | 'error' | 'source'
  status: 'streaming' | 'completed' | 'error'
  content: TextBlockContent | ToolBlockContent | ThinkingBlockContent | ...
}
```

### Block Types

| Type | Content | Description |
|------|---------|-------------|
| `text` | `{ text: string }` | Markdown text, supports streaming |
| `tool` | `{ name, input?, output?, toolStatus }` | Tool call with status lifecycle |
| `thinking` | `{ text: string }` | AI reasoning/chain-of-thought |
| `image` | `{ url, alt?, width?, height? }` | Image content |
| `file` | `{ url, filename, mimeType?, size? }` | File attachment |
| `error` | `{ message, code? }` | Error display |
| `source` | `{ type, url?, title?, excerpt? }` | Citation/RAG source |

### Type Guards
```typescript
import { isTextBlock, isToolBlock, isThinkingBlock, isStreaming, isCompleted } from '@uix-ai/core'

if (isTextBlock(block)) {
  // block.content is TextBlockContent
}
if (isStreaming(conversation)) {
  // show streaming indicator
}
```

---

## AgentChat Props

```typescript
interface AgentChatProps {
  // Required
  conversations: LucidConversation[]
  onSend: (message: string) => void

  // Optional - status & control
  status?: 'idle' | 'streaming' | 'error'
  onStop?: () => void
  onRetry?: (conversationId: string) => void

  // Optional - agent info
  agent?: { name: string; avatar?: string; description?: string }

  // Optional - tool approval
  onToolApprove?: (blockId: string) => void
  onToolDeny?: (blockId: string) => void

  // Optional - customization
  placeholder?: string
  emptyState?: React.ReactNode
  renderBlock?: (block: LucidBlock) => React.ReactNode | null
  showHeader?: boolean
  autoScroll?: boolean
}
```

---

## Composable Components

When you need more control than `AgentChat`, use individual components:

### Layout
| Component | Description |
|-----------|-------------|
| `ChatWindow` | Container with header, messages, input |
| `ChatWindowHeader` | Agent name, avatar, status |
| `ChatWindowMessages` | Scrollable message area |
| `ChatWindowInput` | Text input with send button |
| `ChatWindowEmpty` | Empty state placeholder |
| `ChatList` | Sidebar conversation list |

### Messages
| Component | Description |
|-----------|-------------|
| `ChatMessage` | Full message with avatar and blocks |
| `MessageList` | Scrollable message container |
| `StreamText` | Streaming markdown renderer |
| `ThinkingIndicator` | Pulsing thinking state |
| `ToolResult` | Tool call display with status |
| `SourceBlock` | Citation/RAG source card |

### Avatars
| Component | Description |
|-----------|-------------|
| `Avatar` | Composable avatar (Avatar > AvatarImage + AvatarFallback) |
| `AvatarGroup` | Stacked avatar group with overflow |

### Input
| Component | Description |
|-----------|-------------|
| `ChatInput` | Text input with @ mention support |
| `MentionPopover` | Mention suggestion popup |

---

## Adapter Reference

### Vercel AI SDK Adapter

```typescript
// React hook (recommended)
import { useVercelChat } from '@uix-ai/adapter-vercel/react'
const { conversations, status, send, stop, setMessages } = useVercelChat({
  api: '/api/chat',
  // all useChat options supported
})

// Manual conversion
import { fromVercelMessages, toVercelMessages } from '@uix-ai/adapter-vercel'
const lucidConversations = fromVercelMessages(vercelMessages)
const vercelMessages = toVercelMessages(lucidConversations)
```

### AG-UI Adapter

```typescript
// React hook (recommended)
import { useAGUI } from '@uix-ai/adapter-agui/react'
const { conversations, status, send, stop, reset } = useAGUI({
  url: '/api/agent',
  threadId: 'optional-thread-id',
  headers: { Authorization: 'Bearer ...' },
})

// Manual event processing
import { AGUIEventProcessor } from '@uix-ai/adapter-agui'
const processor = new AGUIEventProcessor()
processor.process(event) // feed AG-UI events
const conversations = processor.getConversations()
```

### A2UI Adapter (Experimental)

```typescript
import { fromA2UIPayload, toA2UIPayload } from '@uix-ai/adapter-a2ui'

// Google A2UI → UIX IR
const conversation = fromA2UIPayload(a2uiPayload)

// UIX IR → Google A2UI
const payload = toA2UIPayload(conversation)
```

---

## Common Patterns

### Next.js App Router + Vercel AI SDK
```tsx
// app/api/chat/route.ts
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    messages,
  })
  return result.toDataStreamResponse()
}

// app/page.tsx
'use client'
import { AgentChat } from '@uix-ai/agent'
import { useVercelChat } from '@uix-ai/adapter-vercel/react'

export default function Page() {
  const { conversations, status, send, stop } = useVercelChat({ api: '/api/chat' })
  return (
    <div className="h-screen">
      <AgentChat
        conversations={conversations}
        status={status}
        onSend={send}
        onStop={stop}
        agent={{ name: 'Claude', description: 'AI Assistant' }}
      />
    </div>
  )
}
```

### Custom Block Rendering
```tsx
<AgentChat
  conversations={conversations}
  onSend={send}
  renderBlock={(block) => {
    if (block.type === 'tool' && block.content.name === 'weather') {
      return <WeatherCard data={block.content.output} />
    }
    return null // fall back to default rendering
  }}
/>
```

### Multiple Conversations (Sidebar + Chat)
```tsx
import { ChatList, ChatWindow } from '@uix-ai/agent'

function App() {
  const [activeId, setActiveId] = useState<string>()
  return (
    <div className="flex h-screen">
      <ChatList conversations={allConversations} activeId={activeId} onSelect={setActiveId} />
      <ChatWindow conversation={activeConversation} onSend={send} />
    </div>
  )
}
```

---

## Package Overview

| Package | Install | Purpose |
|---------|---------|---------|
| `@uix-ai/core` | `pnpm add @uix-ai/core` | IR types, type guards, JSON Schema |
| `@uix-ai/agent` | `pnpm add @uix-ai/agent` | React chat components |
| `@uix-ai/adapter-vercel` | `pnpm add @uix-ai/adapter-vercel` | Vercel AI SDK adapter |
| `@uix-ai/adapter-agui` | `pnpm add @uix-ai/adapter-agui` | AG-UI protocol adapter |
| `@uix-ai/adapter-a2ui` | `pnpm add @uix-ai/adapter-a2ui` | Google A2UI adapter |
| `@uix-ai/lucid-tokens` | `pnpm add @uix-ai/lucid-tokens` | Design tokens |
| `@uix-ai/lucid-react` | `pnpm add @uix-ai/lucid-react` | Base components (Button, Input, Card, Badge) |
| `@uix-ai/stream` | `pnpm add @uix-ai/stream` | Streaming markdown renderer |

---

*UIX — The Last Mile from AI to Human. [GitHub](https://github.com/Deepractice/UIX)*
