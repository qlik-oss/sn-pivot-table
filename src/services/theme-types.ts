type Color = string;

interface FontStyling {
  fontSize?: string;
  fontFamily?: string;
  color?: Color;
}

interface CellStyling {
  color: Color;
  background: Color;
}

interface HeaderStyling extends FontStyling {
  background?: Color;
  rowTitle: CellStyling;
  columnTitle: CellStyling;
}

interface MeasureContentStyling extends FontStyling {
  background?: Color;
  nullValue: CellStyling;
  totalValue: CellStyling;
}

interface DimensionContentStyling extends FontStyling {
  background?: Color;
  nullValue: CellStyling;
  totalLabel: CellStyling;
  measureLabel: CellStyling;
}

interface GridStyling {
  rowHeight: "compact";
  lineCount: number;
  border: Color;
  divider: Color;
}

export interface StyleService {
  header: HeaderStyling;
  content: MeasureContentStyling;
  rowContent: DimensionContentStyling;
  columnContent: DimensionContentStyling;
  grid: GridStyling;
  headerCellHeight: number;
  contentCellHeight: number;
}
