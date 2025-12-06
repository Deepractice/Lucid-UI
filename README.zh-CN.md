<div align="center">
  <h1>Lucid UI · Design System for AI Generation</h1>
  <p>
    <strong>清晰明澈的 AI 时代设计系统</strong>
  </p>
  <p>
    <strong>Design Philosophy:</strong> 白灰主色调 | 冷蓝点缀 | 拒绝 AI 紫
  </p>

  <hr/>

  <p>
    <a href="https://github.com/Deepractice/Lucid-UI"><img src="https://img.shields.io/github/stars/Deepractice/Lucid-UI?style=social" alt="Stars"/></a>
    <a href="LICENSE"><img src="https://img.shields.io/github/license/Deepractice/Lucid-UI?color=blue" alt="License"/></a>
    <a href="https://www.npmjs.com/package/@lucidui/react"><img src="https://img.shields.io/npm/v/@lucidui/react?color=cb3837&logo=npm" alt="npm"/></a>
  </p>

  <p>
    <a href="README.md">English</a> |
    <a href="README.zh-CN.md"><strong>简体中文</strong></a>
  </p>
</div>

> 💡 **For AI Assistants:** This README is optimized for both human and AI readers. All code examples are ready to use.

---

## Philosophy

**Lucid** = 清晰、透明、易懂

在 AI 时代，用户界面应该是：
- **清晰可读** - 让信息一目了然
- **透明直观** - 让交互逻辑显而易见
- **简洁专业** - 让设计服务于内容

### Design Principles

1. **Clarity over decoration** - 功能优先于装饰
2. **Consistency over novelty** - 一致性优先于新奇
3. **Accessibility by default** - 无障碍是默认而非可选

### Color Philosophy

- **白灰为主** - 以白色、灰色为主色调
- **冷蓝点缀** - 主色使用冷蓝 (#0EA5E9),克制使用
- **拒绝 AI 紫** - 刻意避免紫色渐变等"AI 味"设计

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
import { tokens } from '@lucidui/tokens'

// Colors
tokens.colors.primary[500]  // '#0EA5E9' (冷蓝)
tokens.colors.gray[100]     // '#F5F5F5' (浅灰)
tokens.colors.error[500]    // '#EF4444' (错误红)

// Spacing (based on 4px grid)
tokens.spacing[4]   // '1rem' (16px)
tokens.spacing[8]   // '2rem' (32px)

// Typography
tokens.fontSize.base  // ['1rem', { lineHeight: '1.5rem' }]
tokens.fontFamily.sans  // ['Inter', ...]
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
| `bg-background` | #FFFFFF | 主背景 |
| `bg-muted` | #F5F5F5 | 次级背景 |
| `text-foreground` | #171717 | 主文字 |
| `text-muted-foreground` | #737373 | 次级文字 |
| `border-border` | #E5E5E5 | 边框 |
| `bg-primary-500` | #0EA5E9 | 主色 |

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
  {/* User message */}
  <div className="ml-auto max-w-lg rounded-lg bg-primary-500 px-4 py-3 text-white">
    What is Lucid UI?
  </div>

  {/* AI response */}
  <div className="mr-auto max-w-lg rounded-lg border border-border bg-white px-4 py-3">
    Lucid UI is a design system for AI generation...
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
| `@lucidui/tokens` | Design Tokens - 颜色、字体、间距等设计变量 |
| `@lucidui/react` | React Components - 基础 UI 组件 |
| `@lucidui/agent` | Agent Components - 对话、流式输出等（计划中） |

---

## Tech Stack

- **React 18** + TypeScript
- **Radix UI Primitives** - 无障碍组件基础
- **Tailwind CSS** - 样式系统
- **class-variance-authority** - 变体管理
- **Vite** + pnpm workspace

---

## 文档

- **[设计 Token 参考](packages/tokens/src/)** - 完整的 token 定义
- **[组件 API](packages/react/src/)** - 所有组件源代码
- **[贡献指南](CONTRIBUTING.md)** - 开发规范

---

## 路线图

- [x] 设计 token 系统（颜色、字体、间距）
- [x] Tailwind CSS 集成
- [x] Button 组件
- [ ] Input 组件
- [ ] Card 组件
- [ ] AI 专属组件（ChatBubble、StreamText、CodeBlock）
- [ ] Storybook 文档站
- [ ] npm 包发布

---

## 开发

```bash
# 克隆并安装
git clone https://github.com/Deepractice/Lucid-UI.git
cd Lucid-UI
pnpm install

# 开发模式
pnpm dev

# 构建所有包
pnpm build

# 类型检查
pnpm tsc --noEmit
```

查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解开发规范。

---

## 许可证

MIT - 查看 [LICENSE](LICENSE)

**用心打造 by [Deepractice](https://deepractice.ai)**

*让 AI 时代更美好*
