import { useState } from 'react'
import { colors, spacing, radius, shadows, typography, rational, sentient } from '@lucidui/tokens'
import { Button } from '@lucidui/react'

type Section = 'philosophy' | 'colors' | 'typography' | 'spacing' | 'buttons' | 'patterns'

function App() {
  const [activeSection, setActiveSection] = useState<Section>('philosophy')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo with Sentient Gold accent */}
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-semibold">
              <span className="text-gray-900">Lucid</span>
              <span className="text-sentient-500 animate-breathe-glow">UI</span>
            </h1>
            <span className="text-sm text-gray-500">Documentation</span>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-500">
              <span>Search documentation...</span>
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
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-56 border-r border-gray-200 min-h-[calc(100vh-64px)] bg-white p-4 sticky top-16 self-start">
          <div className="space-y-1">
            {[
              { id: 'philosophy', label: 'Introduction' },
              { id: 'colors', label: 'Colors' },
              { id: 'typography', label: 'Typography' },
              { id: 'spacing', label: 'Spacing & Radius' },
              { id: 'buttons', label: 'Buttons' },
              { id: 'patterns', label: 'Patterns' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as Section)}
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
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-4xl">
          {activeSection === 'philosophy' && <PhilosophySection />}
          {activeSection === 'colors' && <ColorsSection />}
          {activeSection === 'typography' && <TypographySection />}
          {activeSection === 'spacing' && <SpacingSection />}
          {activeSection === 'buttons' && <ButtonsSection />}
          {activeSection === 'patterns' && <PatternsSection />}
        </main>
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
      <div className="grid grid-cols-2 gap-8">
        {/* Rational Theme */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Rational 理性蓝 - 科技·效率·精准</h3>
          <div className="grid grid-cols-6 gap-2">
            {([50, 100, 300, 500, 700, 900] as const).map(shade => (
              <div key={shade} className="text-center">
                <div
                  className="h-16 rounded-md border border-gray-200 mb-2 shadow-sm"
                  style={{ backgroundColor: rational[shade] }}
                />
                <p className="text-xs font-medium text-gray-700">{shade}</p>
                <p className="text-xs text-gray-500">{rational[shade].slice(0, 7)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-rational-50 border border-rational-200 rounded-lg">
            <p className="text-sm text-rational-700">
              主色调 <span className="font-mono font-semibold">{rational[500]}</span> -
              适用于数据分析、技术产品、效率工具
            </p>
          </div>
        </div>

        {/* Sentient Theme */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sentient 感性金 - 智慧·思维·人文</h3>
          <div className="grid grid-cols-6 gap-2">
            {([50, 100, 300, 500, 700, 900] as const).map(shade => (
              <div key={shade} className="text-center">
                <div
                  className="h-16 rounded-md border border-gray-200 mb-2 shadow-sm"
                  style={{ backgroundColor: sentient[shade] }}
                />
                <p className="text-xs font-medium text-gray-700">{shade}</p>
                <p className="text-xs text-gray-500">{sentient[shade].slice(0, 7)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-sentient-50 border border-sentient-200 rounded-lg">
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
        <div className="grid grid-cols-11 gap-2">
          {Object.entries(colors.gray).map(([shade, value]) => (
            <div key={shade} className="text-center">
              <div
                className="h-16 rounded-md border border-gray-200 mb-2"
                style={{ backgroundColor: value }}
              />
              <p className="text-xs font-medium text-gray-700">{shade}</p>
              <p className="text-xs text-gray-500">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            白色与灰阶构成视觉基底,为大众产品提供清晰的层级感,避免深色主题的小众性。
          </p>
        </div>
      </div>

      {/* Semantic Colors */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Semantic Colors</h3>
        <div className="grid grid-cols-3 gap-6">
          {/* Success */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Success</h4>
            <div className="grid grid-cols-5 gap-1">
              {([100, 300, 500, 700, 900] as const).map((shade) => (
                <div key={shade} className="text-center">
                  <div
                    className="h-10 rounded border border-gray-200 mb-1"
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
                    className="h-10 rounded border border-gray-200 mb-1"
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
                    className="h-10 rounded border border-gray-200 mb-1"
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

function ButtonsSection() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Buttons</h2>
        <p className="text-gray-600 mb-8">
          Clear visual hierarchy through variants. Accessible by default.
        </p>
      </div>

      {/* Variants */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Variants</h3>
        <div className="flex flex-wrap gap-4 p-6 bg-gray-50 rounded-lg">
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sizes</h3>
        <div className="flex flex-wrap items-center gap-4 p-6 bg-gray-50 rounded-lg">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      {/* States */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">States</h3>
        <div className="flex flex-wrap gap-4 p-6 bg-gray-50 rounded-lg">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      {/* All Combinations */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">All Combinations</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Variant</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Small</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Default</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Large</th>
              </tr>
            </thead>
            <tbody>
              {(['default', 'outline', 'ghost', 'destructive'] as const).map(variant => (
                <tr key={variant} className="border-b border-gray-100">
                  <td className="py-4 px-4 text-sm text-gray-600 capitalize">{variant}</td>
                  <td className="py-4 px-4"><Button variant={variant} size="sm">Button</Button></td>
                  <td className="py-4 px-4"><Button variant={variant} size="default">Button</Button></td>
                  <td className="py-4 px-4"><Button variant={variant} size="lg">Button</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function PatternsSection() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Common Patterns</h2>
        <p className="text-gray-600 mb-8">
          Ready-to-use UI patterns for AI applications.
        </p>
      </div>

      {/* Card Pattern */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Card</h3>
        <div className="max-w-md">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Card Title</h4>
            <p className="text-gray-600 mb-4">
              This is a standard card component with proper spacing and visual hierarchy.
            </p>
            <div className="flex gap-2">
              <Button size="sm">Primary Action</Button>
              <Button variant="outline" size="sm">Secondary</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Bubble Pattern */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">AI Chat Interface</h3>
        <div className="max-w-2xl space-y-4 p-6 bg-gray-50 rounded-lg">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="max-w-[80%] bg-primary-500 text-white rounded-2xl rounded-br-md px-4 py-3">
              <p>How do I use this design system?</p>
            </div>
          </div>
          {/* AI Response */}
          <div className="flex justify-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
              AI
            </div>
            <div className="max-w-[80%] bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
              <p className="text-gray-700">
                Install the packages with npm or pnpm, then import the Tailwind preset and components.
                The design system follows a white/gray foundation with cool blue accents.
              </p>
            </div>
          </div>
          {/* User Message */}
          <div className="flex justify-end">
            <div className="max-w-[80%] bg-primary-500 text-white rounded-2xl rounded-br-md px-4 py-3">
              <p>Thanks! That's helpful.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Pattern */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Form</h3>
        <div className="max-w-md p-6 bg-gray-50 rounded-lg">
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Your message..."
              />
            </div>
            <Button className="w-full">Submit</Button>
          </form>
        </div>
      </div>

      {/* AI Status Animations */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">AI Status Animations</h3>
        <p className="text-gray-600 text-sm mb-4">
          Single-color animations for AI thinking/running states. No purple gradients - just clean, branded motion.
        </p>
        <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
          {/* Breathing */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Breathing (opacity pulse)</p>
            <div className="flex gap-8">
              <span className="text-xl font-semibold text-rational-500 animate-breathe-glow">AI Thinking...</span>
              <span className="text-xl font-semibold text-sentient-500 animate-breathe-glow">Creating...</span>
            </div>
          </div>
          {/* Shimmer */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Shimmer (light sweep)</p>
            <div className="flex gap-8">
              <span className="text-xl font-semibold animate-shimmer-rational">Running task...</span>
              <span className="text-xl font-semibold animate-shimmer-sentient">Generating...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading States */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Loading States</h3>
        <div className="flex gap-8 p-6 bg-gray-50 rounded-lg">
          {/* Spinner */}
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500">Spinner</p>
          </div>
          {/* Skeleton */}
          <div className="text-center">
            <div className="space-y-2 mb-2">
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
            <p className="text-sm text-gray-500">Skeleton</p>
          </div>
          {/* Dots */}
          <div className="text-center">
            <div className="flex gap-1 justify-center mb-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-sm text-gray-500">Dots</p>
          </div>
        </div>
      </div>

      {/* Alert/Status Pattern */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Status Messages</h3>
        <div className="space-y-3 max-w-lg">
          <div className="flex items-center gap-3 p-4 bg-success-50 border border-success-200 rounded-lg">
            <div className="w-5 h-5 bg-success-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
            <p className="text-success-800">Operation completed successfully.</p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-warning-50 border border-warning-200 rounded-lg">
            <div className="w-5 h-5 bg-warning-500 rounded-full flex items-center justify-center text-white text-xs">!</div>
            <p className="text-warning-800">Please review before continuing.</p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-error-50 border border-error-200 rounded-lg">
            <div className="w-5 h-5 bg-error-500 rounded-full flex items-center justify-center text-white text-xs">×</div>
            <p className="text-error-800">An error occurred. Please try again.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
