declare const __webpack_init_sharing__: (scope: string) => Promise<void>;
declare const __webpack_share_scopes__: any;
let initialSharingScopeCreated = false;

const loadModule = (url: string) => import(/* webpackIgnore:true */ url);

const loadRemoteContainer = async (remoteName: string, containerUrl: string, scope: string): Promise<any> => {
  if (!initialSharingScopeCreated) {
    initialSharingScopeCreated = true;
    await __webpack_init_sharing__(scope);
  }
  const container = await loadModule(containerUrl);
  await container.init(__webpack_share_scopes__[scope]);
  return container;
};

export const loadRemoteModule = async (
  remoteName: string,
  moduleName: string,
  url: string,
  scope = "default"
): Promise<any> => {
  const container = await loadRemoteContainer(remoteName, url, scope);
  const factory = await container.get(moduleName);
  const Module = factory();
  return Module;
};
