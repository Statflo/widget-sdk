import React, { lazy, useEffect, useState } from "react";

import { useDynamicScript } from "./useDynamicScript";

declare global {
  interface Window {
    [key: string]: any;
  }
}

declare const __webpack_init_sharing__: (scope: string) => Promise<void>;
declare const __webpack_share_scopes__: any;

function loadComponent(remoteUrl: string, scope: string, module: string) {
  return async () => {
    await __webpack_init_sharing__("default");
    const container = await import(remoteUrl);

    await container.init(__webpack_share_scopes__.default);
    const factory = await container.get(module);
    const Module = factory();
    return Module;
  };
}

const componentCache = new Map();

export const useFederatedComponent = (
  remoteUrl: string,
  scope: string,
  module?: string
) => {
  if (!module) return { errorLoading: false, Component: null };

  const key = `${remoteUrl}-${scope}-${module}`;
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(
    null
  );

  const { ready, errorLoading } = useDynamicScript(remoteUrl);

  useEffect(() => {
    if (Component) setComponent(null);
  }, [key]);

  useEffect(() => {
    if (ready && !Component) {
      const Comp = lazy(loadComponent(remoteUrl, scope, module));
      componentCache.set(key, Comp);
      setComponent(Comp);
    }
  }, [Component, ready, key]);

  return { errorLoading, Component };
};
