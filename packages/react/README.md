# @uix-ai/react

React renderer and base components for the UIX protocol layer, built on the Lucid design system.

## Installation

```bash
pnpm add @uix-ai/react
```

## Usage

```tsx
import { Button, Card, Badge, Input, Skeleton } from '@uix-ai/react'

function App() {
  return (
    <Card>
      <Badge variant="secondary">New</Badge>
      <Input placeholder="Type something..." />
      <Button>Submit</Button>
    </Card>
  )
}
```

## Components

- `Button` - Configurable button with multiple variants and sizes
- `Card` - Container component with header, content, footer slots
- `Badge` - Small status indicator
- `Input` - Text input field
- `Skeleton` - Loading placeholder

## License

MIT
