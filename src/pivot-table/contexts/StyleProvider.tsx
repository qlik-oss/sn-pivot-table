import type { ReactNode } from "react";
import React, { createContext, useContext } from "react";
import type { StyleService } from "../../types/types";

interface StyleProviderProps {
  children: ReactNode;
  styleService: StyleService;
}

const NOOP_STYLE_SERVICE = {} as StyleService;

const StyleContext = createContext<StyleService>(NOOP_STYLE_SERVICE);

export const useStyleContext = (): StyleService => useContext(StyleContext);

const StyleProvider = ({ children, styleService }: StyleProviderProps) => (
  <StyleContext.Provider value={styleService}>{children}</StyleContext.Provider>
);

export default StyleProvider;
