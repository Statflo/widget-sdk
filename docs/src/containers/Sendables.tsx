import { useEffect, useState } from "react";

import { Dialog, IconButton, Menu, Popover } from "@statflo/ui";

import { RemoteComponent } from "../components/RemoteComponent";
import { WidgetEvents, useWidgetContext } from "../providers/WidgetProvider";
import Placeholder from "../components/Placeholder";

const Sendables = () => {
  const { sendableWidgets, events, getLatestEvent, store } = useWidgetContext();

  const [activeWidget, setActiveWidget] = useState<Widget>();
  const [isWidgetOpen, setWidgetOpen] = useState<boolean>(false);

  useEffect(() => {
    const latest = getLatestEvent();
    if (latest?.type === WidgetEvents.APPEND_MESSAGE) {
      setActiveWidget(undefined);
      setWidgetOpen(false);
    }
    if (latest?.type === WidgetEvents.REPLACE_MESSAGE) {
      setActiveWidget(undefined);
      setWidgetOpen(false);
    }
  }, [events, getLatestEvent]);

  if (!sendableWidgets) return null;

  return sendableWidgets.length === 0 ? (
    <Popover
      className="rounded-xl flex flex-col gap-4"
      render={() => (
        <div className="p-4 w-64">
          <Placeholder location="Sendable" />
        </div>
      )}
    >
      <IconButton ariaLabel="Sendables Menu" icon="add" variant="secondary" />
    </Popover>
  ) : (
    <>
      <Menu
        items={
          sendableWidgets?.map((w) => ({
            onClick: () => {
              setActiveWidget(w);
              setWidgetOpen(true);
            },
            text: w?.label && w.label.length > 0 ? w.label : w.name,
          })) ?? []
        }
      >
        <IconButton ariaLabel="Sendables Menu" icon="add" variant="secondary" />
      </Menu>
      <Dialog
        render={({ onClose, labelId, descriptionId }) =>
          activeWidget && (
            <RemoteComponent
              widget={activeWidget}
              store={store}
              fallbackLoading="Loading widget..."
              fallbackError={() => (
                <div>Oops! {activeWidget.name.toLowerCase()}</div>
              )}
              fullWidth
            />
          )
        }
        closeButton="Close"
        setOpen={setWidgetOpen}
        isOpen={isWidgetOpen}
      />
    </>
  );
};

export default Sendables;
