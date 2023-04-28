import React from "react";
import { ExtendedSelections, LayoutService } from "../../types/types";
import { RootProps } from "../Root";
import { DEFAULT_CELL_HEIGHT } from "../constants";
import SelectionsProvider from "../contexts/SelectionsProvider";
import StyleProvider from "../contexts/StyleProvider";

interface Props extends Partial<RootProps> {
  children: JSX.Element;
}

export const TestWithProvider = (props: Props) => {
  const {
    children,
    selections = {
      isActive: () => false,
      isModal: () => false,
      on: () => undefined,
      removeListener: () => undefined,
    } as unknown as ExtendedSelections,
    styleService = {
      header: { color: "white", fontSize: "16px", fontFamily: "Arial" },
      content: { color: "white", fontSize: "12px", fontFamily: "sans-serif" },
      backgroundColor: "red",
      lineClamp: 1,
      headerCellHeight: DEFAULT_CELL_HEIGHT,
      contentCellHeight: DEFAULT_CELL_HEIGHT,
    },
    layoutService = {
      layout: {},
      getNullValueText: () => "-",
      getMeasureInfoIndexFromCellIndex: () => 0,
      isDimensionLocked: () => false,
      size: { x: 1, y: 2 },
      isSnapshot: false,
      hasLimitedData: false,
    } as unknown as LayoutService,
  } = props;

  return (
    <SelectionsProvider selections={selections}>
      <StyleProvider styleService={styleService}>{children}</StyleProvider>
    </SelectionsProvider>
  );
};
