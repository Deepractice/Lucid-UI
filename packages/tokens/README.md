# @uix-ai/tokens

Design tokens for the Lucid design system — colors, typography, spacing, and more.

## Installation

```bash
pnpm add @uix-ai/tokens
```

## Usage

```ts
import { colors, typography, spacing } from '@uix-ai/tokens'
```

### Tailwind CSS Integration

```ts
// tailwind.config.ts
import { lucidPreset } from '@uix-ai/tokens/tailwind'

export default {
  presets: [lucidPreset],
  // ...
}
```

## Token Categories

- **Colors** - Primary (Rational Blue), Secondary (Sentient Gold), neutrals, semantic colors
- **Typography** - Font families, sizes, weights, line heights
- **Spacing** - 4px grid system
- **Borders** - Border radius, widths
- **Shadows** - Elevation levels
- **Motion** - Duration and easing curves

## License

MIT
