import { FastifyPluginAsync, RouteHandlerMethod } from "fastify"
import { isWebUri } from "valid-url"
import { ShortIdModel } from "@/modules/mongo/shorten"
import shortId from "shortid"

export type ShortenParam = {
  code: string
}

const limitKey = `appSecret`

const controller: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  function _useBasicUrl(code: string) {
    return `${fastify.config.domain}/st/${code}`
  }
  fastify.post<{ Body: { originUrl: string; key: string } }>(`/shorten`, async function (request, reply) {
    const { originUrl, key } = request.body
    if (key !== limitKey) return reply.code(403).send({ isOk: false, status: "key error" })

    if (isWebUri(originUrl)) {
      try {
        let url = await ShortIdModel.findOne({ originUrl, active: true }, { _id: 0, isLocked: 0 })
        if (url) {
          return reply.code(200).send({
            isOk: true,
            result: _useBasicUrl(url.code)
          })
        } else {
          const urlCode = shortId.generate()
          const raw = new ShortIdModel({
            code: urlCode,
            originUrl
          })
          await raw.save()
          return reply.code(201).send({
            isOk: true,
            result: _useBasicUrl(urlCode)
          })
        }
      } catch (error) {
        return reply.code(500).send("Server error")
      }
    } else {
      return reply.code(400).send("Invalid url")
    }
  })
}

export const parseShortId: RouteHandlerMethod = async function (request, reply) {
  try {
    const code = (request.params as ShortenParam).code
    const raw = await ShortIdModel.findOne({ code }, { _id: 0, isLocked: 0 })
    if (raw) {
      // 重定向至原链接
      return reply.redirect(raw.originUrl)
    } else {
      return reply.code(404).send({ isOk: false, result: null })
    }
  } catch (error) {
    return reply.code(500).send("Server error")
  }
}

export default controller
