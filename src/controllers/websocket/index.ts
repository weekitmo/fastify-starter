import { FastifyPluginAsync } from "fastify"
import chalk from "chalk"
import { v4 as uuidv4 } from "uuid"
import * as WebSocket from "ws"
const _prefix = `/ws`
const history: string[] = []
const controller: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  function sendMessage(socket: WebSocket, message: any) {
    socket.send(JSON.stringify(message))
  }

  function broadcast(clients: Set<WebSocket.WebSocket>, message: string, save?: boolean) {
    for (const client of clients) {
      client.send(message)
    }

    if (save) {
      history.push(message)
    }
  }

  fastify.get(`${_prefix}/connect`, { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
    connection.socket.on("message", (message: any) => {
      console.log(chalk.magenta(`💬 Received message from client: ${message.toString()}`))
      connection.socket.send("hi client, i'm from server")
    })
  })

  fastify.get(`${_prefix}/chat`, { websocket: true }, (connection, req) => {
    const { socket } = connection
    const sk = socket as any
    if (!sk.uid) sk.uid = uuidv4()

    const server = fastify.websocketServer

    // new client connect broadcast current online & send history
    const onlineEvent = JSON.stringify({
      type: "count",
      data: server.clients.size
    })
    history.map(msg => socket.send(msg))

    broadcast(server.clients, onlineEvent, false)

    socket.on("message", function (message: any) {
      console.log(chalk.red(sk.uid))
      try {
        const json = JSON.parse(message.toString())
        switch (json.type) {
          case "message":
            {
              const messageEvent = JSON.stringify({
                type: "accepted",
                data: `${new Date().toISOString()}: ${json.data}`
              })

              // broadcast to all clients
              fastify.log.info("---> broadcasting to all clients")
              broadcast(server.clients, messageEvent, true)
            }
            break

          default:
            sendMessage(socket, { type: "error", data: "wrong type" })
            break
        }
      } catch (error) {
        const err = error as unknown as any
        sendMessage(socket, { type: "error", data: err?.message })
      }
    })
  })
}

export default controller
