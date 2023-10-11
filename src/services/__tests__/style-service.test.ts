import type { ExtendedTheme } from "@qlik/nebula-table-utils/lib/hooks/use-extended-theme/types";
import { DEFAULT_FONT_FAMILY } from "../../pivot-table/constants";
import type { PaletteColor } from "../../types/QIX";
import type { LayoutService } from "../../types/types";
import createStyleService from "../style-service";

describe("style-service", () => {
  let themeValue: string | undefined = "18px"; // Choosing a value that works for the cellHeight calculation
  let fontSize: number;
  let fontFamily: string;
  let color: string;
  let colorFromPalette: string;
  let lineClamp: number;
  let layoutServiceMock: LayoutService;
  let themeMock: ExtendedTheme;

  beforeEach(() => {
    fontSize = 15;
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
            content: {
              fontSize,
              fontFamily,
              fontStyle: ["bold", "italic", "underline"],
              fontColor: { index: -1, color },
              background: { index: -1, color },
            },
            rowContent: {
              fontSize,
              fontFamily,
              fontStyle: ["bold", "italic", "underline"],
              fontColor: { index: -1, color },
              background: { index: -1, color },
              measureLabel: {
                fontColor: { index: -1, color },
                background: { index: -1, color },
              },
            },
            columnContent: {
              fontSize,
              fontFamily,
              fontStyle: ["bold", "italic", "underline"],
              fontColor: { index: -1, color },
              background: { index: -1, color },
              measureLabel: {
                fontColor: { index: -1, color },
                background: { index: -1, color },
              },
            },
            nullValue: {
              fontColor: { index: -1, color },
              background: { index: -1, color },
            },
            totalValue: {
              fontColor: { index: -1, color },
              background: { index: -1, color },
            },
            grid: {
              rowHeight: "compact",
              lineClamp,
              border: "borderColor",
              divider: "dividerColor",
              background: { index: -1, color },
            },
          },
          { key: "general" },
        ],
      },
    } as unknown as LayoutService;
  });

  test("should resolve style from layout", () => {
    const styleService = createStyleService(themeMock, layoutServiceMock);
    expect(styleService).toEqual({
      header: {
        fontSize: `${fontSize}px`,
        fontFamily,
        fontWeight: "600",
        fontStyle: "italic",
        textDecoration: "underline",
        color,
        background: color,
        activeBackground: "rgb(255, 59, 29)",
        hoverBackground: "rgb(255, 43, 18)",
      },
      content: {
        fontSize: `${fontSize}px`,
        fontFamily,
        fontWeight: "600",
        fontStyle: "italic",
        textDecoration: "underline",
        color,
        background: color,
        lineClamp,
      },
      rowContent: {
        fontSize: `${fontSize}px`,
        fontFamily,
        fontWeight: "600",
        fontStyle: "italic",
        textDecoration: "underline",
        color,
        background: color,
        measureLabel: {
          color,
          background: color,
        },
      },
      columnContent: {
        fontSize: `${fontSize}px`,
        fontFamily,
        fontWeight: "600",
        fontStyle: "italic",
        textDecoration: "underline",
        color,
        background: color,
        measureLabel: {
          color,
          background: color,
        },
      },
      totalValue: {
        fontWeight: "600",
        fontStyle: "normal",
        textDecoration: "none",
        color,
        background: color,
      },
      nullValue: {
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        color,
        background: color,
      },
      grid: {
        rowHeight: "compact",
        border: color,
        divider: color,
        background: color,
      },
      headerCellHeight: 32,
      contentCellHeight: 48,
    });
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
      content: {
        fontSize: "18px",
        fontFamily: "18px",
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        color: "18px",
        background: "18px",
        lineClamp,
      },
      rowContent: {
        fontSize: "18px",
        fontFamily: "18px",
        fontWeight: undefined,
        fontStyle: "normal",
        textDecoration: "none",
        color: "18px",
        background: "18px",
        measureLabel: { color: "18px", background: "18px" },
      },
      columnContent: {
        fontSize: "18px",
        fontFamily: "18px",
        fontWeight: undefined,
        fontStyle: "normal",
        textDecoration: "none",
        color: "18px",
        background: "18px",
        measureLabel: { color: "18px", background: "18px" },
      },
      totalValue: {
        fontWeight: "600",
        fontStyle: "normal",
        textDecoration: "none",
        color: "18px",
        background: "18px",
      },
      nullValue: {
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        color: "18px",
        background: "18px",
      },
      grid: {
        rowHeight: "18px",
        border: "18px",
        divider: "18px",
        background: "18px",
      },
      headerCellHeight: 32,
      contentCellHeight: 56,
    });
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
      content: {
        fontSize: "12px",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        color: "rgba(0, 0, 0, 0.55)",
        background: "transparent",
        lineClamp: 1,
      },
      rowContent: {
        fontSize: "12px",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontWeight: undefined,
        fontStyle: "normal",
        textDecoration: "none",
        color: "#404040",
        background: "transparent",
        measureLabel: { color: "rgba(0, 0, 0, 0.55)", background: "transparent" },
      },
      columnContent: {
        fontSize: "12px",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontWeight: undefined,
        fontStyle: "normal",
        textDecoration: "none",
        color: "#404040",
        background: "transparent",
        measureLabel: { color: "rgba(0, 0, 0, 0.55)", background: "transparent" },
      },
      totalValue: {
        fontWeight: "600",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#404040",
        background: "rgba(0, 0, 0, 0.05)",
      },
      nullValue: {
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#404040",
        background: "rgba(0, 0, 0, 0.05)",
      },
      grid: {
        rowHeight: "compact",
        border: "rgba(0, 0, 0, 0.15)",
        divider: "rgba(0, 0, 0, 0.6)",
        background: "transparent",
      },
      headerCellHeight: 32,
      contentCellHeight: 24,
    });
  });
});
