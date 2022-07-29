import fp from "fastify-plugin"
import fastifyProxy from "@fastify/http-proxy"

export default fp(async (fastify, opts) => {
  const upstream = "https://www.bilibili.com"
  await fastify.register(fastifyProxy, {
    upstream: upstream,
    httpMethods: ["GET"],
    prefix: "/bilibili",
    rewritePrefix: "/bilibili",
    http2: true
  })
}, {})
