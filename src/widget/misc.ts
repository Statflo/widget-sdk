import { ContainerMethods, ContainerPostEventType, WidgetPostEventType } from "../shared";

export const onMessageFromContainer = (cb: (event: ContainerPostEventType) => void) => (e: MessageEvent<ContainerPostEventType>) => {
  const validMethods = Object.values(ContainerMethods);
  const event = e.data;

  if (event && validMethods.includes(event.method)) {
    cb(event);
  }
};

export function postEventFromWidget(window: Window, id: string) {
  const widgetContainerWindow = window?.top;

  if (widgetContainerWindow) {
    const postEvent = (event: Partial<WidgetPostEventType>) => {
      if (event && window.name !== "") {
        widgetContainerWindow.postMessage({ ...event, id }, "*");
      }
    };

    return postEvent;
  }

  return () => null;
}

