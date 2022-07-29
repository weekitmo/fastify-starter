import type { FastifyInstance } from "fastify"
import Fastify from "fastify"
import type { Test } from "tap"
import { app } from "../src/app"

type TTapTest = typeof Test.prototype

export interface ITapContext {
  server: FastifyInstance
}
export interface ITapTest extends TTapTest {
  context: ITapContext
}

export const context: Partial<ITapContext> = {}

export const beforeEachFn = async (t: ITapTest) => {
  const instance = Fastify({
    logger: true,
    pluginTimeout: 10 * 1000
  })

  await instance.register(app)

  context.server = instance

  t.context = context as ITapContext
}

export const teardownFn = async () => {
  await context?.server?.close()
}
