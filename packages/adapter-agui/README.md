# @uix/adapter-agui

Adapter to convert [AG-UI protocol](https://docs.ag-ui.com) streaming events to UIX Lucid IR format.

## Install

```bash
pnpm add @uix/adapter-agui
```

Peer dependencies: `react`, `@uix/core`

## Quick Start

### Using the `useAGUI` hook (recommended)

```tsx
import { AgentChat } from '@uix/agent'
import { useAGUI } from '@uix/adapter-agui/react'

function App() {
  const { conversations, status, send, stop } = useAGUI({ url: '/api/agent' })

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

### `useAGUI` Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | `string` | *required* | AG-UI agent endpoint URL |
| `threadId` | `string` | auto-generated | Thread ID for conversation continuity |
| `headers` | `Record<string, string>` | -- | Custom headers for SSE connection |
| `processorOptions` | `AGUIProcessorOptions` | -- | Event processor configuration |
| `autoConnect` | `boolean` | `false` | Connect on mount |
| `onError` | `(error: Error) => void` | -- | Error callback |
| `onFinish` | `() => void` | -- | Run finished callback |

**Returns:** `{ conversations, status, send, stop, isLoading, reset, error }`

### With thread persistence

```tsx
const { conversations, send } = useAGUI({
  url: '/api/agent',
  threadId: 'thread-abc-123',
  headers: { Authorization: 'Bearer ...' },
})
```

## Manual `AGUIEventProcessor` Usage

For non-React use cases or custom event sources, use the stateful processor directly:

```typescript
import { AGUIEventProcessor } from '@uix/adapter-agui'

const processor = new AGUIEventProcessor({
  onUpdate: (conversations) => {
    // Called after each event is processed
    renderUI(conversations)
  },
})

// Feed events from any source
eventSource.onmessage = (event) => {
  processor.processEvent(JSON.parse(event.data))
}

// Read current state at any time
const conversations = processor.getConversations()

// Reset all state
processor.reset()
```

### Batch conversion (stateless)

For one-shot conversion of a complete event array:

```typescript
import { fromAGUIEvents } from '@uix/adapter-agui'

const conversations = fromAGUIEvents(events)
```

## Supported Event Types

### Lifecycle Events

| Event | Description |
|-------|-------------|
| `RunStarted` | Agent run begins (with `threadId`, `runId`) |
| `RunFinished` | Agent run completes; all streaming messages marked completed |
| `RunError` | Agent run failed; last assistant message marked as error |
| `StepStarted` | Agent step begins |
| `StepFinished` | Agent step completes |

### Text Message Events

| Event | Description |
|-------|-------------|
| `TextMessageStart` | New message created with role and ID |
| `TextMessageContent` | Text delta appended to current message |
| `TextMessageEnd` | Message streaming complete |

### Tool Call Events

| Event | Description |
|-------|-------------|
| `ToolCallStart` | Tool invocation begins (attached to parent message) |
| `ToolCallArgs` | Streamed tool input argument deltas |
| `ToolCallEnd` | Tool input complete |
| `ToolCallResult` | Tool output received |

### Reasoning Events

| Event | Description |
|-------|-------------|
| `ReasoningMessageStart` | Thinking/reasoning block begins |
| `ReasoningMessageContent` | Reasoning text delta |
| `ReasoningMessageEnd` | Reasoning complete |

### State Events

| Event | Description |
|-------|-------------|
| `StateSnapshot` | Full state snapshot |
| `StateDelta` | JSON Patch delta for state |
| `MessagesSnapshot` | Full messages snapshot |

State events (`StateSnapshot`, `StateDelta`, `MessagesSnapshot`) are received but do not produce blocks in the current implementation.

## Links

- [UIX Repository](https://github.com/Deepractice/UIX)
- [AG-UI Protocol Documentation](https://docs.ag-ui.com)
