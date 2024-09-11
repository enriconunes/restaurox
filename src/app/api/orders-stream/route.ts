// app/api/orders-stream/route.ts
import { NextResponse } from 'next/server'

interface Client {
  controller: ReadableStreamDefaultController;
  lastPing: number;
}

let clients = new Set<Client>()

function removeStaleClients() {
  const now = Date.now()
  clients.forEach(client => {
    if (now - client.lastPing > 60000) { // Remove clients inactive for more than a minute
      clients.delete(client)
    }
  })
}

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const client: Client = {
        controller,
        lastPing: Date.now()
      }
      clients.add(client)

      const interval = setInterval(() => {
        removeStaleClients()
        try {
          controller.enqueue('data: ping\n\n')
          client.lastPing = Date.now()
        } catch (error) {
          clearInterval(interval)
          clients.delete(client)
        }
      }, 30000)

      return () => {
        clearInterval(interval)
        clients.delete(client)
      }
    },
    cancel() {
      const firstClient = Array.from(clients)[0]
      if (firstClient) {
        clients.delete(firstClient)
      }
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

export async function POST(request: Request) {
  const newOrder = await request.json()
  removeStaleClients()
  clients.forEach(client => {
    try {
      client.controller.enqueue(`data: ${JSON.stringify(newOrder)}\n\n`)
    } catch (error) {
      clients.delete(client)
    }
  })
  return NextResponse.json({ success: true })
}