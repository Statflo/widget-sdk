import { createWidgetObj } from "."

describe("createWidgetObj", () => {
  it("should work", () => {
      const startingState = {
        prop1: "val1",
        prop2: "val2"
      }

      const result = createWidgetObj(startingState)
      const desiredResult = {}

      console.log("logging: ", result, desiredResult)
      expect(result).toEqual(desiredResult)
  })
})