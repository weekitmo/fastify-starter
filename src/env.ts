import isDocker from "./utils/isDocker"
import path from "path"
import chalk from "chalk"
const isDock = isDocker()
import dotenv from "dotenv"

export type ICurrent = "development" | "production" | "local"
interface IConf {
  current: ICurrent
  port: number
  environment: string
  domain: string
  isDocker: boolean
}

// 加载配置文件
dotenv.config({
  path: path.join(__dirname, `../.env.server.${process.env.NODE_ENV}`)
})
console.log(chalk.magenta(`-----> [🤙 mode:${process.env.NODE_ENV}] <-----`))
const port = process.env.PORT || process.env.port
export const config: IConf = {
  current: process.env.NODE_ENV as ICurrent,
  port: isDock && process.env.NODE_ENV !== `local` ? 80 : (Number(port) as number),
  isDocker: isDock,
  domain: ``,
  environment: (process.env.environment as string) || ``
}
// u can change address to your's domain
;(function getDomain() {
  const env = process.env.NODE_ENV as ICurrent
  switch (env) {
    case "development":
      config.domain = `http://localhost:${config.port}`
      return
    case "production":
      config.domain = `http://localhost:${config.port}`
      return
    case "local":
      config.domain = `http://localhost:${config.port}`
      return
    default:
      config.domain = `http://localhost:${config.port}`
      return
  }
})()
