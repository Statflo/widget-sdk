import { ContainerClient, WidgetClient, Helpers } from "../dist/index.js"
import * as domino from "domino"

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