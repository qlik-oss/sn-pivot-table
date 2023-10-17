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
  MeasureValues = "measureValues",
  DimensionValues = "dimensionValues",
  Grid = "grid",
  NullValues = "nullValues",
  TotalValues = "totalValues",
  TotalLabels = "totalLabels",
  MeasureLabels = "measureLabels",
}

enum Attribute {
  FontSize = "fontSize",
  FontFamily = "fontFamily",
  FontColor = "fontColor",
  FontStyle = "fontStyle",
  Color = "color",
  CellHeight = "cellHeight",
  Background = "background",
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
  const dimensionValue = chartStyling?.[Path.DimensionValues];
  const measureValueStyling = chartStyling?.[Path.MeasureValues];
  const measureLabelStyling = chartStyling?.[Path.MeasureLabels];
  const totalValuesStyling = chartStyling?.[Path.TotalValues];
  const nullValueStyling = chartStyling?.[Path.NullValues];
  const gridStyling = chartStyling?.[Path.Grid];
  const getThemeStyle = (paths: string[], attribute: string) => theme.getStyle(BASE_PATH, paths.join("."), attribute);

  const lineClamp = +(
    gridStyling?.[Attribute.LineClamp] ??
    getThemeStyle([Path.Grid], Attribute.LineClamp) ??
    DEFAULT_LINE_CLAMP
  );

  const headerBackground =
    resolveColor(theme, headerStyling?.[Attribute.Background]) ??
    getThemeStyle([Path.Header], Attribute.Background) ??
    Colors.Transparent;

