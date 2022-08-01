import { FastifyPluginAsync } from "fastify"
import plugin from "fastify-plugin"
import WhichBrowser from "which-browser"
import { parseShortId, ShortenParam } from "@/controllers/shorten"
import websocketController from "@/controllers/websocket"
import uploadController from "@/controllers/upload"
const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return reply.code(206).send("")
  })
  fastify.get("/next", async function (request, reply) {
    const source = (request.headers["user-agent"] as string) || ""

    const ua = new WhichBrowser(source, { detectBots: true })

    return ua.toString()
  })
  fastify.get<{ Params: ShortenParam }>("/st/:code", parseShortId)
  fastify.register(websocketController)
  fastify.register(uploadController)
}

export default plugin(root, { name: "root" })
