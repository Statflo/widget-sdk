import { ContainerMethods, createWidgetObj, DebugLogLevel, TWidgetState } from "../shared";
import { ContainerPostEventType, WidgetMethods, WidgetPostEventType } from "../shared";

import { onContainerMessage } from "./misc";


interface ContainerClientOptions {
  logs?: DebugLogLevel
  window: Window
}

export default class ContainerClient {

  states

  onMessageHandler

  subscribers

  /**
   * A map of widget id to the DOM node of that widget's iframe
   */
  widgets

  logLevel

  window

  constructor(opts: ContainerClientOptions) {
    if (!opts.window) {
      throw Error("window must be provided to container client constructor")
    }

    this.subscribers = new Map();
    this.widgets = new Map();
    this.states = new Map();
    this.window = opts.window
    this.logLevel = opts.logs ?? DebugLogLevel.None;
    this.onMessageHandler = onContainerMessage(this.handleEvent);
    this.window.addEventListener("message", this.onMessageHandler);
  }


  postEvent = (id: string, event: Partial<ContainerPostEventType>) => {
    let widgetIframeElement = this.widgets.get(id);

    if (!widgetIframeElement) {
      widgetIframeElement = this.window.document.getElementById(id);

      if (!widgetIframeElement) {
        throw new Error(`Unable to post(). Could not find Iframe element for widget id '${id}'`);
      }

      this.widgets.set(id, widgetIframeElement);
    }

    const { widgetDomain } = this.states.get(id);

    widgetIframeElement.contentWindow.postMessage(event, widgetDomain);
  }

  createWidget = (state: TWidgetState) => {
    const { id } = state;

    if (!id) {
      throw new Error(`Unable to create widget. Expected an id to exist in initial widget state but '${id}' was given.`);
    }

    if (this.states.get(id)) {
      throw new Error(`Unable to create widget. A widget with the id '${id}' already exists.`);
    }

    const widgetElement = this.window.document.getElementById(id);

    if (widgetElement) {
      this.widgets.set(id, widgetElement);
    } else if (this.logLevel === DebugLogLevel.Debug) {
      console.log("ContainerClient: widget iframe element not found with id: ", id);
    }

    this.states.set(id, createWidgetObj(state));
  }

  /** 
   *  Updates local widget state and forwards the event to an event handler
  */
  handleEvent = (e: WidgetPostEventType) => {
    const { method, name, payload, id } = e;

    if (method === WidgetMethods.postForward) {
      const { recipientId } = e;
      this.post(recipientId, name, payload);
      if (this.logLevel === DebugLogLevel.Debug) {
        console.log("ContainerClient: postForward invoked with with: ", recipientId, name, payload);
      }

      return;
    }

    const state = this.states.get(id);

    if (!state) {
      throw new Error(`Unable to handle event. Receiving event for widget id '${id}' which has not yet been initialized within the container`);
    }

    if (method === WidgetMethods.setState) {
      const { property, value } = payload;

      if (this.logLevel === DebugLogLevel.Debug) {
        console.log(`ContainerClient: updating local widget state for: ${property} = ${value} in widget ${id}`);
      }
      this.states.get(id)[property] = value;
    }
    this.subscribers.get(name)?.(e);
    this.subscribers.get(method)?.(e);
  };

  /** 
   * Assigns value to property for this widget's state. This will be syncronized with the container's widget state.
   * 
   * Valid widgets: (all widgets)
   * 
  */
  setState = (id: string, property: string, value: any) => {
    const state = this.states.get(id);

    if (!state) {
      throw new Error(`Unable to setState(). Widget state has not yet been created for widget id '${id} ${property} = ${value}'`);
    }

    if (this.states.get(id)[property] === value) {
      return;
    }

    const setStateEvent = {
      method: ContainerMethods.setState,
      name: ContainerMethods.setState,
      payload: {
        property,
        value,
      },
    };
    this.postEvent(id, setStateEvent);

    if (this.logLevel === DebugLogLevel.Debug) {
      console.log(`ContainerClient: invoking setState() with event: ${JSON.stringify(setStateEvent)}`);
    }

    state[property] = value;

    // triggers callback for setState subscriber
    const cb = this.subscribers.get(WidgetMethods.setState);
    if (cb) {
      const syntheticEvent = {
        method: WidgetMethods.setState,
        name: WidgetMethods.setState,
        id,
        payload: {
          property,
          value,
        },
      };

      cb(syntheticEvent);
    }
  }

  /** 
   * Posts event to container 
   * 
  */
  post = (id: string, eventName: string, value: any): void => {
    if (!this.states.get(id)) {
      console.log(`Unable to post(). Widget not yet been created for widget id '${id}'`);
      return;
    }

    const event = {
      method: ContainerMethods.post,
      name: eventName,
      payload: value,
    };
    this.postEvent(id, event);

    if (this.logLevel === DebugLogLevel.Debug) {
      console.log(`ContainerClient: invoking post() with event: ${JSON.stringify(event)}`);
    }
  };

  /** 
   * Subscribes the callback to receive event
   * 
  */
  on = (eventName: string, callback: (event: WidgetPostEventType) => void) => {
    this.subscribers.set(eventName, callback);
  };

  /** 
   *  Removes event listeners, widget client class is no longer usable after calling this method
  */
  release = () => {
    this.window.removeEventListener("message", this.onMessageHandler);

    // @ts-ignore
    this.states = null;
    // @ts-ignore
    this.postEvent = null;
    // @ts-ignore
    this.onMessageHandler = null;
    // @ts-ignore
    this.subscribers = null;
  };
}