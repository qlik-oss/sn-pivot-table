import React, { createContext, useContext } from "react";
import type { StyleService } from "../../types/types";

interface StyleProviderProps {
  children: JSX.Element | JSX.Element[];
  styleService: StyleService;
}

const NOOP_STYLE_SERVICE = {} as StyleService;

const StyleContext = createContext<StyleService>(NOOP_STYLE_SERVICE);

export const useStyleContext = (): StyleService => useContext(StyleContext);

const StyleProvider = ({ children, styleService }: StyleProviderProps): JSX.Element => (
  <StyleContext.Provider value={styleService}>{children}</StyleContext.Provider>
);

export default StyleProvider;
