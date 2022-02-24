import * as domino from "domino"

import { ContainerMethods, WidgetMethods } from "../shared"

import WidgetClient, { TWidgetClientOptions } from "."

describe("widget", () => {
  const testWindow = domino.createWindow('<h1>My page </h1>', 'http://example2.com')

  let workingClient: WidgetClient
  beforeEach(() => {
    const createWidgetState = (id: string) => ({ id, prop: "val"}) 
    const id = "id"
    const opts: TWidgetClientOptions = {
      id,
      window: testWindow,
      createWidgetState
    }

    workingClient = new WidgetClient(opts)
  })


  it("should initialize", () => {
    const createWidgetState = (id: string) => ({ id, prop: "val"}) 
    const id = "id"
    const opts: TWidgetClientOptions = {
      id,
      window: testWindow,
      createWidgetState
    }

    const client = new WidgetClient(opts)

    expect(client.window).toEqual(testWindow)
    expect(client.state).toEqual(createWidgetState(id))
  })

  it("should initialize with working postMessage", () => {

    // @ts-ignore
    const myWindow = {
      top: {
        postMessage: jest.fn()
      },
      self: domino.createWindow('<h1>My page </h1>', 'http://example.com'),
      addEventListener: () => null
    } as Window


    const createWidgetState = (id: string) => ({ id, prop: "val"}) 
    const id = "id"
    const opts: TWidgetClientOptions = {
      id,
      window: myWindow,
      createWidgetState
    }
    const client = new WidgetClient(opts)
    const event = {}
    client.postEvent(event)

    // @ts-ignore
    expect(myWindow.top.postMessage).toHaveBeenCalledWith({...event, id}, "*")
  })

  it("should error when no id provided", () => {
    expect(() => {
      new WidgetClient({} as any)
    }).toThrow()
  })

  it("should handle event with state update and subscriber", () => {
    const event = {
        method: ContainerMethods.setState,
        name: ContainerMethods.setState,
        id: "id",
        payload: {
          property: "myProp",
          value: "myValue"
        }
    }

    const cb = jest.fn()


    workingClient.handleEvent(event)
    expect(cb).not.toBeCalled()

    workingClient.on(ContainerMethods.setState, cb)
    workingClient.handleEvent(event)
    
    expect(workingClient.state["myProp"]).toEqual("myValue")
    expect(cb).toHaveBeenCalledWith(event)
  })

  it("should handle setState", () => {
    workingClient.postEvent = jest.fn()
    workingClient.setState("prop", "10")

    expect(workingClient.postEvent).toHaveBeenCalledWith({
      method: WidgetMethods.setState,
      name: WidgetMethods.setState,
      payload: {
        property: "prop",
        value: "10",
      },
    })

    expect(workingClient.state["prop"]).toEqual("10")
  })

  it("should handle post", () => {
    workingClient.postEvent = jest.fn()
    workingClient.post("name", "value")

    expect(workingClient.postEvent).toHaveBeenCalledWith({
      method: WidgetMethods.post,
      name: "name",
      payload: "value"
    })
  })

  it("should handle postForward", () => {
    workingClient.postEvent = jest.fn()
    workingClient.postForward("name", "value", "id")

    expect(workingClient.postEvent).toHaveBeenCalledWith({
      method: WidgetMethods.postForward,
      name: "name",
      payload: "value",
      recipientId: "id"
    })
  })

  it("should release all values", () => {
    workingClient.release()
    
    expect(workingClient.state).toEqual(null)
    expect(workingClient.postEvent).toEqual(null)
    expect(workingClient.onMessageHandler).toEqual(null)
    expect(workingClient.subscribers).toEqual(null)
  })
})