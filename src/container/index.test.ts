import * as domino from "domino"

import { ContainerMethods, DebugLogLevel, WidgetMethods } from "../shared"

import ContainerClient from "."


describe("widget", () => {
  let testWindow: Window

  let workingClient: ContainerClient
  beforeEach(() => {
    testWindow = domino.createWindow('<h1>My page </h1>', 'http://example2.com')

    jest.clearAllMocks()

    const opts = {
      window: testWindow,
    }

    workingClient = new ContainerClient(opts)
  })


  it("should initialize", () => {
    testWindow.addEventListener = jest.fn()
    const newClient = new ContainerClient({
      window: testWindow
    })

    expect(newClient.window).toEqual(testWindow)
    expect(newClient.window.addEventListener).toHaveBeenCalledTimes(1)
  })

  it("should error when no window", () => {
    expect(() => {
      new ContainerClient({ window: null } as any)
    }).toThrow()
  })

  it("should apply logs correctly", () => {
    expect(workingClient.logLevel).toEqual(DebugLogLevel.None)

    testWindow.addEventListener = jest.fn()
    const newClient = new ContainerClient({
      window: testWindow,
      logs: DebugLogLevel.Debug
    })

    expect(newClient.logLevel).toEqual(DebugLogLevel.Debug)
  })

  it("should postEvent return early when no iframe with id has been registered", () => {
    workingClient.postEvent = jest.fn()
    console.log = jest.fn()
    workingClient.post("id", "", null)

    expect(workingClient.postEvent).toBeCalledTimes(0)
    expect(console.log).toBeCalledWith("Unable to post(). Widget not yet been created for widget id 'id'")
  })


  it("should postEvent correctly", () => {
    workingClient.postEvent = jest.fn()
    workingClient.states.set("id", {})


    const name = "eventName"
    const val = 10

    workingClient.post("id", name, val)

    const event =  {
      method: ContainerMethods.post,
      name,
      payload: val,
    }

    expect(workingClient.postEvent).toBeCalledWith("id", event)
  })


  it("should postEvent correctly with logs", () => {
    const client = new ContainerClient({
      window: testWindow,
      logs: DebugLogLevel.Debug
    })
    console.log = jest.fn()
    client.postEvent = jest.fn()
    client.states.set("id", {})


    const name = "eventName"
    const val = 10

    client.post("id", name, val)

    const event =  {
      method: ContainerMethods.post,
      name,
      payload: val,
    }

    expect(console.log).toBeCalledWith(`ContainerClient: invoking post() with event: ${JSON.stringify(event)}`)
  })



  // it("should handle event with state update and subscriber", () => {
  //   const event = {
  //       method: ContainerMethods.setState,
  //       name: ContainerMethods.setState,
  //       id: "id",
  //       payload: {
  //         property: "myProp",
  //         value: "myValue"
  //       }
  //   }

  //   const cb = jest.fn()


  //   workingClient.handleEvent(event)
  //   expect(cb).not.toBeCalled()

  //   workingClient.on(ContainerMethods.setState, cb)
  //   workingClient.handleEvent(event)
    
  //   expect(workingClient.state["myProp"]).toEqual("myValue")
  //   expect(cb).toHaveBeenCalledWith(event)
  // })

  // it("should handle setState", () => {
  //   workingClient.postEvent = jest.fn()
  //   workingClient.setState("prop", "10")

  //   expect(workingClient.postEvent).toHaveBeenCalledWith({
  //     method: WidgetMethods.setState,
  //     name: WidgetMethods.setState,
  //     payload: {
  //       property: "prop",
  //       value: "10",
  //     },
  //   })

  //   expect(workingClient.state["prop"]).toEqual("10")
  // })

  // it("should handle post", () => {
  //   workingClient.postEvent = jest.fn()
  //   workingClient.post("name", "value")

  //   expect(workingClient.postEvent).toHaveBeenCalledWith({
  //     method: WidgetMethods.post,
  //     name: "name",
  //     payload: "value"
  //   })
  // })

  // it("should handle postForward", () => {
  //   workingClient.postEvent = jest.fn()
  //   workingClient.postForward("name", "value", "id")

  //   expect(workingClient.postEvent).toHaveBeenCalledWith({
  //     method: WidgetMethods.postForward,
  //     name: "name",
  //     payload: "value",
  //     recipientId: "id"
  //   })
  // })

  it("should throw error when calling setState() without state", () => {
    expect(() => {
      workingClient.setState("id", "", "")
    }).toThrow()
  })

  it("should early return if setstate has no diff to state", () => {
    const id = "id"
    workingClient.postEvent = jest.fn()
    workingClient.states.set(id, { myProp: "initial_value"})

    workingClient.setState(id, "myProp", "initial_value")
    expect(workingClient.postEvent).toBeCalledTimes(0)
  })

  it("should handle .on()", () => {
    const cb = () => null
    workingClient.on("event", cb)

    expect(workingClient.subscribers.get("event")).toEqual(cb)
  })

  it("should release all values", () => {
    workingClient.release()
    
    expect(workingClient.states).toEqual(null)
    expect(workingClient.postEvent).toEqual(null)
    expect(workingClient.onMessageHandler).toEqual(null)
    expect(workingClient.subscribers).toEqual(null)
  })
})