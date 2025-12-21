# ADR-0005: 流式渲染器架构

## 状态

Accepted

## 日期

2024-12-21

## 背景

AI Agent 应用的核心交互模式是**流式响应**。用户发送请求后，AI 逐步生成响应内容，UI 需要实时渲染这些增量内容。

### 流式渲染的挑战

1. **不完整的 Markdown**
   - 流式传输时，Markdown 语法可能被截断
   - 例如：`**bold` 缺少闭合，```` ``` ```` 代码块未结束
   - 标准 Markdown 解析器会失败或渲染异常

2. **代码高亮闪烁**
   - 每次内容更新触发重新解析和高亮
   - 导致视觉上的闪烁和抖动

3. **性能问题**
   - 高频更新（可能每秒几十次）
   - 需要高效的 diff 和渲染

### 调研发现

发现 Vercel 的 [streamdown](https://github.com/vercel/streamdown) 项目提供了相关解决方案：

- 基于 [remend](https://github.com/vercel/remend) 库实现自修复 Markdown
- 使用 Shiki 进行代码高亮
- 专为流式场景优化

## 决策

创建 `@lucidui/stream` 包，采用以下架构：

### 1. 核心组件

```
@lucidui/stream
├── StreamMarkdown    # 流式 Markdown 渲染器
├── StreamText        # 简单文本 + 光标动画
├── CodeBlock         # 语法高亮代码块
└── healMarkdown()    # Markdown 自修复函数
```

### 2. 自修复策略

参考 streamdown 的理念，实现 `healMarkdown` 函数：

```typescript
function healMarkdown(content: string): string {
  // 1. 处理未闭合的代码块
  // 2. 处理未闭合的行内代码
  // 3. 处理未闭合的粗体/斜体
  // 4. 处理不完整的链接
  return healedContent
}
```

### 3. 渲染流程

```
流式内容 → healMarkdown() → ReactMarkdown → 渲染
     ↓
isStreaming=true 时自动修复
isStreaming=false 时直接渲染
```

### 4. 技术选型

| 功能 | 选择 | 理由 |
|-----|------|------|
| Markdown 解析 | react-markdown | React 生态标准 |
| GFM 支持 | remark-gfm | 表格、任务列表等 |
| 代码高亮 | highlight.js | 轻量、支持多语言 |
| 样式方案 | Tailwind CSS | 与 Lucid-UI 一致 |

### 5. 未来增强

暂不实现但保留空间：
- 增量高亮（避免全量重算）
- 虚拟滚动（超长内容）
- 流式图表渲染

## 后果

### 正面

- 解决了流式渲染的核心痛点
- 提供了开箱即用的解决方案
- 与 Lucid Design System 视觉一致

### 负面

- 自修复逻辑可能有边界情况
- highlight.js 比 Shiki 功能弱一些

### 后续改进

- 考虑迁移到 Shiki（更现代、主题更丰富）
- 增加更多边界情况的自修复规则
- 性能优化（如增量渲染）

## 与 Lucid IR 的关系

流式渲染器需要处理 Lucid IR 中 `status: 'streaming'` 的 Block：

```typescript
// Lucid IR Block
interface LucidBlock {
  id: string
  type: 'text' | 'tool' | 'thinking' | 'image' | 'file' | 'error'
  status: 'streaming' | 'completed' | 'error'  // 流式渲染器关注这个
  content: unknown
}

// 流式渲染器行为
if (block.status === 'streaming' && block.type === 'text') {
  // 使用 healMarkdown 处理不完整内容
  const healed = healMarkdown(block.content.text)
  return <StreamMarkdown>{healed}</StreamMarkdown>
}
```

## 参考

- [Vercel streamdown](https://github.com/vercel/streamdown)
- [Vercel remend](https://github.com/vercel/remend)
- [react-markdown](https://github.com/remarkjs/react-markdown)

## 相关决策

- [ADR-0001](./0001-enterprise-grade-ui-infrastructure.md) - AI-to-UI 协议层定位
- [ADR-0002](./0002-defer-protocol-selection.md) - Lucid IR 协议策略
- [ADR-0006](./0006-lucid-ir-specification.md) - Lucid IR 规范定义
