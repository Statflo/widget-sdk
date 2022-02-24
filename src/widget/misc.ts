import { ContainerMethods, ContainerPostEventType, WidgetPostEventType } from "../shared";

export const onMessageFromContainer = (cb: (event: ContainerPostEventType) => void) => (e: MessageEvent<ContainerPostEventType>) => {
  const validMethods = Object.values(ContainerMethods);
  const event = e.data;

  if (event && validMethods.includes(event.method)) {
    cb(event);
  }
}