/* eslint-disable react/jsx-props-no-spreading  */
import React from "react";
import { Root } from "react-dom/client";
import { ExtendedSelections, StyleService } from "../types/types";
import { PivotTableProps, StickyPivotTable } from "./components/PivotTable";
import SelectionsProvider from "./contexts/SelectionsProvider";
import StyleProvider from "./contexts/StyleProvider";

interface RootProps extends PivotTableProps {
  selections: ExtendedSelections;
  styleService: StyleService;
}

const render = (reactRoot: Root, props: RootProps): void => {
  reactRoot.render(
    <React.StrictMode>
      <SelectionsProvider selections={props.selections}>
        <StyleProvider styleService={props.styleService}>
          <StickyPivotTable {...props} />
        </StyleProvider>
      </SelectionsProvider>
    </React.StrictMode>
  );
};

export default render;
