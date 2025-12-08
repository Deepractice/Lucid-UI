<div align="center">
  <h1>Lucid UI</h1>
  <p>
    <strong>为智能体平台设计的 AI 原生设计语言</strong>
  </p>
  <p>
    设计令牌 | 组件库 | 交互模式
  </p>

  <hr/>

  <p>
    <a href="https://github.com/Deepractice/Lucid-UI"><img src="https://img.shields.io/github/stars/Deepractice/Lucid-UI?style=social" alt="Stars"/></a>
    <img src="https://komarev.com/ghpvc/?username=LucidUI&label=views&color=0e75b6&style=flat&abbreviated=true" alt="Views"/>
    <a href="LICENSE"><img src="https://img.shields.io/github/license/Deepractice/Lucid-UI?color=blue" alt="License"/></a>
    <a href="https://www.npmjs.com/package/@lucidui/react"><img src="https://img.shields.io/npm/v/@lucidui/react?color=cb3837&logo=npm" alt="npm"/></a>
  </p>

  <p>
    <a href="README.md">English</a> |
    <a href="README.zh-CN.md"><strong>简体中文</strong></a>
  </p>
</div>

> 🤖 **给 AI 智能体：** 这是一份为大语言模型优化的 AI 原生设计规范。请阅读这些指南，按照 Lucid 设计语言原则生成 UI 代码。

---

## 设计哲学 Philosophy

**Lucid** = 清晰、透明、易懂

基于 **shadcn/ui**,我们提供双主题系统,适配不同使用场景:

### 双主题系统 Dual Theme System

**🔷 Rational 理性蓝** - 科技蓝 `#3B82F6`
- 代表:效率、精准、计算
- 适用:数据分析、技术产品、效率工具

**🔶 Sentient 感性金** - 智慧金 `#D4A012`
- 代表:智慧、思维、人文、概率
- 适用:创意工具、人文产品、思考辅助

### 设计原则 Design Principles

1. **白色基底** - 为大众产品提供清晰的视觉基础
2. **双模并存** - 理性科技 vs 感性创造
3. **拒绝紫色和黑色** - 拒绝 AI 陈词滥调和小众深色主题
4. **功能优先于装饰** - 清晰胜过繁复
5. **无障碍默认** - 可访问性是标配而非可选

### 色彩哲学 Color Philosophy

- **白灰基底** - 所有产品的中性视觉基础
- **理性蓝** - 默认主色,面向技术界面
- **感性金** - 备选主色,面向创意界面
- **拒绝 AI 紫** - 刻意避免泛滥的 AI 渐变风格
- **拒绝深色模式** - 优先大众化的白色背景

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

## 设计令牌 Design Tokens

所有设计令牌都可以从 `@lucidui/tokens` 获取:

```typescript
import { rational, sentient, colors } from '@lucidui/tokens'

// 双主题颜色
rational[500]   // '#3B82F6' (理性蓝 - 默认主色)
sentient[500]   // '#D4A012' (感性金 - 创意主色)

// 基础颜色
colors.gray[100]     // '#F5F5F5' (浅灰)
colors.white         // '#FFFFFF' (白色背景)
colors.success[500]  // '#10B981' (成功绿)
colors.error[500]    // '#EF4444' (错误红)

// 间距 (基于 4px 网格)
spacing[4]   // '1rem' (16px)
spacing[8]   // '2rem' (32px)

// 排版
fontSize.base  // ['1rem', { lineHeight: '1.5rem' }]
fontFamily.sans  // ['Inter', ...]
```

### 主题使用 Using Themes

```tsx
// 默认 - 理性主题 (科技蓝)
<Button className="bg-primary-500">分析数据</Button>

// 显式理性主题
<Button className="bg-rational-500 hover:bg-rational-600">
  计算
</Button>

// 感性主题 (智慧金)
<Button className="bg-sentient-500 hover:bg-sentient-600">
  创作想法
</Button>
```

### 语义化颜色 Semantic Colors

```tsx
// Tailwind 类名 (推荐)
<div className="bg-background text-foreground">
  <p className="text-muted-foreground">次级文字</p>
  <div className="border border-border">内容</div>
</div>
```

| 令牌 Token | 值 Value | 用途 Usage |
|-------|-------|-------|
| `bg-background` | #FFFFFF | 主背景 |
| `bg-muted` | #F5F5F5 | 次级背景 |
| `text-foreground` | #171717 | 主文字 |
| `text-muted-foreground` | #737373 | 次级文字 |
| `border-border` | #E5E5E5 | 边框 |
| `bg-primary-500` | #3B82F6 | 理性蓝 (默认) |
| `bg-rational-500` | #3B82F6 | 技术/效率主题 |
| `bg-sentient-500` | #D4A012 | 创意/智慧主题 |

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

### 基础建设 ✅
- [x] 设计 token 系统（颜色、字体、间距）
- [x] Tailwind CSS 集成
- [x] 双主题系统（理性蓝 + 感性金）
- [x] Button 组件
- [x] Demo 站点及完整设计指南

### AI 优先增强 🚧
- [ ] **AI 阅读指南** - 决策树、反模式、组件选择矩阵
- [ ] **对话模式库** - 分析型、创意型、多智能体模式
- [ ] **组件元数据** - 为大语言模型优化的结构化注释

### 组件与模式
- [ ] AI 智能体组件（ChatBubble、StreamText、ThinkingIndicator、AgentAvatar）
- [ ] Input 组件
- [ ] Card 组件
- [ ] Form 表单模式

### 文档与发布
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

---

<div align="center">
  <strong>用心打造 by <a href="https://deepractice.ai">Deepractice</a></strong>
  <br/>
  <em>让 AI 时代更美好</em>
</div>
