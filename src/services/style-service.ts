import type { ExtendedTheme } from "@qlik/nebula-table-utils/lib/hooks/use-extended-theme/types";
import { COLORING, getHoverColor } from "@qlik/nebula-table-utils/lib/utils";
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

enum StylingPanelAttribute {
  FontSize = "fontSize",
  FontFamily = "fontFamily",
  FontColor = "fontColor",
  FontStyle = "fontStyle",
  Background = "background",
  LineClamp = "lineClamp",
  Border = "border",
  Divider = "divider",
}

enum ThemeBasePath {
  Dimension = `${BASE_PATH}.dimension`,
  Measure = `${BASE_PATH}.measure`,
  Total = `${BASE_PATH}.total`,
  Null = `${BASE_PATH}.null`,
  Grid = BASE_PATH,
}

enum ThemePath {
  Grid = "grid",
  Divider = "grid.divider",
  LabelName = "label.name",
  LabelValue = "label.value",
}

enum ThemeAttribute {
  FontSize = "fontSize",
  FontFamily = "fontFamily",
  Color = "color",
  BackgroundColor = "backgroundColor",
  LineClamp = "lineClamp",
  BorderColor = "borderColor",
}

const resolveFontSize = (fontSize: string | undefined) => (fontSize ? `${parseInt(fontSize, 10)}px` : undefined);

