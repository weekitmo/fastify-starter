import fastifySwagger from "@fastify/swagger"
import chalk from "chalk"
import { FastifyInstance } from "fastify"
export default function initSwagger(fastify: FastifyInstance) {
  fastify.register(fastifySwagger, {
    routePrefix: "/docs",
    swagger: {
      info: {
        title: "fastify api docs",
        description: "powerby @fastify/swagger",
        version: "1.0.1"
      },
      externalDocs: {
        url: "",
        description: ""
      },
      host: "localhost",
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"]
    },
    uiConfig: {
      docExpansion: "full",
      deepLinking: false
    },
    exposeRoute: true
  })
  console.log(chalk.green(`🎉 --- swagger docs registried ---`))
}
