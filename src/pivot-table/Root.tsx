/* eslint-disable react/jsx-props-no-spreading  */
import React from "react";
import { Root } from "react-dom/client";
import { ExtendedSelections, StyleService } from "../types/types";
import { PivotTableProps } from "./components/PivotTable";
import { Wrapper } from "./components/Wrapper";
import SelectionsProvider from "./contexts/SelectionsProvider";
import StyleProvider from "./contexts/StyleProvider";

export interface RootProps extends PivotTableProps {
  selections: ExtendedSelections;
  styleService: StyleService;
}

const render = (reactRoot: Root, props: RootProps): void => {
  reactRoot.render(
    <React.StrictMode>
      <SelectionsProvider selections={props.selections}>
        <StyleProvider styleService={props.styleService}>
          <Wrapper {...props} />
        </StyleProvider>
      </SelectionsProvider>
    </React.StrictMode>
  );
};

export default render;
