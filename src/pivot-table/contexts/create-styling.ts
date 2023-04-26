import { stardust } from "@nebula.js/stardust";
import { Component } from "../../types/QIX";
import { LayoutService } from "../../types/types";

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
  HEADER = "header",
  CONTENT = "content",
  ROOT = "",
}
enum Attribute {
  FONT_SIZE = "fontSize",
  FONT_FAMILY = "fontFamily",
  COLOR = "color",
  CELL_HEIGHT = "cellHeight",
  LINE_CLAMP = "lineClamp",
}

const resolveFontSize = (fontSize: number | undefined) => (fontSize ? `${fontSize}px` : undefined);

/**
 * get the styling for header and content
 */
const createComponentStyling = (
  chartStyling: Component | undefined,
  theme: stardust.Theme,
  path: Path.HEADER | Path.CONTENT
) => {
  const fontSize =
    resolveFontSize(chartStyling?.[path]?.fontSize) ??
    theme.getStyle(BASE_PATH, path, Attribute.FONT_SIZE) ??
    DEFAULT_FONT_SIZE;

  const fontFamily =
    chartStyling?.[path]?.fontFamily ?? theme.getStyle(BASE_PATH, path, Attribute.FONT_FAMILY) ?? DEFAULT_FONT_SIZE;

  const color =
    chartStyling?.[path]?.fontColor?.color ?? // TODO: resolve color
    theme.getStyle(BASE_PATH, path, Attribute.COLOR) ??
    DEFAULT_FONT_COLOR;

  return { fontSize, fontFamily, color };
};

/**
 * creates the styling based on layout, theme and default values - in that order
 */
export const createStyling = (layoutService: LayoutService, theme: stardust.Theme): Styling => {
  1;
  const chartStyling = layoutService.layout.components?.find((n) => n.key === "theme");

  const lineClamp =
    chartStyling?.rowHeight?.linesCount ??
    // theme.getStyle(BASE_PATH, Path.ROOT, Attribute.LINE_CLAMP) ?? // TODO: add line clamp to theme
    DEFAULT_LINE_CLAMP;
  const cellHeight = lineClamp * DEFAULT_ROW_HEIGHT;
  const backgroundColor = DEFAULT_BACKGROUND_COLOR; // TODO: Add  background to styling panel?

  const header = createComponentStyling(chartStyling, theme, Path.HEADER);
  const content = createComponentStyling(chartStyling, theme, Path.CONTENT);

  return { header, content, lineClamp, cellHeight, backgroundColor };
};
