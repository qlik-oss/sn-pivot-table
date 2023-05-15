export enum Path {
  Header = "header",
  Content = "content",
  RowContent = "rowContent",
  ColumnContent = "columnContent",
  Grid = "Grid",
  Root = "",
}
export enum Attribute {
  FontSize = "fontSize",
  FontFamily = "fontFamily",
  Color = "color",
  CellHeight = "cellHeight",
  LineClamp = "lineClamp",
  Background = "background",
}

interface FontStyling {
  fontSize: string;
  fontFamily: string;
  color: string;
}

export interface CellStyling {
  color: string;
  background: string;
}

interface HeaderStyling extends Pick<FontStyling, "fontSize" | "fontFamily"> {
  background: string;
  rowTitle: CellStyling;
  columnTitle: CellStyling;
}

interface MeasureContentStyling extends FontStyling {
  background: string;
  nullValue: CellStyling;
  totalValue: CellStyling;
}

interface DimensionContentStyling extends FontStyling {
  background: string;
  nullValue: CellStyling;
  totalLabel: CellStyling;
  measureLabel: CellStyling;
}

interface GridStyling {
  rowHeight: "compact";
  lineCount: number;
  border: string;
  divider: string;
}

export interface StylingOptions {
  header: HeaderStyling;
  content: MeasureContentStyling;
  rowContent: DimensionContentStyling;
  columnContent: DimensionContentStyling;
  grid: GridStyling;
}
