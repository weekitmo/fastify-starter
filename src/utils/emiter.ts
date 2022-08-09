import chalk from "chalk"
import { IncomingMessage, ServerResponse } from "http"
import SseStream from "./stream"
import { EventMessage } from "@/@types/sse"

interface GenericType {
  [key: string]: any
}

type FunctionLiker = (...args: any[]) => any

export class Pub {
  private _events: GenericType
  constructor() {
    // 缓存队列
    this._events = {}
  }

  size() {
    return Object.keys(this._events).length
  }

  toString() {
    return `Pub: ${Object.keys(this._events).join(", ")}`
  }

  subscribe(id: string, callback: FunctionLiker) {
    if (this._events[id]) {
      this._events[id].push(callback)
    } else {
      this._events[id] = [callback]
    }
  }

  publish(id: string, ...args: any[]) {
    const callbacks = this._events[id]
    if (callbacks && callbacks.length) {
      callbacks.forEach((callback: FunctionLiker) => {
        callback.call(this, ...args)
      })
    }
  }

  unsubscribe(id: string) {
    this._events[id] = null
    delete this._events[id]
  }
}

export const pubSse = new Pub()

export class Emiter {
  id: string
  verb: boolean
  constructor(id: string, verb = true) {
    this.id = id
    this.verb = verb
  }

  register(req: IncomingMessage, res: ServerResponse) {
    const sse = new SseStream(req)
    sse.pipe(res)

    pubSse.subscribe(this.id, (payload: EventMessage) => {
      sse.writeMessage(payload)
    })

    res.on("close", () => {
      this.verb && console.log(chalk.red(`client[${this.id}] disconnected`))
      sse.unpipe(res)
      pubSse.unsubscribe(this.id)
    })
  }

  emit(payload: EventMessage) {
    emitEvent(this.id, payload)
  }
}

export function emitEvent(id: string, payload: EventMessage) {
  pubSse.publish(id, payload)
}
