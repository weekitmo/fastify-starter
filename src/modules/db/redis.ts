import Redis from "ioredis"
import { getUrl } from "@/constants/redis"
import { connectTimeoutMS } from "@/constants/mongo"
import { config } from "@/env"
import { FastifyInstance } from "fastify"
const env = config.current

let _isReady = false
export const client: Redis = new Redis(getUrl(), {
  connectTimeout: connectTimeoutMS,
  lazyConnect: true,
  maxRetriesPerRequest: 20,
  retryStrategy(times) {
    console.warn(`Retrying redis connection: attempt ${times}`)
    let delay = Math.min(times * 100, 3000)
    return delay
  }
})
export const isReady = () => client && client.status === "ready"

export const closeRedisConnection = async () => {
  if (client && client.quit) {
    await client.quit()
  } else {
    return Promise.resolve()
  }
}

const Log = (...text: any[]) => {
  text.unshift(`[${env === "production" ? "正式环境" : "测试环境"}]`)
  console.log.apply(null, text)
}
// https://github.com/luin/ioredis/blob/9e6db7d7fc769ddc99d9dee4a943f141d71c0756/lib/Redis.ts#L37
export async function initRedis(fastify: FastifyInstance): Promise<Redis> {
  Log(`redis will connect to ${getUrl()}`)
  await client.connect()

  fastify.addHook("onClose", async () => {
    Log("[🫵 redis will disconnect]")
    await closeRedisConnection()
  })
  return client
}
client.on("ready", function () {
  Log(`redis ready...`)
  _isReady = true
})

client.on("connect", function () {
  Log(`redis connect...`)
  _isReady = false
})

client.on("reconnecting", function () {
  Log("redis reconnecting...")
  _isReady = false
})

client.on("end", function () {
  Log("established Redis server connection has closed")
  _isReady = false
})

client.on("error", function (err) {
  _isReady = false
  Log(err)
})
