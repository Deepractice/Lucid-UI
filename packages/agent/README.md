# @uix-ai/agent

React components for rendering UIX Lucid IR conversations. From a single `<AgentChat>` drop-in to fully composable primitives.

## Install

```bash
pnpm add @uix-ai/agent
```

Peer dependencies: `react`, `@uix-ai/core`

## Quick Start (3 lines)

```tsx
import { AgentChat } from '@uix-ai/agent'

<AgentChat
  conversations={conversations}
  onSend={(text) => sendToAgent(text)}
/>
```

## Integration with Adapters

### With Vercel AI SDK

```tsx
import { AgentChat } from '@uix-ai/agent'
import { useVercelChat } from '@uix-ai/adapter-vercel/react'

function App() {
  const { conversations, status, send, stop } = useVercelChat()
  return <AgentChat conversations={conversations} status={status} onSend={send} onStop={stop} />
}
```

### With AG-UI

```tsx
import { AgentChat } from '@uix-ai/agent'
import { useAGUI } from '@uix-ai/adapter-agui/react'

function App() {
  const { conversations, status, send } = useAGUI({ url: '/api/agent' })
  return <AgentChat conversations={conversations} status={status} onSend={send} />
}
```

## AgentChat Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `conversations` | `LucidConversation[]` | *required* | Conversation data from any adapter |
| `agent` | `ChatWindowAgent \| null` | `null` | Agent info for the header (`{ id, name, status }`) |
| `status` | `'idle' \| 'loading' \| 'streaming' \| 'error'` | `'idle'` | Controls input state and submit button |
| `onSend` | `(message: string) => void` | -- | Called when user sends a message |
| `onStop` | `() => void` | -- | Called when user clicks stop during streaming |
| `onRetry` | `() => void` | -- | Called when user clicks retry on error |
| `onToolApprove` | `(toolCallId: string) => void` | -- | Called when user approves a tool execution |
| `onToolDeny` | `(toolCallId: string, reason?: string) => void` | -- | Called when user denies a tool execution |
| `placeholder` | `string` | `'...'` | Input placeholder text |
| `emptyState` | `{ icon?, title?, description? }` | -- | Empty state configuration |
| `renderBlock` | `(block, conversation) => ReactNode \| null` | -- | Custom block renderer; return `null` to fall back to default |
| `showHeader` | `boolean` | `true` if `agent` set | Whether to show the header |
| `autoScroll` | `boolean` | `true` | Auto scroll to bottom on new messages |

## Composable Components

For full control, use the individual building blocks instead of `<AgentChat>`:

### Layout

- **`ChatWindow`** -- top-level container with agent/status context
- **`ChatWindowHeader`** -- header bar showing agent info and status
- **`ChatWindowMessages`** -- scrollable message area with auto-scroll
- **`ChatWindowInput`** -- message input area
- **`ChatWindowEmpty`** -- empty state placeholder
- **`ChatList`** -- list of multiple chat sessions

### Messages

- **`ChatMessage`** -- single message wrapper with role-based styling
- **`ChatMessageAvatar`** -- avatar slot within a message
- **`ChatMessageContent`** -- content slot within a message
- **`ChatMessageTimestamp`** -- timestamp display
- **`MessageList`** -- renders an array of messages
- **`ChatBubble`** -- styled message bubble

### Blocks

- **`StreamText`** -- streaming text with cursor animation
- **`ThinkingIndicator`** -- thinking/reasoning block display
- **`ToolResult`** -- tool call result with status indicator
- **`SourceBlock` / `SourceList`** -- citation/source blocks for RAG

### Avatars

- **`Avatar`** -- base avatar component
- **`AvatarGroup`** -- grouped avatar display
- **`AgentAvatar`** -- agent avatar with status indicator
- **`MessageAvatar`** -- role-based avatar

### Input

- **`ChatInput`** -- text input with send button
- **`MentionPopover`** -- @-mention popover

## Custom Block Rendering

Override how specific block types are rendered:

```tsx
<AgentChat
  conversations={conversations}
  onSend={send}
  renderBlock={(block, conversation) => {
    if (block.type === 'tool') {
      return <MyCustomToolView block={block} />
    }
    return null // fall back to default rendering
  }}
/>
```

## Links

- [UIX Repository](https://github.com/Deepractice/UIX)
