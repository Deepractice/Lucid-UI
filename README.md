<div align="center">
  <h1>Lucid UI · Design System for AI Generation</h1>
  <p>
    <strong>A clear and professional design system for the AI era</strong>
  </p>
  <p>
    <strong>Key Features:</strong> Dual Theme System | Based on shadcn/ui | White Foundation | No Purple, No Black
  </p>

  <hr/>

  <p>
    <a href="https://github.com/Deepractice/Lucid-UI"><img src="https://img.shields.io/github/stars/Deepractice/Lucid-UI?style=social" alt="Stars"/></a>
    <img src="https://komarev.com/ghpvc/?username=LucidUI&label=views&color=0e75b6&style=flat&abbreviated=true" alt="Views"/>
    <a href="LICENSE"><img src="https://img.shields.io/github/license/Deepractice/Lucid-UI?color=blue" alt="License"/></a>
    <a href="https://www.npmjs.com/package/@lucidui/react"><img src="https://img.shields.io/npm/v/@lucidui/react?color=cb3837&logo=npm" alt="npm"/></a>
  </p>

  <p>
    <a href="README.md"><strong>English</strong></a> |
    <a href="README.zh-CN.md">简体中文</a>
  </p>
</div>

> 💡 **For AI Assistants:** This README is optimized for both human and AI readers. All code examples are ready to use.

---

## Philosophy

**Lucid** = Clear, Transparent, Understandable

Based on **shadcn/ui**, we provide a dual theme system for different scenarios:

### Dual Theme System

**🔷 Rational Theme** - Tech Blue `#3B82F6`
- Represents: Efficiency, Precision, Computation
- Use for: Data analysis, Technical products, Productivity tools

**🔶 Sentient Theme** - Wisdom Gold `#D4A012`
- Represents: Wisdom, Thinking, Humanity, Probability
- Use for: Creative tools, Human-centric products, Thinking aids

### Design Principles

1. **White Foundation** - Clear visual base for mainstream products
2. **Dual Modes** - Rational tech vs Sentient creativity
3. **No Purple, No Black** - Reject AI clichés and niche dark themes
4. **Clarity over decoration** - Function before form
5. **Accessibility by default** - Not an afterthought

### Color Philosophy

- **White & Gray Foundation** - Neutral base for all products
- **Rational Blue** - Default primary, for tech-focused interfaces
- **Sentient Gold** - Alternative primary, for creative interfaces
- **No AI Purple** - Deliberately avoiding overused AI gradients
- **No Dark Mode** - Prioritize mainstream white-background clarity

---

## Quick Start

### 1. Installation

```bash
pnpm add @lucidui/react @lucidui/tokens
```

### 2. Setup Tailwind CSS

Install Tailwind:
```bash
pnpm add -D tailwindcss autoprefixer postcss
```

Create `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss'
import { lucidPreset } from '@lucidui/tokens/tailwind'

export default {
  presets: [lucidPreset],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@lucidui/react/dist/**/*.js',
  ],
} satisfies Config
```

Create `postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

Add to your CSS file:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Use Components

```tsx
import { Button } from '@lucidui/react'

export default function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Hello Lucid UI
        </h1>

        <div className="flex gap-3">
          <Button>Primary Action</Button>
          <Button variant="outline">Secondary</Button>
          <Button variant="ghost">Subtle</Button>
        </div>
      </div>
    </div>
  )
}
```

---

## Component Usage

### Button

```tsx
import { Button } from '@lucidui/react'

// Variants
<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Subtle</Button>
<Button variant="destructive">Danger</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Normal</Button>
<Button size="lg">Large</Button>

// As a link
<Button asChild>
  <a href="/somewhere">Link Button</a>
</Button>

// Disabled
<Button disabled>Disabled</Button>
```

---

## Design Tokens

All design tokens are available in `@lucidui/tokens`:

```typescript
import { rational, sentient, colors } from '@lucidui/tokens'

// Dual Theme Colors
rational[500]   // '#3B82F6' (Rational Blue - default primary)
sentient[500]   // '#D4A012' (Sentient Gold - creative primary)

// Foundation Colors
colors.gray[100]     // '#F5F5F5' (Light Gray)
colors.white         // '#FFFFFF' (White background)
colors.success[500]  // '#10B981' (Success Green)
colors.error[500]    // '#EF4444' (Error Red)

