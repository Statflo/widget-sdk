import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { StoreApi, UseBoundStore, create } from "zustand";

import useWidgetStore, { WidgetEvent, WidgetState } from "@statflo/widget-sdk";

const useBoundWidgetStore = create(useWidgetStore);

export enum WidgetEvents {
  APPEND_MESSAGE = "APPEND_MESSAGE",
  AUTHENTICATION_TOKEN = "AUTHENTICATION_TOKEN",
  CONTAINER_HEIGHT = "CONTAINER_HEIGHT",
  CURRENT_ACCOUNT_ID = "CURRENT_ACCOUNT_ID",
  DARK_MODE = "DARK_MODE",
  EXPAND_IFRAME = "EXPAND_IFRAME",
  REPLACE_MESSAGE = "REPLACE_MESSAGE",
  SHOW_ALERT = "SHOW_ALERT",
  USER_AUTHENTICATED = "USER_AUTHENTICATED",
}

type WidgetContextProps = {
  publishEvent: (e: WidgetEvent<any>) => void;
  events: {
    [id: string]: WidgetEvent<any>;
  };
  getLatestEvent: () => WidgetEvent<any> | null;
  getEvents: () => WidgetEvent<any>[];
  store: UseBoundStore<StoreApi<WidgetState>>;
  addWidget: (widget: Widget) => void;
  editWidget: (widget: Widget) => void;
  deleteWidget: (widgetId: string) => void;
  widgets?: Widget[];
  rightPanelWidgets: Widget[];
  sendableWidgets: Widget[];
};

// eslint-disable-next-line
const WidgetContext = createContext<WidgetContextProps>(null!);

export function useWidgetContext() {
  return useContext(WidgetContext);
}

export function WidgetProvider({ children }: { children: React.ReactNode }) {
  const {
    widgets,
    setWidgets,
    publishEvent,
    events,
    getLatestEvent,
    getEvents,
  } = useBoundWidgetStore();

  const [rightPanelWidgets, setRightPanelWidgets] = useState<Widget[]>([]);
  const [sendableWidgets, setSendableWidgets] = useState<Widget[]>([]);

  const addWidget = useCallback(
    (widget: Widget) => {
      setWidgets([...widgets, widget]);

      if (widget.scopes[0].positions[0] === "right_panel") {
        setRightPanelWidgets((prevState) =>
          prevState
            ? [...prevState, widget].sort((a, b) => a.priority - b.priority)
            : [widget]
        );
      }
      if (widget.scopes[0].positions[0] === "sendable") {
        setSendableWidgets((prevState) =>
          prevState
            ? [...prevState, widget].sort((a, b) => a.priority - b.priority)
            : [widget]
        );
      }
    },
    [setWidgets, widgets]
  );

  const editWidget = useCallback(
    (widget: Widget) => {
      const newWidgets = widgets.map((w) => (w.id === widget.id ? widget : w));
      setWidgets(newWidgets);

      if (widget.scopes[0].positions[0] === "right_panel") {
        setSendableWidgets((prevState) =>
          prevState.filter((w) => w.id !== widget.id)
        );
        setRightPanelWidgets((prevState) =>
          prevState.some((w) => w.id === widget.id)
            ? prevState
                .map((w) => (w.id === widget.id ? widget : w))
                .sort((a, b) => a.priority - b.priority)
            : [widget]
        );
      }
      if (widget.scopes[0].positions[0] === "sendable") {
        setRightPanelWidgets((prevState) =>
          prevState?.filter((w) => w.id !== widget.id)
        );
        setSendableWidgets((prevState) =>
          prevState.some((w) => w.id === widget.id)
            ? prevState
                .map((w) => (w.id === widget.id ? widget : w))
                .sort((a, b) => a.priority - b.priority)
            : [widget]
        );
      }
    },
    [setWidgets, widgets]
  );

  const deleteWidget = useCallback(
    (widgetId: string) => {
      const newWidgets = widgets.filter((w) => w.id !== widgetId);
      setWidgets(newWidgets);

      setRightPanelWidgets((prevState) =>
        prevState?.filter((w) => w.id !== widgetId)
      );
      setSendableWidgets((prevState) =>
        prevState?.filter((w) => w.id !== widgetId)
      );
    },
    [setWidgets, widgets]
  );

  const context = useMemo<WidgetContextProps>(
    () => ({
      publishEvent,
      events,
      getLatestEvent,
      getEvents,
      store: useBoundWidgetStore,
      addWidget,
      editWidget,
      deleteWidget,
      widgets,
      rightPanelWidgets,
      sendableWidgets,
    }),
    [
      publishEvent,
      events,
      getLatestEvent,
      getEvents,
      addWidget,
      editWidget,
      deleteWidget,
      widgets,
      rightPanelWidgets,
      sendableWidgets,
    ]
  );

  return (
    <WidgetContext.Provider value={context}>{children}</WidgetContext.Provider>
  );
}
