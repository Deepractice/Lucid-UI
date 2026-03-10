# @uix-ai/stream

Streaming content renderer for UIX blocks. Renders markdown content with real-time streaming support, powered by [Streamdown](https://github.com/nicolo-ribaudo/streamdown).

## Installation

```bash
pnpm add @uix-ai/stream
```

## Usage

```tsx
import { StreamText } from '@uix-ai/stream'

function ChatMessage({ content }: { content: string }) {
  return <StreamText content={content} />
}
```

## Features

- Real-time streaming markdown rendering
- Syntax highlighting for code blocks
- Self-healing parser (handles incomplete markdown gracefully)
- Lucid design system integration

## License

MIT