// Spacing (based on 4px grid)
spacing[4]   // '1rem' (16px)
spacing[8]   // '2rem' (32px)

// Typography
fontSize.base  // ['1rem', { lineHeight: '1.5rem' }]
fontFamily.sans  // ['Inter', ...]
```

### Using Themes

```tsx
// Default - Rational Theme (tech blue)
<Button className="bg-primary-500">Analyze Data</Button>

// Explicit Rational Theme
<Button className="bg-rational-500 hover:bg-rational-600">
  Calculate
</Button>

// Sentient Theme (wisdom gold)
<Button className="bg-sentient-500 hover:bg-sentient-600">
  Create Idea
</Button>
```

### Semantic Colors

```tsx
// Tailwind classes (recommended)
<div className="bg-background text-foreground">
  <p className="text-muted-foreground">Secondary text</p>
  <div className="border border-border">Content</div>
</div>
```

| Token | Value | Usage |
|-------|-------|-------|
| `bg-background` | #FFFFFF | Main background |
| `bg-muted` | #F5F5F5 | Subtle background |
| `text-foreground` | #171717 | Primary text |
| `text-muted-foreground` | #737373 | Secondary text |
| `border-border` | #E5E5E5 | Borders |
| `bg-primary-500` | #3B82F6 | Rational blue (default) |
| `bg-rational-500` | #3B82F6 | Tech/efficiency theme |
| `bg-sentient-500` | #D4A012 | Creative/wisdom theme |

---

## Common Patterns

### Page Layout

```tsx
<div className="min-h-screen bg-background">
  {/* Header */}
  <header className="border-b border-border">
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-xl font-semibold">App Name</h1>
    </div>
  </header>

  {/* Main */}
  <main className="container mx-auto px-4 py-8">
    <div className="max-w-2xl space-y-6">
      {/* Content */}
    </div>
  </main>
</div>
```

### Card Pattern

```tsx
<div className="rounded-lg border border-border bg-white p-6 shadow-sm">
  <h3 className="font-medium text-foreground">Card Title</h3>
  <p className="text-sm text-muted-foreground">Card description</p>
</div>
```

### AI Chat Pattern

```tsx
<div className="max-w-2xl space-y-4">
  {/* User message - Rational theme for analytical queries */}
  <div className="ml-auto max-w-lg rounded-lg bg-rational-500 px-4 py-3 text-white">
    Analyze this data set
  </div>

  {/* AI response - Sentient theme for creative suggestions */}
  <div className="mr-auto max-w-lg rounded-lg bg-sentient-100 border border-sentient-300 px-4 py-3">
    <p className="text-sentient-900">Let me help you explore the patterns...</p>
  </div>
</div>
```

### Loading State

```tsx
<div className="flex items-center gap-2 text-muted-foreground">
  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary-500" />
  <span>Thinking...</span>
</div>
```

---

## Packages

| Package | Description |
|---------|-------------|
| `@lucidui/tokens` | Design Tokens - Colors, typography, spacing, etc. |
| `@lucidui/react` | React Components - Core UI components |
| `@lucidui/agent` | Agent Components - Chat, streaming, code blocks (planned) |

---

## Tech Stack

- **React 18** + TypeScript
- **Radix UI Primitives** - Accessible component foundation
- **Tailwind CSS** - Styling system
- **class-variance-authority** - Variant management
- **Vite** + pnpm workspace

---

## Documentation

- **[Design Tokens Reference](packages/tokens/src/)** - Complete token definitions
- **[Component API](packages/react/src/)** - All component source code
- **[Contributing Guide](CONTRIBUTING.md)** - Development guidelines

---

## Roadmap

- [x] Design token system (colors, typography, spacing)
- [x] Tailwind CSS integration
- [x] Button component
- [ ] Input component
- [ ] Card component
- [ ] AI-specific components (ChatBubble, StreamText, CodeBlock)
- [ ] Storybook documentation site
- [ ] npm package publication

---

## Development

```bash
# Clone and install
git clone https://github.com/Deepractice/Lucid-UI.git
cd Lucid-UI
pnpm install

# Development mode
pnpm dev

# Build all packages
pnpm build

# Type check
pnpm tsc --noEmit
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

MIT - see [LICENSE](LICENSE)

---

<div align="center">
  <strong>Built with care by <a href="https://deepractice.ai">Deepractice</a></strong>
  <br/>
  <em>Making AI Generation Beautiful</em>
</div>
