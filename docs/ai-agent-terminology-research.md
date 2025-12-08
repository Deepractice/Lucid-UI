双主题系统的核心设计理念:

  🎯 Lucid UI 双主题设计语言核心理念

  一、本质定位

  Lucid = 清晰、易懂、理性

  不是追求酷炫,而是追求清晰。在 AI
  产品普遍走神秘主义、紫色渐变那一套的时候,我们反其道而行之——用清晰打败复杂。

  二、双主题的矛盾论基础

  这其实是个典型的矛盾统一体:

  🔷 Rational 理性蓝 - 科技、效率、精准、计算
  - 主要矛盾:效率 vs 复杂性
  - 解决方案:用清晰的蓝色系统化地呈现数据和逻辑
  - 适用场景:数据分析、技术产品、效率工具

  🔶 Sentient 感性金 - 智慧、思维、人文、概率
  - 主要矛盾:创造性 vs 机械感
  - 解决方案:用温暖的金色激发思维和人文关怀
  - 适用场景:创意工具、人文产品、思考辅助

  这两个主题不是对立的,而是对立统一的——就像 Monogent 那个双面 logo,理性和感性是 AI
  的两个必要侧面。

  三、四大核心原则

  1. 白色基底,拒绝深色
    - 为什么?深色是小众,大众产品要白的
    - 矛盾:酷炫 vs 可用性 → 选择可用性
  2. 拒绝 AI 紫色
    - 为什么?紫色渐变已经成了 AI 产品的陈词滥调
    - 我们的技术应该自己说话,不需要视觉特效来"装神秘"
  3. 双主题并存,不是二选一
    - Rational 和 Sentient 可以在同一个产品里共存
    - 根据具体场景选择合适的主题
    - 矛盾的转化:不同场景下主要矛盾不同
  4. 基于 shadcn/ui,不重复造轮子
    - shadcn/ui 已经是成熟的设计系统
    - 我们聚焦在色彩语义层,不折腾底层组件

  四、设计决策的矛盾分析

  主要矛盾:清晰性 vs 表现力
  - 当前阶段的主要矛盾是"如何在 AI 产品中保持清晰"
  - 次要矛盾:美观、品牌差异化
  - 解决主要矛盾的方法:白色基底 + 克制的双主题色彩

  矛盾的转化:
  - 解决了"清晰性"后,下一个矛盾可能是"如何在清晰中创造品牌记忆点"
  - 这就是为什么有双主题——理性蓝和感性金本身就是品牌识别

  五、与 Deepractice 品牌的关系

  Lucid UI 不只是一个组件库,它是 Deepractice 的设计语言:

  - PromptX 可以用 Rational 主题(工具属性强)
  - Monogent 可以混用两个主题(理性计算+感性思维)
  - 未来所有 Deepractice 产品都有统一的视觉语言

  六、实践中的奥卡姆剃刀

  咱们做的每个决定都在用奥卡姆剃刀:

  - 只有两个主题,不是十个
  - 只有白色基底,不搞深色模式
  - 拒绝紫色和黑色,减少选择
  - 基于 shadcn/ui,不自己造轮子

  如无必要,勿增实体。

  ---
  总结一句话:

  Lucid UI 的设计语言就是——在 AI 时代用清晰对抗复杂,用理性和感性的双主题覆盖技术和人文
  场景,用白色基底服务大众,拒绝紫色陈词滥调和深色小众主义。


  市面上：
  - shadcn/ui：通用组件，没有 AI 场景
  - Vercel AI SDK UI：有 streaming，但不是设计系统
  - 各家 AI 产品：都是自己造，没有复用

  Lucid UI 的机会就在这里：第一个专门为 AI 产品设计的组件库。

---

## AI Agent 平台界面术语调研 (2024-2025)

**调研时间**: 2025-12-08
**调研范围**: Anthropic Claude, OpenAI ChatGPT, Google Gemini, GitHub Top 100 AI Projects
**核心议题**: AI Agent 平台不是 IM 应用，需要新的界面术语体系

### 一、范式转移的主要矛盾

**主要矛盾识别**:
旧有 IM 术语 (Chat/Contact/Message) vs. AI 智能体新本质 (Agent/Tool/Capability)

这不是"降低理解成本"的次要矛盾，而是**本质性的认知框架冲突**：

