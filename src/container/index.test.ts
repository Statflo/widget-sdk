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

  it("should throw on postevent without iframe registered", () => {
    expect(() => {
      workingClient.postEvent("id", null as any)
    }).toThrow()
  })

  it("should throw error if createWidget is called on a widget id that already exist", () => {
    expect(() => {
      workingClient.states.set("id", {})
      workingClient.createWidget({ id: "id" })
    }).toThrow("Unable to create widget. A widget with the id 'id' already exists.")
  })

  it("should log debugger when widget doesn't exist", () => {
    const thisWindow = {
      addEventListener: jest.fn(),
      document:{
        getElementById: jest.fn(() => null)
      }
    }

    console.log = jest.fn()
    const client = new ContainerClient({ window: thisWindow, logs: DebugLogLevel.Debug } as any)

    client.createWidget({id: "id"})

    expect(console.log).toBeCalledWith("ContainerClient: widget iframe element not found with id: ", "id")
  })

  it("should handle event setstate with debugger", () => {
    const event = {
      method: WidgetMethods.setState,
      name: "eventName",
      payload: {
        property: 'hello',
        value: "world"
      },
      id: "id",
    }  
    const client = new ContainerClient({ window: testWindow, logs: DebugLogLevel.Debug})
    console.log = jest.fn()
    client.states.set("id", {})
    client.handleEvent(event)
    expect(console.log).toBeCalledWith(`ContainerClient: updating local widget state for: ${event.payload.property} = ${event.payload.value} in widget ${event.id}`)
    expect(client.states.get("id")).toEqual({ hello: "world" })
  })


  it("should call subscribers on handleevent", () => {
    const event = {
      method: WidgetMethods.setState,
      name: "eventName",
      payload: {
        property: 'hello',
        value: "world"
      },
      id: "id",
    }  

    console.log = jest.fn()
    workingClient.states.set("id", {})

    workingClient.subscribers.set(WidgetMethods.setState, jest.fn())
    workingClient.subscribers.set("eventName", jest.fn())

    workingClient.handleEvent(event)
    expect(workingClient.subscribers.get(WidgetMethods.setState)).toBeCalledWith(event)
    expect(workingClient.subscribers.get("eventName")).toBeCalledWith(event)

  })

  it("should handle setstate with debugger and callback", () => {
    const event = {
      method: WidgetMethods.postForward,
      name: "eventName",
      payload: "mypayload",
      id: "id",
      recipientId: "otherid"
    }

    console.log = jest.fn()
    const client = new ContainerClient({ window: testWindow, logs: DebugLogLevel.Debug})
    client.states.set("id", {})
    client.subscribers.set(WidgetMethods.setState, jest.fn());
    
    client.postEvent = jest.fn()
    client.setState("id", "hello", "world")

    const setStateEvent = {
      method: ContainerMethods.setState,
      name: ContainerMethods.setState,
      payload: {
        property: "hello",
        value: "world"
      },
    };

    const syntheticEvent = {
      method: WidgetMethods.setState,
      name: WidgetMethods.setState,
      id: "id",
      payload: {
        property: "hello",
        value: "world"
      },
    };

    expect(client.postEvent).toBeCalledWith("id", setStateEvent)
    expect(console.log).toBeCalledWith(`ContainerClient: invoking setState() with event: ${JSON.stringify(setStateEvent)}`)
    expect(client.subscribers.get(WidgetMethods.setState)).toBeCalledWith(syntheticEvent)
  })

  it("should handle postforward with debugger", () => {
    const event = {
      method: WidgetMethods.postForward,
      name: "eventName",
      payload: "mypayload",
      id: "id",
      recipientId: "otherid"
    }

    console.log = jest.fn()
    const client = new ContainerClient({ window: testWindow, logs: DebugLogLevel.Debug})
    client.post = jest.fn()
    client.handleEvent(event)

    expect(client.post).toBeCalledWith(event.recipientId, event.name, event.payload)
    expect(console.log).toHaveBeenCalledWith("ContainerClient: postForward invoked with with: ", event.recipientId, event.name, event.payload)
  })

  it("should throw error on handle event without preexisting state", () => {
    const event = {
      method: WidgetMethods.post,
      name: "eventName",
      payload: "mypayload",
      id: "id",
      recipientId: "otherid"
    }

    expect(() => {
      workingClient.handleEvent(event)
    }).toThrow(`Unable to handle event. Receiving event for widget id '${event.id}' which has not yet been initialized within the container`)
  })

  
  it("should create widget", () => {
    const iframe = {
      contentWindow: {
        postMessage: jest.fn()
      }
    }

    const thisWindow = {
      addEventListener: jest.fn(),
      document:{
        getElementById: jest.fn(() => iframe)
      }
    }

    const client = new ContainerClient({ window: thisWindow } as any)

    client.createWidget({id: "id"})

    expect(client.widgets.get("id")).toEqual(iframe)
  })

  it("should throw when id is not provided within state", () => {
    expect(() => {
      workingClient.createWidget({ })
    }).toThrow()
  })

  it("should find iframe widget and post event to it", () => {
    const iframe = {
      contentWindow: {
        postMessage: jest.fn()
      }
    }

    const thisWindow = {
      addEventListener: jest.fn(),
      document:{
        getElementById: jest.fn(() => iframe)
      }
    }

    const client = new ContainerClient({ window: thisWindow } as any)
    client.states.set("id", "domain")

    const event = { someEvent: "someValue" }

    client.postEvent("id", event as any)

    expect(thisWindow.document.getElementById).toBeCalled()
    expect(iframe.contentWindow.postMessage).toBeCalled()
  })

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