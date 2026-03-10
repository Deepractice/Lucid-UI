import express from 'express'
import cors from 'cors'

/**
 * Minimal AG-UI protocol server.
 *
 * Accepts a user message via POST and returns a Server-Sent Events stream
 * with AG-UI protocol events. This simulates an agent responding with
 * a streamed text message.
 *
 * AG-UI event types used:
 * - RUN_STARTED:           Signals the start of an agent run
 * - TEXT_MESSAGE_START:     Opens a new text message
 * - TEXT_MESSAGE_CONTENT:   Streams a chunk of text content
 * - TEXT_MESSAGE_END:       Closes the text message
 * - RUN_FINISHED:          Signals the end of the agent run
 */

const app = express()
app.use(cors())
app.use(express.json())

function sendSSE(res: express.Response, event: Record<string, unknown>) {
  res.write(`data: ${JSON.stringify(event)}\n\n`)
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

app.post('/api/agent', async (req, res) => {
  const { message, threadId } = req.body

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  const runId = `run-${Date.now()}`
  const messageId = `msg-${Date.now()}`

  // 1. Signal run started
  sendSSE(res, {
    type: 'RUN_STARTED',
    runId,
    threadId: threadId ?? 'default',
  })

  // 2. Start a text message
  sendSSE(res, {
    type: 'TEXT_MESSAGE_START',
    messageId,
    role: 'assistant',
  })

  // 3. Stream text content token by token
  const response = `You said: "${message}". This is a simulated agent response streamed via the AG-UI protocol. Each word arrives as a separate TEXT_MESSAGE_CONTENT event.`
  const words = response.split(' ')

  for (let i = 0; i < words.length; i++) {
    const token = (i === 0 ? '' : ' ') + words[i]
    sendSSE(res, {
      type: 'TEXT_MESSAGE_CONTENT',
      messageId,
      delta: token,
    })
    await sleep(50) // Simulate token-by-token streaming delay
  }

  // 4. End the text message
  sendSSE(res, {
    type: 'TEXT_MESSAGE_END',
    messageId,
  })

  // 5. Signal run finished
  sendSSE(res, {
    type: 'RUN_FINISHED',
    runId,
    threadId: threadId ?? 'default',
  })

  res.end()
})

const PORT = process.env.PORT ?? 3001

app.listen(PORT, () => {
  console.log(`AG-UI server running at http://localhost:${PORT}/api/agent`)
})
