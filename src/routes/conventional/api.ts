import plugin from "fastify-plugin"
import shortenController from "@/controllers/shorten/index"
import websocketController from "@/controllers/websocket"
import uploadController from "@/controllers/upload"

export default plugin(
  async app => {
    await app.register(shortenController, { prefix: "/api" })
    await app.register(websocketController, { prefix: "" })
    await app.register(uploadController, { prefix: "" })
    return Promise.resolve()
  },
  { name: "unautoApi" }
)
