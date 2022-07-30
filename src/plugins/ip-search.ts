import fp from "fastify-plugin"
import { join } from "path"
import Searcher from "@/utils/search"
const dbPath = join(__dirname, "../../public/ip2region.xdb")
// 创建searcher对象
export const searcher = Searcher.newWithFileOnly(dbPath)

export default fp(async (fastify, opts = { name: "ipSearch" }) => {
  await fastify.decorate("searcher", searcher)
})