  // TODO Support fontWeight, fontStyle and textDecoration in Theme
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
      color:
        resolveColor(theme, headerStyling?.[Attribute.FontColor]) ??
        getThemeStyle([Path.Header], Attribute.Color) ??
        Colors.PrimaryText,
      background: headerBackground,
      hoverBackground: getHoverColor(headerBackground, HEADER_MENU_COLOR_MODIFIER.hover),
      activeBackground: getHoverColor(headerBackground, HEADER_MENU_COLOR_MODIFIER.active),
    },
    dimensionValues: {
      fontSize:
        resolveFontSize(dimensionValue?.[Attribute.FontSize]) ??
        getThemeStyle([Path.DimensionValues], Attribute.FontSize) ??
        DEFAULT_FONT_SIZE,
      fontFamily:
        dimensionValue?.[Attribute.FontFamily] ??
        getThemeStyle([Path.DimensionValues], Attribute.FontFamily) ??
        DEFAULT_FONT_FAMILY,
      fontWeight: resolveFontWeight(dimensionValue?.[Attribute.FontStyle], undefined),
      fontStyle: resolveFontStyle(dimensionValue?.[Attribute.FontStyle]),
      textDecoration: resolveTextDecoration(dimensionValue?.[Attribute.FontStyle]),
      color:
        resolveColor(theme, dimensionValue?.[Attribute.FontColor]) ??
        getThemeStyle([Path.DimensionValues], Attribute.Color) ??
        Colors.PrimaryText,
      background:
        resolveColor(theme, dimensionValue?.[Attribute.Background]) ??
        getThemeStyle([Path.DimensionValues], Attribute.Background) ??
        Colors.Transparent,
    },
    measureValues: {
      fontSize:
        resolveFontSize(measureValueStyling?.[Attribute.FontSize]) ??
        getThemeStyle([Path.MeasureValues], Attribute.FontSize) ??
        DEFAULT_FONT_SIZE,
      fontFamily:
        measureValueStyling?.[Attribute.FontFamily] ??
        getThemeStyle([Path.MeasureValues], Attribute.FontFamily) ??
        DEFAULT_FONT_FAMILY,
      fontWeight: resolveFontWeight(measureValueStyling?.[Attribute.FontStyle], "normal"),
      fontStyle: resolveFontStyle(measureValueStyling?.[Attribute.FontStyle]),
      textDecoration: resolveTextDecoration(measureValueStyling?.[Attribute.FontStyle]),
      color:
        resolveColor(theme, measureValueStyling?.[Attribute.FontColor]) ??
        getThemeStyle([Path.MeasureValues], Attribute.Color) ??
        Colors.Black55,
      background:
        resolveColor(theme, measureValueStyling?.[Attribute.Background]) ??
        getThemeStyle([Path.MeasureValues], Attribute.Background) ??
        Colors.Transparent,
    },
    measureLabels: {
      fontWeight: resolveFontWeight(measureLabelStyling?.[Attribute.FontStyle], "normal"),
      fontStyle: resolveFontStyle(measureLabelStyling?.[Attribute.FontStyle]),
      textDecoration: resolveTextDecoration(measureLabelStyling?.[Attribute.FontStyle]),
      color:
        resolveColor(theme, measureLabelStyling?.[Attribute.FontColor]) ??
        getThemeStyle([Path.MeasureLabels], Attribute.Color) ??
        Colors.Black55,
      background:
        resolveColor(theme, measureLabelStyling?.[Attribute.Background]) ??
        getThemeStyle([Path.MeasureLabels], Attribute.Background) ??
        Colors.Transparent,
    },
    totalValues: {
      fontWeight: resolveFontWeight(totalValuesStyling?.[Attribute.FontStyle], BOLD_FONT_WEIGHT),
      fontStyle: resolveFontStyle(totalValuesStyling?.[Attribute.FontStyle]),
      textDecoration: resolveTextDecoration(totalValuesStyling?.[Attribute.FontStyle]),
      color:
        resolveColor(theme, totalValuesStyling?.[Attribute.FontColor]) ??
        getThemeStyle([Path.TotalValues], Attribute.Color) ??
        Colors.PrimaryText,
      background:
        resolveColor(theme, totalValuesStyling?.[Attribute.Background]) ??
        getThemeStyle([Path.TotalValues], Attribute.Background) ??
        Colors.Transparent,
    },
    nullValues: {
      fontWeight: resolveFontWeight(nullValueStyling?.[Attribute.FontStyle], "normal"),
      fontStyle: resolveFontStyle(nullValueStyling?.[Attribute.FontStyle]),
      textDecoration: resolveTextDecoration(nullValueStyling?.[Attribute.FontStyle]),
      color:
        resolveColor(theme, nullValueStyling?.[Attribute.FontColor]) ??
        getThemeStyle([Path.NullValues], Attribute.Color) ??
        Colors.PrimaryText,
      background:
        resolveColor(theme, nullValueStyling?.[Attribute.Background]) ??
        getThemeStyle([Path.NullValues], Attribute.Background) ??
        Colors.Black5,
    },
    grid: {
      lineClamp,
      border:
        resolveColor(theme, gridStyling?.[Attribute.Border]) ??
        getThemeStyle([Path.Grid], Attribute.Border) ??
        Colors.Black15,
      divider:
        resolveColor(theme, gridStyling?.[Attribute.Divider]) ??
        getThemeStyle([Path.Grid], Attribute.Divider) ??
        Colors.Black60,
      background:
        resolveColor(theme, gridStyling?.[Attribute.Background]) ??
        getThemeStyle([Path.Grid], Attribute.Background) ??
        Colors.Transparent,
    },
  } as StyleService;

  styleService.headerCellHeight = Math.max(
    fontSizeToCellHeight(styleService.header.fontSize, DEFAULT_LINE_CLAMP),
    fontSizeToCellHeight(styleService.dimensionValues.fontSize, DEFAULT_LINE_CLAMP),
    DEFAULT_HEADER_CELL_HEIGHT,
  );

  styleService.contentCellHeight = Math.max(
    fontSizeToCellHeight(styleService.measureValues.fontSize, lineClamp),
    fontSizeToCellHeight(styleService.dimensionValues.fontSize, lineClamp),
    DEFAULT_CELL_HEIGHT,
  );

  return styleService;
};

export default createStyleService;
