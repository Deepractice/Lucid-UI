# AG-UI Protocol Agent + UIX

A chat application using the AG-UI (Agent-UI) protocol for server-sent event streaming, with UIX rendering the interface.

AG-UI is an open protocol for agent-to-UI communication via Server-Sent Events. This example demonstrates a minimal AG-UI server and a React frontend that connects to it using UIX.

## Prerequisites

- Node.js 18+

## Setup

```bash
# Install dependencies
npm install express cors @uix-ai/agent @uix-ai/adapter-agui @uix-ai/core react react-dom
npm install -D typescript @types/express @types/cors @types/react @types/react-dom tsx
```

## Project Structure

```
server.ts   # AG-UI SSE server (Express)
app.tsx     # React chat UI
```

## Step 1: Create the AG-UI Server

The server (`server.ts`) is an Express application that:
1. Accepts POST requests with a user message
2. Returns a Server-Sent Events stream
3. Emits AG-UI protocol events: `RUN_STARTED`, `TEXT_MESSAGE_START`, `TEXT_MESSAGE_CONTENT`, `TEXT_MESSAGE_END`, `RUN_FINISHED`

See `server.ts` for the full implementation.

## Step 2: Create the Chat UI

The React app (`app.tsx`) uses:
- `useAGUI` from `@uix-ai/adapter-agui/react` to connect to the SSE endpoint
- `AgentChat` from `@uix-ai/agent` to render the conversation

See `app.tsx` for the full implementation.

## AG-UI Event Flow

```
Client                    Server
  |                         |
  |-- POST /api/agent ----->|
  |                         |
  |<-- RUN_STARTED ---------|
  |<-- TEXT_MESSAGE_START ---|
  |<-- TEXT_MESSAGE_CONTENT -|  (repeated, one per token)
  |<-- TEXT_MESSAGE_CONTENT -|
  |<-- TEXT_MESSAGE_END -----|
  |<-- RUN_FINISHED --------|
  |                         |
```

## Running

```bash
# Start the AG-UI server
npx tsx server.ts

# In another terminal, start your React app (e.g., with Vite)
npm run dev
```

The server runs on `http://localhost:3001/api/agent` by default.
