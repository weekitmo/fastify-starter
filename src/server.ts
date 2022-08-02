import Fastify from "fastify"
import { config } from "./env"
import chalk from "chalk"
import { join } from "path"
import fastifyApp from "./app"
import { connectTimeoutMS } from "./constants/mongo"
import { readFileSync, existsSync } from "fs"

const certPem = join(__dirname, "../localhost+2.pem")
const keyPem = join(__dirname, "../localhost+2-key.pem")
const isUseSSL = existsSync(certPem) && existsSync(keyPem)
const scheme = isUseSSL ? `https` : `http`
const opt = isUseSSL
  ? {
      https: {
        cert: readFileSync(certPem),
        key: readFileSync(keyPem)
      }
    }
  : {}
const app = Fastify({
  logger: config.current !== "production",
  pluginTimeout: connectTimeoutMS,
  ...opt
})

async function main() {
  await app.register(fastifyApp)

  process.on("unhandledRejection", err => {
    console.error(chalk.red(`[💢 UnhandledRejection] --> \n`), err)
    console.log()
  })

  // Start listening.
  app
    .listen({ port: Number(config.port ?? 4002), host: "0.0.0.0" })
    .then(() => {
      console.log(chalk.underline.green(`Fastify Listening on ${scheme}://127.0.0.1:${config.port}`))
    })
    .catch(err => {
      console.error(chalk.red(`[💢 Catch on listen] --> \n`), err)
      console.log()
    })
}

main()
