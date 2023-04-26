import { Component } from "../../types/QIX";
import { ExtendedTheme, LayoutService } from "../../types/types";

const BASE_PATH = "object.pivotTable";

export const DEFAULT_FONT_SIZE = "12px";
export const DEFAULT_FONT_FAMILY = '"Source Sans Pro", "Arial", "sans-serif"';
export const DEFAULT_FONT_COLOR = "#595959";
export const DEFAULT_BACKGROUND_COLOR = "transparent";
export const DEFAULT_ROW_HEIGHT = 28;
export const DEFAULT_LINE_CLAMP = 1;

type StyleProperties = Record<string, string>;

export interface Styling {
  header: StyleProperties;
  content: StyleProperties;
  backgroundColor: string;
  cellHeight: number;
  lineClamp: number;
}

enum Path {
  Header = "header",
  Content = "content",
  Root = "",
}
enum Attribute {
  FontSize = "fontSize",
  fontFamily = "fontFamily",
  Color = "color",
  CellHeight = "cellHeight",
  LineClamp = "lineClamp",
}

const resolveFontSize = (fontSize: number | undefined) => (fontSize ? `${fontSize}px` : undefined);

/**
 * get the styling for header and content
 */
const createComponentStyling = (
  chartStyling: Component | undefined,
  theme: ExtendedTheme,
  path: Path.Header | Path.Content
) => {
  const fontSize =
    resolveFontSize(chartStyling?.[path]?.fontSize) ??
    theme.getStyle(BASE_PATH, path, Attribute.FontSize) ??
    DEFAULT_FONT_SIZE;

  const fontFamily =
    chartStyling?.[path]?.fontFamily ?? theme.getStyle(BASE_PATH, path, Attribute.fontFamily) ?? DEFAULT_FONT_SIZE;

  const color =
    chartStyling?.[path]?.fontColor?.color ?? // TODO: resolve color
    theme.getStyle(BASE_PATH, path, Attribute.Color) ??
    DEFAULT_FONT_COLOR;

  return { fontSize, fontFamily, color };
};

/**
 * creates the styling based on layout, theme and default values - in that order
 */
export const createStyling = (layoutService: LayoutService, theme: ExtendedTheme): Styling => {
  1;
  const chartStyling = layoutService.layout.components?.find((n) => n.key === "theme");

  const lineClamp =
    chartStyling?.rowHeight?.linesCount ??
    // theme.getStyle(BASE_PATH, Path.ROOT, Attribute.LINE_CLAMP) ?? // TODO: add line clamp to theme
    DEFAULT_LINE_CLAMP;
  const cellHeight = lineClamp * DEFAULT_ROW_HEIGHT;
  const backgroundColor = DEFAULT_BACKGROUND_COLOR; // TODO: Add  background to styling panel?

  const header = createComponentStyling(chartStyling, theme, Path.Header);
  const content = createComponentStyling(chartStyling, theme, Path.Content);

  return { header, content, lineClamp, cellHeight, backgroundColor };
};
