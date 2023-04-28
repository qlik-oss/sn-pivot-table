/* eslint-disable react/jsx-props-no-spreading  */
import { stardust } from "@nebula.js/stardust";
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
  translator: stardust.Translator;
}

const render = (reactRoot: Root, props: RootProps): void => {
  const { selections, styleService, layoutService, translator } = props;

  reactRoot.render(
    <React.StrictMode>
      <SelectionsProvider selections={selections}>
        <StyleProvider styleService={styleService} layoutService={layoutService}>
          <Wrapper {...props} translator={translator} />
        </StyleProvider>
      </SelectionsProvider>
    </React.StrictMode>
  );
};

export default render;
