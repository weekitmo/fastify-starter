import { FastifyRequest } from "fastify"
interface Generic {
  [prop: string]: any
}

export const performCheck = <T extends Generic>(
  request: FastifyRequest,
  type: "query" | "body" | "headers",
  requireds: Array<keyof T>,
  strategy = [undefined, null, ""]
) => {
  const data: T = request[type] as unknown as T
  const inValid = requireds.some(item => {
    if (!data || (data && strategy.includes(data[item]))) {
      return true
    } else {
      return false
    }
  })
  return inValid
}
