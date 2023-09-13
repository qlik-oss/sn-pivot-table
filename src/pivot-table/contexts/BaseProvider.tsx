import type { stardust } from "@nebula.js/stardust";
import React, { createContext, useContext, useMemo } from "react";
import type { App, Model } from "../../types/QIX";

interface IBaseProvider {
  model: Model;
  app: App;
  interactions: stardust.Interactions;
  embed: stardust.Embed;
}

interface BaseProviderProps extends IBaseProvider {
  children: JSX.Element | JSX.Element[];
}

const NOOP_BASE = {} as IBaseProvider;

const BaseContext = createContext<IBaseProvider>(NOOP_BASE);

export const useBaseContext = (): IBaseProvider => useContext(BaseContext);

/**
 * Provider that providers properties that are not expected to change very often
 * during the lifecycle of the chart and does not need a layer of abstraction on
 * top of them. This typically means properties coming from @nebula.js/stardust hooks.
 *
 * The whole purpose of this provider is to avoid prop-drilling those props.
 */
const BaseProvider = ({ children, model, app, interactions, embed }: BaseProviderProps): JSX.Element => {
  const props = useMemo(() => ({ model, app, interactions, embed }), [app, interactions, model, embed]);

  return <BaseContext.Provider value={props}>{children}</BaseContext.Provider>;
};

export default BaseProvider;
