import type { ExtendedTheme } from "@qlik/nebula-table-utils/lib/hooks/use-extended-theme/types";
import { getHoverColor } from "@qlik/nebula-table-utils/lib/utils";
import { Colors } from "../pivot-table/components/shared-styles";
import {
  BOLD_FONT_WEIGHT,
  CELL_PADDING_HEIGHT,
  DEFAULT_CELL_HEIGHT,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_HEADER_CELL_HEIGHT,
  DEFAULT_LINE_CLAMP,
  LINE_HEIGHT_COEFFICIENT,
} from "../pivot-table/constants";
import type { FontStyleOptions, PaletteColor } from "../types/QIX";
import type { LayoutService, StyleService } from "../types/types";

const BASE_PATH = "object.pivotTableV2";

const HEADER_MENU_COLOR_MODIFIER = {
  hover: {
    darker: 0.15,
    brighter: 0.3,
    opacity: 0.03,
  },
  active: {
    darker: 0.3,
    brighter: 0.5,
    opacity: 0.05,
  },
};

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
  FontStyle = "fontStyle",
  Color = "color",
  CellHeight = "cellHeight",
  Background = "background",
  RowHeight = "rowHeight",
  LineClamp = "lineClamp",
  Border = "border",
  Divider = "divider",
}

const resolveFontSize = (fontSize: string | undefined) => (fontSize ? `${parseInt(fontSize, 10)}px` : undefined);

const resolveColor = (theme: ExtendedTheme, color: PaletteColor | undefined) =>
  color ? theme.getColorPickerColor(color) : undefined;

const fontSizeToCellHeight = (fontSize: string, lineClamp: number) =>
  +(parseInt(fontSize, 10) * LINE_HEIGHT_COEFFICIENT * lineClamp + CELL_PADDING_HEIGHT).toFixed(2);

// defaultValue should be undefined for the "third" state where font weight is "bold" for
// a node that can be expanded/collapsed and "normal" if it can not.
// TODO does not work if the use have selected any of the other options, like italic or underline.
const resolveFontWeight = (
  fontStyleOptions: FontStyleOptions[] | undefined,
  defaultValue: "600" | "normal" | undefined,
) => {
  if (fontStyleOptions === undefined) {
    return defaultValue;
  }

  return fontStyleOptions.some((value) => value === "bold") ? BOLD_FONT_WEIGHT : "normal";
};

const resolveFontStyle = (fontStyleOptions: FontStyleOptions[] | undefined) =>
  fontStyleOptions?.some((value) => value === "italic") ? "italic" : "normal";

const resolveTextDecoration = (fontStyleOptions: FontStyleOptions[] | undefined) =>
  fontStyleOptions?.some((value) => value === "underline") ? "underline" : "none";

/**
 * creates the styling based on layout, theme and default values - in that order
 */
