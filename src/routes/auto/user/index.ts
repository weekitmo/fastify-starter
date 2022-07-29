import { FastifyPluginAsync } from "fastify"
import plugin from "fastify-plugin"

const user: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/user", async function (request, reply) {
    return reply.code(200).send("Hello World!")
  })
}

export default plugin(user, { name: "user" })
