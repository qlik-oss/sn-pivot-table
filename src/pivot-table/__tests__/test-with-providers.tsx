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
    selections = {
      isActive: () => false,
      isModal: () => false,
      on: () => undefined,
      removeListener: () => undefined,
      begin: () => Promise.resolve(),
      select: () => Promise.resolve(),
    } as unknown as ExtendedSelections,
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
      dimensionValue: {
        fontSize: "12px",
        fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
        fontWeight: "600",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#404040",
        background: "transparent",
      },
      measureValue: {
        fontSize: "12px",
        fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
        fontWeight: "600",
        fontStyle: "normal",
        textDecoration: "none",
        color: "contentColor",
        background: "contentBackground",
      },
      measureLabel: {
        fontWeight: "600",
        fontStyle: "normal",
        textDecoration: "none",
        color: "measureLabelColor",
        background: "measureLabelBackground",
      },
      totalValue: {
        fontWeight: "600",
        fontStyle: "normal",
        textDecoration: "none",
        color: "totalValueColor",
        background: "totalValueBackground",
      },
      nullValue: {
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
      background: { tableColorFromTheme: "inherit", isDark: false, isTransparent: false, color: "transparent" },
    } as ExtendedTheme,
    keyboard = {} as stardust.Keyboard,
  } = props;

  return (
    <BaseProvider model={model} app={app} interactions={interactions} embed={embed} theme={theme} keyboard={keyboard}>
      <SelectionsProvider selections={selections} updatePageInfo={updatePageInfo}>
        <StyleProvider styleService={styleService}>{children}</StyleProvider>
      </SelectionsProvider>
    </BaseProvider>
  );
};

export default TestWithProvider;
