import { config } from "@/env"
const env = config.current

export const PORT = env === "production" ? 6379 : 6379

export const HOST = env === "production" ? `localhost` : `localhost`

// in docker
export const getUrl = () => (config.isDocker ? `redis:${PORT}` : `redis://${HOST}:${PORT}`)
