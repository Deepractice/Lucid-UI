<div align="center">
  <h1>UIX</h1>
  <p>
    <strong>AI 到人类的最后一公里</strong>
  </p>
  <p>
    AI-to-UI 中间表示 (IR) 协议层
  </p>

  <p>
    <a href="https://github.com/Deepractice/UIX"><img src="https://img.shields.io/github/stars/Deepractice/UIX?style=social" alt="Stars"/></a>
    <img src="https://komarev.com/ghpvc/?username=UIX&label=views&color=0e75b6&style=flat&abbreviated=true" alt="Views"/>
    <a href="LICENSE"><img src="https://img.shields.io/github/license/Deepractice/UIX?color=blue" alt="License"/></a>
    <a href="https://www.npmjs.com/package/@uix/lucid-react"><img src="https://img.shields.io/npm/v/@uix/lucid-react?color=cb3837&logo=npm" alt="npm"/></a>
  </p>

  <p>
    <a href="README.md">English</a> |
    <a href="README.zh-CN.md"><strong>简体中文</strong></a>
  </p>
</div>

---

## 最后一公里问题

```
人类意图 → AI 理解 → AI 生成 → ??? → 人类感知
                               ↑
                          断点在这里
```

AI 已经能理解人类意图、进行推理、调用工具、生成内容。但 **AI 的输出如何真正抵达人类？** 这"最后一公里"一直是断裂的。

**UIX 填补这个断层** —— 一个 AI 和 UI 都理解的协议。

---

## 什么是 UIX？

**UIX** 是 AI 与 UI 之间的中间表示 (IR) 协议层。

```
┌───────────────────────────────────────────────────┐
│                       UIX                         │
│            "AI 到人类的最后一公里"                  │
├───────────────────────────────────────────────────┤
│                                                   │
│  人类意图                                          │
│       ↓                                           │
│  AI 处理 (思考、工具调用、内容生成)                 │
│       ↓                                           │
│  UIX IR ← AI 输出的标准化格式                       │
│       ↓                                           │
│  UI 渲染 ← 理解 IR 的组件                          │
│       ↓                                           │
│  人类感知                                          │
│                                                   │
└───────────────────────────────────────────────────┘
```

### 两个消费者，一套协议

> **UIX IR 同时服务于 AI 和 UI。**

- **给 AI**：标准化的输出格式 —— AI 直接生成 UIX IR
- **给 UI**：标准化的输入格式 —— UI 直接渲染 UIX IR
- **结果**：AI 说这个格式，UI 懂这个格式 —— 无需翻译

---

## 为什么需要 UIX？

### 问题

| 协议 | 状态 | 问题 |
|------|------|------|
| A2UI (Google) | v0.8+ | 声明式 UI 载荷，多平台 (React/Flutter/SwiftUI) |
| AG-UI (CopilotKit) | v0.1+ | 事件驱动的 Agent-前端协议，Google/Microsoft/AWS 已采纳 |
| MCP Apps (Anthropic) | SEP-1865 草案 | 还在设计中，**不能用** |

**多个协议正在涌现，但没有一个提供统一的 IR 层来桥接它们。**

### 解决方案

UIX 提供：
1. **UIX IR** - 今天就能用的稳定内部协议
2. **适配器** - 兼容 Vercel AI SDK、AG-UI、A2UI 及未来协议
3. **参考实现** - React 渲染器作为默认实现

```
AI 智能体事件 (Vercel AI SDK / AG-UI / AgentX / ...)
    ↓
UIX IR (稳定的内部协议)
    ↓
    ├── ReactRenderer (今天能用)
    ├── A2UIRenderer (等 A2UI 成熟)
    └── MCPAppsRenderer (等 MCP Apps 成熟)
```

### 为什么不直接用 A2UI / AG-UI / MCP Apps？

> "协议在不断涌现 —— AG-UI、A2UI、MCP Apps、Vercel AI SDK —— 每个都有自己的消息格式。UIX IR 是统一的抽象层，能适配所有协议。"

| 方案 | 风险 |
|------|------|
| 等一个标准胜出 | 产品停滞，可能押错宝 |
| 直接绑定 AG-UI | 锁定在一个协议的事件模型上 |
| 直接绑定 A2UI | A2UI 变了就要大改 |
| 直接绑定 MCP Apps | 还在草案阶段，可能大改 |
| **UIX IR + 适配器** | 内部稳定，外部灵活 |

---

## UIX IR vs Design Tokens

> **"Design Tokens 让开发者不用重复定义颜色，UIX IR 让 AI 不用重复学习怎么描述 UI 结构。"**

