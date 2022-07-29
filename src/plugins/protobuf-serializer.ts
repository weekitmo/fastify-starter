import fp from "fastify-plugin"
import path from "path"
const packageProtoFilepath = path.join(__dirname, "../../public/protos/", "msg.proto")
// https://www.fastify.io/docs/latest/Reference/TypeScript/
import { FastifyPluginCallback } from "fastify"
import protobufjs from "protobufjs"
export interface ProtobufPluginOptions {
  protoloadPath: string
  messagePackage: string
}
const protobufjsSerializerPlugin: FastifyPluginCallback<ProtobufPluginOptions> = (fastify, options, next) => {
  const { protoloadPath, messagePackage } = options
  const root = protobufjs.loadSync(protoloadPath)
  const Package = root.lookupType(messagePackage)

  fastify.register(require("@fastify/accepts-serializer"), {
    serializers: [
      {
        regex: /^application\/x-protobuf$/,
        serializer: (body: any) => {
          const errmsg = Package.verify(body)
          if (errmsg) {
            throw Error(errmsg)
          }
          return Package.encode(Package.create(body)).finish()
        }
      }
    ],
    default: "application/json"
  })

  fastify.addContentTypeParser(
    "application/x-protobuf",
    {
      parseAs: "buffer"
    },
    async (req, body, done) => {
      try {
        const res = Package.decode(body as Buffer)
        return res
      } catch (err) {
        if (err instanceof protobufjs.util.ProtocolError) {
          console.error(`ProtocolError: `, err)
        }
        done(err as any)
      }
    }
  )

  next()
}
export default fp(protobufjsSerializerPlugin, {
  fastify: ">=3.x",
  name: "fastify-protobufjs-serializer"
})

export const autoConfig = {
  protoloadPath: packageProtoFilepath,
  messagePackage: "ns.AwesomeMessage"
}
