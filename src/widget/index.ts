import { ContainerMethods, ContainerPostEventType, TWidgetState, WidgetMethods, WidgetPostEventType } from "../shared";

import { onMessageFromContainer } from "./misc";



interface TWidgetClientOptions {
  id: string
  createWidgetState: (id: string) => TWidgetState
  window: Window
}

export default class WidgetClient {

  state

  postEvent

  onMessageHandler

  subscribers

  window

  constructor(opts: TWidgetClientOptions) {
    const { id, createWidgetState, window } = opts;

    if (!id) {
      throw new Error("Widget id must be provided to WidgetClient constructor");
    }

    console.log("widget client initialized! ", this)

    this.window = window
    this.subscribers = new Map();
    this.state = createWidgetState(id);

    const topWindow = window.top as Window

    this.postEvent = (event: Partial<WidgetPostEventType>) => {
      if (event) {
        topWindow.postMessage({ ...event, id }, "*");
      }
    };

    this.onMessageHandler = onMessageFromContainer(this.handleEvent);

    this.window.addEventListener("message", this.onMessageHandler);
  }

  /** 
   *  Updates local widget state and forwards the event to an event handler
  */
  handleEvent = (e: ContainerPostEventType) => {
    const { method, name, payload } = e;

    if (method === ContainerMethods.setState) {
      const { property, value } = payload;

      this.state[property] = value;
    }

    // invokes subscriber to this event
    this.subscribers.get(name)?.(e);
  };

  /** 
   * Assigns value to property for this widget's state. This will be syncronized with the container's widget state.
   * 
   * Valid widgets: (all widgets)
   * 
  */
  setState = (property: string, value: any) => {
    this.postEvent({
      method: WidgetMethods.setState,
      name: WidgetMethods.setState,
      payload: {
        property,
        value,
      },
    });

    this.state[property] = value;
  }

  /** 
   * Pushes event to container 
   * 
  */
  post = (eventName: string, value?: any) => {
    this.postEvent({
      method: WidgetMethods.post,
      name: eventName,
      payload: value,
    });

  };

  /** 
   * Pushes event to container to be forwarded (posted) to another widget whose id is equal to recipient id here. 
   * 
  */
  postForward = (eventName: string, value: any, recipientId: string) => {
    this.postEvent({
      method: WidgetMethods.postForward,
      name: eventName,
      payload: value,
      recipientId,
    });
  };


  /** 
   * Subscribes the callback to receive event
   * 
  */
  on = (eventName: string, callback: (event: ContainerPostEventType) => void) => {
    this.subscribers.set(eventName, callback);
  };

  /** 
   *  Removes event listeners, widget client class is no longer usable after calling this method
  */
  release = () => {
    this.window.removeEventListener("message", this.onMessageHandler);

    // @ts-ignore
    this.state = null;
    // @ts-ignore
    this.postEvent = null;
    // @ts-ignore
    this.onMessageHandler = null;
    // @ts-ignore
    this.subscribers = null;
  };
}