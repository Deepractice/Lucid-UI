import { useState, useEffect } from 'react'
import { colors, spacing, radius, shadows, typography, rational, sentient } from '@lucidui/tokens'
import { Button } from '@lucidui/react'

// Custom hook for responsive breakpoints
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

// Breakpoints
const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
}

type Section =
  | 'home'
  | 'philosophy'
  | 'colors'
  | 'typography'
  | 'spacing'
  | 'responsive'
  // Layout
  | 'app-shell'
  | 'conversation-list'
  // Conversation
  | 'chat-bubble'
  | 'message-list'
  | 'input-bar'
  | 'time-divider'
  | 'system-message'
  | 'message-status'
  | 'context-menu'
  | 'reply-quote'
  // Status
  | 'ai-status'
  | 'streaming-text'
  | 'error-state'
  // Agent Identity
  | 'agent-avatar'
  | 'agent-card'
  // Capability
  | 'tool-call'
  | 'code-block'
  // Interaction
  | 'feedback'
  // Mobile
  | 'bottom-tab-bar'
  | 'action-sheet'

interface NavGroup {
  title: string
  items: { id: Section; label: string }[]
}

const navigation: NavGroup[] = [
  {
    title: '',
    items: [
      { id: 'home', label: 'Home' },
      { id: 'philosophy', label: 'About' },
    ]
  },
  {
    title: 'Foundation',
    items: [
      { id: 'colors', label: 'Colors' },
      { id: 'typography', label: 'Typography' },
      { id: 'spacing', label: 'Spacing' },
      { id: 'responsive', label: 'Responsive' },
    ]
  },
  {
    title: 'Layout',
    items: [
      { id: 'app-shell', label: 'App Shell' },
      { id: 'conversation-list', label: 'Conversation List' },
    ]
  },
  {
    title: 'Conversation',
    items: [
      { id: 'chat-bubble', label: 'Chat Bubble' },
      { id: 'message-list', label: 'Message List' },
      { id: 'input-bar', label: 'Input Bar' },
      { id: 'time-divider', label: 'Time Divider' },
      { id: 'system-message', label: 'System Message' },
      { id: 'message-status', label: 'Message Status' },
      { id: 'context-menu', label: 'Context Menu' },
      { id: 'reply-quote', label: 'Reply Quote' },
    ]
  },
  {
    title: 'Status',
    items: [
      { id: 'ai-status', label: 'AI Status' },
      { id: 'streaming-text', label: 'Streaming Text' },
      { id: 'error-state', label: 'Error State' },
    ]
  },
  {
    title: 'Agent Identity',
    items: [
      { id: 'agent-avatar', label: 'Agent Avatar' },
      { id: 'agent-card', label: 'Agent Card' },
    ]
  },
  {
    title: 'Capability',
    items: [
      { id: 'tool-call', label: 'Tool Call' },
      { id: 'code-block', label: 'Code Block' },
    ]
  },
  {
    title: 'Interaction',
    items: [
      { id: 'feedback', label: 'Feedback' },
    ]
  },
  {
    title: 'Mobile',
    items: [
      { id: 'bottom-tab-bar', label: 'Bottom Tab Bar' },
      { id: 'action-sheet', label: 'Action Sheet' },
    ]
  },
]

function App() {
  const [activeSection, setActiveSection] = useState<Section>('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState<Set<number>>(new Set())
  const isDesktop = useMediaQuery(breakpoints.lg)

  // Close sidebar when switching to desktop
  useEffect(() => {
    if (isDesktop) setSidebarOpen(false)
  }, [isDesktop])

  // Close sidebar when section changes on mobile
  const handleSectionChange = (section: Section) => {
    setActiveSection(section)
    if (!isDesktop) setSidebarOpen(false)
  }

  // Toggle group collapse state
  const toggleGroup = (groupIndex: number) => {
    const newCollapsed = new Set(collapsedGroups)
    if (newCollapsed.has(groupIndex)) {
      newCollapsed.delete(groupIndex)
    } else {
      newCollapsed.add(groupIndex)
    }
    setCollapsedGroups(newCollapsed)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="h-16 flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-4 text-gray-500 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Logo area - aligned with sidebar width on desktop */}
          <div className="lg:w-56 flex items-center gap-2 px-4 lg:px-4 flex-shrink-0">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Lucid UI" className="w-8 h-8 rounded" />
            <h1 className="text-xl font-semibold">
              <span className="text-gray-900">Lucid</span>
              <span className="text-sentient-500 animate-breathe-glow">UI</span>
            </h1>
          </div>

          {/* Right side content */}
          <div className="flex-1 flex items-center justify-between px-4 lg:px-6">
            <span className="hidden sm:block text-sm text-gray-500">Documentation</span>
            <div className="flex items-center gap-2 sm:gap-4 ml-auto">
              <div className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-500">
                <span>Search...</span>
                <kbd className="ml-2 px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs">⌘K</kbd>
              </div>
              <a
                href="https://github.com/Deepractice/Lucid-UI"
                target="_blank"
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                title="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && !isDesktop && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - responsive drawer on mobile, fixed on desktop */}
        <nav className={`
          ${isDesktop
            ? 'w-56 border-r border-gray-200 h-[calc(100vh-64px)] bg-white p-4 fixed top-16 left-0 overflow-y-auto'
            : `fixed top-16 left-0 bottom-0 w-72 bg-white border-r border-gray-200 p-4 z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
          }
        `}>
          <div className="space-y-2">
            {navigation.map((group, groupIndex) => (
              <div key={groupIndex}>
                {group.title ? (
                  <button
                    onClick={() => toggleGroup(groupIndex)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
                  >
                    <span>{group.title}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${collapsedGroups.has(groupIndex) ? '-rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : null}
                {!collapsedGroups.has(groupIndex) && (
                  <div className="space-y-1 mt-1">
                    {group.items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleSectionChange(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          activeSection === item.id
                            ? 'bg-rational-50 text-rational-600 font-medium border-l-2 border-rational-500'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Main Content - responsive padding, with left margin on desktop for fixed sidebar */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl ${isDesktop ? 'lg:ml-56' : ''}`}>
          {activeSection === 'home' && <HomeSection />}
          {activeSection === 'philosophy' && <PhilosophySection />}
          {activeSection === 'colors' && <ColorsSection />}
          {activeSection === 'typography' && <TypographySection />}
          {activeSection === 'spacing' && <SpacingSection />}
          {/* Layout */}
          {activeSection === 'app-shell' && <AppShellSection />}
          {activeSection === 'conversation-list' && <ConversationListSection />}
          {/* Conversation */}
          {activeSection === 'chat-bubble' && <ChatBubbleSection />}
          {activeSection === 'message-list' && <MessageListSection />}
          {activeSection === 'input-bar' && <InputBarSection />}
          {activeSection === 'time-divider' && <TimeDividerSection />}
          {activeSection === 'system-message' && <SystemMessageSection />}
          {activeSection === 'message-status' && <MessageStatusSection />}
          {activeSection === 'context-menu' && <ContextMenuSection />}
          {activeSection === 'reply-quote' && <ReplyQuoteSection />}
          {/* Status */}
          {activeSection === 'ai-status' && <AIStatusSection />}
          {activeSection === 'streaming-text' && <StreamingTextSection />}
          {activeSection === 'error-state' && <ErrorStateSection />}
          {/* Agent Identity */}
          {activeSection === 'agent-avatar' && <AgentAvatarSection />}
          {activeSection === 'agent-card' && <AgentCardSection />}
          {/* Capability */}
          {activeSection === 'tool-call' && <ToolCallSection />}
          {activeSection === 'code-block' && <CodeBlockSection />}
          {/* Interaction */}
          {activeSection === 'feedback' && <FeedbackSection />}
          {/* Foundation - Responsive */}
          {activeSection === 'responsive' && <ResponsiveSection />}
          {/* Mobile */}
          {activeSection === 'bottom-tab-bar' && <BottomTabBarSection />}
          {activeSection === 'action-sheet' && <ActionSheetSection />}
        </main>
      </div>
    </div>
  )
}

function HomeSection() {
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Lucid UI</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Design System for AI Agent Platforms. Clear, consistent visual language with dual themes.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">GitHub</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="w-10 h-10 bg-rational-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-rational-600 font-bold">R</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Rational Blue</h3>
          <p className="text-sm text-gray-600">For tech-focused interfaces, data analysis, and efficiency tools.</p>
        </div>
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="w-10 h-10 bg-sentient-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-sentient-600 font-bold">S</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Sentient Gold</h3>
          <p className="text-sm text-gray-600">For creative interfaces, thinking aids, and human-centric products.</p>
        </div>
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-gray-600 font-bold">W</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">White Foundation</h3>
          <p className="text-sm text-gray-600">Clean visual base for mainstream products. No purple, no dark themes.</p>
        </div>
      </div>
    </div>
  )
}

