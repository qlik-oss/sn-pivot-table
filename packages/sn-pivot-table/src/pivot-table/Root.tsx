/* eslint-disable react/jsx-props-no-spreading  */
import { ThemeProvider } from "@mui/material/styles";
import type { stardust } from "@nebula.js/stardust";
import type { ExtendedTheme } from "@qlik/nebula-table-utils/lib/hooks/use-extended-theme/types";
import React from "react";
import { type Root } from "react-dom/client";
import type { App } from "../types/QIX";
import type { ExtendedSelections, Flags, PageInfo, StyleService } from "../types/types";
import type { PivotTableProps } from "./components/PivotTable";
import { Wrapper } from "./components/Wrapper";
import BaseProvider from "./contexts/BaseProvider";
import SelectionsProvider from "./contexts/SelectionsProvider";
import StyleProvider from "./contexts/StyleProvider";
import muiSetup from "./mui-setup";

export interface RootProps extends PivotTableProps {
  selections: ExtendedSelections;
  styleService: StyleService;
  translator: stardust.Translator;
  updatePageInfo: (args: Partial<PageInfo>) => void;
  app: App;
  interactions: stardust.Interactions;
  embed: stardust.Embed;
  keyboard: stardust.Keyboard;
  theme: ExtendedTheme;
  flags: Flags;
}

const render = (reactRoot: Root, props: RootProps): void => {
  const { selections, styleService, app, model, interactions, embed, keyboard, theme, flags } = props;
  const muiTheme = muiSetup("ltr");

  reactRoot.render(
    <React.StrictMode>
      <ThemeProvider theme={muiTheme}>
        <BaseProvider
          app={app}
          model={model}
          interactions={interactions}
          embed={embed}
          keyboard={keyboard}
          theme={theme}
          flags={flags}
        >
          <SelectionsProvider selections={selections} updatePageInfo={props.updatePageInfo}>
            <StyleProvider styleService={styleService}>
              <Wrapper {...props} />
            </StyleProvider>
          </SelectionsProvider>
        </BaseProvider>
      </ThemeProvider>
    </React.StrictMode>,
  );
};

export default render;
