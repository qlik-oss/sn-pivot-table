import type { stardust } from "@nebula.js/stardust";
import type { ExtendedTheme } from "@qlik/nebula-table-utils/lib/hooks/use-extended-theme/types";
import React from "react";
import type { App, Model } from "../../types/QIX";
import type { ExtendedSelections } from "../../types/types";
import type { RootProps } from "../Root";
import { DEFAULT_CELL_HEIGHT } from "../constants";
import BaseProvider from "../contexts/BaseProvider";
import SelectionsProvider from "../contexts/SelectionsProvider";
import StyleProvider from "../contexts/StyleProvider";

interface Props extends Partial<RootProps> {
  children: JSX.Element | JSX.Element[];
}

const TestWithProvider = (props: Props) => {
  const {
    children,
    selections,
    updatePageInfo = () => undefined,
    styleService = {
      header: {
        fontSize: "12px",
        fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
        fontWeight: "600",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#404040",
        background: "transparent",
        activeBackground: "rgba(0, 0, 0, 0.05)",
        hoverBackground: "rgba(0, 0, 0, 0.03)",
      },
      dimensionValues: {
        fontSize: "12px",
        fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
        fontWeight: "600",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#404040",
        background: "transparent",
      },
      measureValues: {
        fontSize: "12px",
        fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
        fontWeight: "600",
        fontStyle: "normal",
        textDecoration: "none",
        color: "contentColor",
        background: "contentBackground",
      },
      measureLabels: {
        fontWeight: "600",
        fontStyle: "normal",
        textDecoration: "none",
        color: "measureLabelColor",
        background: "measureLabelBackground",
      },
      totalValues: {
        fontWeight: "600",
        fontStyle: "normal",
        textDecoration: "none",
        color: "totalValueColor",
        background: "totalValueBackground",
      },
      nullValues: {
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        color: "nullColor",
        background: "nullBackground",
      },
      grid: {
        lineClamp: 1,
        border: "rgba(0, 0, 0, 0.15)",
        divider: "rgba(0, 0, 0, 0.6)",
        background: "transparent",
      },
      headerCellHeight: DEFAULT_CELL_HEIGHT,
      contentCellHeight: DEFAULT_CELL_HEIGHT,
    },
    app = { getField: () => Promise.resolve() } as unknown as App,
    model = { applyPatches: () => Promise.resolve(), getLayout: () => Promise.resolve({}) } as unknown as Model,
    interactions = { select: true, active: true },
    embed = {} as stardust.Embed,
    theme = {
      getStyle: (base, path, attr) => attr,
      background: { tableColorFromTheme: "inherit", isDark: false, isTransparent: false, color: "transparent" },
    } as ExtendedTheme,
    keyboard = {} as stardust.Keyboard,
  } = props;

  // This enables only overriding one or several default properties, not necessarily the entire object
  const mockedSelections = {
    ...{
      isActive: () => false,
      isModal: () => false,
      on: () => undefined,
      removeListener: () => undefined,
      begin: () => Promise.resolve(),
      select: () => Promise.resolve(),
    },
    ...selections,
  } as unknown as ExtendedSelections;

  return (
    <BaseProvider model={model} app={app} interactions={interactions} embed={embed} theme={theme} keyboard={keyboard}>
      <SelectionsProvider selections={mockedSelections} updatePageInfo={updatePageInfo}>
        <StyleProvider styleService={styleService}>{children}</StyleProvider>
      </SelectionsProvider>
    </BaseProvider>
  );
};

export default TestWithProvider;