function PhilosophySection() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        Documentation &gt; <span className="text-gray-900">Introduction</span>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Introduction</h1>
        <p className="text-lg text-gray-600">
          Welcome to Lucid UI documentation!
        </p>
      </div>

      {/* What is Lucid UI */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">What is Lucid UI?</h2>
        <p className="text-gray-600 leading-relaxed">
          Lucid UI is a <strong>Design System for AI Agent Platforms</strong> built on the Model Context Protocol (MCP).
          It enables AI applications to have clear, consistent visual language:
        </p>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-rational-500">•</span>
            <span><strong>Dual Theme System</strong> - Rational Blue for efficiency, Sentient Gold for creativity</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rational-500">•</span>
            <span><strong>White Foundation</strong> - Clear visual base for mainstream products</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rational-500">•</span>
            <span><strong>AI-Readable Specs</strong> - Documentation designed for AI to read and apply</span>
          </li>
        </ul>
      </div>

      {/* Key Features */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Key Features</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Dual Theme System</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Two complementary themes for different scenarios: <span className="text-rational-500 font-medium">Rational Blue</span> for
              tech-focused interfaces (data analysis, efficiency tools), and <span className="text-sentient-500 font-medium">Sentient Gold</span> for
              creative interfaces (thinking aids, human-centric products).
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">No Purple, No Black</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We deliberately reject the overused AI purple gradients and niche dark themes.
              Clarity over mystique. Trust through transparency.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Based on shadcn/ui</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Built on top of shadcn/ui patterns with Radix UI primitives, Tailwind CSS, and class-variance-authority.
              Familiar patterns, AI-optimized documentation.
            </p>
          </div>
        </div>
      </div>

      {/* Why We Reject AI Purple */}
      <div className="bg-gray-900 text-white rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-6">Why We Reject AI Purple</h2>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-3 text-gray-300">The Problem</h3>
            <ul className="space-y-2 text-gray-400">
              <li>• Purple gradients have become a cliché in AI products</li>
              <li>• They create artificial mystique rather than clarity</li>
              <li>• They prioritize aesthetics over usability</li>
              <li>• They make all AI products look the same</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3 text-gray-300">Our Approach</h3>
            <ul className="space-y-2 text-gray-400">
              <li>• Clarity over mystique</li>
              <li>• Function over decoration</li>
              <li>• Trust through transparency</li>
              <li>• Differentiation through simplicity</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Brand Values */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Brand Values</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { value: 'Professional', desc: 'Enterprise-grade quality' },
            { value: 'Trustworthy', desc: 'Reliable and consistent' },
            { value: 'Clear', desc: 'Easy to understand' },
            { value: 'Efficient', desc: 'Respects user time' },
          ].map(item => (
            <div key={item.value} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">{item.value}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Design Principles */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Design Principles</h2>
        <div className="space-y-4">
          {[
            { num: '01', title: 'Content First', desc: 'Design should elevate content, not compete with it. Every visual element must serve a purpose.' },
            { num: '02', title: 'Consistent Hierarchy', desc: 'Use typography, spacing, and color consistently to create clear visual hierarchy across all interfaces.' },
            { num: '03', title: 'Accessible by Default', desc: 'Design for everyone. Ensure sufficient contrast, clear focus states, and semantic structure.' },
            { num: '04', title: 'Restrained Decoration', desc: 'Avoid gratuitous animations, shadows, and effects. Each embellishment must earn its place.' },
          ].map(item => (
            <div key={item.num} className="flex gap-6 p-4 border-b border-gray-100">
              <span className="text-3xl font-bold text-gray-200">{item.num}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Next Steps</h2>
        <div className="grid grid-cols-2 gap-4">
          <a href="https://github.com/Deepractice/Lucid-UI" target="_blank" className="group block p-4 border border-gray-200 rounded-lg hover:border-rational-300 hover:bg-rational-50/50 transition-colors">
            <p className="font-medium text-gray-900 group-hover:text-rational-600">GitHub Repository →</p>
            <p className="text-sm text-gray-500">View source code and contribute</p>
          </a>
          <a href="https://www.npmjs.com/package/@lucidui/react" target="_blank" className="group block p-4 border border-gray-200 rounded-lg hover:border-rational-300 hover:bg-rational-50/50 transition-colors">
            <p className="font-medium text-gray-900 group-hover:text-rational-600">npm Package →</p>
            <p className="text-sm text-gray-500">Install @lucidui/react</p>
          </a>
        </div>
      </div>
    </div>
  )
}

function ColorsSection() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Color System</h2>
        <p className="text-gray-600 mb-8">
          基于 shadcn/ui 的双主题色彩系统:理性蓝与感性金,白色基底,无紫色无黑色。
        </p>
      </div>

      {/* Dual Theme Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Rational Theme */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Rational 理性蓝 - 科技·效率·精准</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {([50, 100, 300, 500, 700, 900] as const).map(shade => (
              <div key={shade} className="text-center">
                <div
                  className="h-12 sm:h-16 rounded-md border border-gray-200 mb-2 shadow-sm"
                  style={{ backgroundColor: rational[shade] }}
                />
                <p className="text-xs font-medium text-gray-700">{shade}</p>
                <p className="text-xs text-gray-500 truncate">{rational[shade].slice(0, 7)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 sm:p-4 bg-rational-50 border border-rational-200 rounded-lg">
            <p className="text-sm text-rational-700">
              主色调 <span className="font-mono font-semibold">{rational[500]}</span> -
              适用于数据分析、技术产品、效率工具
            </p>
          </div>
        </div>

        {/* Sentient Theme */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sentient 感性金 - 智慧·思维·人文</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {([50, 100, 300, 500, 700, 900] as const).map(shade => (
              <div key={shade} className="text-center">
                <div
                  className="h-12 sm:h-16 rounded-md border border-gray-200 mb-2 shadow-sm"
                  style={{ backgroundColor: sentient[shade] }}
                />
                <p className="text-xs font-medium text-gray-700">{shade}</p>
                <p className="text-xs text-gray-500 truncate">{sentient[shade].slice(0, 7)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 sm:p-4 bg-sentient-50 border border-sentient-200 rounded-lg">
            <p className="text-sm text-sentient-700">
              主色调 <span className="font-mono font-semibold">{sentient[500]}</span> -
              适用于创意工具、人文产品、思考辅助
            </p>
          </div>
        </div>
      </div>

      {/* Gray Scale - The Foundation */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Gray Scale 灰阶 - 视觉基底</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-2">
          {Object.entries(colors.gray).map(([shade, value]) => (
            <div key={shade} className="text-center">
              <div
                className="h-12 sm:h-16 rounded-md border border-gray-200 mb-2"
                style={{ backgroundColor: value }}
              />
              <p className="text-xs font-medium text-gray-700">{shade}</p>
              <p className="text-xs text-gray-500 truncate">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            白色与灰阶构成视觉基底,为大众产品提供清晰的层级感,避免深色主题的小众性。
          </p>
        </div>
      </div>

      {/* Semantic Colors */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Semantic Colors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Success */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Success</h4>
            <div className="grid grid-cols-5 gap-1">
              {([100, 300, 500, 700, 900] as const).map((shade) => (
                <div key={shade} className="text-center">
                  <div
                    className="h-8 sm:h-10 rounded border border-gray-200 mb-1"
                    style={{ backgroundColor: colors.success[shade] }}
                  />
                  <p className="text-xs text-gray-500">{shade}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Warning */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Warning</h4>
            <div className="grid grid-cols-5 gap-1">
              {([100, 300, 500, 700, 900] as const).map((shade) => (
                <div key={shade} className="text-center">
                  <div
                    className="h-8 sm:h-10 rounded border border-gray-200 mb-1"
                    style={{ backgroundColor: colors.warning[shade] }}
                  />
                  <p className="text-xs text-gray-500">{shade}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Error */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Error</h4>
            <div className="grid grid-cols-5 gap-1">
              {([100, 300, 500, 700, 900] as const).map((shade) => (
                <div key={shade} className="text-center">
                  <div
                    className="h-8 sm:h-10 rounded border border-gray-200 mb-1"
                    style={{ backgroundColor: colors.error[shade] }}
                  />
                  <p className="text-xs text-gray-500">{shade}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Examples - Dual Theme */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">应用示例 Live Examples</h3>
        <div className="grid grid-cols-2 gap-6">
          {/* Rational Example */}
          <div className="bg-gradient-to-br from-rational-50 to-white rounded-xl border-2 border-rational-200 p-6">
            <div className="bg-white rounded-lg border border-rational-200 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-rational-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  R
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Rational Assistant</p>
                  <p className="text-sm text-gray-500">数据分析助手</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                为效率而生,精准计算,理性决策。适用于技术产品和数据分析场景。
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-rational-500 text-white text-sm rounded-md hover:bg-rational-600 transition-colors font-medium">
                  开始分析
                </button>
                <button className="px-3 py-1.5 border border-rational-300 text-rational-700 text-sm rounded-md hover:bg-rational-50 transition-colors">
                  查看数据
                </button>
              </div>
            </div>
          </div>

          {/* Sentient Example */}
          <div className="bg-gradient-to-br from-sentient-50 to-white rounded-xl border-2 border-sentient-200 p-6">
            <div className="bg-white rounded-lg border border-sentient-200 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-sentient-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  S
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sentient Assistant</p>
                  <p className="text-sm text-gray-500">思维助手</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                激发灵感,探索思维,人文关怀。适用于创意工具和思考辅助场景。
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-sentient-500 text-white text-sm rounded-md hover:bg-sentient-600 transition-colors font-medium">
                  开始创作
                </button>
                <button className="px-3 py-1.5 border border-sentient-300 text-sentient-700 text-sm rounded-md hover:bg-sentient-50 transition-colors">
                  探索想法
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TypographySection() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Typography</h2>
        <p className="text-gray-600 mb-8">
          Inter for interface text, JetBrains Mono for code.
        </p>
      </div>

      {/* Font Family */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Font Families</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Sans (Inter)</p>
            <p className="text-3xl" style={{ fontFamily: typography.fontFamily.sans.join(', ') }}>
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Mono (JetBrains Mono)</p>
            <p className="text-2xl" style={{ fontFamily: typography.fontFamily.mono.join(', ') }}>
              const greeting = "Hello World"
            </p>
          </div>
        </div>
      </div>

      {/* Font Sizes */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Font Sizes</h3>
        <div className="space-y-4">
          {Object.entries(typography.fontSize).map(([name, [size, config]]) => (
            <div key={name} className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
              <span className="w-16 text-sm text-gray-500">{name}</span>
              <span className="w-20 text-sm text-gray-400">{size}</span>
              <span
                style={{ fontSize: size, lineHeight: config.lineHeight }}
                className="text-gray-900"
              >
                Lucid UI Design System
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Font Weights */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Font Weights</h3>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(typography.fontWeight).map(([name, weight]) => (
            <div key={name} className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl text-gray-900 mb-2" style={{ fontWeight: weight }}>Aa</p>
              <p className="text-sm text-gray-500">{name}</p>
              <p className="text-xs text-gray-400">{weight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SpacingSection() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Spacing & Radius</h2>
        <p className="text-gray-600 mb-8">
          4px grid system for consistent spacing. Restrained border radius.
        </p>
      </div>

      {/* Spacing Scale */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Spacing Scale (4px base)</h3>
        <div className="space-y-3">
          {Object.entries(spacing).slice(0, 12).map(([name, value]) => (
            <div key={name} className="flex items-center gap-4">
              <span className="w-12 text-sm text-gray-500">{name}</span>
              <span className="w-16 text-sm text-gray-400">{value}</span>
              <div
                className="h-4 bg-primary-500 rounded-sm"
                style={{ width: value }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Border Radius</h3>
        <div className="grid grid-cols-6 gap-4">
          {Object.entries(radius).map(([name, value]) => (
            <div key={name} className="text-center">
              <div
                className="w-20 h-20 bg-primary-500 mx-auto mb-2"
                style={{ borderRadius: value }}
              />
              <p className="text-sm text-gray-700">{name}</p>
              <p className="text-xs text-gray-500">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shadows */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shadows</h3>
        <div className="grid grid-cols-5 gap-6">
          {Object.entries(shadows).map(([name, value]) => (
            <div key={name} className="text-center">
              <div
                className="w-24 h-24 bg-white rounded-lg mx-auto mb-3"
                style={{ boxShadow: value }}
              />
              <p className="text-sm text-gray-700">{name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// CONVERSATION COMPONENTS
// ============================================

function ChatBubbleSection() {
  const userBubbleCode = `{/* User Message Bubble */}
<div className="flex justify-end">
  <div className="max-w-[80%] bg-rational-500 text-white rounded-2xl rounded-br-md px-4 py-3">
    <p>Your message here</p>
  </div>
</div>`

  const aiBubbleCode = `{/* AI Message Bubble */}
<div className="flex justify-start gap-3">
  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
    AI
  </div>
  <div className="max-w-[80%] bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
    <p className="text-gray-700">AI response here</p>
  </div>
</div>`

  const sentientBubbleCode = `{/* Sentient Theme - User Bubble */}
<div className="flex justify-end">
  <div className="max-w-[80%] bg-sentient-500 text-white rounded-2xl rounded-br-md px-4 py-3">
    <p>Creative message here</p>
  </div>
</div>`

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="text-sm text-gray-500 mb-2">Conversation</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Chat Bubble</h2>
        <p className="text-gray-600">
          消息气泡用于区分用户和 AI 的对话。用户消息使用品牌色填充，AI 消息使用白底灰边框。
        </p>
      </div>

      {/* Design Principles */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">设计原则</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>视觉区分</strong>：用户消息靠右、品牌色填充；AI 消息靠左、白底</li>
          <li>• <strong>圆角处理</strong>：大圆角 + 发送方向小圆角，指示消息来源</li>
          <li>• <strong>最大宽度 80%</strong>：避免气泡过宽，保持阅读舒适性</li>
          <li>• <strong>AI 头像</strong>：始终显示在 AI 消息左侧，便于识别</li>
        </ul>
      </div>

      {/* Mobile Variant */}
      <div className="p-4 bg-rational-50 border border-rational-200 rounded-lg">
        <h3 className="font-medium text-rational-900 mb-2">📱 移动端变体</h3>
        <ul className="text-sm text-rational-700 space-y-1">
          <li>• <strong>更宽气泡</strong>：max-w-[85%] 充分利用屏幕空间</li>
          <li>• <strong>更大内边距</strong>：px-4 py-3 确保触控热区足够大</li>
          <li>• <strong>左滑回复</strong>：向左滑动消息气泡可快速回复</li>
          <li>• <strong>长按菜单</strong>：长按气泡呼出 Action Sheet（复制/转发/删除）</li>
          <li>• <strong>字体调整</strong>：文字略大，保证移动端可读性</li>
        </ul>
      </div>

      {/* User Bubble */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">User Bubble (Rational)</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="flex justify-end">
            <div className="max-w-[80%] bg-rational-500 text-white rounded-2xl rounded-br-md px-4 py-3">
              <p>How do I use this design system?</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{userBubbleCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(userBubbleCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* AI Bubble */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">AI Bubble</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="flex justify-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
              AI
            </div>
            <div className="max-w-[80%] bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
              <p className="text-gray-700">
                Install the packages with npm or pnpm, then import the Tailwind preset and components.
              </p>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{aiBubbleCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(aiBubbleCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Sentient Theme */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">User Bubble (Sentient)</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="flex justify-end">
            <div className="max-w-[80%] bg-sentient-500 text-white rounded-2xl rounded-br-md px-4 py-3">
              <p>Help me brainstorm some creative ideas</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{sentientBubbleCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(sentientBubbleCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Anti-patterns */}
      <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
        <h3 className="font-medium text-error-800 mb-2">Anti-patterns (避免)</h3>
        <ul className="text-sm text-error-700 space-y-1">
          <li>• 不要使用紫色渐变背景</li>
          <li>• 不要让气泡宽度超过 80%</li>
          <li>• 不要在用户消息左侧显示头像</li>
          <li>• 不要使用深色/黑色背景</li>
        </ul>
      </div>
    </div>
  )
}

function MessageListSection() {
  const messageListCode = `{/* Message List Container */}
<div className="flex flex-col gap-4 p-4">
  {/* User Message */}
  <div className="flex justify-end">
    <div className="max-w-[80%] bg-rational-500 text-white rounded-2xl rounded-br-md px-4 py-3">
      <p>User message</p>
    </div>
  </div>

  {/* AI Message */}
  <div className="flex justify-start gap-3">
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
      AI
    </div>
    <div className="max-w-[80%] bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
      <p className="text-gray-700">AI response</p>
    </div>
  </div>
</div>`

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-gray-500 mb-2">Conversation</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Message List</h2>
        <p className="text-gray-600">
          消息列表是聊天气泡的容器，负责消息的布局、滚动和间距管理。
        </p>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">设计原则</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>垂直间距</strong>：消息之间使用 16px (gap-4) 间距</li>
          <li>• <strong>内边距</strong>：容器四周 16px 内边距</li>
          <li>• <strong>滚动行为</strong>：新消息自动滚动到底部</li>
          <li>• <strong>白色背景</strong>：保持清晰的阅读体验</li>
        </ul>
      </div>

      {/* Live Example */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Live Example</h3>
        <div className="max-w-2xl border border-gray-200 rounded-lg overflow-hidden">
          <div className="h-80 overflow-y-auto bg-white">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-rational-500 text-white rounded-2xl rounded-br-md px-4 py-3">
                  <p>What can you help me with?</p>
                </div>
              </div>
              <div className="flex justify-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
                  AI
                </div>
                <div className="max-w-[80%] bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
                  <p className="text-gray-700">
                    I can help you with coding, writing, analysis, and much more. What would you like to explore?
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-rational-500 text-white rounded-2xl rounded-br-md px-4 py-3">
                  <p>Let's start with some code review</p>
                </div>
              </div>
              <div className="flex justify-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
                  AI
                </div>
                <div className="max-w-[80%] bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
                  <p className="text-gray-700">
                    Great choice! Please share your code and I'll provide detailed feedback on structure, performance, and best practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code */}
      <div className="relative">
        <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{messageListCode}</code></pre>
        <button
          onClick={() => navigator.clipboard.writeText(messageListCode)}
          className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
        >
          Copy
        </button>
      </div>
    </div>
  )
}

function InputBarSection() {
  const inputBarCode = `{/* Input Bar */}
<div className="border-t border-gray-200 bg-white p-4">
  <div className="flex gap-3 items-end">
    <textarea
      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-rational-500 focus:border-transparent"
      placeholder="Type your message..."
      rows={1}
    />
    <button className="px-4 py-3 bg-rational-500 text-white rounded-xl hover:bg-rational-600 transition-colors">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    </button>
  </div>
</div>`

  const inputBarWithActionsCode = `{/* Input Bar with Actions */}
<div className="border-t border-gray-200 bg-white p-4">
  <div className="flex gap-2 mb-3">
    <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
      📎 Attach
    </button>
    <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
      🎤 Voice
    </button>
  </div>
  <div className="flex gap-3 items-end">
    <textarea
      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-rational-500 focus:border-transparent"
      placeholder="Type your message..."
      rows={1}
    />
    <button className="px-4 py-3 bg-rational-500 text-white rounded-xl hover:bg-rational-600 transition-colors">
      Send
    </button>
  </div>
</div>`

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-gray-500 mb-2">Conversation</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Input Bar</h2>
        <p className="text-gray-600">
          输入栏是用户发送消息的入口，包含文本输入框和发送按钮。
        </p>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">设计原则</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>固定底部</strong>：输入栏始终固定在聊天窗口底部</li>
          <li>• <strong>圆角输入框</strong>：使用 rounded-xl 保持友好感</li>
          <li>• <strong>焦点状态</strong>：使用品牌色 ring 高亮</li>
          <li>• <strong>发送按钮</strong>：使用品牌色，hover 加深</li>
        </ul>
      </div>

      {/* Mobile Variant */}
      <div className="p-4 bg-rational-50 border border-rational-200 rounded-lg">
        <h3 className="font-medium text-rational-900 mb-2">📱 移动端变体</h3>
        <ul className="text-sm text-rational-700 space-y-1">
          <li>• <strong>键盘适配</strong>：自动调整位置避免被键盘遮挡</li>
          <li>• <strong>工具栏收起</strong>：附件/语音等功能收起为"+"按钮，点击展开</li>
          <li>• <strong>更大按钮</strong>：发送按钮最小 48×48px 确保易点击</li>
          <li>• <strong>自动高度</strong>：输入框根据内容自动调整高度（最多4行）</li>
          <li>• <strong>底部安全区</strong>：iOS 设备底部留出 safe-area-inset-bottom</li>
        </ul>
      </div>

      {/* Basic Input */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Input Bar</h3>
        <div className="max-w-2xl border border-gray-200 rounded-lg overflow-hidden">
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="flex gap-3 items-end">
              <textarea
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-rational-500 focus:border-transparent"
                placeholder="Type your message..."
                rows={1}
              />
              <button className="px-4 py-3 bg-rational-500 text-white rounded-xl hover:bg-rational-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="relative mt-4">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{inputBarCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(inputBarCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* With Actions */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">With Action Buttons</h3>
        <div className="max-w-2xl border border-gray-200 rounded-lg overflow-hidden">
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="flex gap-2 mb-3">
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                📎 Attach
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                🎤 Voice
              </button>
            </div>
            <div className="flex gap-3 items-end">
              <textarea
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-rational-500 focus:border-transparent"
                placeholder="Type your message..."
                rows={1}
              />
              <button className="px-4 py-3 bg-rational-500 text-white rounded-xl hover:bg-rational-600 transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
        <div className="relative mt-4">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{inputBarWithActionsCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(inputBarWithActionsCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// STATUS COMPONENTS
// ============================================

function AIStatusSection() {
  const breatheCode = `{/* Breathing Effect - for thinking/waiting states */}
<span className="text-xl font-semibold text-rational-500 animate-breathe-glow">
  Thinking...
</span>

{/* Sentient theme */}
<span className="text-xl font-semibold text-sentient-500 animate-breathe-glow">
  Creating...
</span>`

  const shimmerCode = `{/* Shimmer Effect - for running/processing states */}
<span className="text-xl font-semibold animate-shimmer-rational">
  Running task...
</span>

{/* Sentient theme */}
<span className="text-xl font-semibold animate-shimmer-sentient">
  Generating...
</span>`

  const cssCode = `/* Add to your CSS */
@keyframes breathe-glow {
  0%, 100% { opacity: 1; filter: brightness(1); }
  50% { opacity: 0.7; filter: brightness(1.2); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-breathe-glow {
  animation: breathe-glow 3s ease-in-out infinite;
}

.animate-shimmer-rational {
  background: linear-gradient(90deg, #3B82F6 0%, #3B82F6 40%, #93C5FD 50%, #3B82F6 60%, #3B82F6 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 2s infinite linear;
}

.animate-shimmer-sentient {
  background: linear-gradient(90deg, #D4A012 0%, #D4A012 40%, #FDE68A 50%, #D4A012 60%, #D4A012 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 2s infinite linear;
}`

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-gray-500 mb-2">Status</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">AI Status</h2>
        <p className="text-gray-600">
          单色动画用于表示 AI 的思考/运行状态。不使用紫色渐变，只用干净的品牌色动效。
        </p>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">设计原则</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>呼吸效果</strong>：用于"思考"或"等待"状态，柔和的透明度脉动</li>
          <li>• <strong>闪烁效果</strong>：用于"运行"或"处理"状态，光线扫过效果</li>
          <li>• <strong>单色原则</strong>：只使用品牌色，不使用多色渐变</li>
          <li>• <strong>克制动画</strong>：动画周期适中（2-3秒），不引起视觉疲劳</li>
        </ul>
      </div>

      {/* Breathing Effect */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Breathing Effect</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="flex gap-8">
            <span className="text-xl font-semibold text-rational-500 animate-breathe-glow">AI Thinking...</span>
            <span className="text-xl font-semibold text-sentient-500 animate-breathe-glow">Creating...</span>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{breatheCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(breatheCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Shimmer Effect */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shimmer Effect</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="flex gap-8">
            <span className="text-xl font-semibold animate-shimmer-rational">Running task...</span>
            <span className="text-xl font-semibold animate-shimmer-sentient">Generating...</span>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{shimmerCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(shimmerCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* CSS Required */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">CSS (Required)</h3>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{cssCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(cssCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Anti-patterns */}
      <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
        <h3 className="font-medium text-error-800 mb-2">Anti-patterns (避免)</h3>
        <ul className="text-sm text-error-700 space-y-1">
          <li>• 不要使用紫色或蓝紫渐变</li>
          <li>• 不要使用过快的动画（小于1秒周期）</li>
          <li>• 不要使用闪烁/跳动效果</li>
          <li>• 不要在动画中混合多种颜色</li>
        </ul>
      </div>
    </div>
  )
}

function StreamingTextSection() {
  const streamingCode = `{/* Streaming Text with Cursor */}
<div className="flex justify-start gap-3">
  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
    AI
  </div>
  <div className="max-w-[80%] bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
    <p className="text-gray-700">
      This is streaming text that appears character by character
      <span className="inline-block w-0.5 h-5 bg-rational-500 ml-0.5 animate-pulse" />
    </p>
  </div>
</div>`

  const typingIndicatorCode = `{/* Typing Indicator */}
<div className="flex justify-start gap-3">
  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
    AI
  </div>
  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
    <div className="flex gap-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
</div>`

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-gray-500 mb-2">Status</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Streaming Text</h2>
        <p className="text-gray-600">
          流式文本用于显示 AI 正在生成的内容，配合光标或打字指示器。
        </p>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">设计原则</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>光标指示</strong>：使用品牌色闪烁光标表示正在输入</li>
          <li>• <strong>打字指示器</strong>：三个跳动的点表示 AI 正在思考</li>
          <li>• <strong>流畅体验</strong>：文字逐字出现，给用户即时反馈</li>
        </ul>
      </div>

      {/* Streaming with Cursor */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Streaming with Cursor</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="flex justify-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
              AI
            </div>
            <div className="max-w-[80%] bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
              <p className="text-gray-700">
                This is streaming text that appears character by character
                <span className="inline-block w-0.5 h-5 bg-rational-500 ml-0.5 animate-pulse" />
              </p>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{streamingCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(streamingCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Typing Indicator */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Typing Indicator</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="flex justify-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
              AI
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{typingIndicatorCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(typingIndicatorCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}

function ErrorStateSection() {
  const errorBubbleCode = `{/* Error Message in Chat */}
<div className="flex justify-start gap-3">
  <div className="w-8 h-8 rounded-full bg-error-100 flex items-center justify-center text-error-600 text-sm font-medium flex-shrink-0">
    !
  </div>
  <div className="max-w-[80%] bg-error-50 border border-error-200 rounded-2xl rounded-bl-md px-4 py-3">
    <p className="text-error-700">Something went wrong. Please try again.</p>
    <button className="mt-2 text-sm text-error-600 hover:text-error-800 underline">
      Retry
    </button>
  </div>
</div>`

  const errorBannerCode = `{/* Error Banner */}
<div className="flex items-center gap-3 p-4 bg-error-50 border border-error-200 rounded-lg">
  <div className="w-5 h-5 bg-error-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
    ×
  </div>
  <div className="flex-1">
    <p className="text-error-800 font-medium">Connection Error</p>
    <p className="text-error-600 text-sm">Unable to connect to the server. Please check your network.</p>
  </div>
  <button className="px-3 py-1.5 bg-error-100 text-error-700 rounded-md hover:bg-error-200 text-sm">
    Retry
  </button>
</div>`

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-gray-500 mb-2">Status</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error State</h2>
        <p className="text-gray-600">
          错误状态用于告知用户操作失败，并提供恢复选项。
        </p>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">设计原则</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>清晰告知</strong>：明确说明发生了什么错误</li>
          <li>• <strong>提供行动</strong>：始终提供重试或其他恢复选项</li>
          <li>• <strong>视觉区分</strong>：使用 error 语义色，区别于正常消息</li>
          <li>• <strong>不引起恐慌</strong>：措辞平和，避免技术术语</li>
        </ul>
      </div>

      {/* Error in Chat */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Error Message in Chat</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="flex justify-start gap-3">
            <div className="w-8 h-8 rounded-full bg-error-100 flex items-center justify-center text-error-600 text-sm font-medium flex-shrink-0">
              !
            </div>
            <div className="max-w-[80%] bg-error-50 border border-error-200 rounded-2xl rounded-bl-md px-4 py-3">
              <p className="text-error-700">Something went wrong. Please try again.</p>
              <button className="mt-2 text-sm text-error-600 hover:text-error-800 underline">
                Retry
              </button>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{errorBubbleCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(errorBubbleCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Error Banner */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Error Banner</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center gap-3 p-4 bg-error-50 border border-error-200 rounded-lg">
            <div className="w-5 h-5 bg-error-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
              ×
            </div>
            <div className="flex-1">
              <p className="text-error-800 font-medium">Connection Error</p>
              <p className="text-error-600 text-sm">Unable to connect to the server. Please check your network.</p>
            </div>
            <button className="px-3 py-1.5 bg-error-100 text-error-700 rounded-md hover:bg-error-200 text-sm">
              Retry
            </button>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{errorBannerCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(errorBannerCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// AGENT IDENTITY COMPONENTS
// ============================================

function AgentAvatarSection() {
  const basicAvatarCode = `{/* Basic Avatar */}
<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
  AI
</div>

{/* With Image */}
<img
  src="/avatar.png"
  alt="Agent"
  className="w-10 h-10 rounded-full object-cover"
/>

{/* Branded Avatar - Rational */}
<div className="w-10 h-10 rounded-full bg-rational-500 flex items-center justify-center text-white font-medium">
  R
</div>

{/* Branded Avatar - Sentient */}
<div className="w-10 h-10 rounded-full bg-sentient-500 flex items-center justify-center text-white font-medium">
  S
</div>`

  const avatarSizesCode = `{/* Avatar Sizes */}
<div className="w-8 h-8 rounded-full bg-gray-200 ..." />   {/* Small - 32px */}
<div className="w-10 h-10 rounded-full bg-gray-200 ..." /> {/* Default - 40px */}
<div className="w-12 h-12 rounded-full bg-gray-200 ..." /> {/* Large - 48px */}
<div className="w-16 h-16 rounded-full bg-gray-200 ..." /> {/* XL - 64px */}`

  const avatarWithStatusCode = `{/* Avatar with Online Status */}
<div className="relative">
  <div className="w-10 h-10 rounded-full bg-rational-500 flex items-center justify-center text-white font-medium">
    AI
  </div>
  <div className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 border-2 border-white rounded-full" />
</div>`

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-gray-500 mb-2">Agent Identity</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Agent Avatar</h2>
        <p className="text-gray-600">
          Agent 头像用于在对话中识别 AI 身份，支持文字、图片和品牌色变体。
        </p>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">设计原则</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>圆形设计</strong>：始终使用 rounded-full</li>
          <li>• <strong>统一尺寸</strong>：默认 40px，在聊天中使用 32px</li>
          <li>• <strong>品牌一致性</strong>：使用 Rational 或 Sentient 主题色</li>
          <li>• <strong>文字备选</strong>：无图片时显示首字母或 "AI"</li>
        </ul>
      </div>

      {/* Basic Avatars */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Avatar Variants</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mb-2">
                AI
              </div>
              <span className="text-xs text-gray-500">Default</span>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-rational-500 flex items-center justify-center text-white font-medium mb-2">
                R
              </div>
              <span className="text-xs text-gray-500">Rational</span>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-sentient-500 flex items-center justify-center text-white font-medium mb-2">
                S
              </div>
              <span className="text-xs text-gray-500">Sentient</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{basicAvatarCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(basicAvatarCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sizes</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-end gap-6">
            <div className="text-center">
              <div className="w-8 h-8 rounded-full bg-rational-500 flex items-center justify-center text-white text-sm font-medium mb-2">
                AI
              </div>
              <span className="text-xs text-gray-500">32px</span>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-rational-500 flex items-center justify-center text-white font-medium mb-2">
                AI
              </div>
              <span className="text-xs text-gray-500">40px</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-rational-500 flex items-center justify-center text-white font-medium mb-2">
                AI
              </div>
              <span className="text-xs text-gray-500">48px</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-rational-500 flex items-center justify-center text-white text-lg font-medium mb-2">
                AI
              </div>
              <span className="text-xs text-gray-500">64px</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{avatarSizesCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(avatarSizesCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* With Status */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">With Status Indicator</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-rational-500 flex items-center justify-center text-white font-medium">
                AI
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 border-2 border-white rounded-full" />
            </div>
            <span className="text-sm text-gray-600">Online indicator</span>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{avatarWithStatusCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(avatarWithStatusCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}

function AgentCardSection() {
  const agentCardCode = `{/* Agent Card */}
<div className="bg-white border border-gray-200 rounded-xl p-6 max-w-sm">
  <div className="flex items-center gap-4 mb-4">
    <div className="w-12 h-12 rounded-full bg-rational-500 flex items-center justify-center text-white font-bold text-lg">
      AI
    </div>
    <div>
      <h3 className="font-semibold text-gray-900">Data Analyst</h3>
      <p className="text-sm text-gray-500">Specialized in data analysis</p>
    </div>
  </div>
  <p className="text-gray-600 text-sm mb-4">
    I can help you analyze data, create visualizations, and generate insights from your datasets.
  </p>
  <div className="flex gap-2">
    <button className="flex-1 px-4 py-2 bg-rational-500 text-white rounded-lg hover:bg-rational-600 text-sm font-medium">
      Start Chat
    </button>
    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
      Details
    </button>
  </div>
</div>`

  const agentCardSentientCode = `{/* Agent Card - Sentient Theme */}
<div className="bg-white border border-gray-200 rounded-xl p-6 max-w-sm">
  <div className="flex items-center gap-4 mb-4">
    <div className="w-12 h-12 rounded-full bg-sentient-500 flex items-center justify-center text-white font-bold text-lg">
      AI
    </div>
    <div>
      <h3 className="font-semibold text-gray-900">Creative Writer</h3>
      <p className="text-sm text-gray-500">Specialized in creative writing</p>
    </div>
  </div>
  <p className="text-gray-600 text-sm mb-4">
    I can help you write stories, poems, and creative content with unique perspectives.
  </p>
  <div className="flex gap-2">
    <button className="flex-1 px-4 py-2 bg-sentient-500 text-white rounded-lg hover:bg-sentient-600 text-sm font-medium">
      Start Chat
    </button>
    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
      Details
    </button>
  </div>
</div>`

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-gray-500 mb-2">Agent Identity</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Agent Card</h2>
        <p className="text-gray-600">
          Agent 卡片用于展示 AI Agent 的信息，包括名称、描述和行动按钮。
        </p>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">设计原则</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>清晰层级</strong>：头像 → 名称 → 描述 → 行动</li>
          <li>• <strong>品牌一致</strong>：使用 Rational 或 Sentient 主题色</li>
          <li>• <strong>行动明确</strong>：主按钮使用品牌色，次按钮使用 outline</li>
          <li>• <strong>适度信息</strong>：描述简洁，不超过两行</li>
        </ul>
      </div>

      {/* Rational Card */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Rational Theme</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-rational-500 flex items-center justify-center text-white font-bold text-lg">
                AI
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Data Analyst</h3>
                <p className="text-sm text-gray-500">Specialized in data analysis</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              I can help you analyze data, create visualizations, and generate insights from your datasets.
            </p>
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-rational-500 text-white rounded-lg hover:bg-rational-600 text-sm font-medium">
                Start Chat
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                Details
              </button>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{agentCardCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(agentCardCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Sentient Card */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sentient Theme</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-sentient-500 flex items-center justify-center text-white font-bold text-lg">
                AI
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Creative Writer</h3>
                <p className="text-sm text-gray-500">Specialized in creative writing</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              I can help you write stories, poems, and creative content with unique perspectives.
            </p>
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-sentient-500 text-white rounded-lg hover:bg-sentient-600 text-sm font-medium">
                Start Chat
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                Details
              </button>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{agentCardSentientCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(agentCardSentientCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// CAPABILITY COMPONENTS
// ============================================

function ToolCallSection() {
  const toolCallCode = `{/* Tool Call Indicator */}
<div className="flex justify-start gap-3">
  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
    AI
  </div>
  <div className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3">
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span>Calling <code className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-700">search_web</code></span>
    </div>
  </div>
</div>`

  const toolCallCompletedCode = `{/* Tool Call Completed */}
<div className="flex justify-start gap-3">
  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
    AI
  </div>
  <div className="bg-success-50 border border-success-200 rounded-xl px-4 py-3">
    <div className="flex items-center gap-2 text-sm text-success-700">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
      <span>Completed <code className="px-1.5 py-0.5 bg-success-100 rounded">search_web</code></span>
    </div>
  </div>
</div>`

  const toolCallExpandedCode = `{/* Tool Call with Details */}
<div className="flex justify-start gap-3">
  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
    AI
  </div>
  <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden max-w-md">
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <svg className="w-4 h-4 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <code className="text-gray-700">read_file</code>
      </div>
      <button className="text-xs text-gray-500 hover:text-gray-700">Show details</button>
    </div>
    <div className="px-4 py-3 bg-white">
      <pre className="text-xs text-gray-600 overflow-x-auto">{"path": "/src/app.tsx"}</pre>
    </div>
  </div>
</div>`

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-gray-500 mb-2">Capability</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tool Call</h2>
        <p className="text-gray-600">
          Tool Call 组件用于显示 AI 正在调用外部工具或 API 的状态。
        </p>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">设计原则</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>状态清晰</strong>：运行中使用 spinner，完成使用 checkmark</li>
          <li>• <strong>工具名称</strong>：使用 monospace 字体显示工具名</li>
          <li>• <strong>可展开详情</strong>：复杂调用可展开查看参数和结果</li>
          <li>• <strong>视觉低调</strong>：使用灰色背景，不抢夺消息内容的注意力</li>
        </ul>
      </div>

      {/* Running State */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Running State</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="flex justify-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
              AI
            </div>
            <div className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Calling <code className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-700">search_web</code></span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{toolCallCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(toolCallCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Completed State */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Completed State</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="flex justify-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
              AI
            </div>
            <div className="bg-success-50 border border-success-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-success-700">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Completed <code className="px-1.5 py-0.5 bg-success-100 rounded">search_web</code></span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{toolCallCompletedCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(toolCallCompletedCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* With Details */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">With Expandable Details</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="flex justify-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
              AI
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden max-w-md">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <code className="text-gray-700">read_file</code>
                </div>
                <button className="text-xs text-gray-500 hover:text-gray-700">Show details</button>
              </div>
              <div className="px-4 py-3 bg-white">
                <pre className="text-xs text-gray-600 overflow-x-auto">{`{"path": "/src/app.tsx"}`}</pre>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{toolCallExpandedCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(toolCallExpandedCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}

function CodeBlockSection() {
  const codeBlockCode = `{/* Code Block in Chat */}
<div className="flex justify-start gap-3">
  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
    AI
  </div>
  <div className="max-w-[80%]">
    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 mb-2">
      <p className="text-gray-700 mb-3">Here's how to create a button:</p>
    </div>
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <span className="text-xs text-gray-400">typescript</span>
        <button className="text-xs text-gray-400 hover:text-white">Copy</button>
      </div>
      <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
        <code>const Button = ({ children }) => (
  &lt;button className="px-4 py-2 bg-blue-500"&gt;
    {children}
  &lt;/button&gt;
)</code>
      </pre>
    </div>
  </div>
</div>`

  const inlineCodeCode = `{/* Inline Code */}
<p className="text-gray-700">
  Use the <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono text-gray-800">Button</code> component.
</p>`

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-gray-500 mb-2">Capability</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Code Block</h2>
        <p className="text-gray-600">
          代码块用于在对话中展示代码片段，支持语法高亮和复制功能。
        </p>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">设计原则</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>深色背景</strong>：代码块使用 gray-900 背景，便于阅读</li>
          <li>• <strong>语言标识</strong>：左上角显示代码语言</li>
          <li>• <strong>复制按钮</strong>：右上角提供一键复制</li>
          <li>• <strong>等宽字体</strong>：使用 JetBrains Mono 或 monospace</li>
        </ul>
      </div>

      {/* Code Block */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Code Block in Chat</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="flex justify-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
              AI
            </div>
            <div className="max-w-[80%]">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 mb-2">
                <p className="text-gray-700 mb-3">Here's how to create a button:</p>
              </div>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
                  <span className="text-xs text-gray-400">typescript</span>
                  <button className="text-xs text-gray-400 hover:text-white">Copy</button>
                </div>
                <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                  <code>{`const Button = ({ children }) => (
  <button className="px-4 py-2 bg-blue-500">
    {children}
  </button>
)`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{codeBlockCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(codeBlockCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Inline Code */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Inline Code</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <p className="text-gray-700">
            Use the <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono text-gray-800">Button</code> component from the library.
          </p>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{inlineCodeCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(inlineCodeCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// INTERACTION COMPONENTS
// ============================================

function FeedbackSection() {
  const feedbackCode = `{/* Feedback Buttons */}
<div className="flex items-center gap-2">
  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
    </svg>
  </button>
  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
    </svg>
  </button>
  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  </button>
  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  </button>
</div>`

  const feedbackInContextCode = `{/* Message with Feedback */}
<div className="flex justify-start gap-3 group">
  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
    AI
  </div>
  <div>
    <div className="max-w-[80%] bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
      <p className="text-gray-700">Here is my response to your question.</p>
    </div>
    <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button className="p-1 text-gray-400 hover:text-gray-600">👍</button>
      <button className="p-1 text-gray-400 hover:text-gray-600">👎</button>
      <button className="p-1 text-gray-400 hover:text-gray-600">📋</button>
      <button className="p-1 text-gray-400 hover:text-gray-600">🔄</button>
    </div>
  </div>
</div>`

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-gray-500 mb-2">Interaction</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Feedback</h2>
        <p className="text-gray-600">
          反馈组件让用户对 AI 回答进行评价、复制或重新生成。
        </p>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">设计原则</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>hover 显示</strong>：默认隐藏，hover 时显示，不干扰阅读</li>
          <li>• <strong>图标简洁</strong>：使用通用图标（点赞、点踩、复制、重新生成）</li>
          <li>• <strong>位置统一</strong>：始终显示在消息下方</li>
          <li>• <strong>低调设计</strong>：使用灰色，不抢夺内容注意力</li>
        </ul>
      </div>

      {/* Feedback Buttons */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Feedback Buttons</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
              </svg>
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Thumbs up • Thumbs down • Copy • Regenerate</p>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{feedbackCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(feedbackCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* In Context */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">In Message Context (hover to show)</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="flex justify-start gap-3 group">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
              AI
            </div>
            <div>
              <div className="max-w-[80%] bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
                <p className="text-gray-700">Here is my response to your question. Hover over this message to see the feedback buttons.</p>
              </div>
              <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 text-gray-400 hover:text-gray-600 text-sm">👍</button>
                <button className="p-1 text-gray-400 hover:text-gray-600 text-sm">👎</button>
                <button className="p-1 text-gray-400 hover:text-gray-600 text-sm">📋</button>
                <button className="p-1 text-gray-400 hover:text-gray-600 text-sm">🔄</button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{feedbackInContextCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(feedbackInContextCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// LAYOUT SECTIONS
// ============================================================================

function AppShellSection() {
  const appShellCode = `{/* App Shell - Three Column Layout */}
<div className="h-screen flex bg-white">
  {/* Sidebar Navigation - 48px */}
  <nav className="w-12 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 gap-4">
    {/* Logo */}
    <div className="w-8 h-8 bg-rational-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
      A
    </div>

    {/* Nav Icons */}
    <button className="w-10 h-10 rounded-lg bg-rational-50 text-rational-600 flex items-center justify-center">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    </button>
    <button className="w-10 h-10 rounded-lg text-gray-400 hover:bg-gray-100 flex items-center justify-center">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    </button>
    <button className="w-10 h-10 rounded-lg text-gray-400 hover:bg-gray-100 flex items-center justify-center">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>

    {/* Spacer */}
    <div className="flex-1" />

    {/* User Avatar */}
    <div className="w-8 h-8 rounded-full bg-gray-300" />
  </nav>

  {/* Conversation List - 280-320px */}
  <aside className="w-80 border-r border-gray-200 flex flex-col">
    {/* List Header */}
    <div className="h-14 px-4 flex items-center justify-between border-b border-gray-100">
      <h2 className="font-semibold text-gray-900">Conversations</h2>
      <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>

    {/* Search */}
    <div className="px-4 py-2">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-9 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rational-500"
        />
      </div>
    </div>

    {/* Conversation Items */}
    <div className="flex-1 overflow-y-auto">
      {/* Active conversation */}
      <div className="px-2 py-1">
        <div className="p-3 bg-rational-50 rounded-lg cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sentient-100 flex items-center justify-center">
              <span className="text-sentient-600 font-medium">AI</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 truncate">Coding Assistant</span>
                <span className="text-xs text-gray-500">2m</span>
              </div>
              <p className="text-sm text-gray-500 truncate">Let me help you with that...</p>
            </div>
          </div>
        </div>
      </div>
      {/* Other conversations */}
      <div className="px-2 py-1">
        <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-medium">W</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 truncate">Writing Helper</span>
                <span className="text-xs text-gray-500">1h</span>
              </div>
              <p className="text-sm text-gray-500 truncate">The article has been revised...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>

  {/* Chat Area - flex-1 */}
  <main className="flex-1 flex flex-col">
    {/* Chat Header */}
    <header className="h-14 px-6 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-sentient-100 flex items-center justify-center">
          <span className="text-sentient-600 text-sm font-medium">AI</span>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Coding Assistant</h3>
          <p className="text-xs text-green-500">Online</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </header>

    {/* Messages Area */}
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
      <p className="text-center text-sm text-gray-400">Messages go here</p>
    </div>

    {/* Input Area */}
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-end gap-3">
        <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3">
          <textarea
            placeholder="Type a message..."
            rows={1}
            className="w-full bg-transparent border-0 resize-none focus:outline-none text-gray-700 text-sm"
          />
        </div>
        <button className="w-10 h-10 bg-rational-500 text-white rounded-full flex items-center justify-center hover:bg-rational-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  </main>
</div>`

  const layoutSpecCode = `/* App Shell Layout Specifications */

/* Sidebar Navigation */
.sidebar-nav {
  width: 48px;              /* Fixed width */
  background: #FAFAFA;      /* gray-50 */
  border-right: 1px solid #E5E7EB;  /* gray-200 */
}

/* Conversation List */
.conversation-list {
  width: 280px;             /* Min: 280px, Max: 320px */
  /* Or use w-80 (320px) in Tailwind */
}

/* Chat Area */
.chat-area {
  flex: 1;                  /* Takes remaining space */
  min-width: 0;             /* Prevents flex overflow */
}

/* Breakpoints for Responsive */
@media (max-width: 768px) {
  /* Mobile: Hide sidebar, show only chat */
  .sidebar-nav { display: none; }
  .conversation-list { display: none; }
}

@media (min-width: 769px) and (max-width: 1024px) {
  /* Tablet: Collapsible conversation list */
  .conversation-list { width: 72px; }  /* Icon-only mode */
}`

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-gray-500 mb-2">Layout</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">App Shell</h2>
        <p className="text-gray-600">
          三栏布局是 IM 类应用的经典结构：左侧导航 + 会话列表 + 聊天区域。
        </p>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">设计原则</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>固定侧边栏</strong>：48px 宽度的图标导航，简洁不占空间</li>
          <li>• <strong>会话列表</strong>：280-320px 宽度，展示足够的预览信息</li>
          <li>• <strong>聊天区域</strong>：flex-1 自适应，始终是视觉焦点</li>
          <li>• <strong>清晰边界</strong>：使用 border 分隔，不使用阴影</li>
          <li>• <strong>白色基底</strong>：保持整体明亮、专业</li>
        </ul>
      </div>

      {/* Mobile Variant */}
      <div className="p-4 bg-rational-50 border border-rational-200 rounded-lg">
        <h3 className="font-medium text-rational-900 mb-2">📱 移动端变体</h3>
        <ul className="text-sm text-rational-700 space-y-1">
          <li>• <strong>单栏切换</strong>：会话列表和聊天区各占全屏，通过导航切换</li>
          <li>• <strong>底部 Tab Bar</strong>：替代侧边栏，包含会话、智能体、发现、我的</li>
          <li>• <strong>返回按钮</strong>：聊天区左上角显示返回箭头，点击回到会话列表</li>
          <li>• <strong>手势支持</strong>：边缘右滑返回上一页</li>
          <li>• <strong>断点</strong>：&lt;768px 启用移动端布局</li>
        </ul>
      </div>

      {/* Layout Diagram */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Layout Structure</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="h-80 flex bg-white">
            {/* Sidebar */}
            <div className="w-12 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 gap-3">
              <div className="w-8 h-8 bg-rational-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">A</div>
              <div className="w-8 h-8 bg-rational-50 rounded-lg"></div>
              <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
              <div className="flex-1" />
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
            {/* Conversation List */}
            <div className="w-64 border-r border-gray-200 flex flex-col">
              <div className="h-12 px-4 flex items-center border-b border-gray-100">
                <span className="text-sm font-medium text-gray-900">Conversations</span>
              </div>
              <div className="px-3 py-2">
                <div className="h-8 bg-gray-100 rounded-lg"></div>
              </div>
              <div className="flex-1 px-2 space-y-1">
                <div className="p-2 bg-rational-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-sentient-100 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-300 rounded w-20 mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded w-28"></div>
                    </div>
                  </div>
                </div>
                <div className="p-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                      <div className="h-2 bg-gray-100 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              <div className="h-12 px-4 flex items-center border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-sentient-100 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Chat Area</span>
                </div>
              </div>
              <div className="flex-1 bg-gray-50 p-4">
                <p className="text-center text-xs text-gray-400">Messages</p>
              </div>
              <div className="h-14 px-4 flex items-center border-t border-gray-200">
                <div className="flex-1 h-8 bg-gray-100 rounded-full"></div>
                <div className="w-8 h-8 bg-rational-500 rounded-full ml-2"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-center gap-8 text-xs text-gray-500">
          <span>← 48px →</span>
          <span>← 280-320px →</span>
          <span>← flex-1 →</span>
        </div>
      </div>

      {/* Layout Specs */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Layout Specifications (CSS)</h3>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{layoutSpecCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(layoutSpecCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Full Code */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Example (React + Tailwind)</h3>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto max-h-96"><code>{appShellCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(appShellCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Anti-patterns */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-medium text-red-800 mb-2">Anti-patterns</h3>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• ❌ 侧边栏使用阴影分隔（应使用 border）</li>
          <li>• ❌ 会话列表宽度超过 320px（信息过多会分散注意力）</li>
          <li>• ❌ 深色侧边栏（与白色主题不协调）</li>
          <li>• ❌ 聊天区域使用固定宽度（应自适应）</li>
          <li>• ❌ 在 header 区域放置过多按钮</li>
        </ul>
      </div>
    </div>
  )
}

function ConversationListSection() {
  const conversationItemCode = `{/* Conversation Item */}
<div className="px-2 py-1">
  <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-sentient-100 flex items-center justify-center">
          <span className="text-sentient-600 font-medium">AI</span>
        </div>
        {/* Online indicator */}
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-gray-900 truncate">Coding Assistant</span>
          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">2:30 PM</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 truncate">Let me help you with that React component...</p>
          {/* Unread badge */}
          <span className="ml-2 w-5 h-5 bg-rational-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">3</span>
        </div>
      </div>
    </div>
  </div>
</div>`

  const activeItemCode = `{/* Active Conversation Item */}
<div className="px-2 py-1">
  <div className="p-3 bg-rational-50 rounded-lg cursor-pointer">
    <div className="flex items-center gap-3">
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-sentient-100 flex items-center justify-center">
          <span className="text-sentient-600 font-medium">AI</span>
        </div>
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-rational-700 truncate">Coding Assistant</span>
          <span className="text-xs text-rational-500 flex-shrink-0 ml-2">2:30 PM</span>
        </div>
        <p className="text-sm text-rational-600 truncate">Let me help you with that...</p>
      </div>
    </div>
  </div>
</div>`

  const listHeaderCode = `{/* Conversation List Header */}
<div className="h-14 px-4 flex items-center justify-between border-b border-gray-100">
  <h2 className="font-semibold text-gray-900">Conversations</h2>
  <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500">
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
    </svg>
  </button>
</div>

{/* Search Bar */}
<div className="px-4 py-2">
  <div className="relative">
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      placeholder="Search conversations..."
      className="w-full pl-9 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rational-500"
    />
  </div>
</div>`

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-gray-500 mb-2">Layout</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Conversation List</h2>
        <p className="text-gray-600">
          会话列表展示所有对话，支持搜索、未读标记和在线状态。
        </p>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">设计原则</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>信息层级</strong>：名称 &gt; 最新消息 &gt; 时间 &gt; 未读数</li>
          <li>• <strong>truncate 处理</strong>：长文本使用省略号，不换行</li>
          <li>• <strong>选中状态</strong>：使用 Rational Blue 背景高亮</li>
          <li>• <strong>hover 反馈</strong>：轻微背景变化，增强可点击感</li>
          <li>• <strong>在线状态</strong>：绿色小圆点，position: absolute</li>
        </ul>
      </div>

      {/* List Header + Search */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">List Header & Search</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="max-w-xs bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="h-14 px-4 flex items-center justify-between border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Conversations</h2>
              <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="px-4 py-2">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rational-500"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{listHeaderCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(listHeaderCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Conversation Items */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Conversation Item States</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4 space-y-2">
          {/* Active */}
          <div className="max-w-xs">
            <p className="text-xs text-gray-500 mb-1">Active State</p>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-2 py-1">
                <div className="p-3 bg-rational-50 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-sentient-100 flex items-center justify-center">
                        <span className="text-sentient-600 font-medium">AI</span>
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-rational-700 truncate">Coding Assistant</span>
                        <span className="text-xs text-rational-500 flex-shrink-0 ml-2">2:30 PM</span>
                      </div>
                      <p className="text-sm text-rational-600 truncate">Let me help you with that...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Default with unread */}
          <div className="max-w-xs">
            <p className="text-xs text-gray-500 mb-1">Default with Unread Badge</p>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-2 py-1">
                <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">W</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 truncate">Writing Helper</span>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">1:15 PM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 truncate">The article has been revised...</p>
                        <span className="ml-2 w-5 h-5 bg-rational-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{activeItemCode}</code></pre>
            <button
              onClick={() => navigator.clipboard.writeText(activeItemCode)}
              className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            >
              Copy
            </button>
          </div>
          <div className="relative">
            <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{conversationItemCode}</code></pre>
            <button
              onClick={() => navigator.clipboard.writeText(conversationItemCode)}
              className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Anti-patterns */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-medium text-red-800 mb-2">Anti-patterns</h3>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• ❌ 消息预览超过一行（使用 truncate）</li>
          <li>• ❌ 未读数使用红色（保持 Rational Blue 品牌色）</li>
          <li>• ❌ 头像使用方形（统一使用圆形）</li>
          <li>• ❌ 在线状态点太大（保持 w-3 h-3）</li>
          <li>• ❌ 选中项使用边框高亮（使用背景色）</li>
        </ul>
      </div>
    </div>
  )
}

function TimeDividerSection() {
  const timeDividerCode = `{/* Time Divider */}
<div className="flex items-center justify-center py-4">
  <div className="px-3 py-1 bg-gray-100 rounded-full">
    <span className="text-xs text-gray-500">Today</span>
  </div>
</div>`

  const timeDividerVariantsCode = `{/* Time Divider with Lines */}
<div className="flex items-center gap-4 py-4">
  <div className="flex-1 h-px bg-gray-200" />
  <span className="text-xs text-gray-400">Yesterday</span>
  <div className="flex-1 h-px bg-gray-200" />
</div>

{/* Date Divider */}
<div className="flex items-center justify-center py-4">
  <div className="px-3 py-1 bg-gray-100 rounded-full">
    <span className="text-xs text-gray-500">December 6, 2024</span>
  </div>
</div>

{/* Time Only (within same day) */}
<div className="flex items-center justify-center py-2">
  <span className="text-xs text-gray-400">2:30 PM</span>
</div>`

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-gray-500 mb-2">Conversation</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Time Divider</h2>
        <p className="text-gray-600">
          时间分隔符用于在消息列表中标记时间节点，帮助用户理解消息的时间线。
        </p>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">设计原则</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>视觉轻量</strong>：使用淡色，不抢夺消息内容注意力</li>
          <li>• <strong>居中显示</strong>：时间信息居中，与左右消息区分</li>
          <li>• <strong>智能显示</strong>：Today/Yesterday 优先，远日期显示完整</li>
          <li>• <strong>间距适当</strong>：py-4 给予足够的视觉分隔</li>
        </ul>
      </div>

      {/* Basic Time Divider */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Time Divider</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="max-w-md mx-auto space-y-4">
            {/* Sample message */}
            <div className="flex justify-start">
              <div className="max-w-[70%] bg-white border border-gray-200 rounded-2xl px-4 py-2">
                <p className="text-sm text-gray-700">Previous message from yesterday</p>
              </div>
            </div>

            {/* Time Divider */}
            <div className="flex items-center justify-center py-4">
              <div className="px-3 py-1 bg-gray-100 rounded-full">
                <span className="text-xs text-gray-500">Today</span>
              </div>
            </div>

            {/* Sample message */}
            <div className="flex justify-end">
              <div className="max-w-[70%] bg-rational-500 rounded-2xl px-4 py-2">
                <p className="text-sm text-white">New message from today</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{timeDividerCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(timeDividerCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Variants */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Variants</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4 space-y-4">
          {/* With lines */}
          <div className="max-w-md mx-auto">
            <p className="text-xs text-gray-400 mb-2">With Lines</p>
            <div className="flex items-center gap-4 py-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">Yesterday</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          </div>

          {/* Date */}
          <div className="max-w-md mx-auto">
            <p className="text-xs text-gray-400 mb-2">Full Date</p>
            <div className="flex items-center justify-center py-4">
              <div className="px-3 py-1 bg-gray-100 rounded-full">
                <span className="text-xs text-gray-500">December 6, 2024</span>
              </div>
            </div>
          </div>

          {/* Time only */}
          <div className="max-w-md mx-auto">
            <p className="text-xs text-gray-400 mb-2">Time Only (same day)</p>
            <div className="flex items-center justify-center py-2">
              <span className="text-xs text-gray-400">2:30 PM</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{timeDividerVariantsCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(timeDividerVariantsCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Anti-patterns */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-medium text-red-800 mb-2">Anti-patterns</h3>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• ❌ 使用深色背景（应保持轻量）</li>
          <li>• ❌ 字体过大（保持 text-xs）</li>
          <li>• ❌ 显示具体秒数（精确到分钟即可）</li>
          <li>• ❌ 每条消息都显示时间（应智能合并）</li>
        </ul>
      </div>
    </div>
  )
}

function SystemMessageSection() {
  const systemMessageCode = `{/* System Message - Centered */}
<div className="flex justify-center py-2">
  <div className="px-4 py-2 bg-gray-100 rounded-lg max-w-md">
    <p className="text-xs text-gray-500 text-center">
      You have started a new conversation with Coding Assistant
    </p>
  </div>
</div>`

  const systemMessageVariantsCode = `{/* System Message - Info */}
<div className="flex justify-center py-2">
  <div className="px-4 py-2 bg-rational-50 rounded-lg max-w-md">
    <p className="text-xs text-rational-600 text-center">
      Agent capabilities have been updated
    </p>
  </div>
</div>

{/* System Message - Warning */}
<div className="flex justify-center py-2">
  <div className="px-4 py-2 bg-amber-50 rounded-lg max-w-md">
    <p className="text-xs text-amber-600 text-center">
      This conversation will expire in 24 hours
    </p>
  </div>
</div>

{/* System Message - Success */}
<div className="flex justify-center py-2">
  <div className="px-4 py-2 bg-green-50 rounded-lg max-w-md">
    <p className="text-xs text-green-600 text-center">
      File uploaded successfully
    </p>
  </div>
</div>

{/* System Message with Icon */}
<div className="flex justify-center py-2">
  <div className="px-4 py-2 bg-gray-100 rounded-lg max-w-md flex items-center gap-2">
    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
    <p className="text-xs text-gray-500">
      Messages are end-to-end encrypted
    </p>
  </div>
</div>`

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-gray-500 mb-2">Conversation</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">System Message</h2>
        <p className="text-gray-600">
          系统消息用于显示非用户/非AI产生的提示信息，如会话状态变更、安全提示等。
        </p>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">设计原则</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>居中显示</strong>：与用户/AI消息区分开</li>
          <li>• <strong>视觉低调</strong>：使用小字体和淡色背景</li>
          <li>• <strong>语义色彩</strong>：根据信息类型使用不同背景色</li>
          <li>• <strong>简洁文案</strong>：一句话说清楚，不啰嗦</li>
        </ul>
      </div>

      {/* Basic System Message */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic System Message</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center py-2">
              <div className="px-4 py-2 bg-gray-100 rounded-lg max-w-md">
                <p className="text-xs text-gray-500 text-center">
                  You have started a new conversation with Coding Assistant
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{systemMessageCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(systemMessageCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Variants */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Semantic Variants</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4 space-y-4">
          {/* Info */}
          <div className="max-w-md mx-auto">
            <p className="text-xs text-gray-400 mb-1">Info (Rational Blue)</p>
            <div className="flex justify-center py-2">
              <div className="px-4 py-2 bg-rational-50 rounded-lg">
                <p className="text-xs text-rational-600 text-center">
                  Agent capabilities have been updated
                </p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="max-w-md mx-auto">
            <p className="text-xs text-gray-400 mb-1">Warning (Amber)</p>
            <div className="flex justify-center py-2">
              <div className="px-4 py-2 bg-amber-50 rounded-lg">
                <p className="text-xs text-amber-600 text-center">
                  This conversation will expire in 24 hours
                </p>
              </div>
            </div>
          </div>

          {/* Success */}
          <div className="max-w-md mx-auto">
            <p className="text-xs text-gray-400 mb-1">Success (Green)</p>
            <div className="flex justify-center py-2">
              <div className="px-4 py-2 bg-green-50 rounded-lg">
                <p className="text-xs text-green-600 text-center">
                  File uploaded successfully
                </p>
              </div>
            </div>
          </div>

          {/* With Icon */}
          <div className="max-w-md mx-auto">
            <p className="text-xs text-gray-400 mb-1">With Icon</p>
            <div className="flex justify-center py-2">
              <div className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-xs text-gray-500">
                  Messages are end-to-end encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto"><code>{systemMessageVariantsCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(systemMessageVariantsCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Anti-patterns */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-medium text-red-800 mb-2">Anti-patterns</h3>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• ❌ 使用与消息相同的气泡样式（应明显区分）</li>
          <li>• ❌ 文字过长（保持简洁，一行为佳）</li>
          <li>• ❌ 使用红色表示普通信息（红色仅用于错误）</li>
          <li>• ❌ 频繁显示系统消息（避免干扰）</li>
        </ul>
      </div>
    </div>
  )
}

function MessageStatusSection() {
  const messageStatusCode = `{/* Message with Status - Sending */}
<div className="flex justify-end items-end gap-1">
  <div className="bg-rational-500 rounded-2xl px-4 py-2">
    <p className="text-sm text-white">Sending this message...</p>
  </div>
  <svg className="w-4 h-4 text-gray-300 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
</div>

{/* Message with Status - Sent */}
<div className="flex justify-end items-end gap-1">
  <div className="bg-rational-500 rounded-2xl px-4 py-2">
    <p className="text-sm text-white">Message sent</p>
  </div>
  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
</div>

{/* Message with Status - Delivered */}
<div className="flex justify-end items-end gap-1">
  <div className="bg-rational-500 rounded-2xl px-4 py-2">
    <p className="text-sm text-white">Message delivered</p>
  </div>
  <svg className="w-4 h-4 text-rational-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7M5 13l4 4L19 7" />
  </svg>
</div>

{/* Message with Status - Read */}
<div className="flex justify-end items-end gap-1">
  <div className="bg-rational-500 rounded-2xl px-4 py-2">
    <p className="text-sm text-white">Message read by AI</p>
  </div>
  <svg className="w-4 h-4 text-rational-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
  </svg>
</div>

{/* Message with Status - Failed */}
<div className="flex justify-end items-end gap-1">
  <div className="bg-rational-500 rounded-2xl px-4 py-2">
    <p className="text-sm text-white">Failed to send</p>
  </div>
  <button className="text-red-500 hover:text-red-600">
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </button>
</div>`

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-gray-500 mb-2">Conversation</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Message Status</h2>
        <p className="text-gray-600">
          消息状态指示器显示消息的发送状态：发送中、已发送、已送达、已读、发送失败。
        </p>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">设计原则</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>位置统一</strong>：显示在消息气泡右下角外侧</li>
          <li>• <strong>图标简洁</strong>：单勾/双勾/填充双勾表示递进状态</li>
          <li>• <strong>颜色语义</strong>：灰色-发送中/已发送，蓝色-已送达/已读，红色-失败</li>
          <li>• <strong>可交互</strong>：失败状态可点击重试</li>
        </ul>
      </div>

      {/* Status States */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Status States</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4 space-y-4">
          {/* Sending */}
          <div className="max-w-md ml-auto">
            <p className="text-xs text-gray-400 mb-1 text-right">Sending</p>
            <div className="flex justify-end items-end gap-1">
              <div className="bg-rational-500 rounded-2xl px-4 py-2">
                <p className="text-sm text-white">Sending this message...</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>

          {/* Sent */}
          <div className="max-w-md ml-auto">
            <p className="text-xs text-gray-400 mb-1 text-right">Sent</p>
            <div className="flex justify-end items-end gap-1">
              <div className="bg-rational-500 rounded-2xl px-4 py-2">
                <p className="text-sm text-white">Message sent</p>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Delivered */}
          <div className="max-w-md ml-auto">
            <p className="text-xs text-gray-400 mb-1 text-right">Delivered</p>
            <div className="flex justify-end items-end gap-1">
              <div className="bg-rational-500 rounded-2xl px-4 py-2">
                <p className="text-sm text-white">Message delivered</p>
              </div>
              <div className="flex -space-x-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Read */}
          <div className="max-w-md ml-auto">
            <p className="text-xs text-gray-400 mb-1 text-right">Read</p>
            <div className="flex justify-end items-end gap-1">
              <div className="bg-rational-500 rounded-2xl px-4 py-2">
                <p className="text-sm text-white">Message read by AI</p>
              </div>
              <div className="flex -space-x-2">
                <svg className="w-4 h-4 text-rational-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <svg className="w-4 h-4 text-rational-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Failed */}
          <div className="max-w-md ml-auto">
            <p className="text-xs text-gray-400 mb-1 text-right">Failed (tap to retry)</p>
            <div className="flex justify-end items-end gap-1">
              <div className="bg-rational-500 rounded-2xl px-4 py-2">
                <p className="text-sm text-white">Failed to send</p>
              </div>
              <button className="text-red-500 hover:text-red-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto max-h-96"><code>{messageStatusCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(messageStatusCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Anti-patterns */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-medium text-red-800 mb-2">Anti-patterns</h3>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• ❌ 状态图标过大（保持 w-4 h-4）</li>
          <li>• ❌ 在气泡内部显示状态（应在外部）</li>
          <li>• ❌ 使用文字代替图标（图标更简洁）</li>
          <li>• ❌ AI 消息也显示状态（只对用户消息显示）</li>
        </ul>
      </div>
    </div>
  )
}

function ContextMenuSection() {
  const contextMenuCode = `{/* Context Menu Overlay */}
<div className="fixed inset-0 bg-black/20 z-50">
  {/* Menu positioned near the long-pressed message */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[160px]">
      <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        Reply
      </button>
      <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Copy
      </button>
      <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Forward
      </button>
      <div className="h-px bg-gray-100 my-1" />
      <button className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </button>
    </div>
  </div>
</div>`

  const mobileContextMenuCode = `{/* Mobile Action Sheet Style */}
<div className="fixed inset-0 bg-black/20 z-50 flex items-end">
  <div className="w-full bg-white rounded-t-2xl pb-safe">
    <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />
    <div className="px-4 pb-4 space-y-1">
      <button className="w-full px-4 py-3 text-left text-base text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-3">
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        Reply
      </button>
      <button className="w-full px-4 py-3 text-left text-base text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-3">
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Copy
      </button>
      <button className="w-full px-4 py-3 text-left text-base text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </button>
    </div>
    <button className="w-full px-4 py-4 text-center text-base text-gray-500 border-t border-gray-100">
      Cancel
    </button>
  </div>
</div>`

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-gray-500 mb-2">Conversation</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Context Menu</h2>
        <p className="text-gray-600">
          长按消息触发的上下文菜单，提供回复、复制、转发、删除等操作。
        </p>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">设计原则</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>触发方式</strong>：桌面右键，移动端长按</li>
          <li>• <strong>位置跟随</strong>：菜单靠近触发位置</li>
          <li>• <strong>分组清晰</strong>：危险操作（删除）使用分隔线隔开</li>
          <li>• <strong>图标+文字</strong>：提高可识别性</li>
          <li>• <strong>移动适配</strong>：移动端使用底部 Action Sheet</li>
        </ul>
      </div>

      {/* Desktop Context Menu */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Desktop Context Menu</h3>
        <div className="p-6 bg-gray-100 rounded-lg mb-4">
          <div className="flex justify-center">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[160px]">
              <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Reply
              </button>
              <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
              <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Forward
              </button>
              <div className="h-px bg-gray-100 my-1" />
              <button className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto max-h-80"><code>{contextMenuCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(contextMenuCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Mobile Action Sheet */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Mobile Action Sheet</h3>
        <div className="p-6 bg-gray-100 rounded-lg mb-4">
          <div className="max-w-xs mx-auto">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />
              <div className="px-4 pb-4 space-y-1">
                <button className="w-full px-4 py-3 text-left text-base text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Reply
                </button>
                <button className="w-full px-4 py-3 text-left text-base text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
                <button className="w-full px-4 py-3 text-left text-base text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
              <button className="w-full px-4 py-4 text-center text-base text-gray-500 border-t border-gray-100">
                Cancel
              </button>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto max-h-80"><code>{mobileContextMenuCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(mobileContextMenuCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Anti-patterns */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-medium text-red-800 mb-2">Anti-patterns</h3>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• ❌ 菜单项过多（保持 5 个以内）</li>
          <li>• ❌ 没有遮罩层（用户需要明确的模态提示）</li>
          <li>• ❌ 删除操作没有二次确认</li>
          <li>• ❌ 移动端使用桌面样式的下拉菜单</li>
        </ul>
      </div>
    </div>
  )
}

function ReplyQuoteSection() {
  const replyQuoteCode = `{/* Reply Quote in Input Area */}
<div className="border-t border-gray-200 bg-gray-50">
  {/* Quote Preview */}
  <div className="px-4 py-2 flex items-start gap-3 border-l-2 border-rational-500 ml-4 mr-4 mt-2 bg-white rounded-r-lg">
    <div className="flex-1 min-w-0">
      <p className="text-xs text-rational-600 font-medium">Replying to AI</p>
      <p className="text-sm text-gray-500 truncate">Let me help you with that React component...</p>
    </div>
    <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  {/* Input */}
  <div className="p-4 flex items-end gap-3">
    <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3">
      <textarea placeholder="Type a message..." rows={1} className="w-full bg-transparent border-0 resize-none focus:outline-none text-gray-700 text-sm" />
    </div>
    <button className="w-10 h-10 bg-rational-500 text-white rounded-full flex items-center justify-center">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    </button>
  </div>
</div>`

  const replyInMessageCode = `{/* Message with Reply Quote */}
<div className="flex justify-start gap-3">
  <div className="w-8 h-8 rounded-full bg-sentient-100 flex items-center justify-center text-sentient-600 text-sm font-medium flex-shrink-0">
    AI
  </div>
  <div className="max-w-[80%]">
    {/* Quoted Message */}
    <div className="bg-gray-100 rounded-t-2xl rounded-br-2xl px-4 py-2 border-l-2 border-gray-300">
      <p className="text-xs text-gray-500 font-medium">You</p>
      <p className="text-sm text-gray-600 truncate">How do I create a React component?</p>
    </div>
    {/* Reply Message */}
    <div className="bg-white border border-gray-200 rounded-b-2xl rounded-tr-2xl px-4 py-3 -mt-px">
      <p className="text-sm text-gray-700">Here's how you can create a React component...</p>
    </div>
  </div>
</div>`

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-gray-500 mb-2">Conversation</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Reply Quote</h2>
        <p className="text-gray-600">
          引用回复让用户可以针对特定消息进行回复，保持对话上下文清晰。
        </p>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">设计原则</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>左侧边框</strong>：使用 border-l-2 标识引用区域</li>
          <li>• <strong>发送者标注</strong>：显示被引用消息的发送者</li>
          <li>• <strong>内容截断</strong>：引用内容使用 truncate，不过长</li>
          <li>• <strong>可取消</strong>：在输入框上方显示时，提供关闭按钮</li>
          <li>• <strong>视觉连接</strong>：引用和回复在视觉上连续</li>
        </ul>
      </div>

      {/* Reply Quote in Input */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Reply Quote in Input Area</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="max-w-md mx-auto border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="border-t border-gray-200 bg-gray-50">
              <div className="px-4 py-2 flex items-start gap-3 border-l-2 border-rational-500 ml-4 mr-4 mt-2 bg-white rounded-r-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-rational-600 font-medium">Replying to AI</p>
                  <p className="text-sm text-gray-500 truncate">Let me help you with that React component...</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 flex items-end gap-3">
                <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3">
                  <input type="text" placeholder="Type a message..." className="w-full bg-transparent border-0 focus:outline-none text-gray-700 text-sm" />
                </div>
                <button className="w-10 h-10 bg-rational-500 text-white rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto max-h-72"><code>{replyQuoteCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(replyQuoteCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Reply in Message */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Reply Quote in Message</h3>
        <div className="p-6 bg-gray-50 rounded-lg mb-4">
          <div className="max-w-md mx-auto space-y-4">
            {/* Original message being replied to */}
            <div className="flex justify-end">
              <div className="max-w-[70%] bg-rational-500 rounded-2xl px-4 py-2">
                <p className="text-sm text-white">How do I create a React component?</p>
              </div>
            </div>

            {/* Reply with quote */}
            <div className="flex justify-start gap-3">
              <div className="w-8 h-8 rounded-full bg-sentient-100 flex items-center justify-center text-sentient-600 text-sm font-medium flex-shrink-0">
                AI
              </div>
              <div className="max-w-[80%]">
                <div className="bg-gray-100 rounded-t-2xl rounded-br-2xl px-4 py-2 border-l-2 border-gray-300">
                  <p className="text-xs text-gray-500 font-medium">You</p>
                  <p className="text-sm text-gray-600 truncate">How do I create a React component?</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-b-2xl rounded-tr-2xl px-4 py-3 -mt-px">
                  <p className="text-sm text-gray-700">Here's how you can create a React component. First, you need to import React...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 overflow-x-auto max-h-72"><code>{replyInMessageCode}</code></pre>
          <button
            onClick={() => navigator.clipboard.writeText(replyInMessageCode)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Anti-patterns */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-medium text-red-800 mb-2">Anti-patterns</h3>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• ❌ 引用内容过长（使用 truncate 限制一行）</li>
          <li>• ❌ 引用和回复分离显示（应视觉连接）</li>
          <li>• ❌ 没有发送者标识（需要明确"回复谁"）</li>
          <li>• ❌ 引用样式与普通消息相同（需要视觉区分）</li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// Responsive Design Section
// ============================================================================
function ResponsiveSection() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Responsive Design</h2>
        <p className="text-gray-600 mb-8">
          移动优先的响应式设计系统，确保 AI Agent 平台在手机、平板、桌面端都有最佳体验。
        </p>
      </div>

      {/* Breakpoints */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Breakpoints 断点系统</h3>
        <p className="text-gray-600 mb-4">采用移动优先策略，基于 Tailwind CSS 断点标准：</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">断点</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">尺寸</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">典型设备</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 hidden sm:table-cell">布局策略</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-mono text-rational-600">default</td>
                <td className="px-4 py-3">&lt; 640px</td>
                <td className="px-4 py-3">手机竖屏</td>
                <td className="px-4 py-3 hidden sm:table-cell">单栏 + 底部导航</td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="px-4 py-3 font-mono text-rational-600">sm</td>
                <td className="px-4 py-3">≥ 640px</td>
                <td className="px-4 py-3">手机横屏/小平板</td>
                <td className="px-4 py-3 hidden sm:table-cell">单栏 + 抽屉侧边栏</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-rational-600">md</td>
                <td className="px-4 py-3">≥ 768px</td>
                <td className="px-4 py-3">平板</td>
                <td className="px-4 py-3 hidden sm:table-cell">双栏布局</td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="px-4 py-3 font-mono text-rational-600">lg</td>
                <td className="px-4 py-3">≥ 1024px</td>
                <td className="px-4 py-3">小桌面</td>
                <td className="px-4 py-3 hidden sm:table-cell">三栏完整布局</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-rational-600">xl</td>
                <td className="px-4 py-3">≥ 1280px</td>
                <td className="px-4 py-3">大桌面</td>
                <td className="px-4 py-3 hidden sm:table-cell">三栏 + 更多留白</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Layout Strategy */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">IM Layout Strategy 布局策略</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mobile */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-gray-900">Mobile &lt;768px</span>
            </div>
            <div className="bg-gray-100 rounded p-2 text-xs font-mono space-y-1">
              <div className="bg-white rounded p-1 text-center">会话列表（全屏）</div>
              <div className="text-center text-gray-400">↕ 页面切换</div>
              <div className="bg-white rounded p-1 text-center">聊天区（全屏）</div>
              <div className="bg-rational-100 rounded p-1 text-center text-rational-700">底部 Tab Bar</div>
            </div>
          </div>

          {/* Tablet */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-gray-900">Tablet 768-1024px</span>
            </div>
            <div className="bg-gray-100 rounded p-2 text-xs font-mono">
              <div className="flex gap-1">
                <div className="bg-white rounded p-1 text-center w-1/3">会话列表</div>
                <div className="bg-white rounded p-1 text-center flex-1">聊天区</div>
              </div>
              <div className="mt-1 text-center text-gray-400 text-xs">侧边栏为抽屉式</div>
            </div>
          </div>

          {/* Desktop */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-gray-900">Desktop ≥1024px</span>
            </div>
            <div className="bg-gray-100 rounded p-2 text-xs font-mono">
              <div className="flex gap-1">
                <div className="bg-gray-300 rounded p-1 text-center w-8">Nav</div>
                <div className="bg-white rounded p-1 text-center w-1/3">会话列表</div>
                <div className="bg-white rounded p-1 text-center flex-1">聊天区</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Touch Target */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Touch Target 触控热区</h3>
        <p className="text-gray-600 mb-4">确保移动端交互的可用性，遵循 iOS/Android 设计规范：</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">最小点击区域</h4>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-rational-100 border-2 border-dashed border-rational-400 rounded flex items-center justify-center text-xs text-rational-600">
                44×44
              </div>
              <div className="text-sm text-gray-600">
                <p>iOS: 44×44 pt</p>
                <p>Android: 48×48 dp</p>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">间距规范</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• 可点击元素间距 ≥ 8px</p>
              <p>• 列表项高度 ≥ 48px</p>
              <p>• 按钮内边距 ≥ 12px</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gesture Support */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Gesture Support 手势支持</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">手势</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">操作</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 hidden sm:table-cell">适用组件</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3">← 左滑消息</td>
                <td className="px-4 py-3">回复</td>
                <td className="px-4 py-3 hidden sm:table-cell">Chat Bubble</td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="px-4 py-3">→ 右滑消息</td>
                <td className="px-4 py-3">删除/更多</td>
                <td className="px-4 py-3 hidden sm:table-cell">Chat Bubble</td>
              </tr>
              <tr>
                <td className="px-4 py-3">长按</td>
                <td className="px-4 py-3">呼出 Action Sheet</td>
                <td className="px-4 py-3 hidden sm:table-cell">Chat Bubble, Image</td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="px-4 py-3">↓ 下拉</td>
                <td className="px-4 py-3">加载更多历史</td>
                <td className="px-4 py-3 hidden sm:table-cell">Message List</td>
              </tr>
              <tr>
                <td className="px-4 py-3">← 边缘右滑</td>
                <td className="px-4 py-3">返回上一页</td>
                <td className="px-4 py-3 hidden sm:table-cell">全局导航</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Component Variants */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Component Responsive Variants 组件响应式变体</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">组件</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">桌面端</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">移动端</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-medium">App Shell</td>
                <td className="px-4 py-3">三栏固定</td>
                <td className="px-4 py-3">单栏切换 + 底部 Tab</td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="px-4 py-3 font-medium">Chat Bubble</td>
                <td className="px-4 py-3">max-w-[70%]</td>
                <td className="px-4 py-3">max-w-[85%]</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Input Bar</td>
                <td className="px-4 py-3">固定底部 + 工具栏</td>
                <td className="px-4 py-3">工具栏收起为 "+"</td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="px-4 py-3 font-medium">Context Menu</td>
                <td className="px-4 py-3">右键下拉菜单</td>
                <td className="px-4 py-3">长按 Action Sheet</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Message Status</td>
                <td className="px-4 py-3">图标 + 文字</td>
                <td className="px-4 py-3">仅图标</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Example */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Code Example</h3>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// useMediaQuery hook
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (e: MediaQueryListEvent) =>
      setMatches(e.matches)
    media.addEventListener('change', listener)
    return () =>
      media.removeEventListener('change', listener)
  }, [query])

  return matches
}

// Usage
const isMobile = useMediaQuery('(max-width: 767px)')
const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
const isDesktop = useMediaQuery('(min-width: 1024px)')

// Responsive component
function ChatBubble({ message }) {
  const isMobile = useMediaQuery('(max-width: 767px)')

  return (
    <div className={\`
      \${isMobile ? 'max-w-[85%]' : 'max-w-[70%]'}
      bg-white rounded-2xl p-3
    \`}>
      {message}
    </div>
  )
}`}
        </pre>
      </div>

      {/* Anti-patterns */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-medium text-red-800 mb-2">Anti-patterns 反模式</h4>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• ❌ 固定像素宽度而非响应式断点</li>
          <li>• ❌ 触控热区小于 44×44px</li>
          <li>• ❌ 移动端保留 hover 状态样式</li>
          <li>• ❌ 横向滚动的内容区域</li>
          <li>• ❌ 桌面端和移动端使用相同的交互模式</li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// Bottom Tab Bar Section
// ============================================================================
function BottomTabBarSection() {
  const [activeTab, setActiveTab] = useState('chat')

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Bottom Tab Bar</h2>
        <p className="text-gray-600 mb-8">
          移动端底部导航栏，用于 App 主要功能区域的快速切换，是移动端 IM 应用的核心导航组件。
        </p>
      </div>

      {/* Design Principles */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">设计原则</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 最多 5 个标签项，超过则使用"更多"入口</li>
          <li>• 图标 + 文字标签组合，确保可识别性</li>
          <li>• 当前激活项使用主题色（理性蓝/感性金）高亮</li>
          <li>• 未读消息使用小红点或数字角标提示</li>
          <li>• 固定在屏幕底部，不随内容滚动</li>
        </ul>
      </div>

      {/* Live Example */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Live Example</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden max-w-sm mx-auto">
          {/* Mock screen content */}
          <div className="h-64 bg-gray-50 flex items-center justify-center text-gray-400">
            {activeTab === 'chat' && '会话列表'}
            {activeTab === 'contacts' && '智能体'}
            {activeTab === 'discover' && '发现'}
            {activeTab === 'me' && '我的'}
          </div>

          {/* Bottom Tab Bar */}
          <div className="flex items-center justify-around bg-white border-t border-gray-200 h-14 px-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex flex-col items-center justify-center flex-1 h-full relative ${
                activeTab === 'chat' ? 'text-rational-500' : 'text-gray-500'
              }`}
            >
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </div>
              <span className="text-xs mt-1">会话</span>
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                activeTab === 'contacts' ? 'text-rational-500' : 'text-gray-500'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs mt-1">智能体</span>
            </button>

            <button
              onClick={() => setActiveTab('discover')}
              className={`flex flex-col items-center justify-center flex-1 h-full relative ${
                activeTab === 'discover' ? 'text-rational-500' : 'text-gray-500'
              }`}
            >
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </div>
              <span className="text-xs mt-1">发现</span>
            </button>

            <button
              onClick={() => setActiveTab('me')}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                activeTab === 'me' ? 'text-rational-500' : 'text-gray-500'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs mt-1">我的</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sentient Theme Variant */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sentient Theme Variant</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden max-w-sm mx-auto">
          <div className="h-32 bg-gray-50 flex items-center justify-center text-gray-400">
            感性金主题
          </div>
          <div className="flex items-center justify-around bg-white border-t border-gray-200 h-14 px-2">
            <button className="flex flex-col items-center justify-center flex-1 h-full text-sentient-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-xs mt-1">会话</span>
            </button>
            <button className="flex flex-col items-center justify-center flex-1 h-full text-gray-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs mt-1">智能体</span>
            </button>
            <button className="flex flex-col items-center justify-center flex-1 h-full text-gray-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-xs mt-1">发现</span>
            </button>
            <button className="flex flex-col items-center justify-center flex-1 h-full text-gray-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs mt-1">我的</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Code</h3>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`interface TabItem {
  id: string
  label: string
  icon: React.ReactNode
  badge?: number | boolean
}

function BottomTabBar({
  tabs,
  activeTab,
  onTabChange,
  theme = 'rational'
}: {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (id: string) => void
  theme?: 'rational' | 'sentient'
}) {
  const activeColor = theme === 'rational'
    ? 'text-rational-500'
    : 'text-sentient-500'

  return (
    <nav className="fixed bottom-0 left-0 right-0
      flex items-center justify-around
      bg-white border-t border-gray-200
      h-14 px-2 safe-area-pb"
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={\`flex flex-col items-center
            justify-center flex-1 h-full
            \${activeTab === tab.id
              ? activeColor
              : 'text-gray-500'
            }\`}
        >
          <div className="relative">
            {tab.icon}
            {tab.badge && (
              <span className="absolute -top-1 -right-1
                min-w-[16px] h-4 px-1
                bg-red-500 text-white text-xs
                rounded-full flex items-center
                justify-center">
                {typeof tab.badge === 'number'
                  ? tab.badge
                  : ''}
              </span>
            )}
          </div>
          <span className="text-xs mt-1">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}`}
        </pre>
      </div>

      {/* Anti-patterns */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-medium text-red-800 mb-2">Anti-patterns 反模式</h4>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• ❌ 标签项超过 5 个</li>
          <li>• ❌ 仅使用图标无文字标签</li>
          <li>• ❌ 点击热区小于 44×44px</li>
          <li>• ❌ 未处理 iOS 安全区域（底部圆角）</li>
          <li>• ❌ 在桌面端显示底部 Tab Bar</li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// Action Sheet Section
// ============================================================================
function ActionSheetSection() {
  const [showActionSheet, setShowActionSheet] = useState(false)

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Action Sheet</h2>
        <p className="text-gray-600 mb-8">
          移动端底部弹出菜单，用于替代桌面端的右键菜单，适用于消息操作、分享、更多选项等场景。
        </p>
      </div>

      {/* Design Principles */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">设计原则</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 从底部滑出，带遮罩层</li>
          <li>• 选项按钮高度 ≥ 56px，确保易点击</li>
          <li>• 危险操作（如删除）使用红色标识</li>
          <li>• 必须包含"取消"按钮，与选项区域分隔</li>
          <li>• 点击遮罩层或取消按钮关闭</li>
          <li>• 支持手势下滑关闭</li>
        </ul>
      </div>

      {/* Live Example */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Live Example</h3>
        <div className="max-w-sm mx-auto">
          <button
            onClick={() => setShowActionSheet(true)}
            className="w-full px-4 py-3 bg-rational-500 text-white rounded-lg hover:bg-rational-600 transition-colors"
          >
            长按消息 / 点击查看效果
          </button>

          {/* Action Sheet Modal */}
          {showActionSheet && (
            <div className="fixed inset-0 z-50 flex items-end justify-center">
              {/* Overlay */}
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowActionSheet(false)}
              />

              {/* Sheet */}
              <div className="relative w-full max-w-md bg-white rounded-t-2xl overflow-hidden animate-slide-up">
                {/* Handle */}
                <div className="flex justify-center py-2">
                  <div className="w-10 h-1 bg-gray-300 rounded-full" />
                </div>

                {/* Options */}
                <div className="px-4 pb-2">
                  <button className="w-full py-4 text-center text-gray-900 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    回复
                  </button>
                  <button className="w-full py-4 text-center text-gray-900 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    复制
                  </button>
                  <button className="w-full py-4 text-center text-gray-900 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    转发
                  </button>
                  <button className="w-full py-4 text-center text-gray-900 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    收藏
                  </button>
                  <button className="w-full py-4 text-center text-red-500 hover:bg-red-50 transition-colors">
                    删除
                  </button>
                </div>

                {/* Cancel */}
                <div className="px-4 pb-6 pt-2 bg-gray-50">
                  <button
                    onClick={() => setShowActionSheet(false)}
                    className="w-full py-4 text-center text-gray-900 bg-white rounded-xl font-medium hover:bg-gray-100 transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Variants */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Variants</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* With Header */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-3 py-2 text-xs text-gray-500">With Header</div>
            <div className="bg-white rounded-t-xl p-4">
              <div className="text-center py-2 border-b border-gray-100">
                <p className="text-sm text-gray-500">确定要删除这条消息吗？</p>
              </div>
              <button className="w-full py-3 text-center text-red-500 border-b border-gray-100">
                删除
              </button>
              <div className="pt-2">
                <button className="w-full py-3 text-center text-gray-900 bg-gray-50 rounded-lg">
                  取消
                </button>
              </div>
            </div>
          </div>

          {/* With Icons */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-3 py-2 text-xs text-gray-500">With Icons</div>
            <div className="bg-white rounded-t-xl p-4">
              <button className="w-full py-3 flex items-center gap-3 text-gray-900 border-b border-gray-100">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                回复
              </button>
              <button className="w-full py-3 flex items-center gap-3 text-gray-900 border-b border-gray-100">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                复制
              </button>
              <button className="w-full py-3 flex items-center gap-3 text-red-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                删除
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Code */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Code</h3>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`interface ActionSheetOption {
  label: string
  icon?: React.ReactNode
  danger?: boolean
  onPress: () => void
}

function ActionSheet({
  isOpen,
  onClose,
  title,
  options
}: {
  isOpen: boolean
  onClose: () => void
  title?: string
  options: ActionSheetOption[]
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full bg-white
        rounded-t-2xl overflow-hidden
        animate-slide-up safe-area-pb"
      >
        {/* Handle */}
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Title */}
        {title && (
          <div className="px-4 py-3 text-center border-b">
            <p className="text-sm text-gray-500">{title}</p>
          </div>
        )}

        {/* Options */}
        <div className="px-4">
          {options.map((option, i) => (
            <button
              key={i}
              onClick={() => {
                option.onPress()
                onClose()
              }}
              className={\`w-full py-4 flex items-center
                gap-3 border-b border-gray-100
                \${option.danger
                  ? 'text-red-500'
                  : 'text-gray-900'
                }\`}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>

        {/* Cancel */}
        <div className="px-4 py-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-4 text-center
              text-gray-900 bg-white rounded-xl
              font-medium"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  )
}

// CSS Animation
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}`}
        </pre>
      </div>

      {/* Anti-patterns */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-medium text-red-800 mb-2">Anti-patterns 反模式</h4>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• ❌ 选项太多导致需要滚动（应分组或使用子页面）</li>
          <li>• ❌ 无取消按钮或点击遮罩无法关闭</li>
          <li>• ❌ 危险操作无颜色区分</li>
          <li>• ❌ 在桌面端使用 Action Sheet（应使用 Dropdown）</li>
          <li>• ❌ 无动画效果直接显示</li>
        </ul>
      </div>
    </div>
  )
}

export default App
