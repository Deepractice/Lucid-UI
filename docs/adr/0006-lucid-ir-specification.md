# ADR-0006: Lucid IR 规范定义

## 状态

Accepted

## 日期

2024-12-21

## 背景

根据 [ADR-0001](./0001-enterprise-grade-ui-infrastructure.md) 确定的 AI-to-UI 协议层定位，需要定义 Lucid IR (Intermediate Representation) 的核心规范。

### 设计来源

Lucid IR 的设计从 [AgentX](https://github.com/Deepractice/AgentX) 的 UI 实践中抽象而来：

```
AgentX UI (粗略实现，实验性)
    ↓ 抽象提炼
Lucid IR (协议规范)
    ↓ 实现
AgentX UI + 其他框架 (遵循规范)
```

### AgentX 事件系统

AgentX 采用 4 层事件架构：

| 层级 | 类型 | 示例 |
|------|------|------|
| Stream | 原始流事件 | text_delta, tool_use_start |
| State | 状态变化 | conversation_thinking, tool_executing |
| Message | 完整消息 | assistant_message, tool_result_message |
| Turn | 对话轮次 | turn_complete |

Lucid IR 需要能够表达这些事件产生的 UI 状态。

## 决策

### 核心类型定义

```typescript
// 对话容器
interface LucidConversation {
  id: string
  role: 'user' | 'assistant' | 'system'
  status: 'streaming' | 'completed' | 'error'
  blocks: LucidBlock[]
  timestamp: number
}

// 内容块
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

### Block 类型规范

| 类型 | 描述 | Content 结构 |
|------|------|-------------|
| `text` | 文本内容（支持流式） | `{ text: string }` |
| `tool` | 工具/函数调用结果 | `{ name, input, output, status }` |
| `thinking` | AI 推理过程 | `{ reasoning: string }` |
| `image` | 图片内容 | `{ url, alt, width, height }` |
| `file` | 文件附件 | `{ name, type, url }` |
| `error` | 错误信息 | `{ code, message }` |

### Block 详细定义

```typescript
// 文本块
interface TextBlockContent {
  text: string
}

// 工具块
interface ToolBlockContent {
  name: string
  input: unknown
  output?: unknown
  status: 'pending' | 'running' | 'success' | 'error'
  error?: string
}

// 思考块
interface ThinkingBlockContent {
  reasoning: string
}

// 图片块
interface ImageBlockContent {
  url: string
  alt?: string
  width?: number
  height?: number
}

// 文件块
interface FileBlockContent {
  name: string
  type: string  // MIME type
  url: string
  size?: number
}

// 错误块
interface ErrorBlockContent {
  code: string
  message: string
  details?: unknown
}
```

### 设计原则

1. **Block-Based 渲染**
   - 文本和工具可以并行出现在同一消息中
   - 每个 Block 独立渲染，互不影响

2. **流式优先**
   - 所有 Block 都有 `status` 字段
   - `streaming` 状态下内容可能不完整
   - 渲染器需要处理不完整内容

3. **AI 可生成**
   - JSON 格式，便于 AI 生成
   - 简单的类型系统，易于理解
   - 无需复杂的嵌套结构

4. **与 AgentX 事件对应**

```
AgentX 事件                    Lucid IR
─────────────────────────────────────────
text_delta              →    TextBlock (streaming)
tool_use_start          →    ToolBlock (status: running)
tool_result_message     →    ToolBlock (status: success)
conversation_thinking   →    ThinkingBlock
assistant_message       →    Conversation (completed)
```

### 示例

```json
{
  "conversations": [
    {
      "id": "conv-1",
      "role": "user",
      "status": "completed",
      "blocks": [
        { "id": "b1", "type": "text", "status": "completed", "content": { "text": "你好" } }
      ],
      "timestamp": 1703145600000
    },
    {
      "id": "conv-2",
      "role": "assistant",
      "status": "streaming",
      "blocks": [
        { "id": "b2", "type": "text", "status": "streaming", "content": { "text": "你好！我是..." } },
        { "id": "b3", "type": "tool", "status": "running", "content": { "name": "search", "input": { "query": "..." } } }
      ],
      "timestamp": 1703145601000
    }
  ]
}
```

## 后果

### 正面

- 清晰的类型定义
- 与 AgentX 事件系统对齐
- 支持流式渲染
- AI 可生成的格式

### 负面

- 需要维护类型定义
- 可能需要随 AgentX 演进而调整

### 扩展预留

未来可能增加的 Block 类型：

- `audio` - 音频内容
- `video` - 视频内容
- `chart` - 图表数据
- `form` - 表单输入
- `action` - 可点击操作

## 实现路径

1. **@lucidui/ir** - JSON Schema 和 TypeScript 类型
2. **@lucidui/react** - React 渲染器实现
3. **AgentX 适配器** - AgentX 事件转 Lucid IR

## 相关决策

- [ADR-0001](./0001-enterprise-grade-ui-infrastructure.md) - AI-to-UI 协议层定位
- [ADR-0002](./0002-defer-protocol-selection.md) - Lucid IR 协议策略
- [ADR-0005](./0005-streaming-renderer-architecture.md) - 流式渲染器架构