| IM 隐喻 | AI 平台本质 | 矛盾点 |
|---------|-------------|--------|
| 联系人 Contact | 智能体 Agent | IM 暗示"对等人类社交"，但智能体是工具/能力 |
| 聊天 Chat | 会话 Conversation / 任务 Task | IM 暗示"闲聊对话"，但 AI 交互是"任务委托" |
| 消息 Message | 产物 Artifact / 执行结果 | IM 暗示"信息传递"，但 AI 产出是"可交互作品" |
| 群聊 Group | 多智能体协作 Multi-Agent | IM 暗示"多人讨论"，但是智能体编排系统 |

### 二、大厂新术语体系 (2024-2025)

#### 1. Anthropic Claude 的创新术语

**Artifacts** (2024.06 首创)
- 定义：AI 创造的可交互产物（代码、文档等）
- 范式变化：不是"消息"，而是"独立可编辑的作品"
- 界面实现：独立窗口，实时预览和交互
- 意义：首次区分"对话内容"和"创作产物"

**Computer Use** (2024.10)
- 定义：AI 直接操作计算机的能力
- 范式变化：从 API 调用 → 模拟人类操作（看屏幕、点击、输入）
- 界面实现：屏幕共享式的操作展示
- 意义：突破了"Tool Calling"边界，进入通用操作层

**Model Context Protocol (MCP)** (2024.11)
- 定义：AI 系统与外部工具集成的开放标准
- 范式变化：从"每个产品自己造轮子" → "标准化工具接口"
- OpenAI 2025.03 正式采纳
- 意义：行业级术语标准化开端

#### 2. GitHub 的工作流术语

**Agent HQ / Mission Control** (2024)
- 定义：统一的智能体指挥中心
- 范式变化：从"聊天窗口" → "任务编排中心"
- 界面隐喻：不是打开对话，而是打开**指挥舱**
- 特点：跨平台一致（Web/VS Code/CLI/Mobile）

**Agent Mode** (2025)
- 定义：让 AI 自主工作的模式切换
- 范式变化：从"问答式 Copilot" → "自主工作的 Autopilot"
- 界面实现：模式切换开关 + 任务监控面板

#### 3. 开源社区的演进路径

**词汇演进轨迹**:
```
Chatbot (2020)
  ↓ 能力升级
Conversational Agent (2022)
  ↓ 自主性提升
Agentic System (2024)
  ↓ 主动融入
Ambient Agent (2024 LangChain 首创)
```

**Ambient Agent 的定义**:
- 从"等待命令的 Copilot" → "主动融入工作流的 Autopilot"
- 不再需要显式呼唤，而是持续感知上下文并主动行动
- 界面形态：从"聊天窗口"消失，融入各个工作界面

### 三、多智能体协作的新词汇

#### 核心术语

**Multi-Agent Orchestration** (编排)
- 含义：多个智能体的协同调度
- 类比：不是"群聊"，而是"交响乐团指挥"
- 界面需求：可视化编排画板 + 执行监控

**Agent Swarm** (群体智能)
- 含义：大量简单智能体的涌现智能
- 类比：蚁群算法，不是"讨论组"
- 界面需求：群体状态可视化 + 涌现行为展示

**Agent-to-Agent (A2A)** 协议
- 含义：智能体间直接通信的标准
- 范式：不经过人类中转的 Agent 自主协作
- 界面需求：A2A 通信日志 + 协作关系图谱

### 四、界面层的术语建议

#### 分层命名策略（学习 Anthropic）

**表层 - 降低门槛**:
| 旧 IM 术语 | 新术语 (入门层) | 理由 |
|-----------|----------------|------|
| 聊天 Chat | 会话 Conversation | 更正式，保留对话感 |
| 联系人 Contacts | 智能体 Agents | 体现工具属性 |

**深层 - 体现本质**:
| 功能 | 新术语 (专业层) | 定义 |
|------|----------------|------|
| 智能体列表 | 工作空间 Workspace | 智能体的工作环境 |
| 聊天内容 | 产物/作品 Artifacts | AI 创造的可交互内容 |
| 工具面板 | 能力面板 Capability Panel | 可调用的工具集 |
| 对话记录 | 执行轨迹 Execution Trace | Tool Call 可视化 |
| 发送消息 | 委派任务 Delegate Task | 强调任务性质 |

#### 隐喻系统的转换

**从 IM 隐喻到工作协作隐喻**:

IM 旧隐喻:
- 打开聊天窗口 → 发消息 → 查看已读/未读
- 添加联系人 → 建群 → 群聊

AI 新隐喻:
- 打开指挥中心 Mission Control → 委派任务 → 追踪执行进度
- 激活智能体 → 组建团队 → 多智能体编排

### 五、Lucid UI 的术语应用建议

