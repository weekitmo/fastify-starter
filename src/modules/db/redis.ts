import Redis from "ioredis"
import { getUrl } from "@/constants/redis"
import { connectTimeoutMS } from "@/constants/redis"
import { config } from "@/env"
import { FastifyInstance } from "fastify"
const env = config.current

const maxRetry = 5
export const client: Redis = new Redis(getUrl(), {
  connectTimeout: connectTimeoutMS,
  lazyConnect: true,
  maxRetriesPerRequest: maxRetry,
  retryStrategy(times) {
    console.warn(`Retrying redis connection: attempt ${times}`)
    if (times > maxRetry) {
      console.log(`lost connection and exhausted attempts : ${times}`)
      // End reconnecting with built in error
      closeRedisConnection()
      return undefined
    }
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
  try {
    await client.connect()
  } catch (error) {}

  fastify.addHook("onClose", async () => {
    Log("[🫵 redis will disconnect]")
    await closeRedisConnection()
  })
  return client
}
client.on("ready", function () {
  Log(`redis ready...`)
})

client.on("connect", function () {
  Log(`redis connect...`)
})

client.on("reconnecting", function () {
  Log("redis reconnecting...")
})

client.on("end", function () {
  Log("established Redis server connection has closed")
})

client.on("error", function (err) {
  Log(err)
})
