/* eslint-disable react/jsx-props-no-spreading  */
import type { stardust } from "@nebula.js/stardust";
import React from "react";
import { type Root } from "react-dom/client";
import type { App } from "../types/QIX";
import type { ExtendedSelections, PageInfo, StyleService } from "../types/types";
import type { PivotTableProps } from "./components/PivotTable";
import { Wrapper } from "./components/Wrapper";
import BaseProvider from "./contexts/BaseProvider";
import SelectionsProvider from "./contexts/SelectionsProvider";
import StyleProvider from "./contexts/StyleProvider";

export interface RootProps extends PivotTableProps {
  selections: ExtendedSelections;
  styleService: StyleService;
  translator: stardust.Translator;
  updatePageInfo: (args: Partial<PageInfo>) => void;
  app: App;
  interactions: stardust.Interactions;
  embed: stardust.Embed;
}

const render = (reactRoot: Root, props: RootProps): void => {
  const { selections, styleService, app, model, interactions, embed } = props;

  reactRoot.render(
    <React.StrictMode>
      <BaseProvider app={app} model={model} interactions={interactions} embed={embed}>
        <SelectionsProvider selections={selections} updatePageInfo={props.updatePageInfo}>
          <StyleProvider styleService={styleService}>
            <Wrapper {...props} />
          </StyleProvider>
        </SelectionsProvider>
      </BaseProvider>
    </React.StrictMode>,
  );
};

export default render;
