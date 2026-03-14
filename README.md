<div align="center">
  <h1>UIX</h1>
  <p>
    <strong>The Last Mile from AI to Human</strong>
  </p>
  <p>
    AI-to-UI Intermediate Representation (IR) Protocol & Conversion Engine
  </p>

  <p>
    <a href="https://github.com/Deepractice/UIX"><img src="https://img.shields.io/github/stars/Deepractice/UIX?style=social" alt="Stars"/></a>
    <img src="https://komarev.com/ghpvc/?username=UIX&label=views&color=0e75b6&style=flat&abbreviated=true" alt="Views"/>
    <a href="LICENSE"><img src="https://img.shields.io/github/license/Deepractice/UIX?color=blue" alt="License"/></a>
    <a href="https://www.npmjs.com/package/@uix-ai/core"><img src="https://img.shields.io/npm/v/@uix-ai/core?color=cb3837&logo=npm" alt="npm"/></a>
  </p>

  <p>
    <a href="README.md"><strong>English</strong></a> |
    <a href="README.zh-CN.md">简体中文</a>
  </p>
</div>

---

## What UIX Is (and What It Is Not)

**UIX is a protocol layer and conversion engine**, not a Chat UI framework.

If you need a full-featured React chat interface, use [assistant-ui](https://github.com/assistant-ui/assistant-ui) — it's excellent and battle-tested. UIX solves a different problem: **normalizing AI output from any source into a single, stable format.**

```
                      ┌─────────────────────────┐
Vercel AI SDK ──────→ │                         │
AgentX ─────────────→ │   UIX IR                │ ──→ assistant-ui
AG-UI (CopilotKit) ─→ │   (unified format)      │ ──→ your own renderer
A2UI (Google) ──────→ │                         │ ──→ any UI framework
                      └─────────────────────────┘
```

**Think of UIX as Babel for AI output** — Babel normalizes JavaScript across engines; UIX normalizes AI output across providers.

---

## The Problem

AI backends all speak different formats:

| Source | Message Format | Tool Call Format | Streaming Protocol |
|--------|---------------|-----------------|-------------------|
| Vercel AI SDK | `UIMessage.parts[]` | `ToolInvocationPart` | Data Stream |
| AgentX | `Conversation.blocks[]` | `ToolBlock` | WebSocket events |
| AG-UI (CopilotKit) | AG-UI events | `ToolCallStart/End` | SSE events |
| A2UI (Google) | Declarative UI payload | Component-based | gRPC stream |

If you build a chat UI, you're locked into one format. Switch backends? Rewrite your UI layer.

**UIX IR eliminates this coupling.** Your UI only knows `LucidConversation` and `LucidBlock` — adapters handle the rest.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  AI Backends (upstream)                                         │
│  Vercel AI SDK · AgentX · AG-UI · A2UI · LangChain · ...       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    UIX Adapters (ACL)
                    Pure functions, zero side effects
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  UIX IR  (@uix-ai/core)                                        │
│  LucidConversation → LucidBlock[]                               │
│  7 block types: text · tool · thinking · image · file · error · │
│  source                                                         │
│  JSON Schema + TypeScript types + type guards                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
               ┌───────────┴───────────┐
               ▼                       ▼
┌──────────────────────┐  ┌──────────────────────────────────────┐
│  assistant-ui         │  │  UIX Reference Renderer              │
│  (recommended)        │  │  @uix-ai/stream (StreamMarkdown)     │
│  Full chat UI runtime │  │  @uix-ai/agent (ChatBubble, etc.)    │
│  via ExternalStore    │  │  Lightweight, zero-runtime            │
└──────────────────────┘  └──────────────────────────────────────┘
```

### Why Adapters Instead of Direct Integration?

In DDD terms, each AI backend is a separate **Bounded Context**. UIX adapters are the **Anti-Corruption Layer (ACL)** — the downstream consumer (UI) protects itself from upstream format changes.

- Upstream (AgentX, Vercel, etc.) owns its own types — no pressure to change
- Downstream (UI) only depends on UIX IR — immune to backend switches
- Adapters are pure functions: `fromX(input) → LucidConversation[]`

---

## UIX IR Specification

### Core Types

```typescript
interface LucidConversation {
  id: string
  role: 'user' | 'assistant' | 'system'
  status: 'streaming' | 'completed' | 'error'
  blocks: LucidBlock[]
  timestamp: number
}

interface LucidBlock<T extends BlockType> {
  id: string
  type: T  // 'text' | 'tool' | 'thinking' | 'image' | 'file' | 'error' | 'source'
  status: 'streaming' | 'completed' | 'error'
  content: ContentByType<T>  // conditional type, inferred from T
}
```

### Block Types

| Type | Description | Content |
|------|-------------|---------|
| `text` | Text content (supports streaming) | `{ text: string }` |
| `tool` | Tool/function call | `{ name, input, output, status }` — 9-state lifecycle |
| `thinking` | AI reasoning process | `{ reasoning: string }` |
| `image` | Image content | `{ url, alt, width, height }` |
| `file` | File attachment | `{ name, type, url, size }` |
| `error` | Error message | `{ code, message, details }` |
| `source` | Source citation | `{ sourceId, title, url, excerpt }` |

### Tool Lifecycle (9 states)

```
pending → streaming → ready → running → success
                                ↓
                        approval-required → approved → success
                                         → denied
                                ↓
                               error
```

---

## Packages

### Core (the value)

| Package | Description | Status |
|---------|-------------|--------|
| `@uix-ai/core` | UIX IR types, JSON Schema, type guards | ✅ v0.0.2 |

### Adapters (the bridge)

| Package | Converts From | Status |
|---------|--------------|--------|
| `@uix-ai/adapter-vercel` | Vercel AI SDK 4.x / 6.x | ✅ v0.0.2 |
| `@uix-ai/adapter-agui` | AG-UI protocol (CopilotKit) | 🚧 Alpha |
| `@uix-ai/adapter-a2ui` | A2UI protocol (Google) | 🧪 Experimental |
| `@uix-ai/adapter-agentx` | AgentX Presentation | 🔜 Planned |

### Reference Renderers (optional)

These are **not** the core value of UIX. They are lightweight reference implementations. For production chat UI, we recommend [assistant-ui](https://github.com/assistant-ui/assistant-ui).

| Package | Description | Status |
|---------|-------------|--------|
| `@uix-ai/stream` | Streaming Markdown renderer (Streamdown + Shiki + KaTeX + Mermaid, self-healing) | ✅ v0.0.2 |
| `@uix-ai/agent` | Chat components (MessageList, ChatBubble, ToolResult, ThinkingIndicator) | ✅ v0.0.2 |
| `@uix-ai/react` | Base UI components (Button, Input, Badge, Card) | ✅ v0.0.2 |
| `@uix-ai/tokens` | Lucid design tokens (Tailwind preset) | ✅ v0.0.2 |

---

## Relationship with Other Projects

### vs assistant-ui

| | UIX | assistant-ui |
|---|---|---|
| **Solves** | "How to normalize AI output" | "How to render AI chat in React" |
| **Core artifact** | JSON Schema + TypeScript types | React components + Runtime |
| **State management** | Stateless (pure conversion) | Full runtime (Thread, messages, branching) |
| **Relationship** | **Data source for assistant-ui** | **Rendering layer for UIX IR** |

They are complementary. Use UIX to normalize your AI backend, then feed the result into assistant-ui's `ExternalStoreRuntime`.

### vs AG-UI / A2UI / MCP Apps

These are **transport protocols** (how AI talks to frontend). UIX IR is an **internal representation** (how your app stores and renders AI output). UIX adapters bridge the gap:

```
AG-UI events → adapter-agui → UIX IR → your UI
A2UI payload → adapter-a2ui → UIX IR → your UI
```

### Within the Deepractice Ecosystem

```
AgentX  — AI Agent runtime (the engine)
UIX     — AI output protocol (the translator)
PromptX — AI application (the product, built with both)
```

| Project | Role |
|---------|------|
| [AgentX](https://github.com/Deepractice/AgentX) | AI Agent runtime — create, drive, and manage agents |
| [PromptX](https://github.com/Deepractice/PromptX) | AI-powered application platform |
| [PromptML](https://github.com/Deepractice/PromptML) | Prompt markup language |

---

## Quick Start

### Normalize Vercel AI SDK output

```typescript
import { fromVercelMessages } from '@uix-ai/adapter-vercel'
import type { LucidConversation } from '@uix-ai/core'

// Your Vercel AI SDK messages
const vercelMessages = useChat().messages

// Convert to UIX IR — one line
const conversations: LucidConversation[] = fromVercelMessages(vercelMessages)

// Now render with any UI framework
conversations.forEach(conv => {
  conv.blocks.forEach(block => {
    if (block.type === 'text') console.log(block.content.text)
    if (block.type === 'tool') console.log(block.content.name, block.content.output)
  })
})
```

### Use with assistant-ui (recommended for production)

```typescript
import { fromVercelMessages } from '@uix-ai/adapter-vercel'
import { useExternalStoreRuntime } from '@assistant-ui/react'

// UIX IR as the data layer, assistant-ui as the rendering layer
const runtime = useExternalStoreRuntime({
  messages: fromVercelMessages(vercelMessages),
  onNew: (message) => { /* send to backend */ }
})
```

### Use reference renderer (lightweight / prototyping)

```typescript
import { fromVercelMessages } from '@uix-ai/adapter-vercel'
import { StreamMarkdown } from '@uix-ai/stream'

const conversations = fromVercelMessages(messages)
const lastBlock = conversations.at(-1)?.blocks.at(-1)

if (lastBlock?.type === 'text') {
  return <StreamMarkdown content={lastBlock.content.text} />
}
```

---

## UIX IR Format

A complete UIX IR document:

```json
{
  "conversations": [
    {
      "id": "conv-1",
      "role": "user",
      "status": "completed",
      "blocks": [
        { "id": "b1", "type": "text", "status": "completed", "content": { "text": "Explain quicksort" } }
      ],
      "timestamp": 1710000000000
    },
    {
      "id": "conv-2",
      "role": "assistant",
      "status": "completed",
      "blocks": [
        { "id": "b2", "type": "thinking", "status": "completed", "content": { "reasoning": "User wants an algorithm explanation..." } },
        { "id": "b3", "type": "text", "status": "completed", "content": { "text": "Quicksort is a divide-and-conquer algorithm..." } },
        { "id": "b4", "type": "tool", "status": "completed", "content": { "name": "run_code", "input": { "code": "..." }, "output": "[3,5,7,9]", "status": "success" } }
      ],
      "timestamp": 1710000001000
    }
  ]
}
```

---

## AI Skills

UIX provides AI-readable design rules that work with any AI coding tool. No npm install needed — just copy a Markdown file.

| Skill | For | Description |
|-------|-----|-------------|
| [`lucid-ui`](skills/lucid-ui/SKILL.md) | Everyone | Professional design system that replaces AI purple cliché |
| [`uix-components`](skills/uix-components/SKILL.md) | UIX users | Component API, adapter patterns, IR type reference |

**Supported platforms:** Claude Code, Claude.ai, Cursor, OpenAI Codex, Windsurf, GitHub Copilot, Cline, Gemini Code Assist

> See [`skills/README.md`](skills/README.md) for installation instructions.

---

## Roadmap

### Phase 1: Foundation ✅
- [x] UIX IR JSON Schema + TypeScript types (`@uix-ai/core`)
- [x] Design token system (`@uix-ai/tokens`)
- [x] Reference React components (`@uix-ai/react`, `@uix-ai/agent`)
- [x] Streaming Markdown renderer (`@uix-ai/stream`)

### Phase 2: Adapters ✅
- [x] Vercel AI SDK adapter (`@uix-ai/adapter-vercel`, SDK 4.x & 6.x)
- [x] AG-UI protocol adapter (`@uix-ai/adapter-agui`)
- [x] A2UI protocol adapter (`@uix-ai/adapter-a2ui`, experimental)

### Phase 3: Ecosystem Integration (current)
- [ ] AgentX adapter (`@uix-ai/adapter-agentx`)
- [ ] assistant-ui integration guide
- [ ] IR validation CLI tool
- [ ] Live demo with real AI agent
- [ ] More adapters (LangChain, CrewAI, etc.)

---

## Development

```bash
git clone https://github.com/Deepractice/UIX.git
cd UIX
pnpm install
pnpm dev
```

---

## License

MIT - see [LICENSE](LICENSE)

---

<div align="center">
  <strong>Built with clarity by <a href="https://deepractice.ai">Deepractice</a></strong>
</div>
