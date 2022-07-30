import { FastifyPluginAsync } from "fastify"
import plugin from "fastify-plugin"
import { join } from "path"
import Searcher from "@/utils/search"
const dbPath = join(__dirname, "../../../../public/ip2region.xdb")

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
    try {
      // 创建searcher对象
      const searcher = Searcher.newWithFileOnly(dbPath)
      // 查询
      const data = await searcher.search(ip)
      // data: {region: '中国|0|江苏省|苏州市|电信', ioCount: 3, took: 1.342389}
      return reply.code(200).send(data)
    } catch (e) {
      console.error(e)
      return reply.badRequest(`Error in search~`)
    }
  })
}

export default plugin(user, { name: "user" })
