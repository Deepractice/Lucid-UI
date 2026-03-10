# @uix/core

Core type definitions for the UIX Intermediate Representation (Lucid IR) -- the universal format that bridges AI agent backends and UI renderers.

## Install

```bash
pnpm add @uix/core
```

## What is Lucid IR?

Lucid IR is a JSON-based intermediate representation that describes AI conversation content in a structured, renderer-agnostic way. AI agent events flow through adapters into Lucid IR, and renderers convert Lucid IR into actual UI.

```
AI Agent Events -> Adapter -> Lucid IR (this package) -> Renderer -> UI
```

## Core Types

### LucidConversation

A single message in a conversation, containing one or more content blocks.

```typescript
import type { LucidConversation } from '@uix/core'

const conversation: LucidConversation = {
  id: 'conv-1',
  role: 'assistant',       // 'user' | 'assistant' | 'system'
  status: 'completed',     // 'streaming' | 'completed' | 'error'
  blocks: [ /* LucidBlock[] */ ],
  timestamp: Date.now(),
}
```

### LucidBlock

A content block within a conversation. The generic type parameter narrows the `content` field automatically.

```typescript
import type { LucidBlock } from '@uix/core'

// Text block
const text: LucidBlock<'text'> = {
  id: 'b1',
  type: 'text',
  status: 'streaming',
  content: { text: 'Hello...' },
}

// Tool call block
const tool: LucidBlock<'tool'> = {
  id: 'b2',
  type: 'tool',
  status: 'completed',
  content: {
    name: 'search',
    input: { query: 'weather' },
    output: { results: [] },
    status: 'success',
  },
}
```

### Block Types

| Type | Content Interface | Description |
|------|-------------------|-------------|
| `text` | `TextBlockContent` | Markdown text content |
| `tool` | `ToolBlockContent` | Tool/function call with input, output, and execution status |
| `thinking` | `ThinkingBlockContent` | AI reasoning/chain-of-thought |
| `image` | `ImageBlockContent` | Image with URL and dimensions |
| `file` | `FileBlockContent` | File attachment with MIME type |
| `error` | `ErrorBlockContent` | Error with code and message |
| `source` | `SourceBlockContent` | Citation/reference for RAG applications |

### Tool Status Lifecycle

Tool blocks have a fine-grained status model:

`pending` -> `streaming` -> `ready` -> `running` -> `success` | `error`

With optional human-in-the-loop: `ready` -> `approval-required` -> `approved` | `denied`

## Type Guards

Type guards narrow `LucidBlock` to a specific block type, giving you type-safe access to `content`:

```typescript
import { isTextBlock, isToolBlock, isThinkingBlock, isSourceBlock } from '@uix/core'

function renderBlock(block: LucidBlock) {
  if (isTextBlock(block)) {
    return block.content.text       // TypeScript knows this is TextBlockContent
  }
  if (isToolBlock(block)) {
    return block.content.name       // TypeScript knows this is ToolBlockContent
  }
  if (isThinkingBlock(block)) {
    return block.content.reasoning  // TypeScript knows this is ThinkingBlockContent
  }
}
```

### Status Guards

```typescript
import { isStreaming, isCompleted, isError } from '@uix/core'

if (isStreaming(block)) { /* show cursor */ }
if (isCompleted(block)) { /* render final */ }
```

### Tool Status Helpers

```typescript
import { isToolAwaitingApproval, isToolTerminal, isToolExecuting } from '@uix/core'

if (isToolAwaitingApproval(toolBlock)) { /* show approve/deny buttons */ }
if (isToolTerminal(toolBlock)) { /* show result */ }
if (isToolExecuting(toolBlock)) { /* show spinner */ }
```

## LucidRenderer Interface

Implement this interface to create custom renderers:

```typescript
import type { LucidRenderer, LucidConversation, LucidBlock } from '@uix/core'

class MyRenderer implements LucidRenderer<string> {
  render(conversations: LucidConversation[]): string {
    return conversations.map(c => c.blocks.map(b => this.renderBlock?.(b)).join('')).join('\n')
  }

  renderBlock(block: LucidBlock): string {
    // ...
  }
}
```

## Links

- [UIX Repository](https://github.com/Deepractice/UIX)
