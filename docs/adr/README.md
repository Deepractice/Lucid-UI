# Architecture Decision Records (ADR)

本目录记录 Lucid-UI 项目的关键架构决策。

## 核心定位

> **Lucid UI 是 AI-to-UI 协议层，消费者是 AI，不是开发者。**

## 什么是 ADR？

ADR 是记录重要架构决策的轻量级文档。每个 ADR 描述一个决策的：
- **背景** - 为什么需要做这个决策
- **决策** - 具体选择了什么
- **后果** - 这个决策带来的影响

## ADR 状态

- **proposed** - 提议中，等待讨论
- **accepted** - 已接受，正在执行
- **deprecated** - 已废弃，被新决策取代
- **superseded** - 已被取代，参见新 ADR

## 目录

| ADR | 标题 | 状态 | 日期 |
|-----|------|------|------|
| [ADR-0001](./0001-enterprise-grade-ui-infrastructure.md) | AI-to-UI 协议层定位 | accepted (v2) | 2024-12-21 |
| [ADR-0002](./0002-defer-protocol-selection.md) | Lucid IR 协议策略 | accepted | 2024-12-21 |
| [ADR-0003](./0003-web-first-strategy.md) | Web 优先策略 | accepted | 2024-12-21 |
| [ADR-0004](./0004-no-dark-mode.md) | 无暗色模式设计原则 | accepted | 2024-12-21 |
| [ADR-0005](./0005-streaming-renderer-architecture.md) | 流式渲染器架构 | accepted | 2024-12-21 |
| [ADR-0006](./0006-lucid-ir-specification.md) | Lucid IR 规范定义 | accepted | 2024-12-21 |

## 核心决策关系

```
ADR-0001 (协议层定位)
    ↓
ADR-0002 (Lucid IR 策略) ←→ ADR-0006 (Lucid IR 规范)
    ↓
ADR-0003 (Web 优先) + ADR-0005 (流式渲染器)
    ↓
ADR-0004 (设计原则)
```

## 参考

- [ADR GitHub Organization](https://adr.github.io/)
- [Michael Nygard's article on ADRs](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
