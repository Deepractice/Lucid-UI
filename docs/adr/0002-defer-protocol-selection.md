# ADR-0002: Lucid IR 协议策略

## 状态

Accepted (Updated)

## 日期

2024-12-21 (Updated)

## 背景

在讨论 Lucid-UI 的长期架构时，识别到一个核心需求：**让 AI/Agent 能够快速生成 UI**。这需要一个标准化的 UI 协议。

### 市场现状

当前市场上有两个主要的 UI 协议方向：

| 协议 | 定位 | 状态 | 限制 |
|-----|------|------|------|
| **A2UI (Google)** | Native-first JSON 蓝图 | v0.8 Preview | 仅 Android TV/Wear OS |
| **MCP Apps (Anthropic)** | Web-based iframe 应用 | SEP-1865 草案 | 安全模型未定 |

### 核心洞察

通过分析 AgentX 的实践经验，识别出关键问题：

> **AgentX 已经有了可用的 UI 实现，但缺少抽象出的协议规范。**

从 AgentX 的 UI 实践中，我们可以提炼出一个内部协议规范（Lucid IR），而不是等待外部标准成熟。

## 决策

**创建 Lucid IR 作为内部协议，A2UI/MCP Apps 作为未来的渲染目标。**

### 策略架构

```
AI 智能体事件
    ↓
Lucid IR (稳定的内部协议)
    ↓
    ├── ReactRenderer (今天能用)
    ├── A2UIRenderer (等 A2UI 成熟)
    └── MCPAppsRenderer (等 MCP Apps 成熟)
```

### 依赖倒置原则

所有实现都依赖 Lucid IR 抽象，而非具体渲染器：

```
        ┌─────────────────────┐
        │     Lucid IR        │  ← 抽象协议
        │   (JSON Schema)     │
        └──────────┬──────────┘
                   │
     ┌─────────────┼─────────────┐
     │             │             │
     ▼             ▼             ▼
┌─────────┐  ┌──────────┐  ┌──────────┐
│ AgentX  │  │  Other   │  │  A2UI    │
│   UI    │  │Frameworks│  │ Adapter  │
└─────────┘  └──────────┘  └──────────┘
```

### 核心原则

1. **Lucid IR 是核心** - AI 生成的目标格式
2. **渲染器是实现** - React 只是第一个渲染器
3. **适配器模式** - A2UI/MCP Apps 通过适配器接入
4. **依赖倒置** - AgentX 依赖 Lucid IR，不是反过来

### 与外部协议的关系

> "A2UI 和 MCP Apps 是未来的目标，Lucid IR 是今天的桥梁。我们不是在重复造轮子，是在造一个可以适配任何轮子的适配器。"

- 如果 A2UI 成熟，可以创建 `A2UIRenderer`
- 如果 MCP Apps 成熟，可以创建 `MCPAppsRenderer`
- Lucid IR 保持稳定，只是增加更多渲染目标

## 后果

### 正面

- 今天就能用，不需要等待外部标准
- 内部稳定，外部灵活
- 遵循依赖倒置原则
- 从 AgentX 实践中提炼，经过验证

### 负面

- 需要维护自己的协议规范
- 可能与未来标准有差异需要适配

### 未来演进

| 场景 | 策略 |
|------|------|
| A2UI 1.0 发布 | 创建 A2UIRenderer 适配器 |
| MCP Apps 正式采纳 | 创建 MCPAppsRenderer 适配器 |
| 新标准出现 | 评估是否创建新适配器 |
| 外部标准与 Lucid IR 差异大 | 在适配器层处理转换 |

## 相关决策

- [ADR-0001](./0001-enterprise-grade-ui-infrastructure.md) - AI-to-UI 协议层定位
- [ADR-0003](./0003-web-first-strategy.md) - Web 优先策略
- [ADR-0006](./0006-lucid-ir-specification.md) - Lucid IR 规范定义
