import fs from "fs"
import { FastifyPluginAsync } from "fastify"
import { pipeline } from "stream"
import util from "util"
const pump = util.promisify(pipeline)
interface AttachFile {
  data: Buffer
  filename: string
  encoding: string
  mimetype: string
  limit: false
}

interface RequestBody {
  key: string
  remark: string
  file: AttachFile[]
}
const controller: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{ Body: RequestBody }>(`/upload`, async (request, reply) => {
    if (!request.isMultipart()) {
      return reply.code(400).send({ error: "Request is not multipart" })
    }
    const data = await request.file()
    // stores files to tmp dir and return paths
    // tmp files cleaned up automatically
    // if use addToBody, this function will not be called
    // const files = await request.saveRequestFiles({});
    console.log(data.fields, data.fieldname, data.encoding, data.mimetype, data.file)
    try {
      await pump(data.file, fs.createWriteStream(data.filename))

      reply.code(200).send({ isOk: true, result: "Upload success" })
    } catch (error) {
      console.log(error)

      return reply.code(500).send({ isOk: false, error: `上传出错`, detail: error })
    }
  })
}

export default controller
