import type { Meta, StoryObj } from '@storybook/react-vite'
import { AgentChat } from '@uix-ai/agent'
import type { ChatWindowAgent } from '@uix-ai/agent'
import type { LucidConversation } from '@uix-ai/core'
import { useState, useCallback } from 'react'

const meta: Meta<typeof AgentChat> = {
  title: 'Layout/AgentChat',
  component: AgentChat,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AgentChat>

// ============================================================================
// Mock Data
// ============================================================================

const mockAgent: ChatWindowAgent = {
  id: 'claude',
  name: 'Claude',
  avatar: 'https://github.com/anthropics.png',
  status: 'online',
  description: 'AI assistant powered by Anthropic',
}

const now = Date.now()

const basicConversations: LucidConversation[] = [
  {
    id: 'conv-1',
    role: 'user',
    status: 'completed',
    blocks: [
      { id: 'b1', type: 'text', status: 'completed', content: { text: 'What is React?' } },
    ],
    timestamp: now - 60000,
  },
  {
    id: 'conv-2',
    role: 'assistant',
    status: 'completed',
    blocks: [
      {
        id: 'b2',
        type: 'text',
        status: 'completed',
        content: {
          text: 'React is a JavaScript library for building user interfaces. It was developed by Facebook and uses a component-based architecture, making code easier to maintain and reuse.',
        },
      },
    ],
    timestamp: now - 55000,
  },
  {
    id: 'conv-3',
    role: 'user',
    status: 'completed',
    blocks: [
      { id: 'b3', type: 'text', status: 'completed', content: { text: 'How does it compare to Vue?' } },
    ],
    timestamp: now - 50000,
  },
  {
    id: 'conv-4',
    role: 'assistant',
    status: 'completed',
    blocks: [
      {
        id: 'b4',
        type: 'text',
        status: 'completed',
        content: {
          text: 'React and Vue differ in several ways:\n\n1. **Template syntax**: Vue uses templates, React uses JSX\n2. **Data binding**: Vue has two-way binding, React uses one-way data flow\n3. **Learning curve**: Vue is generally easier to pick up, React requires understanding more concepts like hooks and JSX',
        },
      },
    ],
    timestamp: now - 45000,
  },
]

const streamingConversations: LucidConversation[] = [
  {
    id: 'conv-1',
    role: 'user',
    status: 'completed',
    blocks: [
      { id: 'b1', type: 'text', status: 'completed', content: { text: 'Explain quantum computing in simple terms.' } },
    ],
    timestamp: now - 10000,
  },
  {
    id: 'conv-2',
    role: 'assistant',
    status: 'streaming',
    blocks: [
      {
        id: 'b2',
        type: 'text',
        status: 'streaming',
        content: {
          text: 'Quantum computing uses the principles of quantum mechanics to process information in fundamentally different ways than classical computers. Instead of bits that are either 0 or 1, quantum computers use qubits that can be',
        },
      },
    ],
    timestamp: now - 5000,
  },
]

const toolCallConversations: LucidConversation[] = [
  {
    id: 'conv-1',
    role: 'user',
    status: 'completed',
    blocks: [
      { id: 'b1', type: 'text', status: 'completed', content: { text: 'What is the weather in San Francisco?' } },
    ],
    timestamp: now - 30000,
  },
  {
    id: 'conv-2',
    role: 'assistant',
    status: 'completed',
    blocks: [
      {
        id: 'b2',
        type: 'tool',
        status: 'completed',
        content: {
          name: 'get_weather',
          input: { location: 'San Francisco, CA' },
          output: { temperature: 18, condition: 'Partly cloudy', humidity: 72 },
          status: 'success',
        },
      },
      {
        id: 'b3',
        type: 'text',
        status: 'completed',
        content: {
          text: 'The current weather in San Francisco is 18°C (64°F) with partly cloudy skies and 72% humidity.',
        },
      },
    ],
    timestamp: now - 25000,
  },
]

const thinkingConversations: LucidConversation[] = [
  {
    id: 'conv-1',
    role: 'user',
    status: 'completed',
    blocks: [
      { id: 'b1', type: 'text', status: 'completed', content: { text: 'What is 247 * 389?' } },
    ],
    timestamp: now - 20000,
  },
  {
    id: 'conv-2',
    role: 'assistant',
    status: 'completed',
    blocks: [
      {
        id: 'b2',
        type: 'thinking',
        status: 'completed',
        content: {
          reasoning: 'I need to multiply 247 by 389.\n247 * 389 = 247 * 400 - 247 * 11 = 98800 - 2717 = 96083',
        },
      },
      {
        id: 'b3',
        type: 'text',
        status: 'completed',
        content: { text: '247 * 389 = **96,083**' },
      },
    ],
    timestamp: now - 15000,
  },
]

// ============================================================================
// Stories
// ============================================================================

/**
 * Empty state with no conversations. Shows the default empty state UI.
 */
export const Empty: Story = {
  render: () => (
    <div className="h-[600px] border border-gray-200 rounded-lg overflow-hidden">
      <AgentChat
        conversations={[]}
        onSend={(msg) => console.log('Send:', msg)}
      />
    </div>
  ),
}

/**
 * Empty state with agent information displayed in the header.
 */
export const WithAgent: Story = {
  render: () => (
    <div className="h-[600px] border border-gray-200 rounded-lg overflow-hidden">
      <AgentChat
        conversations={[]}
        agent={mockAgent}
        showHeader
        emptyState={{
          title: 'Chat with Claude',
          description: 'Ask me anything - I can help with coding, writing, analysis, and more.',
        }}
        onSend={(msg) => console.log('Send:', msg)}
      />
    </div>
  ),
}

/**
 * A basic conversation with several text messages exchanged between user and assistant.
 */
export const BasicConversation: Story = {
  render: () => (
    <div className="h-[600px] border border-gray-200 rounded-lg overflow-hidden">
      <AgentChat
        conversations={basicConversations}
        agent={mockAgent}
        onSend={(msg) => console.log('Send:', msg)}
      />
    </div>
  ),
}

/**
 * Shows an assistant message that is still streaming, with cursor indicator.
 */
export const StreamingResponse: Story = {
  render: () => (
    <div className="h-[600px] border border-gray-200 rounded-lg overflow-hidden">
      <AgentChat
        conversations={streamingConversations}
        agent={mockAgent}
        status="streaming"
        onStop={() => console.log('Stop streaming')}
      />
    </div>
  ),
}

/**
 * Conversation that includes a tool call block with input and output.
 */
export const WithToolCall: Story = {
  render: () => (
    <div className="h-[600px] border border-gray-200 rounded-lg overflow-hidden">
      <AgentChat
        conversations={toolCallConversations}
        agent={mockAgent}
        onSend={(msg) => console.log('Send:', msg)}
      />
    </div>
  ),
}

/**
 * Conversation with a thinking/reasoning block shown as a collapsible section.
 */
export const WithThinking: Story = {
  render: () => (
    <div className="h-[600px] border border-gray-200 rounded-lg overflow-hidden">
      <AgentChat
        conversations={thinkingConversations}
        agent={mockAgent}
        onSend={(msg) => console.log('Send:', msg)}
      />
    </div>
  ),
}

/**
 * Interactive demo using React state. Sending a message adds it to the conversation
 * and simulates an assistant response after a 1-second delay.
 */
export const FullDemo: Story = {
  render: function FullDemoStory() {
    const [conversations, setConversations] = useState<LucidConversation[]>([])
    const [status, setStatus] = useState<'idle' | 'loading' | 'streaming' | 'error'>('idle')

    const handleSend = useCallback((message: string) => {
      const userConv: LucidConversation = {
        id: `user-${Date.now()}`,
        role: 'user',
        status: 'completed',
        blocks: [
          { id: `ub-${Date.now()}`, type: 'text', status: 'completed', content: { text: message } },
        ],
        timestamp: Date.now(),
      }

      setConversations((prev) => [...prev, userConv])
      setStatus('streaming')

      setTimeout(() => {
        const assistantConv: LucidConversation = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          status: 'completed',
          blocks: [
            {
              id: `ab-${Date.now()}`,
              type: 'text',
              status: 'completed',
              content: {
                text: `You said: "${message}"\n\nThis is a simulated response from the assistant. In a real application, this would come from an AI model via a protocol adapter.`,
              },
            },
          ],
          timestamp: Date.now(),
        }

        setConversations((prev) => [...prev, assistantConv])
        setStatus('idle')
      }, 1000)
    }, [])

    return (
      <div className="h-[600px] border border-gray-200 rounded-lg overflow-hidden">
        <AgentChat
          conversations={conversations}
          agent={mockAgent}
          status={status}
          onSend={handleSend}
          onStop={() => setStatus('idle')}
          placeholder="Type a message to try the interactive demo..."
          emptyState={{
            title: 'Interactive Demo',
            description: 'Send a message to see the simulated response.',
          }}
        />
      </div>
    )
  },
}

/**
 * Demonstrates that the same LucidConversation data can be rendered regardless of
 * which protocol adapter produced it. AgentChat works with any protocol adapter
 * (@uix-ai/adapter-vercel, @uix-ai/adapter-agui, or custom sources) because they all
 * output the same LucidConversation format.
 */
export const MultiProtocol: Story = {
  render: () => (
    <div className="h-[600px] border border-gray-200 rounded-lg overflow-hidden">
      <AgentChat
        conversations={basicConversations}
        agent={{ ...mockAgent, description: 'Works with any protocol adapter' }}
        onSend={(msg) => console.log('Send:', msg)}
      />
    </div>
  ),
}
