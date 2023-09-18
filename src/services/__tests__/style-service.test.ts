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
  let linesCount: number;
  let layoutServiceMock: LayoutService;
  let themeMock: ExtendedTheme;

  beforeEach(() => {
    fontSize = 15;
    fontFamily = "Arial";
    color = "#ff0000";
    colorFromPalette = "#00ff00";
    linesCount = 2;
    themeMock = {
      getStyle: () => themeValue,
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
              background: { index: -1, color },
              rowTitle: {
                fontColor: { index: -1, color },
                background: { index: -1, color },
              },
              columnTitle: {
                fontColor: { index: -1, color },
                background: { index: -1, color },
              },
            },
            content: {
              fontSize,
              fontFamily,
              fontColor: { index: -1, color },
              background: { index: -1, color },
              nullValue: {
                fontColor: { index: -1, color },
                background: { index: -1, color },
              },
              totalValue: {
                fontColor: { index: -1, color },
                background: { index: -1, color },
              },
            },
            rowContent: {
              fontSize,
              fontFamily,
              fontColor: { index: -1, color },
              background: { index: -1, color },
              nullValue: {
                fontColor: { index: -1, color },
                background: { index: -1, color },
              },
              totalLabel: {
                fontColor: { index: -1, color },
                background: { index: -1, color },
              },
              measureLabel: {
                fontColor: { index: -1, color },
                background: { index: -1, color },
              },
            },
            columnContent: {
              fontSize,
              fontFamily,
              fontColor: { index: -1, color },
              background: { index: -1, color },
              nullValue: {
                fontColor: { index: -1, color },
                background: { index: -1, color },
              },
              totalLabel: {
                fontColor: { index: -1, color },
                background: { index: -1, color },
              },
              measureLabel: {
                fontColor: { index: -1, color },
                background: { index: -1, color },
              },
            },
            grid: {
              rowHeight: "compact",
              lineCount: linesCount,
              border: "borderColor",
              divider: "dividerColor",
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
      lineClamp: linesCount,
      headerLineClamp: 1,
      header: {
        fontSize: `${fontSize}px`,
        fontFamily,
        background: color,
        rowTitle: {
          color,
          background: color,
        },
        columnTitle: {
          color,
          background: color,
        },
      },
      content: {
        fontSize: `${fontSize}px`,
        fontFamily,
        color,
        background: color,
        nullValue: {
          color,
          background: color,
        },
        totalValue: {
          color,
          background: color,
        },
      },
      rowContent: {
        fontSize: `${fontSize}px`,
        fontFamily,
        color,
        background: color,
        nullValue: {
          color,
          background: color,
        },
        totalLabel: {
          color,
          background: color,
        },
        measureLabel: {
          color,
          background: color,
        },
      },
      columnContent: {
        fontSize: `${fontSize}px`,
        fontFamily,
        color,
        background: color,
        nullValue: {
          color,
          background: color,
        },
        totalLabel: {
          color,
          background: color,
        },
        measureLabel: {
          color,
          background: color,
        },
      },
      grid: {
        rowHeight: "compact",
        lineCount: linesCount,
        border: color,
        divider: color,
      },
      headerCellHeight: 32,
      contentCellHeight: 48,
    });
  });

  test("should resolve style from theme", () => {
    layoutServiceMock.layout.components = [];
    const styleService = createStyleService(themeMock, layoutServiceMock);

    expect(styleService).toEqual({
      lineClamp: 1,
      headerLineClamp: 1,
      header: {
        fontSize: "18px",
        fontFamily: "18px",
        background: "18px",
        rowTitle: { color: "18px", background: "18px" },
        columnTitle: { color: "18px", background: "18px" },
      },
      content: {
        fontSize: "18px",
        fontFamily: "18px",
        color: "18px",
        background: "18px",
        nullValue: { color: "18px", background: "18px" },
        totalValue: { color: "18px", background: "18px" },
      },
      rowContent: {
        fontSize: "18px",
        fontFamily: "18px",
        color: "18px",
        background: "18px",
        nullValue: { color: "18px", background: "18px" },
        totalLabel: { color: "18px", background: "18px" },
        measureLabel: { color: "18px", background: "18px" },
      },
      columnContent: {
        fontSize: "18px",
        fontFamily: "18px",
        color: "18px",
        background: "18px",
        nullValue: { color: "18px", background: "18px" },
        totalLabel: { color: "18px", background: "18px" },
        measureLabel: { color: "18px", background: "18px" },
      },
      grid: {
        rowHeight: "18px",
        lineCount: "18px",
        border: "18px",
        divider: "18px",
      },
      headerCellHeight: 32,
      contentCellHeight: 32,
    });
  });

  test("should resolve style from default values", () => {
    themeValue = undefined;
    layoutServiceMock.layout.components = [];
    const styleService = createStyleService(themeMock, layoutServiceMock);

    expect(styleService).toEqual({
      lineClamp: 1,
      headerLineClamp: 1,
      header: {
        fontSize: "12px",
        fontFamily: DEFAULT_FONT_FAMILY,
        background: "transparent",
        rowTitle: { color: "#404040", background: "transparent" },
        columnTitle: { color: "#404040", background: "rgba(0, 0, 0, 0.03)" },
      },
      content: {
        fontSize: "12px",
        fontFamily: DEFAULT_FONT_FAMILY,
        color: "rgba(0, 0, 0, 0.55)",
        background: "transparent",
        nullValue: { color: "#404040", background: "rgba(0, 0, 0, 0.05)" },
        totalValue: { color: "#404040", background: "transparent" },
      },
      rowContent: {
        fontSize: "12px",
        fontFamily: DEFAULT_FONT_FAMILY,
        color: "#404040",
        background: "transparent",
        nullValue: { color: "#404040", background: "rgba(0, 0, 0, 0.05)" },
        totalLabel: { color: "#404040", background: "transparent" },
        measureLabel: { color: "rgba(0, 0, 0, 0.55)", background: "transparent" },
      },
      columnContent: {
        fontSize: "12px",
        fontFamily: DEFAULT_FONT_FAMILY,
        color: "#404040",
        background: "transparent",
        nullValue: { color: "#404040", background: "rgba(0, 0, 0, 0.05)" },
        totalLabel: { color: "#404040", background: "transparent" },
        measureLabel: { color: "rgba(0, 0, 0, 0.55)", background: "transparent" },
      },
      grid: {
        rowHeight: "compact",
        lineCount: 1,
        border: "rgba(0, 0, 0, 0.15)",
        divider: "rgba(0, 0, 0, 0.6)",
      },
      headerCellHeight: 32,
      contentCellHeight: 24,
    });
  });
});
