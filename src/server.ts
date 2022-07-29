import Fastify from "fastify"
import { config } from "./env"
import chalk from "chalk"
import fastifyApp from "./app"
import { connectTimeoutMS } from "./constants/mongo"
const app = Fastify({
  logger: config.current !== "production",
  pluginTimeout: connectTimeoutMS
})

async function main() {
  await app.register(fastifyApp)

  process.on("unhandledRejection", err => {
    console.error(chalk.red(`[💢 UnhandledRejection] --> \n`), err)
    console.log()
  })

  // Start listening.
  app
    .listen({ port: Number(config.port ?? 3888), host: "0.0.0.0" })
    .then(() => {
      console.log(chalk.underline.green(`Fastify Listening on http://127.0.0.1:${config.port}`))
    })
    .catch(err => {
      console.error(chalk.red(`[💢 Catch on listen] --> \n`), err)
      console.log()
    })
}

main()
