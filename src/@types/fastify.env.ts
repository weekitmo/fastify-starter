import type { ICurrent } from "@/env"
import { Searcher } from "@/utils/search"
declare module "fastify" {
  export interface FastifyInstance {
    config: {
      environment: string
      current: ICurrent
      port: number
      domain: string
    }
    searcher: InstanceType<typeof Searcher>
  }

  export interface WebSocket {
    uid: string
  }
}
