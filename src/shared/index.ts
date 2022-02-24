export enum WidgetMethods {
  post = "widget_sdk/post",
  postForward = "widget_sdk/post_forward",
  setState = "widget_sdk/set_state",
}

export enum ContainerMethods {
  post = "container_sdk/post",
  setState = "container_sdk/set_state",
}

export interface WidgetPostEventType {
  method: WidgetMethods;
  name: string;
  id: string;
  payload?: any;
  /* only included with postForward calls */
  recipientId?: any;
}

export interface ContainerPostEventType {
  method: ContainerMethods;
  name: string;
  id: string;
  payload?: any;
}

export interface TWidgetState {
  [key: string]: any
}

export enum DebugLogLevel {
  None = "none",
  Debug = "debug",
}

export function createWidgetObj(widgetState: object) {
  console.log("create widget obj: ", widgetState)
  const state = {};
  const descriptors = {};

  Object.entries(widgetState).forEach(([key, value]) => {
    // @ts-ignore
    descriptors[key] = {
      value,
      writable: true,
    };
  });

  const newState = Object.defineProperties(state, descriptors);
  
  console.log("state: ", newState, Object.entries(widgetState), descriptors)
  return newState;
}