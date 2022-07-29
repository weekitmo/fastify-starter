import plugin from "fastify-plugin"

import shortenController from "@/controllers/shorten/index"

export default plugin(
  async app => {
    await app.register(shortenController, { prefix: "/api" })
    return Promise.resolve()
  },
  { name: "unautoApi" }
)
