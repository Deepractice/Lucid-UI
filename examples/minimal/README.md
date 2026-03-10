# Minimal UIX Example

The simplest possible UIX setup -- no adapters, no backend. Manually construct `LucidConversation` objects and render them with `AgentChat`.

This example demonstrates the core concept: UIX components consume a universal intermediate representation (Lucid IR), and you can create that data from any source.

## Prerequisites

- Node.js 18+

## Setup

```bash
# Using Vite for a quick React setup
npm create vite@latest minimal-uix -- --template react-ts
cd minimal-uix

# Install UIX
npm install @uix-ai/agent @uix-ai/core react react-dom
```

## The Core Idea

UIX components render `LucidConversation[]` -- an array of conversation turns. Each turn has a role (`user` or `assistant`), a status, and an array of content blocks.

```typescript
import type { LucidConversation } from '@uix-ai/core'

const conversations: LucidConversation[] = [
  {
    id: '1',
    role: 'user',
    status: 'completed',
    blocks: [
      { id: 'b1', type: 'text', status: 'completed', content: { text: 'Hello!' } },
    ],
    timestamp: Date.now(),
  },
  {
    id: '2',
    role: 'assistant',
    status: 'completed',
    blocks: [
      { id: 'b2', type: 'text', status: 'completed', content: { text: 'Hi there!' } },
    ],
    timestamp: Date.now(),
  },
]
```

Pass this array to `<AgentChat>` and you get a complete chat UI. No backend required.

## Block Types

UIX supports several block types out of the box:

| Type       | Content Fields                | Description                   |
|------------|-------------------------------|-------------------------------|
| `text`     | `{ text: string }`           | Plain text or markdown        |
| `thinking` | `{ reasoning: string }`     | Model reasoning / chain of thought |
| `tool`     | `{ name, input, output, status }` | Tool call and result    |
| `source`   | `{ title, url, excerpt }`   | Citation / reference          |
| `error`    | `{ code, message }`         | Error display                 |
| `image`    | `{ url, alt }`              | Image content                 |
| `file`     | `{ name, url, type }`       | File attachment                |

## Running

```bash
npm run dev
```

Open `http://localhost:5173` to see the chat interface with static messages.

## Next Steps

- Add `onSend` to handle user input and append new conversations
- Connect to a real backend using `@uix-ai/adapter-vercel` or `@uix-ai/adapter-agui`
- Use `renderBlock` to customize how specific block types are displayed
