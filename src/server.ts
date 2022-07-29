import Fastify from "fastify"
import { config } from "./env"
import chalk from "chalk"
import { join } from "path"
import fastifyApp from "./app"
import { connectTimeoutMS } from "./constants/mongo"
import { readFileSync } from "fs"

const app = Fastify({
  logger: config.current !== "production",
  pluginTimeout: connectTimeoutMS,
  // http2: true,
  https: {
    cert: readFileSync(join(__dirname, "../localhost+2.pem")),
    key: readFileSync(join(__dirname, "../localhost+2-key.pem"))
  }
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
      console.log(chalk.underline.green(`Fastify Listening on https://127.0.0.1:${config.port}`))
    })
    .catch(err => {
      console.error(chalk.red(`[💢 Catch on listen] --> \n`), err)
      console.log()
    })
}

main()
