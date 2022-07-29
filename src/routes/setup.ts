import { FastifyInstance } from "fastify"

import root from "./conventional/root"
import api from "./conventional/api"

export const setupConventional = async (fastify: FastifyInstance) => {
  await fastify.register(root)
  await fastify.register(api)
}
