import IframeResizer from "iframe-resizer-react";
import React, { ComponentType, FC, useState } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { UseBoundStore } from "zustand/react";
import { Mutate, StoreApi } from "zustand/vanilla";

import { Widget, WidgetState } from "@statflo/widget-sdk";

type WidgetProps = {
  widget: Widget;
  store: UseBoundStore<Mutate<StoreApi<WidgetState>, any>>;
  fallbackError?: ComponentType<FallbackProps>;
  fallbackLoading?: string | React.ReactNode;
  fullWidth?: boolean;
  expdanded?: boolean;
  [key: string]: any;
};

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div role="alert">
      Oops! We're running into some issues, please contact support.
    </div>
  );
}

export const RemoteComponent: FC<WidgetProps> = ({
  widget,
  store,
  fallbackError = null,
  fallbackLoading = null,
  fullWidth = false,
  expanded = false,
  ...props
}) => {
  const events = store((state) => state.events);
  const [loading, setLoading] = useState(true);

  const onLoad = (e: any) => {
    // Populate Iframe widgets with any events they may have missed before loading
    const iframe = document.getElementById(widget.id) as HTMLIFrameElement;

    Object.keys(events).forEach((id) => {
      const event = events[id];
      const { type, data } = event;
      iframe.contentWindow?.postMessage({ id, type, data }, widget.url);
    });

    setLoading(false);
  };

  return (
    <ErrorBoundary FallbackComponent={fallbackError ?? ErrorFallback}>
      {widget.type === "iframe" ? (
        <>
          {loading && fallbackLoading}
          <IframeResizer
            id={widget.id}
            src={widget.url}
            style={
              !fullWidth
                ? {
                    width: expanded ? "100%" : "calc(100% + 8px)",
                    border: "none",
                    margin: expanded ? "0" : "-0.25rem",
                  }
                : { border: "none" }
            }
            widthCalculationMethod={fullWidth ? "rightMostElement" : "scroll"}
            onLoad={onLoad}
            sizeHeight
            sizeWidth={fullWidth}
          />
        </>
      ) : loading ? (
        fallbackLoading
      ) : null}
    </ErrorBoundary>
  );
};
