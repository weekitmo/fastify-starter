import { FastifyPluginAsync } from "fastify"
import { v4 as uuidv4 } from "uuid"
import * as WebSocket from "ws"
import { SocketMsgType, DefUidSocket, MessageEvent, MsgType } from "./type"
import { client as redis, isReady } from "@/modules/db/redis"
import { Emiter, emitEvent, pubSse } from "@/utils/emiter"

const _wsPrefix = `/ws`
const _ssePrefix = `/sse`
const _cacheKey = `ws-history-list`
const limit = 500
const controller: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  function broadcast(clients: Set<WebSocket.WebSocket>, message: string, save?: boolean) {
    for (const client of clients) {
      client.send(message)
    }

    if (save && isReady()) {
      redis.pipeline().rpush(`${_cacheKey}`, message).ltrim(`${_cacheKey}`, -limit, -1).exec()
    }
  }

  function serialization(type: keyof typeof SocketMsgType, data: any) {
    const msg: MessageEvent = {
      type: type,
      data: data,
      date: new Date().toUTCString()
    }
    const messageEvent = JSON.stringify(msg)

    return messageEvent
  }

  fastify.get<{ Params: { uid?: string } }>(
    `${_wsPrefix}/cooperate/:uid?`,
    { websocket: true },
    async (connection, req) => {
      const { socket } = connection
      const sk = socket as DefUidSocket
      // first connect
      if (!sk.uid) {
        sk.uid = req.params.uid || uuidv4()
      }

      const server = fastify.websocketServer

      // new client connect broadcast current online & send history
      const onlineEvent = serialization(SocketMsgType.notify, { category: "online", value: server.clients.size })
      broadcast(server.clients, onlineEvent, false)
      const records = await redis.lrange(`${_cacheKey}`, 0, -1)
      records.map(msg => socket.send(msg))
      const identifyEvent = serialization(SocketMsgType.notify, { category: "identify", value: sk.uid })
      socket.send(identifyEvent)

      socket.on("message", function (message: string) {
        try {
          // send ping/pong
          const msg = message.toString()
          if (typeof msg === "string" && msg === "0x9") {
            socket.send("0xA")
            return
          }
          const json = JSON.parse(msg) as MessageEvent
          switch (json.type) {
            case SocketMsgType.message:
              {
                const source = serialization(SocketMsgType.message, {
                  category: MsgType.text,
                  value: json.data,
                  identify: sk.uid
                })
                // broadcast to all clients
                broadcast(server.clients, source, true)
              }
              break
            case SocketMsgType.cooperate:
              {
                const source = serialization(SocketMsgType.cooperate, {
                  category: MsgType.text,
                  value: json.data,
                  identify: sk.uid
                })
                // broadcast to all clients
                broadcast(server.clients, source, false)
              }
              break

            default:
              socket.send(serialization(SocketMsgType.error, { category: "error", value: `unknown type` }))

              break
          }
        } catch (error) {
          const err = error as unknown as any
          socket.send(serialization(SocketMsgType.error, { category: "error", value: err?.message || null }))
        }
      })
    }
  )

  function getServerSentEventConnected() {
    return `data:${JSON.stringify({ status: `connected` })}\n\n`
  }

  // sse
  fastify.get<{ Params: { identify: string } }>(`${_ssePrefix}/notify/:identify`, async (request, reply) => {
    const { identify } = request.params
    if (!identify) {
      return reply.send({ isOk: false, result: `Forbid access` })
    }

    const sseEmit = new Emiter(identify)

    sseEmit.register(request.raw, reply.raw)

    reply.raw.write(getServerSentEventConnected())
  })

  // sse visit
  fastify.post<{ Params: { identify: string } }>(`${_ssePrefix}/visit/:identify`, async (request, reply) => {
    const { identify } = request.params
    if (!identify) {
      return reply.send({ isOk: false, result: `Forbid access` })
    }

    // event must be message & client will recieve it
    emitEvent(identify, {
      event: "message",
      data: JSON.stringify({
        time: new Date().getTime(),
        id: identify,
        online: pubSse.size()
      })
    })

    return reply.code(200).send({ isOk: true })
  })
}

export default controller
