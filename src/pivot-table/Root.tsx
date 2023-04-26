/* eslint-disable react/jsx-props-no-spreading  */
import React from "react";
import { Root } from "react-dom/client";
import { ExtendedSelections, ExtendedTheme } from "../types/types";
import { PivotTableProps, StickyPivotTable } from "./components/PivotTable";
import SelectionsProvider from "./contexts/SelectionsProvider";
import StyleProvider from "./contexts/StyleProvider";

interface RootProps extends PivotTableProps {
  selections: ExtendedSelections;
  theme: ExtendedTheme;
}

const render = (reactRoot: Root, props: RootProps): void => {
  reactRoot.render(
    <React.StrictMode>
      <SelectionsProvider selections={props.selections}>
        <StyleProvider theme={props.theme} layoutService={props.layoutService}>
          <StickyPivotTable {...props} />
        </StyleProvider>
      </SelectionsProvider>
    </React.StrictMode>
  );
};

export default render;
