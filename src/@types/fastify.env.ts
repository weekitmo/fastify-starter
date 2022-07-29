import type { ICurrent } from "@/env"
declare module "fastify" {
  export interface FastifyInstance {
    config: {
      environment: string
      current: ICurrent
      port: number
      domain: string
    }
  }
}
