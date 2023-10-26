import type { stardust } from "@nebula.js/stardust";
import type { HeaderData, SortDirection } from "@qlik/nebula-table-utils/lib/components/HeadCellMenu/types";
import type { PSEUDO_DIMENSION_INDEX } from "../constants";
import type { ColumnWidth, ExtendedDimensionInfo, NxSelectionCellType, PivotLayout } from "./QIX";

export type ExpandOrCollapser = (rowIndex: number, columnIndex: number) => void;

export type ApplyColumnWidth = (columnWidth: ColumnWidth, cell: Cell) => void;

export type FetchNextPage = (isRow: boolean, startIndex: number) => Promise<boolean>;

export type FetchMoreData = (left: number, top: number, width: number, height: number) => Promise<void>;

export type List = Record<number, Cell>;

export type Grid = List[];

export interface HeaderCell extends HeaderData {
  columnWidth?: ColumnWidth;
  qReverseSort?: boolean;
  isLocked: boolean;
  qApprMaxGlyphCount?: number;
}

export type MeasureData = MeasureCell[][];

export type VisibleDimensionInfo = ExtendedDimensionInfo | typeof PSEUDO_DIMENSION_INDEX;

export interface Rect {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface DataModel {
  fetchMoreData: FetchMoreData;
  collapseLeft: ExpandOrCollapser;
  collapseTop: ExpandOrCollapser;
  expandLeft: ExpandOrCollapser;
  expandTop: ExpandOrCollapser;
  applyColumnWidth: ApplyColumnWidth;
}

export interface ItemData {
  dataModel?: DataModel;
  layoutService: LayoutService;
}

export interface ShowLastBorder {
  right: boolean;
  bottom: boolean;
}

export interface GridItemData extends ItemData {
  grid: MeasureCell[][];
  isLeftColumn?: boolean;
  showLastBorder: ShowLastBorder;
  isTotalValue: (x: number, y: number) => boolean;
  shouldShowTotalCellBottomDivider: (y: number) => boolean;
  shouldShowTotalCellRightDivider: (x: number) => boolean;
}

export interface ListItemData extends ItemData {
  list: List;
  isLeftColumn?: boolean;
  isLast: boolean;
  itemCount: number;
  showLastBorder: ShowLastBorder;
  listValues: Cell[];
  totalDividerIndex: number;
}

export interface Cell {
  ref: EngineAPI.INxPivotDimensionCell;
  x: number; // x position of cell in dataset
  y: number; // y position of cell in dataset
  pageX: number; // X position of cell in page
  pageY: number; // Y position of cell in page
  mainAxisPageCoord: number; // Either equal pageX or pageY depending on if a cell is in the left or top grid
  isLeftColumn: boolean;
  parent: Cell | null;
  root: Cell | null;
  children: Cell[];
  leafCount: number;
  distanceToNextCell: number;
  isTotal: boolean;
  isEmpty: boolean;
  isNull: boolean;
  isPseudoDimension: boolean;
  isLockedByDimension: boolean;
  isLeafNode: boolean;
  isAncestorPseudoDimension: boolean;
  expressionColor: ExpressionColor;
  selectionCellType: NxSelectionCellType;
}

export interface MeasureCell {
  ref: EngineAPI.INxPivotValuePoint;
  isNull: boolean;
  expressionColor: ExpressionColor;
}

export interface PivotDataSize {
  headers: Point;
  top: Point;
  left: Point;
  data: Point;
  totalColumns: number;
  totalRows: number;
}

export interface PivotData {
  qDataPages: EngineAPI.INxPivotPage[];
  left: Cell[][];
  leftGrid: Cell[][];
  top: Cell[][];
  topGrid: Cell[][];
  data: EngineAPI.INxPivotValuePoint[][];
  headers: (null | string)[][];
  size: PivotDataSize;
}

export interface TopDimensionData {
  grid: Grid;
  rowCount: number;
  layoutSize: Point;
  totalDividerIndex: number;
}

export interface LeftDimensionData {
  grid: Grid;
  columnCount: number;
  layoutSize: Point;
  totalDividerIndex: number;
}

export interface HeadersData {
  data: (null | HeaderCell)[][];
  size: Point;
}

export interface Data {
  headersData: HeadersData;
  measureData: MeasureData;
  topDimensionData: TopDimensionData;
  leftDimensionData: LeftDimensionData;
  nextPageHandler: (nextPage: EngineAPI.INxPivotPage) => void;
}

export interface ExtendedSelections extends stardust.ObjectSelections {
  on: (name: string, callback: () => void) => void;
  removeListener: (name: string, callback: () => void) => void;
}

export interface ViewService {
  gridColumnStartIndex: number;
  gridRowStartIndex: number;
  gridWidth: number;
  gridHeight: number;
}

export interface LayoutService {
  layout: PivotLayout;
  getMeasureInfoIndexFromCellIndex: (index: number) => number;
  getNullValueText: () => string;
  size: Point;
  isSnapshot: boolean;
  hasLimitedData: boolean;
  hasLeftDimensions: boolean;
  showTotalsAbove: boolean;
  hasPseudoDimOnLeft: boolean;
  isFullyExpanded: boolean;
  dimensionInfoIndexMap: Map<ExtendedDimensionInfo, number>;
}

export interface DataService {
  addPage: (nextDataPage: EngineAPI.INxPivotPage) => void;
  addDataPage: (nextDataPage: EngineAPI.INxPivotPage) => void;
  hasMoreRows: boolean;
  hasMoreColumns: boolean;
  data: PivotData;
  size: PivotDataSize;
}

export interface Galaxy {
  translator: stardust.Translator;
  anything: {
    sense: {
      isUnsupportedFeature: (f: string) => boolean;
    };
  };
}

export interface PageInfo {
  page: number;
  shouldShowPagination: boolean;
  totalPages: number;
  rowsPerPage: number;
  totalRowCount: number;
  rowsOnCurrentPage: number;
}

export type CellStyling = {
  fontSize: string;
  fontFamily: string;
  fontWeight: string | undefined; // "600" | "normal" from Styling panel, but from Theme it can be any supported font-weight value
  fontStyle: string; // "italic" | "normal" from Styling panel, but from Theme it can be any supported font-weight value
  textDecoration: string; // "underline" | "none" from Styling panel, but from Theme it can be any supported font-weight value
  color: string;
  background: string;
};

export type ThemeStyling = {
  header: CellStyling;
  dimensionValues: CellStyling;
  measureValues: CellStyling;
  measureLabels: Omit<CellStyling, "fontSize" | "fontFamily">;
  nullValues: Omit<CellStyling, "fontSize" | "fontFamily">;
  totalValues: Omit<CellStyling, "fontSize" | "fontFamily">;
  grid: {
    lineClamp: number;
    border: string;
    divider: string;
    background: string;
  };
};

export type StyleService = ThemeStyling & {
  header: CellStyling & { hoverBackground: string; activeBackground: string };
  headerCellHeight: number;
  contentCellHeight: number;
};

export type ActivelySortedColumn = {
  colIdx: number;
  fieldId: string;
  qLibraryId?: string;
  sortDirection: SortDirection;
};

export enum AttrExprInfoIDs {
  CellForegroundColor = "cellForegroundColor",
  CellBackgroundColor = "cellBackgroundColor",
}

export type AttrExprInfoIndex = {
  cellForegroundColor: number;
  cellBackgroundColor: number;
};

export type AttrExprInfoIndexes = {
  left: AttrExprInfoIndex[];
  top: AttrExprInfoIndex[];
  measures: AttrExprInfoIndex[];
};

export type ExpressionColor = {
  color: string | null;
  background: string | null;
};

export type ChangeSortOrder = (headerCell: HeaderCell, sortOrder: SortDirection) => Promise<boolean>;
export type ChangeActivelySortedHeader = (headerData: Omit<HeaderData, "isActivelySorted">) => Promise<boolean>;

export enum ScrollableContainerOrigin {
  LEFT_GRID = "leftGrid",
  DATA_GRID = "dataGrid",
  CONTAINER_GRID = "containerGrid",
}
