import React, { createContext, useContext, useMemo } from "react";
import { LayoutService, StyleService } from "../../types/types";
import { DEFAULT_ROW_HEIGHT } from "../constants";
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
  const { headerCellHeight, contentCellHeight } = useCellHeight({ styleService, layoutService });

  const rowHeight = useMemo(
    () => layoutService.layout.components?.find((n) => n.key === "theme")?.rowHeight,
    [layoutService.layout.components]
  );

  const memoisedProps: StyleService = useMemo(() => {
    const lineClamp = rowHeight?.linesCount || 1;
    const cellHeight = DEFAULT_ROW_HEIGHT * lineClamp;
    return { ...styleService, cellHeight, lineClamp, headerCellHeight, contentCellHeight };
  }, [styleService, rowHeight?.linesCount, headerCellHeight, contentCellHeight]);

  return <StyleContext.Provider value={memoisedProps}>{children}</StyleContext.Provider>;
};

export default StyleProvider;
