import type { stardust } from "@nebula.js/stardust";
import type { ColumnWidth } from "@qlik/nebula-table-utils/lib/components/ColumnAdjuster";
import type { HeaderData, SortDirection } from "@qlik/nebula-table-utils/lib/components/HeadCellMenu/types";
import type { PSEUDO_DIMENSION_INDEX } from "../constants";
import type { ExtendedDimensionInfo, ExtendedMeasureInfo, NxSelectionCellType, PivotLayout } from "./QIX";

export type ExpandOrCollapser = (rowIndex: number, columnIndex: number) => void;

export type ApplyColumnWidth = (columnWidth: ColumnWidth, cellInfo: AdjusterCellInfo) => void;

export type FetchNextPage = (isRow: boolean, startIndex: number) => Promise<boolean>;

export type FetchPages = (pages: EngineAPI.INxPage[]) => Promise<void>;

export type List = Record<number, Cell>;

export type Grid = List[];

export enum ColumnWidthLocation {
  Dimension = "dimensions",
  Measures = "measures",
  Pivot = "pivot",
}

export interface HeaderCell extends HeaderData {
  columnWidthLocation: ColumnWidthLocation;
  columnWidth?: ColumnWidth;
  qReverseSort?: boolean;
  isLocked: boolean;
  qApprMaxGlyphCount?: number;
  dimensionInfoIndex: number;
  canBeResized: boolean;
  isLeftDimension: boolean;
  isLastDimension: boolean;
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
  collapseLeft: ExpandOrCollapser;
  collapseTop: ExpandOrCollapser;
  expandLeft: ExpandOrCollapser;
  expandTop: ExpandOrCollapser;
  applyColumnWidth: ApplyColumnWidth;
  fetchPages: FetchPages;
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
  pageInfo: PageInfo;
  lastRow: List;
  lastColumn: List;
  attrExprInfoIndexes: AttrExprInfoIndex[];
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

export interface AdjusterCellInfo {
  dimensionInfoIndex: number;
  isLeftColumn: boolean;
  canBeResized: boolean;
  x?: number;
  columnWidthLocation: ColumnWidthLocation;
  colIdx?: number;
  expressionColor?: ExpressionColor;
}

export interface Cell {
  id: string;
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
  expressionColor: ExpressionColor;
  selectionCellType: NxSelectionCellType;
  dimensionInfoIndex: number;
  canBeResized: boolean;
  visibleMeasureInfoIndex?: number;
}

export interface MeasureCell {
  id: string;
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

export type HeadersDataMatrix = (null | HeaderCell)[][];

export interface HeadersData {
  data: HeadersDataMatrix;
  size: Point;
}

export interface Data {
  headersData: HeadersData;
  measureData: MeasureData;
  topDimensionData: TopDimensionData;
  leftDimensionData: LeftDimensionData;
  attrExprInfoIndexes: AttrExprInfoIndexes;
  nextPageHandler: (nextPages: EngineAPI.INxPivotPage[]) => void;
}

export interface ExtendedSelections extends stardust.ObjectSelections {
  on: (name: string, callback: () => void) => void;
  removeListener: (name: string, callback: () => void) => void;
}

export interface UseOptions {
  viewState: ViewState;
}

export interface ViewState {
  rowPartialHeight: number;
  visibleTopIndex: number;
  visibleRows: number;
  page: number;
  rowsPerPage: number;
}

export interface ViewService {
  gridColumnStartIndex: number;
  gridRowStartIndex: number;
  gridWidth: number;
  gridHeight: number;
  rowPartialHeight?: number;
  visibleTopIndex?: number;
  visibleRows?: number;
  viewState: ViewState;
  page?: number;
  rowsPerPage?: number;
}

export interface LayoutService {
  layout: PivotLayout;
  getMeasureInfoIndexFromCellIndex: (index: number, getVisibleIndex?: boolean) => number;
  getDimensionInfo: (index: number) => VisibleDimensionInfo | undefined;
  getDimensionInfoIndex: (qDimensionInfo: VisibleDimensionInfo) => number;
  getNullValueText: () => string;
  size: Point;
  isSnapshot: boolean;
  hasLimitedData: boolean;
  hasData: boolean;
  hasLeftDimensions: boolean;
  showTotalsAbove: boolean;
  hasPseudoDimOnLeft: boolean;
  leftDimensionInfoIndexes: number[];
  isLeftDimension: (dimensionInfoIndex: number) => boolean;
  isFullyExpanded: boolean;
  triggerdByExpandOrCollapse: boolean;
  visibleMeasureInfo: ExtendedMeasureInfo[];
}

export interface DataService {
  addPage: (nextDataPage: EngineAPI.INxPivotPage) => void;
  addDataPage: (nextDataPage: EngineAPI.INxPivotPage) => void;
  hasMoreRows: boolean;
  hasMoreColumns: boolean;
  data: PivotData;
  size: PivotDataSize;
}

export type Flags = { isEnabled: (flag: string) => boolean };

export interface Galaxy {
  translator: stardust.Translator;
  anything: {
    sense: {
      isUnsupportedFeature: (f: string) => boolean;
    };
  };
  flags: Flags;
}

export interface PageInfo {
  page: number;
  shouldShowPagination: boolean;
  totalPages: number;
  rowsPerPage: number;
  totalRowCount: number;
  rowsOnCurrentPage: number;
}

export type BasicCellStyling = {
  fontWeight: string | undefined; // "600" | "normal" from Styling panel, but from Theme it can be any supported font-weight value
  fontStyle: string; // "italic" | "normal" from Styling panel, but from Theme it can be any supported font-weight value
  textDecoration: string; // "underline" | "none" from Styling panel, but from Theme it can be any supported font-weight value
  color: string;
  background: string;
};

export type CellStyling = BasicCellStyling & {
  fontSize: string;
  fontFamily: string;
};

export type StylingPanelOptions = {
  header: CellStyling;
  dimensionValues: CellStyling;
  measureValues: CellStyling;
  measureLabels: BasicCellStyling;
  nullValues: BasicCellStyling;
  totalValues: BasicCellStyling;
  grid: {
    lineClamp: number;
    border: string;
    divider: string;
    background: string;
  };
};

export type StyleService = StylingPanelOptions & {
  header: CellStyling & { hoverBackground: string; activeBackground: string };
  headerCellHeight: number;
  contentCellHeight: number;
  contentRowHeight: number;
  contentTextHeight: number;
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

export enum ScrollDirection {
  Forward = "forward",
  Backward = "backward",
  None = "none", // If the user is not scrolling in any direction, use this value
}
