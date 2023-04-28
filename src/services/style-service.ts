import {
  CELL_PADDING_HEIGHT,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_CELL_HEIGHT,
  DEFAULT_FONT_COLOR,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_LINE_CLAMP,
  LINE_HEIGHT_COEFFICIENT,
} from "../pivot-table/constants";
import { Component } from "../types/QIX";
import { ExtendedTheme, LayoutService, StyleService } from "../types/types";

const BASE_PATH = "object.pivotTable";

enum Path {
  Header = "header",
  Content = "content",
  Root = "",
}
enum Attribute {
  FontSize = "fontSize",
  FontFamily = "fontFamily",
  Color = "color",
  CellHeight = "cellHeight",
  LineClamp = "lineClamp",
}

type StyleProperties = {
  fontSize: string;
  fontFamily: string;
  color: string;
  cellHeight: number;
};

export interface Styling {
  header: StyleProperties;
  content: StyleProperties;
  backgroundColor: string;
  lineClamp: number;
}

const resolveFontSize = (fontSize: number | undefined) => (fontSize ? `${fontSize}px` : undefined);

const fontSizeToCellHeight = (fontSize: string, lineClamp: number) =>
  +(parseInt(fontSize, 10) * LINE_HEIGHT_COEFFICIENT * lineClamp + CELL_PADDING_HEIGHT).toFixed(2);

/**
 * get the styling for header and content
 */
const createSectionStyling = (
  chartStyling: Component | undefined,
  theme: ExtendedTheme,
  path: Path.Header | Path.Content
) => {
  const section = chartStyling?.[path];

  const fontSize =
    resolveFontSize(section?.fontSize) ?? theme.getStyle(BASE_PATH, path, Attribute.FontSize) ?? DEFAULT_FONT_SIZE;
  // TODO: no way of setting fontFamily in the styling panel yet
  const fontFamily = theme.getStyle(BASE_PATH, path, Attribute.FontFamily) ?? DEFAULT_FONT_FAMILY;
  // TODO: resolve color
  const color = section?.fontColor?.color ?? theme.getStyle(BASE_PATH, path, Attribute.Color) ?? DEFAULT_FONT_COLOR;

  return { fontSize, fontFamily, color };
};

/**
 * creates the styling based on layout, theme and default values - in that order
 */
const createStyleService = (theme: ExtendedTheme, layoutService: LayoutService): StyleService => {
  const chartStyling = layoutService.layout.components?.find((n) => n.key === "theme");

  const lineClamp =
    chartStyling?.rowHeight?.linesCount ??
    // theme.getStyle(BASE_PATH, Path.ROOT, Attribute.LINE_CLAMP) ?? // TODO: add line clamp to theme
    DEFAULT_LINE_CLAMP;
  const backgroundColor = DEFAULT_BACKGROUND_COLOR; // TODO: Add  background to styling panel?

  const header = createSectionStyling(chartStyling, theme, Path.Header);
  const content = createSectionStyling(chartStyling, theme, Path.Content);

  const headerCellHeight = Math.max(fontSizeToCellHeight(header.fontSize, lineClamp), DEFAULT_CELL_HEIGHT);
  const contentCellHeight = Math.max(fontSizeToCellHeight(content.fontSize, lineClamp), DEFAULT_CELL_HEIGHT);

  return { header, content, lineClamp, backgroundColor, headerCellHeight, contentCellHeight };
};

export default createStyleService;
