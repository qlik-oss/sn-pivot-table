import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_CELL_HEIGHT,
  DEFAULT_FONT_COLOR,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_LINE_CLAMP,
} from "../../pivot-table/constants";
import type { ExtendedTheme, LayoutService } from "../../types/types";
import createStyleService from "../style-service";

describe("style-service", () => {
  const themeValue = "18px"; // Choosing a value that works for the cellHeight calculation
  let fontSize: number;
  let color: string;
  let linesCount: number;
  let layoutServiceMock: LayoutService;
  let themeMock: ExtendedTheme;

  beforeEach(() => {
    fontSize = 15;
    color = "#ff0000";
    linesCount = 2;
    themeMock = {
      getStyle: () => themeValue,
    } as unknown as ExtendedTheme;
    layoutServiceMock = {
      layout: {
        components: [
          {
            key: "theme",
            header: {
              fontSize,
              fontColor: { index: -1, color },
            },
            content: {
              fontSize,
              fontColor: { index: -1, color },
            },
            rowHeight: {
              linesCount,
            },
          },
          { key: "general" },
        ],
      },
    } as LayoutService;
  });

  test("should resolve layout styles, except fontFamily that use theme and bgColor that uses default", () => {
    const styleService = createStyleService(themeMock, layoutServiceMock);
    expect(styleService).toEqual({
      header: {
        fontSize: `${fontSize}px`,
        fontFamily: themeValue,
        color,
      },
      content: {
        fontSize: `${fontSize}px`,
        fontFamily: themeValue,
        color,
      },
      lineClamp: linesCount,
      backgroundColor: DEFAULT_BACKGROUND_COLOR,
      headerCellHeight: 48,
      contentCellHeight: 48,
    });
  });

  test("should resolve theme styles, except bgColor and lineClamp that uses default", () => {
    layoutServiceMock.layout.components = [];

    const styleService = createStyleService(themeMock, layoutServiceMock);
    expect(styleService).toEqual({
      header: {
        fontSize: themeValue,
        fontFamily: themeValue,
        color: themeValue,
      },
      content: {
        fontSize: themeValue,
        fontFamily: themeValue,
        color: themeValue,
      },
      lineClamp: DEFAULT_LINE_CLAMP,
      backgroundColor: DEFAULT_BACKGROUND_COLOR,
      headerCellHeight: 32,
      contentCellHeight: 32,
    });
  });

  test("should resolve default styles", () => {
    layoutServiceMock.layout.components = [];
    themeMock.getStyle = () => undefined;

    const styleService = createStyleService(themeMock, layoutServiceMock);
    expect(styleService).toEqual({
      header: {
        fontSize: DEFAULT_FONT_SIZE,
        fontFamily: DEFAULT_FONT_FAMILY,
        color: DEFAULT_FONT_COLOR,
      },
      content: {
        fontSize: DEFAULT_FONT_SIZE,
        fontFamily: DEFAULT_FONT_FAMILY,
        color: DEFAULT_FONT_COLOR,
      },
      lineClamp: DEFAULT_LINE_CLAMP,
      backgroundColor: DEFAULT_BACKGROUND_COLOR,
      headerCellHeight: DEFAULT_CELL_HEIGHT,
      contentCellHeight: DEFAULT_CELL_HEIGHT,
    });
  });
});
