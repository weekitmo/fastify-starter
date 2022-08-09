import type { ITapTest } from "./utils"
import { beforeEach, teardown, test } from "tap"
import { beforeEachFn, teardownFn } from "./utils"

beforeEach(beforeEachFn)
teardown(teardownFn)

// https://github.com/fastify/fastify/issues/2038
test("Basic route check", async (t: ITapTest) => {
  t.plan(2)
  const { statusCode, ...response } = await t.context.server.inject({
    url: "/user",
    method: "GET"
  })

  t.equal(statusCode, 200, "return a status code of 200")
  const body = JSON.parse(response.body) as unknown as { result: string }
  t.equal(body.result, `Hello World!`, "pass body result")
})

test("Access user ip", async (t: ITapTest) => {
  t.plan(2)
  const { statusCode, ...response } = await t.context.server.inject({
    url: "/info",
    method: "GET"
  })
  t.match(statusCode, /(200|201)/, "return a status code of 200 or 201")

  const body = JSON.parse(response.body) as unknown as { isOk: boolean; [key: string]: any }

  t.equal(body.isOk, true, "return body maybe not match")
})
