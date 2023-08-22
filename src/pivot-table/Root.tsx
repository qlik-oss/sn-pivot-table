/* eslint-disable react/jsx-props-no-spreading  */
import type { stardust } from "@nebula.js/stardust";
import React from "react";
import { type Root } from "react-dom/client";
import type {
  ChangeActivelySortedHeader,
  ChangeSortOrder,
  ExtendedSelections,
  PageInfo,
  StyleService,
} from "../types/types";
import type { PivotTableProps } from "./components/PivotTable";
import { Wrapper } from "./components/Wrapper";
import SelectionsProvider from "./contexts/SelectionsProvider";
import StyleProvider from "./contexts/StyleProvider";

export interface RootProps extends PivotTableProps {
  selections: ExtendedSelections;
  styleService: StyleService;
  translator: stardust.Translator;
  updatePageInfo: (args: Partial<PageInfo>) => void;
  changeSortOrder: ChangeSortOrder;
  changeActivelySortedHeader: ChangeActivelySortedHeader;
}

const render = (reactRoot: Root, props: RootProps): void => {
  const { selections, styleService } = props;

  reactRoot.render(
    <React.StrictMode>
      <SelectionsProvider selections={selections} updatePageInfo={props.updatePageInfo}>
        <StyleProvider styleService={styleService}>
          <Wrapper {...props} />
        </StyleProvider>
      </SelectionsProvider>
    </React.StrictMode>
  );
};

export default render;
