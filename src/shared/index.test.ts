import { createWidgetObj } from "."

describe("createWidgetObj", () => {
  it("should create a writable widget state", () => {
      const startingState = {
        prop1: "val1",
        prop2: "val2"
      }

      const result = createWidgetObj(startingState) as any

      expect(result).toEqual(startingState)

      result.prop1 = 10
      expect(result.prop1).toEqual(10)
  })
})