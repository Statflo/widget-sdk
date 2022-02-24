import { WidgetMethods } from "../shared"

import { onContainerMessage } from "./misc"


describe("onContainerMessage", () => {
  it("should call callback on valid method", () => {
    let result = null
    const cb = (e: any) => {
      result = e
    }

    const onMessage = onContainerMessage(cb)

    const event = {
      method: WidgetMethods.post,
      name: "someName",
      id: "someId",
      payload: "somePayload"
    }

    onMessage({ data: event } as any)

    expect(result).toEqual(event)
  })

  it("should not call callback on valid method", () => {
    let result = null
    const cb = (e: any) => {
      result = e
    }

    const onMessage = onContainerMessage(cb)

    const event = {
      method: "unkown method",
      name: "someName",
      id: "someId",
      payload: "somePayload"
    }

    onMessage({ data: event } as any)

    expect(result).toEqual(null)
  })
})