# @uix/adapter-a2ui

Adapter to convert [Google A2UI](https://github.com/google/A2UI) protocol payloads to UIX Lucid IR format.

> **Experimental.** A2UI is an early-stage protocol and its specification may change. This adapter tracks the latest available version (`v0.10`).

## Install

```bash
pnpm add @uix/adapter-a2ui
```

Peer dependency: `@uix/core`

## Quick Start

```typescript
import { fromA2UIPayload, toA2UIPayload } from '@uix/adapter-a2ui'

// A2UI -> UIX Lucid IR
const conversation = fromA2UIPayload(a2uiPayload)

// UIX Lucid IR -> A2UI
const payload = toA2UIPayload(conversation)
```

## `fromA2UIPayload(payload, options?)`

Converts an A2UI `updateComponents` payload into a `LucidConversation`. The A2UI component tree is flattened into a linear sequence of `LucidBlock` items. Container components (Row, Column, Card, etc.) are traversed but not emitted as blocks.

Returns `null` if the payload does not contain `updateComponents`.

```typescript
import { fromA2UIPayload } from '@uix/adapter-a2ui'
import type { A2UIPayload } from '@uix/adapter-a2ui'

const payload: A2UIPayload = {
  version: 'v0.10',
  updateComponents: {
    surfaceId: 'form_1',
    components: [
      { id: 'root', component: 'Column', children: ['title', 'img'] },
      { id: 'title', component: 'Text', text: 'Hello World' },
      { id: 'img', component: 'Image', url: 'https://example.com/photo.png' },
    ],
  },
}

const conversation = fromA2UIPayload(payload)
// conversation.blocks[0] -> text block "Hello World"
// conversation.blocks[1] -> image block
```

### Batch conversion

```typescript
import { fromA2UIPayloads } from '@uix/adapter-a2ui'

const conversations = fromA2UIPayloads(payloadArray)
```

## `toA2UIPayload(conversation, surfaceId?, version?)`

Converts a `LucidConversation` back to an A2UI `updateComponents` payload. All blocks are wrapped in a root `Column` layout.

```typescript
import { toA2UIPayload } from '@uix/adapter-a2ui'

const payload = toA2UIPayload(conversation)
// payload.updateComponents.components -> [Column root, Text, Image, ...]
```

## Supported Component Types

### Display Components

| A2UI Component | UIX Block Type | Notes |
|----------------|----------------|-------|
| `Text` | `text` | Direct mapping |
| `Image` | `image` | Direct mapping |
| `Icon` | `text` | Rendered as `[Icon: name]` |
| `Video` | `text` | Rendered as `[Video: url]` |
| `AudioPlayer` | `text` | Rendered as `[Audio: url]` |

### Container Components (traversed, not emitted)

`Row`, `Column`, `Card`, `List`, `Tabs`, `Modal`

Containers are walked to collect child components but do not produce blocks themselves. `Tabs` children are emitted with bold tab titles.

### Input Components

| A2UI Component | UIX Block Type | Notes |
|----------------|----------------|-------|
| `TextField` | `text` | `[TextField: label]` |
| `CheckBox` | `text` | `[CheckBox: label]` |
| `DateTimeInput` | `text` | `[DateTimeInput: label]` |
| `ChoicePicker` | `text` | `[ChoicePicker: label] options=[...]` |
| `Slider` | `text` | `[Slider: label] range=[min, max]` |

### Interactive Components

| A2UI Component | UIX Block Type | Notes |
|----------------|----------------|-------|
| `Button` | `text` | `[Button: label] (action:name)` |
| `Divider` | `text` | Rendered as `---` |

## Conversion Options

```typescript
import type { A2UIConversionOptions } from '@uix/adapter-a2ui'

const options: A2UIConversionOptions = {
  generateConversationId: (surfaceId) => `my-${surfaceId}`,
  generateBlockId: (componentId) => `blk-${componentId}`,
  resolveValue: (dynamic) => {
    // Resolve data-binding expressions against your data model
    if (typeof dynamic === 'object' && 'path' in dynamic) {
      return lookupPath(dynamic.path)
    }
    return String(dynamic)
  },
}
```

## Dynamic Values

A2UI supports dynamic data bindings. Without a `resolveValue` function, bindings are rendered as placeholders:

- Path binding: `{ path: "user.name" }` renders as `{{user.name}}`
- Function call: `{ call: "formatDate", args: {...} }` renders as `{{formatDate(...)}}`

Provide a `resolveValue` callback to resolve these against your application's data model.

## Links

- [UIX Repository](https://github.com/Deepractice/UIX)
- [Google A2UI Protocol](https://github.com/google/A2UI)
