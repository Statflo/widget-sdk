import IframeResizer from "iframe-resizer-react";
import React, { ComponentType, FC, useEffect, useState } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { UseBoundStore } from "zustand/react";
import { Mutate, StoreApi } from "zustand/vanilla";

import { loadRemoteModule } from "../lib/module-federation";
import { Widget, WidgetState } from "../store";

type WidgetProps = {
  widget: Widget;
  store: UseBoundStore<Mutate<StoreApi<WidgetState>, any>>;
  fallbackError?: ComponentType<FallbackProps>;
  fallbackLoading?: string | React.ReactNode;
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
  ...props
}) => {
  const events = store((state) => state.events);
  const [loading, setLoading] = useState(true);
  const [Component, setComponent] = useState<React.ElementType>();

  useEffect(() => {
    if (widget.type === "native") {
      if (widget.native && widget.native.module && widget.native.remote) {
        const remote = widget.native.remote;
        const module = widget.native.module;
        const url = widget.url;

        const lazyFactory = () => loadRemoteModule(remote, module, url);
        setComponent(React.lazy(lazyFactory));
      }
      setLoading(false);
    }
  }, []);

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
            style={{
              width: "calc(100% + 8px)",
              height: "100%",
              border: "none",
              margin: "-0.25rem",
            }}
            heightCalculationMethod="lowestElement"
            onLoad={onLoad}
          />
        </>
      ) : loading ? (
        fallbackLoading
      ) : Component ? (
        <React.Suspense fallback={fallbackLoading}>
          <Component widget={widget} store={store} {...props} />
        </React.Suspense>
      ) : null}
    </ErrorBoundary>
  );
};
