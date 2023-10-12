import type { ExtendedTheme } from "@qlik/nebula-table-utils/lib/hooks/use-extended-theme/types";
import { DEFAULT_FONT_FAMILY } from "../../pivot-table/constants";
import type { Component, PaletteColor } from "../../types/QIX";
import type { LayoutService, StyleService } from "../../types/types";
import createStyleService from "../style-service";

describe("style-service", () => {
  let themeValue: string | undefined = "18px"; // Choosing a value that works for the cellHeight calculation
  let fontSize: string;
  let fontFamily: string;
  let color: string;
  let colorFromPalette: string;
  let lineClamp: number;
  let layoutServiceMock: LayoutService;
  let themeMock: ExtendedTheme;

  beforeEach(() => {
    fontSize = "15px";
    fontFamily = "Arial";
    color = "#ff0000";
    colorFromPalette = "#00ff00";
    lineClamp = 2;
    themeMock = {
      getStyle: (basePath: string, path: string, attribute: string) =>
        attribute === "lineClamp" && themeValue !== undefined ? lineClamp : themeValue,
      getColorPickerColor: (paletteColor: PaletteColor) =>
        paletteColor.index && paletteColor.index > -1 ? colorFromPalette : color,
    } as unknown as ExtendedTheme;
    layoutServiceMock = {
      layout: {
        components: [
          {
            key: "theme",
            header: {
              fontSize,
              fontFamily,
              fontColor: { index: -1, color },
              fontStyle: ["bold", "italic", "underline"],
              background: { index: -1, color },
            },
            measureValues: {
              fontSize,
              fontFamily,
              fontStyle: ["bold", "italic", "underline"],
              fontColor: { index: -1, color },
              background: { index: -1, color },
            },
            dimensionValues: {
              fontSize,
              fontFamily,
              fontStyle: ["bold", "italic", "underline"],
              fontColor: { index: -1, color },
              background: { index: -1, color },
            },
            measureLabels: {
              fontStyle: ["bold", "italic", "underline"],
              fontColor: { index: -1, color },
              background: { index: -1, color },
            },
            nullValues: {
              fontStyle: ["bold", "italic", "underline"],
              fontColor: { index: -1, color },
              background: { index: -1, color },
            },
            totalValues: {
              fontStyle: ["bold", "italic", "underline"],
              fontColor: { index: -1, color },
              background: { index: -1, color },
            },
            grid: {
              lineClamp,
              border: "borderColor",
              divider: "dividerColor",
              background: { index: -1, color },
            },
          } as Component,
          { key: "general" },
        ],
      },
    } as unknown as LayoutService;
  });

  test("should resolve style from layout", () => {
    const styleService = createStyleService(themeMock, layoutServiceMock);
    expect(styleService).toEqual({
      header: {
        fontSize,
        fontFamily,
        fontWeight: "600",
        fontStyle: "italic",
        textDecoration: "underline",
        color,
        background: color,
        activeBackground: "rgb(255, 59, 29)",
        hoverBackground: "rgb(255, 43, 18)",
      },
      measureValues: {
        fontSize,
        fontFamily,
        fontWeight: "600",
        fontStyle: "italic",
        textDecoration: "underline",
        color,
        background: color,
      },
      dimensionValues: {
        fontSize,
        fontFamily,
        fontWeight: "600",
        fontStyle: "italic",
        textDecoration: "underline",
        color,
        background: color,
      },
      measureLabels: {
        fontWeight: "600",
        fontStyle: "italic",
        textDecoration: "underline",
        color,
        background: color,
      },
      totalValues: {
        fontWeight: "600",
        fontStyle: "italic",
        textDecoration: "underline",
        color,
        background: color,
      },
      nullValues: {
        fontWeight: "600",
        fontStyle: "italic",
        textDecoration: "underline",
        color,
        background: color,
      },
      grid: {
        lineClamp,
        border: color,
        divider: color,
        background: color,
      },
      headerCellHeight: 32,
      contentCellHeight: 48,
    } as StyleService);
  });

  test("should resolve style from theme", () => {
    layoutServiceMock.layout.components = [];
    const styleService = createStyleService(themeMock, layoutServiceMock);

    expect(styleService).toEqual({
      header: {
        fontSize: "18px",
        fontFamily: "18px",
        fontWeight: "600",
        fontStyle: "normal",
        textDecoration: "none",
        color: "18px",
        background: "18px",
        activeBackground: "rgb(0, 0, 0)",
        hoverBackground: "rgb(0, 0, 0)",
      },
      measureValues: {
        fontSize: "18px",
        fontFamily: "18px",
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        color: "18px",
        background: "18px",
      },
      dimensionValues: {
        fontSize: "18px",
        fontFamily: "18px",
        fontWeight: undefined,
        fontStyle: "normal",
        textDecoration: "none",
        color: "18px",
        background: "18px",
      },
      measureLabels: {
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        color: "18px",
        background: "18px",
      },
      totalValues: {
        fontWeight: "600",
        fontStyle: "normal",
        textDecoration: "none",
        color: "18px",
        background: "18px",
      },
      nullValues: {
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        color: "18px",
        background: "18px",
      },
      grid: {
        lineClamp,
        border: "18px",
        divider: "18px",
        background: "18px",
      },
      headerCellHeight: 32,
      contentCellHeight: 56,
    } as StyleService);
  });

  test("should resolve style from default values", () => {
    themeValue = undefined;
    layoutServiceMock.layout.components = [];
    const styleService = createStyleService(themeMock, layoutServiceMock);

    expect(styleService).toEqual({
      header: {
        fontSize: "12px",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontWeight: "600",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#404040",
        background: "transparent",
        activeBackground: "rgba(0, 0, 0, 0.05)",
        hoverBackground: "rgba(0, 0, 0, 0.03)",
      },
      measureValues: {
        fontSize: "12px",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        color: "rgba(0, 0, 0, 0.55)",
        background: "transparent",
      },
      dimensionValues: {
        fontSize: "12px",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontWeight: undefined,
        fontStyle: "normal",
        textDecoration: "none",
        color: "#404040",
        background: "transparent",
      },
      measureLabels: {
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#404040",
        background: "transparent",
      },
      totalValues: {
        fontWeight: "600",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#404040",
        background: "transparent",
      },
      nullValues: {
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#404040",
        background: "rgba(0, 0, 0, 0.05)",
      },
      grid: {
        lineClamp: 1,
        border: "rgba(0, 0, 0, 0.15)",
        divider: "rgba(0, 0, 0, 0.6)",
        background: "transparent",
      },
      headerCellHeight: 32,
      contentCellHeight: 24,
    } as StyleService);
  });
});
