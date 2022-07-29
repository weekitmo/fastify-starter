import { config } from "@/env"
const env = config.current
export const DbName = `fastify-api-db`
export const connectTimeoutMS = 10000

// in docker-compose should connect to mongo:port
const prodUri = `mongodb://localhost:27017`
const devUri = `mongodb://localhost:27017`

export const getMongoUri = (): string => {
  let uri = devUri
  switch (env) {
    case "local":
      uri = devUri
      break
    case "development":
      uri = devUri
      break
    case "production":
      uri = prodUri
      break
  }

  if (config.isDocker) {
    return uri.replace("localhost:", "mongo:")
  }
  return uri
}
