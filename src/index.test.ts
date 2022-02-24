import * as Helpers from "./shared"

import * as Package from "."
import { ContainerClient, WidgetClient } from "."


describe("package exports", () => {
  it("should export widget, client, and helpers correctly", () => {
    expect(Package.ContainerClient).toEqual(ContainerClient)
    expect(Package.WidgetClient).toEqual(WidgetClient)
    expect(Package.Helpers).toEqual(Helpers)
  })
})