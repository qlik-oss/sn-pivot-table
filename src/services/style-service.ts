import {
  CELL_PADDING_HEIGHT,
  DEFAULT_CELL_HEIGHT,
  DEFAULT_FONT_COLOR,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_LINE_CLAMP,
  LINE_HEIGHT_COEFFICIENT,
} from "../pivot-table/constants";
import type { PaletteColor } from "../types/QIX";
import type { ExtendedTheme, LayoutService, StyleService } from "../types/types";

const BASE_PATH = "object.pivotTableV2";

enum Path {
  Header = "header",
  Content = "content",
  RowContent = "rowContent",
  RowTitle = "rowTitle",
  ColumnContent = "columnContent",
  ColumnTitle = "columnTitle",
  Grid = "grid",
  NullValue = "nullValue",
  TotalValue = "totalValue",
  TotalLabel = "totalLabel",
  MeasureLabel = "measureLabel",
  Root = "",
}
enum Attribute {
  FontSize = "fontSize",
  FontFamily = "fontFamily",
  FontColor = "fontColor",
  Color = "color",
  CellHeight = "cellHeight",
  LineClamp = "lineClamp",
  Background = "background",
  RowHeight = "rowHeight",
  LineCount = "lineCount",
  Border = "border",
  Divider = "divider",
}

const resolveFontSize = (fontSize: number | undefined) => (fontSize ? `${fontSize}px` : undefined);

const resolveColor = (theme: ExtendedTheme, color: PaletteColor | undefined) =>
  color ? theme.getColorPickerColor(color) : undefined;

const fontSizeToCellHeight = (fontSize: string, lineClamp: number) =>
  +(parseInt(fontSize, 10) * LINE_HEIGHT_COEFFICIENT * lineClamp + CELL_PADDING_HEIGHT).toFixed(2);

/**
 * creates the styling based on layout, theme and default values - in that order
 */
