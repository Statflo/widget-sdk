import { WidgetMethods, WidgetPostEventType } from "../shared";

export const onContainerMessage = (cb: any) => (e: MessageEvent<WidgetPostEventType>) => {
  const validMethods = Object.values(WidgetMethods);

  if (e.data && validMethods.includes(e.data.method)) {
    cb({
      method: e.data.method,
      id: e.data.id,
      name: e.data.name,
      payload: e.data.payload,
      recipientId: e.data.recipientId,
    });
  }
};
