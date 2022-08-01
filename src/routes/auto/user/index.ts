import { FastifyPluginAsync } from "fastify"
import plugin from "fastify-plugin"
import { client, isReady } from "@/modules/db/redis"

const cacheKey = `ip-cache`
const user: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/user", async function (request, reply) {
    return reply.code(200).send({ result: "Hello World!" })
  })
  fastify.get<{ Params: { search: string } }>("/user/:search", async (request, reply) => {
    // ip maybe like 218.4.167.70
    const ip = request.params.search
    if (!ip) {
      return reply.forbidden(`Not found ip address~`)
    }

    let cache = ``
    try {
      if (isReady()) {
        cache = (await client.get(`${cacheKey}:${ip}`)) || ``
        if (cache) return reply.code(201).send(JSON.parse(cache))
      }
    } catch (error) {
      return reply.code(500).send({ error: "redis error" })
    }

    try {
      // 查询
      const data = await fastify.searcher.search(ip)
      await client
        .pipeline()
        .set(`${cacheKey}:${ip}`, JSON.stringify(data))
        .pexpire(`${cacheKey}:${ip}`, 30 * 1000)
        .exec()
      // data: {region: '中国|0|江苏省|苏州市|电信', ioCount: 3, took: 1.342389}
      return reply.code(200).send(data)
    } catch (e) {
      console.error(e)
      return reply.badRequest(`Error in search~`)
    }
  })
}

export default plugin(user, { name: "user" })
