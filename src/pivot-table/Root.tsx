/* eslint-disable react/jsx-props-no-spreading  */
import type { stardust } from "@nebula.js/stardust";
import React from "react";
import type { Root } from "react-dom/client";
import { PageInfo } from "../hooks/use-pivot-table";
import type { Data, ExtendedSelections, StyleService } from "../types/types";
import { Wrapper, WrapperProps } from "./components/Wrapper";
import SelectionsProvider from "./contexts/SelectionsProvider";
import StyleProvider from "./contexts/StyleProvider";

export interface RootProps extends WrapperProps {
  pvData: Data;
  pageInfo: PageInfo;
  selections: ExtendedSelections;
  styleService: StyleService;
  translator: stardust.Translator;
  updatePageInfo: (args: Partial<PageInfo>) => void;
}

const render = (reactRoot: Root, props: RootProps): void => {
  const { selections, styleService } = props;

  reactRoot.render(
    <React.StrictMode>
      <SelectionsProvider selections={selections}>
        <StyleProvider styleService={styleService}>
          <Wrapper {...props} />
        </StyleProvider>
      </SelectionsProvider>
    </React.StrictMode>
  );
};

export default render;
