import React, { createContext, useContext, useMemo } from "react";
import { ExtendedTheme, LayoutService } from "../../types/types";
import { Styling, createStyling } from "./create-styling";

interface StyleProviderProps {
  children: JSX.Element | JSX.Element[];
  theme: ExtendedTheme;
  layoutService: LayoutService;
}

const NOOP_STYLE_SERVICE = {} as Styling;

const StyleContext = createContext<Styling>(NOOP_STYLE_SERVICE);

export const useStyleContext = (): Styling => useContext(StyleContext);

const StyleProvider = ({ children, theme, layoutService }: StyleProviderProps): JSX.Element => {
  const memoisedStyling = useMemo(() => createStyling(layoutService, theme), [layoutService, theme]);

  return <StyleContext.Provider value={memoisedStyling}>{children}</StyleContext.Provider>;
};

export default StyleProvider;
