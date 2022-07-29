import { connectTimeoutMS, getMongoUri } from "@/constants/mongo"
import { config } from "@/env"
import chalk from "chalk"
import { FastifyInstance } from "fastify"
import mongoose from "mongoose"

// https://stackoverflow.com/questions/67390730/mongodb-with-mongoose-is-using-wrong-database
export async function initMongoose(fastify: FastifyInstance) {
  const uri = getMongoUri()

  try {
    await mongoose.connect(`${getMongoUri()}`, { connectTimeoutMS: connectTimeoutMS })

    console.log(`Connected successfully to mongodb(${uri}) in mode: ${config.current}`)
  } catch (error) {
    console.error(chalk(`💔 Connect mongo db failure`), error)
  }

  fastify.addHook("onClose", async () => {
    console.log("[🫵 mongodb will disconnect]")
    await closeDatabase()
  })
  return Promise.resolve()
}

export async function closeDatabase() {
  await mongoose.disconnect()
}
