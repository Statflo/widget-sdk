import * as domino from "domino"

import { ContainerClient, Helpers, WidgetClient } from "../dist/index.js"

const myWindow = domino.createWindow('<h1>My page </h1>', 'http://example.com')

const myWidgetClient = new WidgetClient({
  id: "10",
  createWidgetState: (id) => ({ id }),
  window: myWindow
})
const myContainerClient = new ContainerClient({
  window: myWindow
})

console.log("helpers: ", Helpers.WidgetMethods)