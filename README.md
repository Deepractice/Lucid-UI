<div align="center">
  <h1>Lucid A2UI</h1>
  <p>
    <strong>The Last Mile from AI to Human</strong>
  </p>
  <p>
    AI-to-UI Intermediate Representation (IR) Protocol Layer
  </p>

  <hr/>

  <p>
    <a href="https://github.com/Deepractice/Lucid-UI"><img src="https://img.shields.io/github/stars/Deepractice/Lucid-UI?style=social" alt="Stars"/></a>
    <img src="https://komarev.com/ghpvc/?username=LucidUI&label=views&color=0e75b6&style=flat&abbreviated=true" alt="Views"/>
    <a href="LICENSE"><img src="https://img.shields.io/github/license/Deepractice/Lucid-UI?color=blue" alt="License"/></a>
    <a href="https://www.npmjs.com/package/@lucidui/react"><img src="https://img.shields.io/npm/v/@lucidui/react?color=cb3837&logo=npm" alt="npm"/></a>
  </p>

  <p>
    <a href="README.md"><strong>English</strong></a> |
    <a href="README.zh-CN.md">简体中文</a>
  </p>
</div>

---

## The Last Mile Problem

```
Human Intent → AI Understanding → AI Generation → ??? → Human Perception
                                                   ↑
                                            The gap is here
```

AI can understand human intent, reason, call tools, and generate content. But **how does AI output actually reach the human?** This "last mile" has been broken.

**Lucid A2UI bridges this gap** — a protocol that both AI and UI understand.

---

## What is Lucid A2UI?

**Lucid A2UI** is an Intermediate Representation (IR) protocol layer between AI and UI.

```
┌─────────────────────────────────────────────────────────────┐
│                      Lucid A2UI                             │
│           "The Last Mile from AI to Human"                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Human Intent                                               │
│       ↓                                                     │
│  AI Processing (thinking, tool calls, generation)          │
│       ↓                                                     │
│  Lucid IR ← Standardized format AI outputs                  │
│       ↓                                                     │
│  UI Rendering ← Components that understand IR               │
│       ↓                                                     │
│  Human Perception                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Two Consumers, One Protocol

> **Lucid IR is consumed by both AI and UI.**

- **For AI**: A standardized output format — AI generates Lucid IR directly
- **For UI**: A standardized input format — UI renders Lucid IR directly
- **Result**: AI speaks this format, UI understands this format — no translation needed

---

## Why Lucid A2UI?

### The Problem

| Protocol | Status | Issue |
|----------|--------|-------|
| A2UI (Google) | v0.8 Preview | Only Android TV/Wear OS, **no Web** |
| MCP Apps (Anthropic) | SEP-1865 Draft | Still in design, **not usable** |

**No production-ready AI-to-UI protocol exists today.**

### The Solution

Lucid UI provides:
1. **Lucid IR** - A stable internal protocol that works today
2. **Adapters** - Future compatibility with A2UI, MCP Apps when they mature
3. **Reference implementation** - React renderer as default

```
AI Agent Events
    ↓
Lucid IR (stable internal protocol)
    ↓
    ├── ReactRenderer (works today)
    ├── A2UIRenderer (when A2UI matures)
    └── MCPAppsRenderer (when MCP Apps matures)
```

---

## Architecture

### Three-Layer Design

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Lucid IR (Core)                                   │
│  - JSON Schema definition                                   │
│  - Block & Conversation standards                           │
│  - AI-generatable format                                    │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: Renderers                                         │
│  - ReactRenderer → Web                                      │
│  - A2UIRenderer → Native (future)                           │
│  - MCPAppsRenderer → Claude Desktop (future)                │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: Design System                                     │
│  - @lucidui/tokens (design tokens)                          │
│  - @lucidui/react (base components)                         │
│  - @lucidui/stream (streaming renderer)                     │
└─────────────────────────────────────────────────────────────┘
```

### Dependency Inversion

All implementations depend on the Lucid IR abstraction:

```
        ┌─────────────────────┐
        │     Lucid IR        │  ← Abstract protocol
        │   (JSON Schema)     │
        └──────────┬──────────┘
                   │
     ┌─────────────┼─────────────┐
     │             │             │
     ▼             ▼             ▼
┌─────────┐  ┌──────────┐  ┌──────────┐
│ AgentX  │  │  Other   │  │  A2UI    │
│   UI    │  │Frameworks│  │ Adapter  │
└─────────┘  └──────────┘  └──────────┘
```

---

## Lucid IR Specification

### Core Types

```typescript
interface LucidConversation {
  id: string
  role: 'user' | 'assistant' | 'system'
  status: 'streaming' | 'completed' | 'error'
  blocks: LucidBlock[]
  timestamp: number
}

interface LucidBlock {
  id: string
  type: 'text' | 'tool' | 'thinking' | 'image' | 'file' | 'error'
  status: 'streaming' | 'completed' | 'error'
  content: unknown  // varies by type
}

// Renderer interface
interface LucidRenderer<T> {
  render(conversations: LucidConversation[]): T
}
```

