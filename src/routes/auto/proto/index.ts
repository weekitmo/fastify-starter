import { FastifyPluginAsync } from "fastify"

const proto: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // get /proto/encode
  fastify.get(
    "/encode",
    {
      schema: {
        description: "This is an endpoint for fetching all products",
        tags: ["user"],
        response: {
          200: {
            description: "Success Response",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "number" },
                category: { type: "string" },
                title: { type: "string" },
                price: { type: "number" }
              }
            }
          }
        }
      }
    },
    async function (request, reply) {
      reply.send({
        name: "binari-encodings",
        private: true,
        version: "1.0.0",
        licence: "MIT",
        value: 43,
        awesome_field: "awesome-test"
      })
    }
  )
  // post /proto/decode
  fastify.post("/decode", async function (request, reply) {
    // http POST http://localhost:5000/proto/decode Accept:application/x-protobuf Content-Type:application/x-protobuf @grpc\package-protobuf.dat
    const body = request.body
    return body
  })
}

export default proto
