<div align="center">
  <h1>UIX</h1>
  <p>
    <strong>The Last Mile from AI to Human</strong>
  </p>
  <p>
    AI-to-UI Intermediate Representation (IR) Protocol Layer
  </p>

  <p>
    <a href="https://github.com/Deepractice/UIX"><img src="https://img.shields.io/github/stars/Deepractice/UIX?style=social" alt="Stars"/></a>
    <img src="https://komarev.com/ghpvc/?username=UIX&label=views&color=0e75b6&style=flat&abbreviated=true" alt="Views"/>
    <a href="LICENSE"><img src="https://img.shields.io/github/license/Deepractice/UIX?color=blue" alt="License"/></a>
    <a href="https://www.npmjs.com/package/@uix/lucid-react"><img src="https://img.shields.io/npm/v/@uix/lucid-react?color=cb3837&logo=npm" alt="npm"/></a>
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

**UIX bridges this gap** — a protocol that both AI and UI understand.

---

## What is UIX?

**UIX** is an Intermediate Representation (IR) protocol layer between AI and UI.

```
┌─────────────────────────────────────────────────────────────┐
│                       UIX                                   │
│       "The Last Mile from AI to Human"                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Human Intent                                               │
│       ↓                                                     │
│  AI Processing (thinking, tool calls, generation)           │
│       ↓                                                     │
│  UIX IR ← Standardized format AI outputs                    │
│       ↓                                                     │
│  UI Rendering ← Components that understand IR               │
│       ↓                                                     │
│  Human Perception                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Two Consumers, One Protocol

> **UIX IR is consumed by both AI and UI.**

- **For AI**: A standardized output format — AI generates UIX IR directly
- **For UI**: A standardized input format — UI renders UIX IR directly
- **Result**: AI speaks this format, UI understands this format — no translation needed

---

## Why UIX?

### The Problem

| Protocol | Status | Issue |
|----------|--------|-------|
| A2UI (Google) | v0.8 Preview | Only Android TV/Wear OS, **no Web** |
| MCP Apps (Anthropic) | SEP-1865 Draft | Still in design, **not usable** |

**No production-ready AI-to-UI protocol exists today.**

### The Solution

UIX provides:
1. **UIX IR** - A stable internal protocol that works today
2. **Adapters** - Future compatibility with A2UI, MCP Apps when they mature
3. **Reference implementation** - React renderer as default

```
AI Agent Events
    ↓
UIX IR (stable internal protocol)
    ↓
    ├── ReactRenderer (works today)
    ├── A2UIRenderer (when A2UI matures)
    └── MCPAppsRenderer (when MCP Apps matures)
```

---

## UIX IR vs Design Tokens

> **"Design Tokens let developers stop redefining colors. UIX IR lets AI stop relearning how to describe UI structure."**

### Different Layers, Different Problems

```
UIX IR       = Script (what to perform)
React Components = Actors (how to perform)
Design Tokens  = Costumes & Props (what to wear)
```

| Dimension | Design Tokens | UIX IR |
|-----------|---------------|----------|
| Problem Solved | Design-to-code consistency | AI-output-to-UI standardization |
| Consumer | Human developers (understands CSS) | AI (needs structured, semantic description) |
| Target Market | Design systems, component libraries | AI Agent platforms |
| Competitors | Style Dictionary, Theo | None (greenfield market) |

### The Key Insight

Traditional UI pipeline:
```
Designer (Figma) → Developer writes code → User sees UI
                   ↑ Design Tokens solve this
```

AI Agent pipeline:
```
AI reasoning → UIX IR → Renderer → User sees UI
               ↑ UIX IR solves this (no one did before)
```

**Design Tokens is "style variables". UIX IR is "AI's UI expression language"** — completely different layers and purposes.

---

## Architecture

### Three-Layer Design

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: UIX IR (Core)                                     │
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
│  - @uix/lucid-tokens (design tokens)                        │
│  - @uix/lucid-react (base components)                       │
│  - @uix/stream (streaming renderer)                         │
└─────────────────────────────────────────────────────────────┘
```

### Dependency Inversion

All implementations depend on the UIX IR abstraction:

```
        ┌─────────────────────┐
        │       UIX IR        │  ← Abstract protocol
        │    (JSON Schema)    │
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

UIX is abstracted from [AgentX](https://github.com/Deepractice/AgentX) practices:

```
AgentX UI (rough implementation, experimental)
    ↓ abstract & refine
UIX IR (protocol specification)
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
UIX IR (LucidConversation[])
    ↓ Render
React Components
```

---

## Packages

| Package | Layer | Status | Description |
|---------|-------|--------|-------------|
| `@uix/core` | Protocol | 🚧 Designing | UIX IR JSON Schema & TypeScript types |
| `@uix/lucid-tokens` | Design System | ✅ Ready | Design tokens (colors, typography, spacing) |
| `@uix/lucid-react` | Renderer | ✅ Ready | React renderer & base components |
| `@uix/stream` | Renderer | ✅ Ready | Streaming markdown renderer (Streamdown) |
| `@uix/agent` | Components | ✅ Ready | AI Agent conversation components |

---

## Quick Start

### For Developers (React Renderer)

```bash
pnpm add @uix/lucid-react @uix/lucid-tokens
```

```tsx
import { Button } from '@uix/lucid-react'

function App() {
  return <Button>Click me</Button>
}
```

### For AI Agents (UIX IR)

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

### Phase 1: Foundation ✅
- [x] Design token system (`@uix/lucid-tokens`)
- [x] React base components (`@uix/lucid-react`)
- [x] Streaming markdown renderer (`@uix/stream`)
- [x] AI Agent components (`@uix/agent`)
  - [x] ChatMessage, ChatInput, Avatar system
  - [x] StreamText, ThinkingIndicator, ToolResult
  - [x] ChatList, ChatWindow layout components

### Phase 2: Protocol (Current)
- [ ] UIX IR JSON Schema
- [ ] TypeScript type definitions
- [ ] AgentX adapter
- [ ] Validation tools

### Phase 3: Ecosystem
- [ ] A2UI renderer (when mature)
- [ ] MCP Apps renderer (when mature)
- [ ] Documentation & examples

---

## Why Not Just Wait for A2UI / MCP Apps?

> "A2UI and MCP Apps are future targets. UIX IR is today's bridge. We're not reinventing the wheel—we're building an adapter that can fit any wheel."

| Approach | Risk |
|----------|------|
| Wait for standards | AgentX has no UI, product stalls |
| Bind to A2UI directly | A2UI changes, major rewrite needed |
| Bind to MCP Apps directly | Same problem |
| **UIX IR + Adapters** | Internal stability, external flexibility |

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
