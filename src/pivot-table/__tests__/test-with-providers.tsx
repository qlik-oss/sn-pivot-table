import React from "react";
import type { ExtendedSelections } from "../../types/types";
import type { RootProps } from "../Root";
import { DEFAULT_CELL_HEIGHT } from "../constants";
import SelectionsProvider from "../contexts/SelectionsProvider";
import StyleProvider from "../contexts/StyleProvider";

interface Props extends Partial<RootProps> {
  children: JSX.Element;
}

const TestWithProvider = (props: Props) => {
  const {
    children,
    selections = {
      isActive: () => false,
      isModal: () => false,
      on: () => undefined,
      removeListener: () => undefined,
    } as unknown as ExtendedSelections,
    styleService = {
      header: {
        fontSize: "12px",
        fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
        background: "transparent",
        rowTitle: {
          color: "#404040",
          background: "transparent",
        },
        columnTitle: {
          color: "#404040",
          background: "transparent",
        },
      },
      content: {
        fontSize: "12px",
        fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
        color: "rgba(0, 0, 0, 0.55)",
        background: "transparent",
        nullValue: {
          color: "#404040",
          background: "rgba(0, 0, 0, 0.05)",
        },
        totalValue: {
          color: "#404040",
          background: "transparent",
        },
      },
      rowContent: {
        fontSize: "12px",
        fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
        color: "#404040",
        background: "transparent",
        nullValue: {
          color: "#404040",
          background: "rgba(0, 0, 0, 0.05)",
        },
        totalLabel: {
          color: "#404040",
          background: "transparent",
        },
        measureLabel: {
          color: "rgba(0, 0, 0, 0.55)",
          background: "transparent",
        },
      },
      columnContent: {
        fontSize: "12px",
        fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
        color: "#404040",
        background: "transparent",
        nullValue: {
          color: "#404040",
          background: "rgba(0, 0, 0, 0.05)",
        },
        totalLabel: {
          color: "#404040",
          background: "transparent",
        },
        measureLabel: {
          color: "rgba(0, 0, 0, 0.55)",
          background: "transparent",
        },
      },
      grid: {
        rowHeight: "compact",
        lineCount: 1,
        border: "rgba(0, 0, 0, 0.15)",
        divider: "rgba(0, 0, 0, 0.6)",
      },
      lineClamp: 1,
      headerCellHeight: DEFAULT_CELL_HEIGHT,
      contentCellHeight: DEFAULT_CELL_HEIGHT,
    },
  } = props;

  return (
    <SelectionsProvider selections={selections}>
      <StyleProvider styleService={styleService}>{children}</StyleProvider>
    </SelectionsProvider>
  );
};

export default TestWithProvider;
