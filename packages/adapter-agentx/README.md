# @uix-ai/adapter-agentx

Adapter to convert [AgentX](https://github.com/Deepractice/AgentX) Presentation state to UIX Lucid IR format.

## Install

```bash
pnpm add @uix-ai/adapter-agentx @uix-ai/core
```

## Usage

### Convert AgentX PresentationState → UIX IR

```typescript
import { fromAgentXState } from '@uix-ai/adapter-agentx'

presentation.onUpdate((state) => {
  const conversations = fromAgentXState(state)
  // Render with assistant-ui, UIX components, or any UIX-compatible renderer
})
```

### Convert AgentX Conversations → UIX IR

```typescript
import { fromAgentXConversations } from '@uix-ai/adapter-agentx'

const history = messagesToConversations(messages)
const conversations = fromAgentXConversations(history)
```

### Reverse: UIX IR → AgentX

```typescript
import { toAgentXConversations } from '@uix-ai/adapter-agentx'

const agentXConversations = toAgentXConversations(lucidConversations)
```

## Type Mapping

| AgentX | → | UIX IR |
|--------|---|--------|
| `TextBlock { content }` | → | `LucidBlock<'text'> { content: { text } }` |
| `ToolBlock` (4 states) | → | `LucidBlock<'tool'>` (9 states) |
| `ImageBlock` | → | `LucidBlock<'image'>` |
| `ErrorConversation` | → | `LucidConversation` + `LucidBlock<'error'>` |
| `isStreaming: true` | → | `status: 'streaming'` |

## License

MIT
