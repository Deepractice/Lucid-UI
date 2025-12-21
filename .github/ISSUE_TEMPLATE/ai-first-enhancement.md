---
name: AI-First Enhancement Roadmap
about: Enhance Lucid UI as AI-to-UI Protocol Layer
title: '[Roadmap] AI-to-UI Protocol Enhancement'
labels: enhancement, documentation, protocol
assignees: ''
---

## 背景

Lucid UI 定位为 **AI-to-UI 协议层**:
- 消费者是 AI，不是开发者
- Lucid IR 是 AI 生成 UI 的中间表示
- 渲染器将 Lucid IR 转换为实际 UI

## 核心洞察

> **传统组件库**: 开发者写代码 → 调用组件 → UI
> **Lucid 协议**: AI 生成 Lucid IR → 系统渲染 → UI

## 目标

让 Lucid UI 成为真正的 AI-to-UI 协议层:
1. AI 能生成符合 Lucid IR 规范的 JSON
2. 渲染器能正确渲染所有 Block 类型
3. 支持流式渲染和自修复内容

---

## 📋 实施计划

### Phase 1: Lucid IR Schema (优先级: ⭐⭐⭐)

**目标**: 完成 Lucid IR 协议定义

**包含内容**:

#### 1.1 核心类型
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
  content: unknown
}
```

#### 1.2 Block 类型

| 类型 | 描述 | Content 结构 |
|------|------|-------------|
| `text` | 文本内容 | `{ text: string }` |
| `tool` | 工具调用 | `{ name, input, output, status }` |
| `thinking` | 推理过程 | `{ reasoning: string }` |
| `image` | 图片 | `{ url, alt, width, height }` |
| `file` | 文件 | `{ name, type, url }` |
| `error` | 错误 | `{ code, message }` |

**验收标准**:
- [ ] JSON Schema 定义完成
- [ ] TypeScript 类型导出
- [ ] @lucidui/ir 包发布

---

### Phase 2: Block Renderers (优先级: ⭐⭐⭐)

**目标**: 完成所有 Block 类型的渲染器

**包含内容**:

#### 2.1 已完成
- [x] TextBlock → StreamMarkdown (带自修复)
- [x] ToolBlock → ToolResult
- [x] ThinkingBlock → ThinkingIndicator

#### 2.2 待完成
- [ ] ImageBlock → 图片渲染器
- [ ] FileBlock → 文件附件渲染器
- [ ] ErrorBlock → 错误展示

**验收标准**:
- [ ] 所有 Block 类型都有对应的渲染器
- [ ] 渲染器支持 streaming 状态
- [ ] 渲染器处理 error 状态

---

### Phase 3: AgentX Adapter (优先级: ⭐⭐)

**目标**: 将 AgentX 事件转换为 Lucid IR

**事件映射**:

| AgentX 事件 | Lucid IR |
|------------|----------|
| text_delta | TextBlock (streaming) |
| tool_use_start | ToolBlock (status: running) |
| tool_result_message | ToolBlock (status: success) |
| conversation_thinking | ThinkingBlock |
| assistant_message | Conversation (completed) |

**验收标准**:
- [ ] AgentX 事件可转换为 Lucid IR
- [ ] 双向类型安全
- [ ] 流式事件正确处理

---

## 💡 设计原则

### 协议层 vs 组件库
| 维度 | 传统组件库 | Lucid UI |
|-----|----------|----------|
| 消费者 | 开发者 | **AI** |
| 输入 | 代码调用 | **JSON Schema (Lucid IR)** |
| 核心价值 | 组件复用 | **协议标准化** |
| 扩展方式 | 添加组件 | **适配更多渲染目标** |

### 为什么不等 A2UI / MCP Apps 成熟？
> "A2UI 和 MCP Apps 是未来的目标，Lucid IR 是今天的桥梁。"

| 方案 | 风险 |
|------|------|
| 等标准成熟 | 产品停滞 |
| 直接绑定 A2UI | A2UI 变了要大改 |
| **Lucid IR + 适配器** | 内部稳定，外部灵活 |

---

## 📅 时间规划

| 阶段 | 工作量 | 状态 |
|------|--------|------|
| Phase 1: Lucid IR Schema | 2天 | 设计中 |
| Phase 2: Block Renderers | 2天 | 部分完成 |
| Phase 3: AgentX Adapter | 1.5天 | 待开始 |

---

## ✅ 完成标准

- [ ] Lucid IR JSON Schema 定义完整
- [ ] 所有 Block 类型有渲染器
- [ ] AgentX 事件可转换为 Lucid IR
- [ ] 支持流式渲染和自修复
- [ ] 文档遵循奥卡姆剃刀原则

---

## 🔗 相关资源

- [Lucid IR 规范](../../docs/adr/0006-lucid-ir-specification.md)
- [协议层定位](../../docs/adr/0001-enterprise-grade-ui-infrastructure.md)
- [Demo 站点](https://deepractice.github.io/Lucid-UI/)
- [AgentX](https://github.com/Deepractice/AgentX)