### 不同层次，不同问题

```
UIX IR     = 剧本（演什么）
React 组件   = 演员（怎么演）
Design Tokens = 服装道具（穿什么）
```

| 维度 | Design Tokens | UIX IR |
|------|---------------|----------|
| 解决的痛点 | 设计到代码的一致性 | AI 输出到界面的标准化 |
| 消费者 | 人类开发者（理解 CSS） | AI（需要结构化、语义化描述） |
| 目标市场 | 设计系统、组件库 | AI Agent 平台 |
| 竞品 | Style Dictionary, Theo | AG-UI、A2UI（协议层，非统一 IR） |

### 核心差异

传统 UI 链路：
```
设计师 (Figma) → 开发者写代码 → 用户看到界面
                 ↑ Design Tokens 解决这段
```

AI Agent 链路：
```
AI 推理 → UIX IR → 渲染引擎 → 用户看到界面
          ↑ UIX IR 解决这段（之前没人做）
```

**Design Tokens 是"样式变量"，UIX IR 是"AI 的 UI 表达语言"** —— 完全不同的层次和用途。

---

## 架构

### 三层设计

```
┌───────────────────────────────────────────────────┐
│  第一层: UIX IR (核心)                             │
│  - JSON Schema 定义                                │
│  - Block 和 Conversation 标准                      │
│  - AI 可生成的格式                                 │
└───────────────────────────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────┐
│  第二层: 渲染器                                    │
│  - ReactRenderer → Web                            │
│  - A2UIRenderer → 原生应用 (未来)                  │
│  - MCPAppsRenderer → Claude Desktop (未来)        │
└───────────────────────────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────┐
│  第三层: 设计系统                                  │
│  - @uix/lucid-tokens (设计令牌)                   │
│  - @uix/lucid-react (基础组件)                    │
│  - @uix/stream (流式渲染)                         │
└───────────────────────────────────────────────────┘
```

### 依赖倒置

所有实现都依赖 UIX IR 抽象：

```
        ┌─────────────────────┐
        │       UIX IR        │  ← 抽象协议
        │    (JSON Schema)    │
        └──────────┬──────────┘
                   │
     ┌─────────┬───┴───┬─────────┐
     │         │       │         │
     ▼         ▼       ▼         ▼
┌─────────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ Vercel  │ │AG-UI │ │A2UI  │ │AgentX│
│ AI SDK  │ │适配器│ │适配器│ │  UI  │
└─────────┘ └──────┘ └──────┘ └──────┘
```

---

## UIX IR 规范

### 核心类型

```typescript
interface LucidConversation {
  id: string
  role: 'user' | 'assistant' | 'system'
  status: 'streaming' | 'completed' | 'error'
  blocks: LucidBlock[]
  timestamp: number
}

interface LucidBlock {
  id: string
  type: 'text' | 'tool' | 'thinking' | 'image' | 'file' | 'error'
  status: 'streaming' | 'completed' | 'error'
  content: unknown  // 根据 type 不同
}

// 渲染器接口
interface LucidRenderer<T> {
  render(conversations: LucidConversation[]): T
}
```

### Block 类型

| 类型 | 描述 | 内容 |
|------|------|------|
| `text` | 文本内容（支持流式） | `{ text: string }` |
| `tool` | 工具/函数调用结果 | `{ name, input, output, status }` |
| `thinking` | AI 推理过程 | `{ reasoning: string }` |
| `image` | 图片内容 | `{ url, alt, width, height }` |
| `file` | 文件附件 | `{ name, type, url }` |
| `error` | 错误信息 | `{ code, message }` |

---

## 与 AgentX 的关系