### Block Types

| Type | Description | Content |
|------|-------------|---------|
| `text` | Text content (supports streaming) | `{ text: string }` |
| `tool` | Tool/function call result | `{ name, input, output, status }` |
| `thinking` | AI reasoning process | `{ reasoning: string }` |
| `image` | Image content | `{ url, alt, width, height }` |
| `file` | File attachment | `{ name, type, url }` |
| `error` | Error message | `{ code, message }` |

---

## Relationship with AgentX

Lucid UI is abstracted from [AgentX](https://github.com/Deepractice/AgentX) practices:

```
AgentX UI (rough implementation, experimental)
    ↓ abstract & refine
Lucid IR (protocol specification)
    ↓ implement
AgentX UI + Other frameworks (follow the spec)
```

### Event Flow

```
AgentX 4-Layer Events
    │
    │ Stream: text_delta, tool_use_start
    │ State: conversation_thinking, tool_executing
    │ Message: assistant_message, tool_result_message
    │
    ↓ Transform
Lucid IR (LucidConversation[])
    ↓ Render
React Components
```

---

## Packages

| Package | Layer | Status | Description |
|---------|-------|--------|-------------|
| `@lucidui/ir` | Protocol | 🚧 Designing | Lucid IR JSON Schema & TypeScript types |
| `@lucidui/tokens` | Design System | ✅ Ready | Design tokens (colors, typography, spacing) |
| `@lucidui/react` | Renderer | ✅ Ready | React renderer & base components |
| `@lucidui/stream` | Renderer | 🚧 Building | Streaming content renderer |

---

## Quick Start

### For Developers (React Renderer)

```bash
pnpm add @lucidui/react @lucidui/tokens
```

```tsx
import { Button } from '@lucidui/react'

function App() {
  return <Button>Click me</Button>
}
```

### For AI Agents (Lucid IR)

```json
{
  "conversations": [
    {
      "id": "conv-1",
      "role": "user",
      "status": "completed",
      "blocks": [
        { "id": "b1", "type": "text", "status": "completed", "content": { "text": "Hello" } }
      ]
    },
    {
      "id": "conv-2",
      "role": "assistant",
      "status": "streaming",
      "blocks": [
        { "id": "b2", "type": "text", "status": "streaming", "content": { "text": "Hi there..." } },
        { "id": "b3", "type": "tool", "status": "completed", "content": { "name": "search", "output": "..." } }
      ]
    }
  ]
}
```

---

## Design Philosophy

### Dual Theme System

**Rational Theme** - Tech Blue `#0284c7`
- For: Data analysis, Technical products, Productivity tools
- Represents: Efficiency, Precision, Computation

**Sentient Theme** - Wisdom Gold `#f59e0b`
- For: Creative tools, Human-centric products, Thinking aids
- Represents: Wisdom, Thinking, Humanity

### Design Principles

1. **White Foundation** - Clear visual base, no dark mode
2. **No AI Purple** - Reject overused AI clichés
3. **Block-Based** - Parallel rendering of text + tools
4. **Streaming-First** - Self-healing incomplete content
5. **Accessibility by Default** - Not an afterthought

---

## Roadmap

### Phase 1: Foundation (Current)
- [x] Design token system
- [x] React base components
- [x] Streaming renderer
- [ ] Lucid IR schema definition

### Phase 2: Protocol
- [ ] Lucid IR JSON Schema
- [ ] TypeScript type definitions
- [ ] AgentX adapter
- [ ] Validation tools

### Phase 3: Ecosystem
- [ ] A2UI renderer (when mature)
- [ ] MCP Apps renderer (when mature)
- [ ] Documentation & examples

---

## Why Not Just Wait for A2UI / MCP Apps?

> "A2UI and MCP Apps are future targets. Lucid IR is today's bridge. We're not reinventing the wheel—we're building an adapter that can fit any wheel."

| Approach | Risk |
|----------|------|
| Wait for standards | AgentX has no UI, product stalls |
| Bind to A2UI directly | A2UI changes, major rewrite needed |
| Bind to MCP Apps directly | Same problem |
| **Lucid IR + Adapters** | Internal stability, external flexibility |

---

## Ecosystem

Part of the **Deepractice AI development ecosystem**:

| Project | Description |
|---------|-------------|
| [AgentX](https://github.com/Deepractice/AgentX) | AI Agent development framework |
| [PromptX](https://github.com/Deepractice/PromptX) | Prompt engineering platform |
| [DPML](https://github.com/Deepractice/dpml) | Deepractice Markup Language |

---

## Development

```bash
git clone https://github.com/Deepractice/Lucid-UI.git
cd Lucid-UI
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