#### 核心原则
1. **表层简单，深层准确**：入口用熟悉词，深入用专业词
2. **用 emoji 强化新概念**：🤖 智能体、🎨 作品、🛠️ 工具、📊 轨迹
3. **创造自己的特色术语**：如"Agent Studio"（智能体工作室）

#### 具体映射表

| Lucid UI 组件名 | 原 IM 术语 | 推荐术语 | 备选术语 |
|----------------|-----------|---------|---------|
| 底部导航 Tab | 联系人 | 🤖 智能体 Agents | 团队 Team |
| 主界面区域 | 聊天区 | 会话区 Conversation | 工作区 Workspace |
| 对话内容 | 消息 | 交互 Interaction | 产物 Artifact |
| 左侧列表 | 会话列表 | 项目 Projects | 任务 Tasks |
| 发送按钮文案 | 发送 Send | 执行 Execute | 委派 Delegate |

#### 渐进式命名策略

**阶段 1 - 熟悉过渡** (当前):
- 会话 Conversation (不用 Chat)
- 智能体 Agents (不用 Contacts)
- 保留用户熟悉感

**阶段 2 - 概念深化** (产品成熟后):
- 工作空间 Workspace
- 执行轨迹 Execution Trace
- 能力编排 Capability Orchestration

**阶段 3 - 话语权建立** (行业领先时):
- 创造专有术语如"Agent Studio"
- 定义新的界面模式如"Lucid Canvas"

### 六、与"Chat is all you need"的辩证统一

**表面矛盾**:
- Chat 是简单交互界面
- Agent 是复杂编排系统

**辩证统一**:
- **界面层**：保持 Chat 的简单（单一输入框）
- **概念层**：用新术语体现 Agent 本质（工作空间、编排、产物）
- **架构层**：Agentic Workspace + Tool Orchestration

**类比 iPhone**:
- 界面极简：一个 Home 键
- 概念革命：不叫"手机"，叫"智能终端"
- 本质突破：重新定义移动设备

**Lucid UI 应该做的**:
- 界面极简：Chat 输入框 + 清晰布局
- 概念革命：不是 IM，是 AI Agent Platform
- 本质突破：重新定义 AI 时代的人机协作界面

### 七、调研来源

**主要来源**:
- [Anthropic Claude 特性更新](https://www.techtarget.com/searchenterpriseai/feature/Claude-AI-vs-ChatGPT-How-do-they-compare) - Artifacts, Computer Use
- [Model Context Protocol](https://en.wikipedia.org/wiki/Model_Context_Protocol) - 行业标准
- [GitHub Agent HQ](https://github.blog/news-insights/company-news/welcome-home-agents/) - Mission Control 概念
- [Chat vs Ambient Agents](https://www.walturn.com/insights/chat-agents-vs-ambient-agents-two-paths-to-ai-driven-assistance) - 范式演进
- [60 AI Agents Terms 2025](https://www.analyticsvidhya.com/blog/2025/03/ai-agents-terms/) - 术语表
- [GitHub MCP & Multi-Agents Top 10](https://github.blog/open-source/maintainers/from-mcp-to-multi-agents-the-top-10-open-source-ai-projects-on-github-right-now-and-why-they-matter/) - 开源趋势

### 八、结论与行动建议

#### 主要发现
1. **术语演进正在发生**：2024-2025 是 AI Agent 界面范式转折点
2. **大厂在创造新词**：Artifacts、Computer Use、Agent HQ 等
3. **IM 术语已过时**：Contact/Chat/Message 无法描述 Agent 本质
4. **机会窗口期**：行业术语尚未标准化，有话语权建立空间

#### Lucid UI 的定位机会
作为"第一个 AI Agent 平台的设计语言"，Lucid UI 可以：

1. **借鉴成熟术语**：Workspace, Artifacts, Orchestration
2. **创造特色术语**：Agent Studio, Lucid Canvas
3. **建立话语权**：通过设计规范定义界面范式
4. **引领行业标准**：像 shadcn/ui 定义组件范式一样

#### 立即可行动的建议
1. ✅ **已完成**: 底部 Tab "联系人" → "智能体" (带机器人 icon)
2. 📝 **下一步**: 更新 README tips，明确"AI-Native Design System"定位
3. 🎨 **设计规范**: 在 Demo 站点添加"术语表"章节
4. 📚 **文档完善**: 编写"从 IM 到 Agent Platform"的迁移指南
5. 🚀 **对外传播**: 用新术语体系对外介绍 Lucid UI

---

**核心洞察**:
不是在造一个"更好看的聊天界面"，而是在定义"AI Agent 时代的人机协作范式"。术语的选择，就是范式的宣言。