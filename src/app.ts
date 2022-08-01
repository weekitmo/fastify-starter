import path from "path"
import chalk from "chalk"
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload"
import { FastifyPluginAsync } from "fastify"
import cors from "@fastify/cors"
import multipart from "@fastify/multipart"
import fastifyStatic from "@fastify/static"
import cookie, { FastifyCookieOptions } from "@fastify/cookie"
import websocket from "@fastify/websocket"
import webProxy from "./proxies/web"
import { config } from "./env"
import { initRedis } from "@/modules/db/redis"
import { initMongoose } from "@/modules/db/mongo"
import { basicConf } from "@/constants/basic"
import { setupConventional } from "./routes/setup"
import swagger from "./swagger"
const join = path.join

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>

const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  await fastify.register(cors, {
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  })
  swagger(fastify)
  await initMongoose(fastify)
  const redisClient = await initRedis(fastify)

  await fastify.register(import("@fastify/rate-limit"), {
    max: 5000,
    timeWindow: 30 * 1000,
    allowList: ["localhost"],
    keyGenerator: req => {
      const realIp = req.headers["x-real-ip"] as string
      const forwardIp = req.headers["X-Forwarded-For"] as string
      let ip = realIp || forwardIp || req.ip
      return ip
    },
    redis: redisClient,
    // if redis not useful
    skipOnError: true
  })
  await fastify.register(websocket, {
    options: {
      maxPayload: 5 * 1024 * 1024,
      clientTracking: true
    }
  })

  await fastify.register(multipart, {
    limits: {
      fileSize: basicConf.upload.max
    },
    prefix: "/upload"
    // addToBody: true
  })
  await fastify.register(cookie, {
    secret: "a-fastify-secret", // for cookies signature
    parseOptions: {}
  } as FastifyCookieOptions)

  fastify.decorate("config", {
    environment: config.environment,
    current: config.current,
    port: config.port,
    domain: config.domain
  })
  console.log(chalk.green(`👏 Start config: 👇👇👇 \n`))
  console.table(config)
  console.log()
  fastify.addHook("onResponse", (request, reply, next) => {
    reply.header("x-server-engine", "fastify")
    next()
  })
  await fastify.register(fastifyStatic, {
    root: path.join(__dirname, `../public/`),
    prefix: "/site",
    logLevel: "error",
    cacheControl: true,
    // https://www.npmjs.com/package/ms#readme
    maxAge: "1h",
    lastModified: true,
    acceptRanges: true
  })

  await setupConventional(fastify)

  await fastify.register(webProxy)

  await fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts
  })

  await fastify.register(AutoLoad, {
    dir: join(__dirname, "routes/auto"),
    options: opts
  })

  fastify.swagger()

  return Promise.resolve()
}

export default app
export { app }
