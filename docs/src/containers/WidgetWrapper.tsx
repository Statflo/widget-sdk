import { useEffect, useRef, useState } from "react";

import { WidgetEvent } from "@statflo/widget-sdk";

import { RemoteComponent } from "../components/RemoteComponent";
import { WidgetEvents, useWidgetContext } from "../providers/WidgetProvider";
import { classNames } from "@statflo/ui";

type WidgetWrapperProps = {
  widget: Widget;
};

const WidgetWrapper = ({ widget }: WidgetWrapperProps) => {
  const { publishEvent, events, getLatestEvent, store } = useWidgetContext();
  const [expanded, setExpanded] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const latest = getLatestEvent();
    if (latest?.type === WidgetEvents.EXPAND_IFRAME) {
      const { name, expand } = latest.data;
      if (widget.name.toLowerCase() === name) {
        setExpanded(expand);

        setTimeout(() => {
          if (ref.current) {
            publishEvent(
              new WidgetEvent<number>(
                WidgetEvents.CONTAINER_HEIGHT,
                ref.current.offsetHeight
              )
            );
          }
        });
      }
    }
  }, [widget.name, events, getLatestEvent, publishEvent]);

  return (
    <div className={classNames(expanded && "absolute inset-0 z-20")} ref={ref}>
      <RemoteComponent
        expanded={expanded}
        widget={widget}
        store={store}
        fallbackLoading="Loading Widget..."
        fallbackError={() => <div />}
      />
    </div>
  );
};

export default WidgetWrapper;