export const resolveColor = (theme: ExtendedTheme, color: PaletteColor | undefined) => {
  if (color) {
    const resolvedColor = theme.getColorPickerColor(color);
    // Handle when color is set to "none" via the color picker
    if (resolvedColor === "none") {
      return Colors.Transparent;
    }

    return resolvedColor;
  }

  return undefined;
};

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
  const headerStyling = chartStyling?.header;
  const dimensionValue = chartStyling?.dimensionValues;
  const measureValueStyling = chartStyling?.measureValues;
  const measureLabelStyling = chartStyling?.measureLabels;
  const totalValuesStyling = chartStyling?.totalValues;
  const nullValueStyling = chartStyling?.nullValues;
  const gridStyling = chartStyling?.grid;

  const getThemeStyle = (basePath: ThemeBasePath, path: ThemePath, attribute: ThemeAttribute) =>
    theme.getStyle(basePath, path, attribute);

  const lineClamp = +(
    gridStyling?.[StylingPanelAttribute.LineClamp] ??
    getThemeStyle(ThemeBasePath.Grid, ThemePath.Grid, ThemeAttribute.LineClamp) ??
    DEFAULT_LINE_CLAMP
  );

  const headerBackground =
    resolveColor(theme, headerStyling?.[StylingPanelAttribute.Background]) ??
    getThemeStyle(ThemeBasePath.Dimension, ThemePath.LabelName, ThemeAttribute.BackgroundColor) ??
    Colors.Transparent;

  // TODO Support fontWeight, fontStyle and textDecoration in Theme
  const styleService: StyleService = {
    header: {
      fontSize:
        resolveFontSize(headerStyling?.[StylingPanelAttribute.FontSize]) ??
        getThemeStyle(ThemeBasePath.Dimension, ThemePath.LabelName, ThemeAttribute.FontSize) ??
        DEFAULT_FONT_SIZE,
      fontFamily:
        headerStyling?.[StylingPanelAttribute.FontFamily] ??
        getThemeStyle(ThemeBasePath.Dimension, ThemePath.LabelName, ThemeAttribute.FontFamily) ??
        DEFAULT_FONT_FAMILY,
      fontWeight: resolveFontWeight(headerStyling?.[StylingPanelAttribute.FontStyle], BOLD_FONT_WEIGHT),
      fontStyle: resolveFontStyle(headerStyling?.[StylingPanelAttribute.FontStyle]),
      textDecoration: resolveTextDecoration(headerStyling?.[StylingPanelAttribute.FontStyle]),
      color:
        resolveColor(theme, headerStyling?.[StylingPanelAttribute.FontColor]) ??
        getThemeStyle(ThemeBasePath.Dimension, ThemePath.LabelName, ThemeAttribute.Color) ??
        COLORING.TEXT,
      background: headerBackground,
      hoverBackground: getHoverColor(headerBackground, HEADER_MENU_COLOR_MODIFIER.hover),
      activeBackground: getHoverColor(headerBackground, HEADER_MENU_COLOR_MODIFIER.active),
    },
    dimensionValues: {
      fontSize:
        resolveFontSize(dimensionValue?.[StylingPanelAttribute.FontSize]) ??
        getThemeStyle(ThemeBasePath.Dimension, ThemePath.LabelValue, ThemeAttribute.FontSize) ??
        DEFAULT_FONT_SIZE,
      fontFamily:
        dimensionValue?.[StylingPanelAttribute.FontFamily] ??
        getThemeStyle(ThemeBasePath.Dimension, ThemePath.LabelValue, ThemeAttribute.FontFamily) ??
        DEFAULT_FONT_FAMILY,
      fontWeight: resolveFontWeight(dimensionValue?.[StylingPanelAttribute.FontStyle], undefined),
      fontStyle: resolveFontStyle(dimensionValue?.[StylingPanelAttribute.FontStyle]),
      textDecoration: resolveTextDecoration(dimensionValue?.[StylingPanelAttribute.FontStyle]),
      color:
        resolveColor(theme, dimensionValue?.[StylingPanelAttribute.FontColor]) ??
        getThemeStyle(ThemeBasePath.Dimension, ThemePath.LabelValue, ThemeAttribute.Color) ??
        COLORING.TEXT,
      background:
        resolveColor(theme, dimensionValue?.[StylingPanelAttribute.Background]) ??
        getThemeStyle(ThemeBasePath.Dimension, ThemePath.LabelValue, ThemeAttribute.BackgroundColor) ??
        Colors.Transparent,
    },
    measureValues: {
      fontSize:
        resolveFontSize(measureValueStyling?.[StylingPanelAttribute.FontSize]) ??
        getThemeStyle(ThemeBasePath.Measure, ThemePath.LabelValue, ThemeAttribute.FontSize) ??
        DEFAULT_FONT_SIZE,
      fontFamily:
        measureValueStyling?.[StylingPanelAttribute.FontFamily] ??
        getThemeStyle(ThemeBasePath.Measure, ThemePath.LabelValue, ThemeAttribute.FontFamily) ??
        DEFAULT_FONT_FAMILY,
      fontWeight: resolveFontWeight(measureValueStyling?.[StylingPanelAttribute.FontStyle], "normal"),
      fontStyle: resolveFontStyle(measureValueStyling?.[StylingPanelAttribute.FontStyle]),
      textDecoration: resolveTextDecoration(measureValueStyling?.[StylingPanelAttribute.FontStyle]),
      color:
        resolveColor(theme, measureValueStyling?.[StylingPanelAttribute.FontColor]) ??
        getThemeStyle(ThemeBasePath.Measure, ThemePath.LabelValue, ThemeAttribute.Color) ??
        Colors.FontSecondary,
      background:
        resolveColor(theme, measureValueStyling?.[StylingPanelAttribute.Background]) ??
        getThemeStyle(ThemeBasePath.Measure, ThemePath.LabelValue, ThemeAttribute.BackgroundColor) ??
        Colors.Transparent,
    },
    measureLabels: {
      fontWeight: resolveFontWeight(measureLabelStyling?.[StylingPanelAttribute.FontStyle], "normal"),
      fontStyle: resolveFontStyle(measureLabelStyling?.[StylingPanelAttribute.FontStyle]),
      textDecoration: resolveTextDecoration(measureLabelStyling?.[StylingPanelAttribute.FontStyle]),
      color:
        resolveColor(theme, measureLabelStyling?.[StylingPanelAttribute.FontColor]) ??
        getThemeStyle(ThemeBasePath.Measure, ThemePath.LabelName, ThemeAttribute.Color) ??
        Colors.FontSecondary,
      background:
        resolveColor(theme, measureLabelStyling?.[StylingPanelAttribute.Background]) ??
        getThemeStyle(ThemeBasePath.Measure, ThemePath.LabelName, ThemeAttribute.BackgroundColor) ??
        Colors.Transparent,
    },
    totalValues: {
      fontWeight: resolveFontWeight(totalValuesStyling?.[StylingPanelAttribute.FontStyle], BOLD_FONT_WEIGHT),
      fontStyle: resolveFontStyle(totalValuesStyling?.[StylingPanelAttribute.FontStyle]),
      textDecoration: resolveTextDecoration(totalValuesStyling?.[StylingPanelAttribute.FontStyle]),
      color:
        resolveColor(theme, totalValuesStyling?.[StylingPanelAttribute.FontColor]) ??
        getThemeStyle(ThemeBasePath.Total, ThemePath.LabelValue, ThemeAttribute.Color) ??
        COLORING.TEXT,
      background:
        resolveColor(theme, totalValuesStyling?.[StylingPanelAttribute.Background]) ??
        getThemeStyle(ThemeBasePath.Total, ThemePath.LabelValue, ThemeAttribute.BackgroundColor) ??
        Colors.Transparent,
    },
    nullValues: {
      fontWeight: resolveFontWeight(nullValueStyling?.[StylingPanelAttribute.FontStyle], "normal"),
      fontStyle: resolveFontStyle(nullValueStyling?.[StylingPanelAttribute.FontStyle]),
      textDecoration: resolveTextDecoration(nullValueStyling?.[StylingPanelAttribute.FontStyle]),
      color:
        resolveColor(theme, nullValueStyling?.[StylingPanelAttribute.FontColor]) ??
        getThemeStyle(ThemeBasePath.Null, ThemePath.LabelValue, ThemeAttribute.Color) ??
        COLORING.TEXT,
      background:
        resolveColor(theme, nullValueStyling?.[StylingPanelAttribute.Background]) ??
        getThemeStyle(ThemeBasePath.Null, ThemePath.LabelValue, ThemeAttribute.BackgroundColor) ??
        Colors.NullValueBackground,
    },
    grid: {
      lineClamp,
      border:
        resolveColor(theme, gridStyling?.[StylingPanelAttribute.Border]) ??
        getThemeStyle(ThemeBasePath.Grid, ThemePath.Grid, ThemeAttribute.BorderColor) ??
        Colors.DividerLight,
      divider:
        resolveColor(theme, gridStyling?.[StylingPanelAttribute.Divider]) ??
        getThemeStyle(ThemeBasePath.Grid, ThemePath.Divider, ThemeAttribute.BorderColor) ??
        Colors.DividerDark,
      background:
        resolveColor(theme, gridStyling?.[StylingPanelAttribute.Background]) ??
        getThemeStyle(ThemeBasePath.Grid, ThemePath.Grid, ThemeAttribute.BackgroundColor) ??
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

  styleService.contentRowHeight = styleService.contentCellHeight / lineClamp;

  styleService.contentTextHeight = styleService.contentRowHeight - CELL_PADDING_HEIGHT;

  return styleService;
};

export default createStyleService;
