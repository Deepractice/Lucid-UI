import React from 'react'
import { AgentChat } from '@uix/agent'
import { useAGUI } from '@uix/adapter-agui/react'

/**
 * Chat UI connected to an AG-UI protocol agent.
 *
 * useAGUI handles:
 * - SSE connection to the agent endpoint
 * - Parsing AG-UI events (RUN_STARTED, TEXT_MESSAGE_*, etc.)
 * - Converting events to UIX LucidConversation format
 * - Managing loading/streaming/error status
 *
 * AgentChat renders the full chat interface from the conversation data.
 */
export default function App() {
  const { conversations, status, send, stop, reset, error } = useAGUI({
    url: 'http://localhost:3001/api/agent',
    onError: (err) => {
      console.error('AG-UI error:', err)
    },
    onFinish: () => {
      console.log('Agent run finished')
    },
  })

  return (
    <div className="h-screen flex flex-col">
      {/* Optional: error banner */}
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-2 text-sm">
          Error: {error.message}
          <button onClick={reset} className="ml-2 underline">
            Reset
          </button>
        </div>
      )}

      <div className="flex-1">
        <AgentChat
          conversations={conversations}
          status={status}
          onSend={send}
          onStop={stop}
          agent={{
            id: 'ag-ui-agent',
            name: 'AG-UI Agent',
            status: status === 'error' ? 'offline' : 'online',
          }}
          placeholder="Send a message to the agent..."
          emptyState={{
            title: 'AG-UI Agent',
            description: 'This agent communicates via the AG-UI protocol over Server-Sent Events.',
          }}
        />
      </div>
    </div>
  )
}
