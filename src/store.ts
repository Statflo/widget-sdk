import { v4 as uuidv4 } from "uuid";
import { createStore } from "zustand/vanilla";
import "iframe-resizer/js/iframeResizer.contentWindow";

export interface Widget {
  id: string;
  name: string;
  label?: string;
  url: string;
  type: "iframe" | "native";
  native?: {
    remote: string;
    module: string;
  };
  options?: {
    defaultExpanded?: boolean;
    priority?: number;
  };
}

export interface WidgetState {
  widgets: Widget[];
  setWidgets: (widgets: Widget[]) => void;
  events: { [id: string]: WidgetEvent<any> };
  publishEvent: (e: WidgetEvent<any>) => void;
  getLatestEvent: () => WidgetEvent<any> | null;
  getEvents: () => WidgetEvent<any>[];
}

export class WidgetEvent<T> {
  readonly id: string;
  readonly created: Date;

  constructor(
    readonly type: string,
    readonly data: T,
    id?: string,
    created?: Date
  ) {
    this.id = id ?? uuidv4();
    this.created = created ?? new Date();
  }
}

const useWidgetStore = createStore<WidgetState>()((set, get) => {
  const listener = (event: MessageEvent) => {
    const { data } = event;

    if (
      data.constructor === Object &&
      "id" in data &&
      "type" in data &&
      "data" in data
    ) {
      const { id, type, created } = data;

      const { events } = get();

      if (id in events) {
        return;
      }

      get().publishEvent(new WidgetEvent(type, data.data, id, created));
    }
  };

  window.addEventListener("message", listener);

  return {
    widgets: [],
    setWidgets: (widgets: Widget[]) => {
      set({ widgets });
    },
    events: {},
    publishEvent: (e: WidgetEvent<any>) => {
      const { id, type, data } = e;

      get()
        .widgets.filter((widget) => widget.type === "iframe")
        .forEach((widget) => {
          const iframe = document.getElementById(
            widget.id
          ) as HTMLIFrameElement;

          if (iframe) {
            const { origin } = new URL(widget.url);
            iframe.contentWindow?.postMessage({ id, type, data }, origin);
          }
        });

      parent.postMessage({ id, type, data }, "*");

      set({ events: { ...get().events, [e.id]: e } });
    },
    getLatestEvent: () => {
      const { events } = get();

      return (
        events[Object.keys(events)[Object.keys(events).length - 1]] ?? null
      );
    },
    getEvents: () => {
      const events = Object.keys(get().events).map(
        (eventId) => get().events[eventId]
      );

      events.sort((a, b) => (a.created > b.created ? 1 : -1));

      return events;
    },
  };
});

export default useWidgetStore;
