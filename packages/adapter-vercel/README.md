# @uix-ai/adapter-vercel

Adapter to convert Vercel AI SDK messages to UIX Lucid IR format. Compatible with Vercel AI SDK 4.x and 6.x.

## Install

```bash
pnpm add @uix-ai/adapter-vercel
```

Peer dependencies: `react`, `@uix-ai/core`

## Quick Start

### Using the `useVercelChat` hook (recommended)

The all-in-one hook manages chat state internally and returns UIX-ready data:

```tsx
import { AgentChat } from '@uix-ai/agent'
import { useVercelChat } from '@uix-ai/adapter-vercel/react'

function App() {
  const { conversations, status, send, stop } = useVercelChat({ api: '/api/chat' })

  return (
    <AgentChat
      conversations={conversations}
      status={status}
      onSend={send}
      onStop={stop}
    />
  )
}
```

### Using with existing `useChat`

If you already use `useChat` from `@ai-sdk/react`, wrap the messages with `useVercelMessages`:

```tsx
import { useChat } from '@ai-sdk/react'
import { useVercelMessages } from '@uix-ai/adapter-vercel/react'

function App() {
  const chat = useChat({ api: '/api/chat' })
  const conversations = useVercelMessages(chat.messages)

  // Use conversations with any UIX component
}
```

## React Hooks

### `useVercelChat(options?)`

Complete bridge that manages chat state and conversion.

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `api` | `string` | `'/api/chat'` | Vercel AI SDK endpoint |
| `conversionOptions` | `ConversionOptions` | -- | Customize block ID generation, part filtering |
| `initialMessages` | `VercelUIMessage[]` | `[]` | Pre-populate the conversation |
| `onFinish` | `() => void` | -- | Called when response completes |
| `onError` | `(error: Error) => void` | -- | Called on error |

**Returns:** `{ conversations, status, send, stop, isLoading, messages, setMessages }`

### `useVercelMessages(messages, options?)`

Low-level hook that reactively converts Vercel messages to `LucidConversation[]`. Use this when you manage `useChat` yourself.

```tsx
const conversations = useVercelMessages(messages)
```

## Manual Conversion API

For non-React usage or server-side conversion:

```typescript
import { fromVercelMessages, fromVercelMessage, toVercelMessage, toVercelMessages } from '@uix-ai/adapter-vercel'

// Vercel -> UIX
const conversations = fromVercelMessages(vercelMessages)
const single = fromVercelMessage(vercelMessage)

// UIX -> Vercel
const vercelMsg = toVercelMessage(conversation)
const vercelMsgs = toVercelMessages(conversations)
```

### `convertPartToBlock(part, options?)`

Convert a single Vercel message part to a `LucidBlock`:

```typescript
import { convertPartToBlock } from '@uix-ai/adapter-vercel'

const block = convertPartToBlock({ type: 'text', text: 'Hello' })
```

### `convertBlockToParts(block)`

Convert a `LucidBlock` back to Vercel message parts:

```typescript
import { convertBlockToParts } from '@uix-ai/adapter-vercel'

const parts = convertBlockToParts(textBlock)
```

## Conversion Options

```typescript
const options: ConversionOptions = {
  generateBlockId: () => crypto.randomUUID(),
  includeMetadata: false,
  filterPart: (part) => part.type !== 'step-start',
}

const conversations = fromVercelMessages(messages, options)
```

## Supported Vercel Part Types

| Vercel Part | UIX Block Type | Notes |
|-------------|----------------|-------|
| `text` | `text` | Supports streaming state |
| `reasoning` | `thinking` | Maps to thinking/reasoning block |
| `file` | `file` | Preserves MIME type and filename |
| `source-url` | `source` | URL citation for RAG |
| `source-document` | `source` | Document citation for RAG |
| `tool-*` / `dynamic-tool` | `tool` | Full tool lifecycle mapping |
| `step-start` | *(skipped)* | Structural marker in SDK 6.x agent loops |

## SDK 4.x and 6.x Compatibility

This adapter works with both Vercel AI SDK 4.x and 6.x. Key differences handled automatically:

- **SDK 6.x** introduced `step-start` parts for agent tool loops -- these are skipped as structural markers.
- **SDK 6.x** added `dynamic-tool` type alongside `tool-*` pattern -- both are supported.
- Tool state names differ between versions -- all mappings are handled internally.

## Links

- [UIX Repository](https://github.com/Deepractice/UIX)
- [Vercel AI SDK Migration Guide (6.0)](https://ai-sdk.dev/docs/migration-guides/migration-guide-6-0)
