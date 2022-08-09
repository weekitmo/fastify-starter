import { Transform } from "stream"
import { IncomingMessage, OutgoingHttpHeaders } from "http"
import type { EventMessage } from "@/@types/sse"

function dataString(data: string | object): string {
  if (typeof data === "object") return dataString(JSON.stringify(data))
  return data
    .split(/\r\n|\r|\n/)
    .map(line => `data: ${line}\n`)
    .join("")
}

interface WriteHeaders {
  writeHead?(statusCode: number, headers?: OutgoingHttpHeaders): WriteHeaders
  flushHeaders?(): void
}

export type HeaderStream = NodeJS.WritableStream & WriteHeaders

export default class SseStream extends Transform {
  constructor(req?: IncomingMessage) {
    super({ objectMode: true })
    if (req) {
      req.socket.setKeepAlive(true)
      req.socket.setNoDelay(true)
      req.socket.setTimeout(0)
    }
  }

  pipe<T extends HeaderStream>(destination: T, options?: { end?: boolean }): T {
    if (destination.writeHead) {
      destination.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Transfer-Encoding": "identity",
        "Cache-Control": "no-cache",
        // if config nginx
        // https://segmentfault.com/a/1190000005912198
        "X-Accel-Buffering": "no",
        Connection: "keep-alive"
      })
      destination.flushHeaders?.()
    }
    // (Safari) don't trigger onopen until the first frame is received.
    destination.write(":ok\n\n")
    return super.pipe(destination, options)
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format
  // https://stackoverflow.com/questions/31700336/server-sent-event-eventsource-with-node-js-express
  // https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html
  _transform(message: EventMessage, encoding: string, callback: (error?: Error | null, data?: any) => void) {
    if (message.comment) this.push(`: ${message.comment}\n`)
    if (message.event) this.push(`event: ${message.event}\n`)
    if (message.id) this.push(`id: ${message.id}\n`)
    if (message.retry) this.push(`retry: ${message.retry}\n`)
    if (message.data) this.push(dataString(message.data))
    this.push("\n")
    callback()
  }

  writeMessage(
    message: EventMessage,
    encoding?: BufferEncoding,
    cb?: (error: Error | null | undefined) => void
  ): boolean {
    return this.write(message, encoding, cb)
  }
}

export function serializeSSEEvent(chunk: EventMessage): string {
  let payload = ""
  if (chunk.id) {
    payload += `id: ${chunk.id}\n`
  }
  if (chunk.event) {
    payload += `event: ${chunk.event}\n`
  }
  if (chunk.data) {
    payload += `data: ${chunk.data}\n`
  }
  if (chunk.retry) {
    payload += `retry: ${chunk.retry}\n`
  }
  if (!payload) {
    return ""
  }
  payload += "\n"
  return payload
}