const createStyleService = (theme: ExtendedTheme, layoutService: LayoutService): StyleService => {
  const chartStyling = layoutService.layout.components?.find((n) => n.key === "theme");
  const headerStyling = chartStyling?.[Path.Header];
  const contentStyling = chartStyling?.[Path.Content];
  const rowContentStyling = chartStyling?.[Path.RowContent];
  const columnContentStyling = chartStyling?.[Path.ColumnContent];
  const nullValueStyling = chartStyling?.[Path.NullValue];
  const gridStyling = chartStyling?.[Path.Grid];
  const getThemeStyle = (paths: string[], attribute: string) => theme.getStyle(BASE_PATH, paths.join("."), attribute);

  const lineClamp = +(
    contentStyling?.[Attribute.LineClamp] ??
    getThemeStyle([Path.Content], Attribute.LineClamp) ??
    DEFAULT_LINE_CLAMP
  );

  const styleService: StyleService = {
    header: {
      fontSize:
        resolveFontSize(headerStyling?.[Attribute.FontSize]) ??
        getThemeStyle([Path.Header], Attribute.FontSize) ??
        DEFAULT_FONT_SIZE,
      fontFamily:
        headerStyling?.[Attribute.FontFamily] ??
        getThemeStyle([Path.Header], Attribute.FontFamily) ??
        DEFAULT_FONT_FAMILY,
      fontWeight: resolveFontWeight(headerStyling?.[Attribute.FontStyle], BOLD_FONT_WEIGHT),
      fontStyle: resolveFontStyle(headerStyling?.[Attribute.FontStyle]),
      textDecoration: resolveTextDecoration(headerStyling?.[Attribute.FontStyle]),
      background:
        resolveColor(theme, headerStyling?.[Attribute.Background]) ??
        getThemeStyle([Path.Header], Attribute.Background) ??
        Colors.Transparent,
      rowTitle: {
        color:
          resolveColor(theme, headerStyling?.[Path.RowTitle]?.[Attribute.FontColor]) ??
          getThemeStyle([Path.Header, Path.RowTitle], Attribute.Color) ??
          Colors.PrimaryText,
        background:
          resolveColor(theme, headerStyling?.[Path.RowTitle]?.[Attribute.Background]) ??
          getThemeStyle([Path.Header, Path.RowTitle], Attribute.Background) ??
          Colors.Transparent,
      },
      columnTitle: {
        color:
          resolveColor(theme, headerStyling?.[Path.ColumnTitle]?.[Attribute.FontColor]) ??
          getThemeStyle([Path.Header, Path.ColumnTitle], Attribute.Color) ??
          Colors.PrimaryText,
        background:
          resolveColor(theme, headerStyling?.[Path.ColumnTitle]?.[Attribute.Background]) ??
          getThemeStyle([Path.Header, Path.ColumnTitle], Attribute.Background) ??
          Colors.Black3,
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
      fontWeight: resolveFontWeight(contentStyling?.[Attribute.FontStyle], undefined),
      fontStyle: resolveFontStyle(contentStyling?.[Attribute.FontStyle]),
      textDecoration: resolveTextDecoration(contentStyling?.[Attribute.FontStyle]),
      color:
        resolveColor(theme, contentStyling?.[Attribute.FontColor]) ??
        getThemeStyle([Path.Content], Attribute.Color) ??
        Colors.Black55,
      background:
        resolveColor(theme, contentStyling?.[Attribute.Background]) ??
        getThemeStyle([Path.Content], Attribute.Background) ??
        Colors.Transparent,
      lineClamp,
      totalValue: {
        color:
          resolveColor(theme, contentStyling?.[Path.TotalValue]?.[Attribute.FontColor]) ??
          getThemeStyle([Path.Content, Path.TotalValue], Attribute.Color) ??
          Colors.PrimaryText,
        background:
          resolveColor(theme, contentStyling?.[Path.TotalValue]?.[Attribute.Background]) ??
          getThemeStyle([Path.Content, Path.TotalValue], Attribute.Background) ??
          Colors.Transparent,
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
      fontWeight: resolveFontWeight(rowContentStyling?.[Attribute.FontStyle], undefined),
      fontStyle: resolveFontStyle(rowContentStyling?.[Attribute.FontStyle]),
      textDecoration: resolveTextDecoration(rowContentStyling?.[Attribute.FontStyle]),
      color:
        resolveColor(theme, rowContentStyling?.[Attribute.FontColor]) ??
        getThemeStyle([Path.RowContent], Attribute.Color) ??
        Colors.PrimaryText,
      background:
        resolveColor(theme, rowContentStyling?.[Attribute.Background]) ??
        getThemeStyle([Path.RowContent], Attribute.Background) ??
        Colors.Transparent,
      totalLabel: {
        color:
          resolveColor(theme, rowContentStyling?.[Path.TotalLabel]?.[Attribute.FontColor]) ??
          getThemeStyle([Path.RowContent, Path.TotalLabel], Attribute.Color) ??
          Colors.PrimaryText,
        background:
          resolveColor(theme, rowContentStyling?.[Path.TotalLabel]?.[Attribute.Background]) ??
          getThemeStyle([Path.RowContent, Path.TotalLabel], Attribute.Background) ??
          Colors.Transparent,
      },
      measureLabel: {
        color:
          resolveColor(theme, rowContentStyling?.[Path.MeasureLabel]?.[Attribute.FontColor]) ??
          getThemeStyle([Path.RowContent, Path.MeasureLabel], Attribute.Color) ??
          Colors.Black55,
        background:
          resolveColor(theme, rowContentStyling?.[Path.MeasureLabel]?.[Attribute.Background]) ??
          getThemeStyle([Path.RowContent, Path.MeasureLabel], Attribute.Background) ??
          Colors.Transparent,
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
      fontWeight: resolveFontWeight(columnContentStyling?.[Attribute.FontStyle], undefined),
      fontStyle: resolveFontStyle(columnContentStyling?.[Attribute.FontStyle]),
      textDecoration: resolveTextDecoration(columnContentStyling?.[Attribute.FontStyle]),
      color:
        resolveColor(theme, columnContentStyling?.[Attribute.FontColor]) ??
        getThemeStyle([Path.ColumnContent], Attribute.Color) ??
        Colors.PrimaryText,
      background:
        resolveColor(theme, columnContentStyling?.[Attribute.Background]) ??
        getThemeStyle([Path.ColumnContent], Attribute.Background) ??
        Colors.Transparent,
      totalLabel: {
        color:
          resolveColor(theme, columnContentStyling?.[Path.TotalLabel]?.[Attribute.FontColor]) ??
          getThemeStyle([Path.ColumnContent, Path.TotalLabel], Attribute.Color) ??
          Colors.PrimaryText,
        background:
          resolveColor(theme, columnContentStyling?.[Path.TotalLabel]?.[Attribute.Background]) ??
          getThemeStyle([Path.ColumnContent, Path.TotalLabel], Attribute.Background) ??
          Colors.Transparent,
      },
      measureLabel: {
        color:
          resolveColor(theme, columnContentStyling?.[Path.MeasureLabel]?.[Attribute.FontColor]) ??
          getThemeStyle([Path.ColumnContent, Path.MeasureLabel], Attribute.Color) ??
          Colors.Black55,
        background:
          resolveColor(theme, columnContentStyling?.[Path.MeasureLabel]?.[Attribute.Background]) ??
          getThemeStyle([Path.ColumnContent, Path.MeasureLabel], Attribute.Background) ??
          Colors.Transparent,
      },
    },
    nullValue: {
      fontWeight: resolveFontWeight(nullValueStyling?.[Attribute.FontStyle], "normal"),
      fontStyle: resolveFontStyle(nullValueStyling?.[Attribute.FontStyle]),
      textDecoration: resolveTextDecoration(nullValueStyling?.[Attribute.FontStyle]),
      color:
        resolveColor(theme, nullValueStyling?.[Attribute.FontColor]) ??
        getThemeStyle([Path.NullValue], Attribute.Color) ??
        Colors.PrimaryText,
      background:
        resolveColor(theme, nullValueStyling?.[Attribute.Background]) ??
        getThemeStyle([Path.NullValue], Attribute.Background) ??
        Colors.Black5,
    },
    grid: {
      rowHeight: gridStyling?.[Attribute.RowHeight] ?? getThemeStyle([Path.Grid], Attribute.RowHeight) ?? "compact",
      border:
        resolveColor(theme, gridStyling?.[Attribute.Border]) ??
        getThemeStyle([Path.Grid], Attribute.Border) ??
        Colors.Black15,
      divider:
        resolveColor(theme, gridStyling?.[Attribute.Divider]) ??
        getThemeStyle([Path.Grid], Attribute.Divider) ??
        Colors.Black60,
    },
  } as StyleService;

  styleService["headerCellHeight"] = Math.max(
    fontSizeToCellHeight(styleService.header.fontSize, DEFAULT_LINE_CLAMP),
    fontSizeToCellHeight(styleService.columnContent.fontSize, DEFAULT_LINE_CLAMP),
    DEFAULT_HEADER_CELL_HEIGHT,
  );

  styleService["contentCellHeight"] = Math.max(
    fontSizeToCellHeight(styleService.content.fontSize, lineClamp),
    fontSizeToCellHeight(styleService.rowContent.fontSize, lineClamp),
    DEFAULT_CELL_HEIGHT,
  );

  styleService.header.rowTitle.hoverBackground = getHoverColor(
    styleService.header.rowTitle.background,
    HEADER_MENU_COLOR_MODIFIER.hover,
  );
  styleService.header.rowTitle.activeBackground = getHoverColor(
    styleService.header.rowTitle.background,
    HEADER_MENU_COLOR_MODIFIER.active,
  );
  styleService.header.columnTitle.hoverBackground = getHoverColor(
    styleService.header.columnTitle.background,
    HEADER_MENU_COLOR_MODIFIER.hover,
  );
  styleService.header.columnTitle.activeBackground = getHoverColor(
    styleService.header.columnTitle.background,
    HEADER_MENU_COLOR_MODIFIER.active,
  );
  console.log("%c styleService", "color: orangered", styleService);
  return styleService;
};

export default createStyleService;