const createStyleService = (theme: ExtendedTheme, layoutService: LayoutService): StyleService => {
  const chartStyling = layoutService.layout.components?.find((n) => n.key === "theme");
  const headerStyling = chartStyling?.[Path.Header];
  const contentStyling = chartStyling?.[Path.Content];
  const rowContentStyling = chartStyling?.[Path.RowContent];
  const columnContentStyling = chartStyling?.[Path.ColumnContent];
  const gridStyling = chartStyling?.[Path.Grid];
  const getThemeStyle = (paths: string[], attribute: string) => theme.getStyle(BASE_PATH, paths.join("."), attribute);

  const lineClamp = gridStyling?.lineCount ?? DEFAULT_LINE_CLAMP;

  const styleService: StyleService = {
    lineClamp,
    header: {
      fontSize:
        resolveFontSize(headerStyling?.[Attribute.FontSize]) ??
        getThemeStyle([Path.Header], Attribute.FontSize) ??
        DEFAULT_FONT_SIZE,
      fontFamily:
        headerStyling?.[Attribute.FontFamily] ??
        getThemeStyle([Path.Header], Attribute.FontFamily) ??
        DEFAULT_FONT_FAMILY,
      background:
        resolveColor(theme, headerStyling?.[Attribute.Background]) ??
        getThemeStyle([Path.Header], Attribute.Background) ??
        "transparent",
      rowTitle: {
        color:
          resolveColor(theme, headerStyling?.[Path.RowTitle]?.[Attribute.FontColor]) ??
          getThemeStyle([Path.Header, Path.RowTitle], Attribute.Color) ??
          DEFAULT_FONT_COLOR,
        background:
          resolveColor(theme, headerStyling?.[Path.RowTitle]?.[Attribute.Background]) ??
          getThemeStyle([Path.Header, Path.RowTitle], Attribute.Background) ??
          "transparent",
      },
      columnTitle: {
        color:
          resolveColor(theme, headerStyling?.[Path.ColumnTitle]?.[Attribute.FontColor]) ??
          getThemeStyle([Path.Header, Path.ColumnTitle], Attribute.Color) ??
          DEFAULT_FONT_COLOR,
        background:
          resolveColor(theme, headerStyling?.[Path.ColumnTitle]?.[Attribute.Background]) ??
          getThemeStyle([Path.Header, Path.ColumnTitle], Attribute.Background) ??
          "transparent",
      },
    },
    content: {
      fontSize:
        resolveFontSize(contentStyling?.[Attribute.FontSize]) ??
        getThemeStyle([Path.Content], Attribute.FontSize) ??
        DEFAULT_FONT_SIZE,
      fontFamily:
        contentStyling?.[Attribute.FontFamily] ??
        getThemeStyle([Path.Content], Attribute.FontFamily) ??
        DEFAULT_FONT_FAMILY,
      color:
        resolveColor(theme, contentStyling?.[Attribute.FontColor]) ??
        getThemeStyle([Path.Content], Attribute.Color) ??
        "rgba(0, 0, 0, 0.55)",
      background:
        resolveColor(theme, contentStyling?.[Attribute.Background]) ??
        getThemeStyle([Path.Content], Attribute.Background) ??
        "transparent",
      nullValue: {
        color:
          resolveColor(theme, contentStyling?.[Path.NullValue]?.[Attribute.FontColor]) ??
          getThemeStyle([Path.Content, Path.NullValue], Attribute.Color) ??
          DEFAULT_FONT_COLOR,
        background:
          resolveColor(theme, contentStyling?.[Path.NullValue]?.[Attribute.Background]) ??
          getThemeStyle([Path.Content, Path.NullValue], Attribute.Background) ??
          "rgba(0, 0, 0, 0.05)",
      },
      totalValue: {
        color:
          resolveColor(theme, contentStyling?.[Path.TotalValue]?.[Attribute.FontColor]) ??
          getThemeStyle([Path.Content, Path.TotalValue], Attribute.Color) ??
          DEFAULT_FONT_COLOR,
        background:
          resolveColor(theme, contentStyling?.[Path.TotalValue]?.[Attribute.Background]) ??
          getThemeStyle([Path.Content, Path.TotalValue], Attribute.Background) ??
          "transparent",
      },
    },
    rowContent: {
      fontSize:
        resolveFontSize(rowContentStyling?.[Attribute.FontSize]) ??
        getThemeStyle([Path.RowContent], Attribute.FontSize) ??
        DEFAULT_FONT_SIZE,
      fontFamily:
        rowContentStyling?.[Attribute.FontFamily] ??
        getThemeStyle([Path.RowContent], Attribute.FontFamily) ??
        DEFAULT_FONT_FAMILY,
      color:
        resolveColor(theme, rowContentStyling?.[Attribute.FontColor]) ??
        getThemeStyle([Path.RowContent], Attribute.Color) ??
        DEFAULT_FONT_COLOR,
      background:
        resolveColor(theme, rowContentStyling?.[Attribute.Background]) ??
        getThemeStyle([Path.RowContent], Attribute.Background) ??
        "transparent",
      nullValue: {
        color:
          resolveColor(theme, rowContentStyling?.[Path.NullValue]?.[Attribute.FontColor]) ??
          getThemeStyle([Path.RowContent, Path.NullValue], Attribute.Color) ??
          DEFAULT_FONT_COLOR,
        background:
          resolveColor(theme, rowContentStyling?.[Path.NullValue]?.[Attribute.Background]) ??
          getThemeStyle([Path.RowContent, Path.NullValue], Attribute.Background) ??
          "rgba(0, 0, 0, 0.05)",
      },
      totalLabel: {
        color:
          resolveColor(theme, rowContentStyling?.[Path.TotalLabel]?.[Attribute.FontColor]) ??
          getThemeStyle([Path.RowContent, Path.TotalLabel], Attribute.Color) ??
          DEFAULT_FONT_COLOR,
        background:
          resolveColor(theme, rowContentStyling?.[Path.TotalLabel]?.[Attribute.Background]) ??
          getThemeStyle([Path.RowContent, Path.TotalLabel], Attribute.Background) ??
          "transparent",
      },
      measureLabel: {
        color:
          resolveColor(theme, rowContentStyling?.[Path.MeasureLabel]?.[Attribute.FontColor]) ??
          getThemeStyle([Path.RowContent, Path.MeasureLabel], Attribute.Color) ??
          "rgba(0, 0, 0, 0.55)",
        background:
          resolveColor(theme, rowContentStyling?.[Path.MeasureLabel]?.[Attribute.Background]) ??
          getThemeStyle([Path.RowContent, Path.MeasureLabel], Attribute.Background) ??
          "transparent",
      },
    },
    columnContent: {
      fontSize:
        resolveFontSize(columnContentStyling?.[Attribute.FontSize]) ??
        getThemeStyle([Path.ColumnContent], Attribute.FontSize) ??
        DEFAULT_FONT_SIZE,
      fontFamily:
        columnContentStyling?.[Attribute.FontFamily] ??
        getThemeStyle([Path.ColumnContent], Attribute.FontFamily) ??
        DEFAULT_FONT_FAMILY,
      color:
        resolveColor(theme, columnContentStyling?.[Attribute.FontColor]) ??
        getThemeStyle([Path.ColumnContent], Attribute.Color) ??
        DEFAULT_FONT_COLOR,
      background:
        resolveColor(theme, columnContentStyling?.[Attribute.Background]) ??
        getThemeStyle([Path.ColumnContent], Attribute.Background) ??
        "transparent",
      nullValue: {
        color:
          resolveColor(theme, columnContentStyling?.[Path.NullValue]?.[Attribute.FontColor]) ??
          getThemeStyle([Path.ColumnContent, Path.NullValue], Attribute.Color) ??
          DEFAULT_FONT_COLOR,
        background:
          resolveColor(theme, columnContentStyling?.[Path.NullValue]?.[Attribute.Background]) ??
          getThemeStyle([Path.ColumnContent, Path.NullValue], Attribute.Background) ??
          "rgba(0, 0, 0, 0.05)",
      },
      totalLabel: {
        color:
          resolveColor(theme, columnContentStyling?.[Path.TotalLabel]?.[Attribute.FontColor]) ??
          getThemeStyle([Path.ColumnContent, Path.TotalLabel], Attribute.Color) ??
          DEFAULT_FONT_COLOR,
        background:
          resolveColor(theme, columnContentStyling?.[Path.TotalLabel]?.[Attribute.Background]) ??
          getThemeStyle([Path.ColumnContent, Path.TotalLabel], Attribute.Background) ??
          "transparent",
      },
      measureLabel: {
        color:
          resolveColor(theme, columnContentStyling?.[Path.MeasureLabel]?.[Attribute.FontColor]) ??
          getThemeStyle([Path.ColumnContent, Path.MeasureLabel], Attribute.Color) ??
          "rgba(0, 0, 0, 0.55)",
        background:
          resolveColor(theme, columnContentStyling?.[Path.MeasureLabel]?.[Attribute.Background]) ??
          getThemeStyle([Path.ColumnContent, Path.MeasureLabel], Attribute.Background) ??
          "transparent",
      },
    },
    grid: {
      rowHeight: gridStyling?.[Attribute.RowHeight] ?? getThemeStyle([Path.Grid], Attribute.RowHeight) ?? "compact",
      lineCount: gridStyling?.[Attribute.LineCount] ?? getThemeStyle([Path.Grid], Attribute.LineCount) ?? 1,
      border: gridStyling?.[Attribute.Border] ?? getThemeStyle([Path.Grid], Attribute.Border) ?? "rgba(0, 0, 0, 0.15)",
      divider:
        gridStyling?.[Attribute.Divider] ?? getThemeStyle([Path.Grid], Attribute.Divider) ?? "rgba(0, 0, 0, 0.6)",
    },
  } as StyleService;

  styleService["headerCellHeight"] = Math.max(
    fontSizeToCellHeight(styleService.header.fontSize, lineClamp),
    fontSizeToCellHeight(styleService.columnContent.fontSize, lineClamp),
    DEFAULT_CELL_HEIGHT
  );
  styleService["contentCellHeight"] = Math.max(
    fontSizeToCellHeight(styleService.content.fontSize, lineClamp),
    fontSizeToCellHeight(styleService.rowContent.fontSize, lineClamp),
    DEFAULT_CELL_HEIGHT
  );

  return styleService;
};

export default createStyleService;
