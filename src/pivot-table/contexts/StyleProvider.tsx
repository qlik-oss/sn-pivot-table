import React, { createContext, useContext, useMemo } from "react";
import { LayoutService, StyleService } from "../../types/types";
import { DEFAULT_ROW_HEIGHT } from "../constants";

interface StyleProviderProps {
  children: JSX.Element | JSX.Element[];
  styleService: StyleService;
  layoutService: LayoutService;
}

const NOOP_STYLE_SERVICE = {} as StyleService;

const StyleContext = createContext<StyleService>(NOOP_STYLE_SERVICE);

export const useStyleContext = (): StyleService => useContext(StyleContext);

const StyleProvider = ({ children, styleService, layoutService }: StyleProviderProps): JSX.Element => {
  const rowHeight = useMemo(
    () => layoutService.layout.components?.find((n) => n.key === "theme")?.rowHeight,
    [layoutService.layout.components]
  );

  const memoisedProps = useMemo(() => {
    const cellHeight = DEFAULT_ROW_HEIGHT * (rowHeight?.linesCount || 3);
    return { ...styleService, cellHeight };
  }, [styleService, rowHeight?.linesCount]);

  return <StyleContext.Provider value={memoisedProps}>{children}</StyleContext.Provider>;
};

export default StyleProvider;
