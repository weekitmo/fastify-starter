import { FastifyPluginAsync } from "fastify"
import { v4 as uuidv4 } from "uuid"
import * as WebSocket from "ws"
import { SocketDataEnum, DefUidSocket, MessageEvent } from "./type"
import { client as redis, isReady } from "@/modules/db/redis"

const _prefix = `/ws`
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

  function serialization(type: keyof typeof SocketDataEnum, data: any) {
    const msg: MessageEvent = {
      type: type,
      data: data,
      date: new Date().toUTCString()
    }
    const messageEvent = JSON.stringify(msg)

    return messageEvent
  }

  fastify.get(`${_prefix}/cooperate`, { websocket: true }, async (connection, req) => {
    const { socket } = connection
    const sk = socket as DefUidSocket
    // first connect
    if (!sk.uid) sk.uid = uuidv4()

    const server = fastify.websocketServer

    // new client connect broadcast current online & send history
    const onlineEvent = serialization(SocketDataEnum.notify, { category: "online", value: server.clients.size })
    broadcast(server.clients, onlineEvent, false)
    const records = await redis.lrange(`${_cacheKey}`, 0, -1)
    records.map(msg => socket.send(msg))
    const identifyEvent = serialization(SocketDataEnum.notify, { category: "identify", value: sk.uid })
    socket.send(identifyEvent)

    socket.on("message", function (message: string) {
      try {
        const json = JSON.parse(message.toString()) as MessageEvent
        switch (json.type) {
          case SocketDataEnum.message:
            {
              const source = serialization(SocketDataEnum.message, {
                category: "text",
                value: json.data,
                identify: sk.uid
              })
              // broadcast to all clients
              broadcast(server.clients, source, true)
            }
            break
          case SocketDataEnum.cooperate:
            {
              const source = serialization(SocketDataEnum.cooperate, {
                category: "text",
                value: json.data,
                identify: sk.uid
              })
              // broadcast to all clients
              broadcast(server.clients, source, false)
            }
            break
          case SocketDataEnum.pingpong:
            socket.send(serialization(SocketDataEnum.pingpong, { category: "text", value: `pong` }))

            break
          default:
            socket.send(serialization(SocketDataEnum.error, { category: "error", value: `unknown type` }))

            break
        }
      } catch (error) {
        const err = error as unknown as any
        socket.send(serialization(SocketDataEnum.error, { category: "error", value: err?.message || null }))
      }
    })
  })
}

export default controller
