<div align="center">
  <h1>UIX</h1>
  <p>
    <strong>AI 到人类的最后一公里</strong>
  </p>
  <p>
    AI-to-UI 中间表示 (IR) 协议与转换引擎
  </p>

  <p>
    <a href="https://github.com/Deepractice/UIX"><img src="https://img.shields.io/github/stars/Deepractice/UIX?style=social" alt="Stars"/></a>
    <img src="https://komarev.com/ghpvc/?username=UIX&label=views&color=0e75b6&style=flat&abbreviated=true" alt="Views"/>
    <a href="LICENSE"><img src="https://img.shields.io/github/license/Deepractice/UIX?color=blue" alt="License"/></a>
    <a href="https://www.npmjs.com/package/@uix-ai/core"><img src="https://img.shields.io/npm/v/@uix-ai/core?color=cb3837&logo=npm" alt="npm"/></a>
  </p>

  <p>
    <a href="README.md">English</a> |
    <a href="README.zh-CN.md"><strong>简体中文</strong></a>
  </p>
</div>

---

## UIX 是什么（以及不是什么）

**UIX 是协议层和转换引擎**，不是 Chat UI 框架。

如果你需要完整的 React 聊天界面，用 [assistant-ui](https://github.com/assistant-ui/assistant-ui) —— 它很优秀且经过实战验证。UIX 解决的是另一个问题：**将任意 AI 后端的输出归一化为单一、稳定的格式。**

```
                      ┌─────────────────────────┐
Vercel AI SDK ──────→ │                         │
AgentX ─────────────→ │   UIX IR                │ ──→ assistant-ui
AG-UI (CopilotKit) ─→ │   (统一格式)              │ ──→ 你自己的渲染器
A2UI (Google) ──────→ │                         │ ──→ 任何 UI 框架
                      └─────────────────────────┘
```

**UIX 之于 AI 输出，就像 Babel 之于 JavaScript** —— Babel 在不同引擎间统一 JS 语法；UIX 在不同 AI 后端间统一输出格式。

---

## 问题

各 AI 后端说着不同的"语言"：

| 来源 | 消息格式 | 工具调用格式 | 流式协议 |
|------|---------|------------|---------|
| Vercel AI SDK | `UIMessage.parts[]` | `ToolInvocationPart` | Data Stream |
| AgentX | `Conversation.blocks[]` | `ToolBlock` | WebSocket 事件 |
| AG-UI (CopilotKit) | AG-UI 事件 | `ToolCallStart/End` | SSE 事件 |
| A2UI (Google) | 声明式 UI 载荷 | 组件化 | gRPC 流 |

如果你的聊天界面直接绑定一种格式，换后端就要重写 UI 层。

**UIX IR 消除了这层耦合。** 你的 UI 只认识 `LucidConversation` 和 `LucidBlock` —— 适配器处理剩下的事。

---

## 架构

```
┌─────────────────────────────────────────────────────────────────┐
│  AI 后端 (上游)                                                   │
│  Vercel AI SDK · AgentX · AG-UI · A2UI · LangChain · ...        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    UIX 适配器 (防腐层 ACL)
                    纯函数，零副作用
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  UIX IR  (@uix-ai/core)                                         │
│  LucidConversation → LucidBlock[]                               │
│  7 种 Block: text · tool · thinking · image · file · error ·     │
│  source                                                         │
│  JSON Schema + TypeScript 类型 + 类型守卫                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
               ┌───────────┴───────────┐
               ▼                       ▼
┌──────────────────────┐  ┌──────────────────────────────────────┐
│  assistant-ui         │  │  UIX 参考渲染器                       │
│  (推荐用于生产)        │  │  @uix-ai/stream (StreamMarkdown)      │
│  完整的聊天 UI 运行时  │  │  @uix-ai/agent (ChatBubble 等)         │
│  通过 ExternalStore   │  │  轻量级，零运行时依赖                    │
└──────────────────────┘  └──────────────────────────────────────┘
```

### 为什么用适配器而不是直接集成？

用 DDD 的术语：每个 AI 后端是一个独立的**限界上下文 (Bounded Context)**。UIX 适配器是**防腐层 (Anti-Corruption Layer)** —— 下游消费者（UI）保护自己不受上游格式变化的污染。

- 上游（AgentX、Vercel 等）拥有自己的类型 —— 无需为 UIX 改动
- 下游（UI）只依赖 UIX IR —— 切换后端不受影响
- 适配器是纯函数：`fromX(input) → LucidConversation[]`

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

interface LucidBlock<T extends BlockType> {
  id: string
  type: T  // 'text' | 'tool' | 'thinking' | 'image' | 'file' | 'error' | 'source'
  status: 'streaming' | 'completed' | 'error'
  content: ContentByType<T>  // 条件类型，由 T 推导
}
```

### Block 类型

| 类型 | 描述 | 内容 |
|------|------|------|
| `text` | 文本内容（支持流式） | `{ text: string }` |
| `tool` | 工具/函数调用 | `{ name, input, output, status }` — 9 种状态生命周期 |
| `thinking` | AI 推理过程 | `{ reasoning: string }` |
| `image` | 图片内容 | `{ url, alt, width, height }` |
| `file` | 文件附件 | `{ name, type, url, size }` |
| `error` | 错误信息 | `{ code, message, details }` |
| `source` | 来源引用 | `{ sourceId, title, url, excerpt }` |

### 工具生命周期（9 种状态）

```
pending → streaming → ready → running → success
                                ↓
                        approval-required → approved → success
                                         → denied
                                ↓
                               error
```

---

## 包结构

### 核心（价值所在）

| 包 | 描述 | 状态 |
|---|------|------|
| `@uix-ai/core` | UIX IR 类型、JSON Schema、类型守卫 | ✅ v0.0.2 |

### 适配器（桥梁）

| 包 | 转换来源 | 状态 |
|---|---------|------|
| `@uix-ai/adapter-vercel` | Vercel AI SDK 4.x / 6.x | ✅ v0.0.2 |
| `@uix-ai/adapter-agui` | AG-UI 协议 (CopilotKit) | 🚧 Alpha |
| `@uix-ai/adapter-a2ui` | A2UI 协议 (Google) | 🧪 实验性 |
| `@uix-ai/adapter-agentx` | AgentX Presentation | 🔜 计划中 |

### 参考渲染器（可选）

这些**不是** UIX 的核心价值。它们是轻量参考实现。生产环境的聊天 UI，我们推荐 [assistant-ui](https://github.com/assistant-ui/assistant-ui)。

| 包 | 描述 | 状态 |
|---|------|------|
| `@uix-ai/stream` | 流式 Markdown 渲染器（Streamdown + Shiki + KaTeX + Mermaid，自愈能力） | ✅ v0.0.2 |
| `@uix-ai/agent` | 对话组件（MessageList、ChatBubble、ToolResult、ThinkingIndicator） | ✅ v0.0.2 |
| `@uix-ai/react` | 基础 UI 组件（Button、Input、Badge、Card） | ✅ v0.0.2 |
| `@uix-ai/tokens` | Lucid 设计令牌（Tailwind preset） | ✅ v0.0.2 |

---

## 与其他项目的关系

### vs assistant-ui

| | UIX | assistant-ui |
|---|---|---|
| **解决的问题** | "如何归一化 AI 输出" | "如何用 React 渲染 AI 对话" |
| **核心产物** | JSON Schema + TypeScript 类型 | React 组件 + 运行时 |
| **状态管理** | 无状态（纯转换） | 完整运行时（Thread、消息、分支） |
| **关系** | **assistant-ui 的数据源** | **UIX IR 的渲染层** |

两者互补。用 UIX 归一化你的 AI 后端输出，然后喂给 assistant-ui 的 `ExternalStoreRuntime` 渲染。

### vs AG-UI / A2UI / MCP Apps

这些是**传输协议**（AI 如何与前端通信）。UIX IR 是**内部表示**（你的应用如何存储和渲染 AI 输出）。UIX 适配器桥接两者：

```
AG-UI 事件 → adapter-agui → UIX IR → 你的 UI
A2UI 载荷 → adapter-a2ui → UIX IR → 你的 UI
```

### 在 Deepractice 生态中的位置

```
AgentX  — AI Agent 运行时（引擎）
UIX     — AI 输出协议（翻译官）
PromptX — AI 应用（用引擎 + 翻译官造的产品）
```

| 项目 | 角色 |
|------|------|
| [AgentX](https://github.com/Deepractice/AgentX) | AI Agent 运行时 —— 创建、驱动、管理智能体 |
| [PromptX](https://github.com/Deepractice/PromptX) | AI 驱动的应用平台 |
| [PromptML](https://github.com/Deepractice/PromptML) | 提示词标记语言 |

---

## 快速开始

### 归一化 Vercel AI SDK 输出

```typescript
import { fromVercelMessages } from '@uix-ai/adapter-vercel'
import type { LucidConversation } from '@uix-ai/core'

// 你的 Vercel AI SDK 消息
const vercelMessages = useChat().messages

// 转换为 UIX IR —— 一行代码
const conversations: LucidConversation[] = fromVercelMessages(vercelMessages)

// 用任何 UI 框架渲染
conversations.forEach(conv => {
  conv.blocks.forEach(block => {
    if (block.type === 'text') console.log(block.content.text)
    if (block.type === 'tool') console.log(block.content.name, block.content.output)
  })
})
```

### 配合 assistant-ui 使用（推荐用于生产）

```typescript
import { fromVercelMessages } from '@uix-ai/adapter-vercel'
import { useExternalStoreRuntime } from '@assistant-ui/react'

// UIX IR 作为数据层，assistant-ui 作为渲染层
const runtime = useExternalStoreRuntime({
  messages: fromVercelMessages(vercelMessages),
  onNew: (message) => { /* 发送到后端 */ }
})
```

### 使用参考渲染器（轻量 / 原型验证）

```typescript
import { fromVercelMessages } from '@uix-ai/adapter-vercel'
import { StreamMarkdown } from '@uix-ai/stream'

const conversations = fromVercelMessages(messages)
const lastBlock = conversations.at(-1)?.blocks.at(-1)

if (lastBlock?.type === 'text') {
  return <StreamMarkdown content={lastBlock.content.text} />
}
```

---

## UIX IR 格式

一个完整的 UIX IR 文档：

```json
{
  "conversations": [
    {
      "id": "conv-1",
      "role": "user",
      "status": "completed",
      "blocks": [
        { "id": "b1", "type": "text", "status": "completed", "content": { "text": "解释快速排序" } }
      ],
      "timestamp": 1710000000000
    },
    {
      "id": "conv-2",
      "role": "assistant",
      "status": "completed",
      "blocks": [
        { "id": "b2", "type": "thinking", "status": "completed", "content": { "reasoning": "用户想了解排序算法..." } },
        { "id": "b3", "type": "text", "status": "completed", "content": { "text": "快速排序是一种分治算法..." } },
        { "id": "b4", "type": "tool", "status": "completed", "content": { "name": "run_code", "input": { "code": "..." }, "output": "[3,5,7,9]", "status": "success" } }
      ],
      "timestamp": 1710000001000
    }
  ]
}
```

---

## AI Skills

UIX 提供 AI 可读的设计规则（Skills），适用于任何 AI 编程工具。无需 npm 安装 —— 复制一个 Markdown 文件即可。

| Skill | 面向 | 描述 |
|-------|------|------|
| [`lucid-ui`](skills/lucid-ui/SKILL.md) | 所有人 | 专业设计系统，替代 AI 紫色渐变 |
| [`uix-components`](skills/uix-components/SKILL.md) | UIX 用户 | 组件 API、适配器模式、IR 类型参考 |

**支持平台：** Claude Code, Claude.ai, Cursor, OpenAI Codex, Windsurf, GitHub Copilot, Cline, Gemini Code Assist

> 安装说明见 [`skills/README.md`](skills/README.md)

---

## 路线图

### 第一阶段：基础建设 ✅
- [x] UIX IR JSON Schema + TypeScript 类型（`@uix-ai/core`）
- [x] 设计令牌系统（`@uix-ai/tokens`）
- [x] 参考 React 组件（`@uix-ai/react`、`@uix-ai/agent`）
- [x] 流式 Markdown 渲染器（`@uix-ai/stream`）

### 第二阶段：适配器 ✅
- [x] Vercel AI SDK 适配器（`@uix-ai/adapter-vercel`，SDK 4.x 和 6.x）
- [x] AG-UI 协议适配器（`@uix-ai/adapter-agui`）
- [x] A2UI 协议适配器（`@uix-ai/adapter-a2ui`，实验性）

### 第三阶段：生态集成（进行中）
- [ ] AgentX 适配器（`@uix-ai/adapter-agentx`）
- [ ] assistant-ui 集成指南
- [ ] IR 校验 CLI 工具
- [ ] 接入真实 AI Agent 的 Live Demo
- [ ] 更多适配器（LangChain、CrewAI 等）

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
