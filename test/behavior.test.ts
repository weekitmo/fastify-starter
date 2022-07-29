import type { ITapTest } from "./utils"
import { beforeEach, teardown, test } from "tap"
import { beforeEachFn, teardownFn } from "./utils"

beforeEach(beforeEachFn)
teardown(teardownFn)

test("Basic route check", async (t: ITapTest) => {
  const { statusCode, ...response } = await t.context.server.inject({
    url: "/user",
    method: "GET"
  })

  t.equal(statusCode, 200, "return a status code of 200")
  const body = JSON.parse(response.body) as unknown as { result: string }
  console.log(`----> `, body.result)
  t.equal(body.result, `Hello World!`, "return body maybe not match")
})