UIX 从 [AgentX](https://github.com/Deepractice/AgentX) 实践中抽象而来：

```
AgentX UI (粗略实现，实验性)
    ↓ 抽象提炼
UIX IR (协议规范)
    ↓ 实现
AgentX UI + 其他框架 (遵循规范)
```

### 事件流

```
AgentX 4层事件
    │
    │ Stream: text_delta, tool_use_start
    │ State: conversation_thinking, tool_executing
    │ Message: assistant_message, tool_result_message
    │
    ↓ 转换
UIX IR (LucidConversation[])
    ↓ 渲染
React 组件
```

---

## 包结构

| 包 | 层级 | 状态 | 描述 |
|---|------|------|------|
| `@uix/core` | 协议 | 🚧 设计中 | UIX IR JSON Schema 和 TypeScript 类型 |
| `@uix/lucid-tokens` | 设计系统 | ✅ 就绪 | 设计令牌（颜色、字体、间距） |
| `@uix/lucid-react` | 渲染器 | ✅ 就绪 | React 渲染器和基础组件 |
| `@uix/stream` | 渲染器 | ✅ 就绪 | 流式 Markdown 渲染器 (Streamdown) |
| `@uix/agent` | 组件 | ✅ 就绪 | AI Agent 对话组件 |
| `@uix/adapter-vercel` | 适配器 | ✅ 就绪 | Vercel AI SDK 4.x / 6.x ↔ UIX IR 转换器 |
| `@uix/adapter-agui` | 适配器 | 🚧 Alpha | AG-UI 协议事件 → UIX IR 转换器 |
| `@uix/adapter-a2ui` | 适配器 | 🧪 实验性 | Google A2UI 声明式 UI → UIX IR 转换器 |

---

## 快速开始

### 给开发者 (React 渲染器)

```bash
pnpm add @uix/lucid-react @uix/lucid-tokens
```

```tsx
import { Button } from '@uix/lucid-react'

function App() {
  return <Button>点击我</Button>
}
```

### 给 AI 智能体 (UIX IR)

```json
{
  "conversations": [
    {
      "id": "conv-1",
      "role": "user",
      "status": "completed",
      "blocks": [
        { "id": "b1", "type": "text", "status": "completed", "content": { "text": "你好" } }
      ]
    },
    {
      "id": "conv-2",
      "role": "assistant",
      "status": "streaming",
      "blocks": [
        { "id": "b2", "type": "text", "status": "streaming", "content": { "text": "你好..." } },
        { "id": "b3", "type": "tool", "status": "completed", "content": { "name": "search", "output": "..." } }
      ]
    }
  ]
}
```

---

## 设计哲学

### 双主题系统

**🔷 理性蓝** - 科技蓝 `#0284c7`
- 适用：数据分析、技术产品、效率工具
- 代表：效率、精准、计算

**🔶 感性金** - 智慧金 `#f59e0b`
- 适用：创意工具、人文产品、思考辅助
- 代表：智慧、思维、人文

### 设计原则

1. **白色基底** - 清晰的视觉基础，无暗色模式
2. **拒绝 AI 紫** - 拒绝泛滥的 AI 渐变风格
3. **Block-Based** - 文本和工具并行渲染
4. **流式优先** - 自修复不完整内容
5. **无障碍默认** - 可访问性是标配

---

## 路线图

### 第一阶段：基础建设 ✅
- [x] 设计令牌系统 (`@uix/lucid-tokens`)
- [x] React 基础组件 (`@uix/lucid-react`)
- [x] 流式 Markdown 渲染器 (`@uix/stream`)
- [x] AI Agent 组件 (`@uix/agent`)
  - [x] ChatMessage, ChatInput, Avatar 系统
  - [x] StreamText, ThinkingIndicator, ToolResult
  - [x] ChatList, ChatWindow 布局组件

### 第二阶段：协议与适配器 ✅
- [x] UIX IR JSON Schema（`packages/core/schema/uix-ir.schema.json`）
- [x] TypeScript 类型定义（`@uix/core`）
- [x] Vercel AI SDK 适配器（`@uix/adapter-vercel`，支持 SDK 4.x 和 6.x）
- [x] AG-UI 协议适配器（`@uix/adapter-agui`）
- [x] A2UI 协议适配器（`@uix/adapter-a2ui`，实验性）
- [x] 文档和示例（`examples/`，各包 README）
- [ ] AgentX 适配器
- [ ] IR 校验工具

### 第三阶段：生态
- [ ] npm 发布（`@uix/*` 包）
- [ ] `create-uix-app` CLI 脚手架
- [ ] 接入真实 AI Agent 的 Live Demo
- [ ] MCP Apps 渲染器（等成熟后）
- [ ] 更多适配器集成（LangChain、CrewAI 等）

---

## 生态系统

**Deepractice AI 开发生态** 的一部分：

| 项目 | 描述 |
|------|------|
| [AgentX](https://github.com/Deepractice/AgentX) | AI 智能体开发框架 |
| [PromptX](https://github.com/Deepractice/PromptX) | 提示词工程平台 |
| [PromptML](https://github.com/Deepractice/PromptML) | Deepractice 提示词标记语言 |

---

## 开发

```bash
git clone https://github.com/Deepractice/UIX.git
cd UIX
pnpm install
pnpm dev
```

---

## 许可证

MIT - 查看 [LICENSE](LICENSE)

---

<div align="center">
  <strong>用心打造 by <a href="https://deepractice.ai">Deepractice</a></strong>
</div>
