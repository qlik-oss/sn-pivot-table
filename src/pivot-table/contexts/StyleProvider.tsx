import React, { createContext, useContext, useMemo } from "react";
import { LayoutService, StyleService } from "../../types/types";
import useCellHeight from "../hooks/use-cell-height";

interface StyleProviderProps {
  children: JSX.Element | JSX.Element[];
  styleService: StyleService;
  layoutService: LayoutService;
}

const NOOP_STYLE_SERVICE = {} as StyleService;

const StyleContext = createContext<StyleService>(NOOP_STYLE_SERVICE);

export const useStyleContext = (): StyleService => useContext(StyleContext);

const StyleProvider = ({ children, styleService, layoutService }: StyleProviderProps): JSX.Element => {
  const cellHeightData = useCellHeight({ styleService, layoutService });

  const memoisedProps: StyleService = useMemo(
    () => ({ ...styleService, ...cellHeightData }),
    [styleService, cellHeightData]
  );

  return <StyleContext.Provider value={memoisedProps}>{children}</StyleContext.Provider>;
};

export default StyleProvider;
