import type { stardust } from "@nebula.js/stardust";
import type { ExtendedDimensionInfo, PivotLayout } from "./QIX";

export type ExpandOrCollapser = (rowIndex: number, columnIndex: number) => void;

export type FetchNextPage = (isRow: boolean, startIndex: number) => Promise<boolean>;

export type FetchMoreData = (left: number, top: number, width: number, height: number) => Promise<boolean>;

export type List = Record<number, Cell>;

export type Grid = List[];

export type HeaderCell = {
  id: string;
  title: string;
  sortDirection: SortDirection;
  qReverseSort?: boolean;
  colIdx: number;

  fieldId: string;
  qLibraryId?: string;
  isActivelySorted: boolean;
};

export type MeasureData = EngineAPI.INxPivotValuePoint[][];

export type VisibleDimensionInfo = ExtendedDimensionInfo | -1;

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
}

export interface ItemData {
  dataModel?: DataModel;
  layoutService: LayoutService;
}

export interface GridItemData extends ItemData {
  grid: EngineAPI.INxPivotValuePoint[][];
  isLeftColumn?: boolean;
  showLastRowBorderBottom: boolean;
  isTotalValue: (x: number, y: number) => boolean;
  shouldShowTotalCellBottomDivider: (y: number) => boolean;
  shouldShowTotalCellRightDivider: (x: number) => boolean;
}

export interface ListItemData extends ItemData {
  list: List;
  isLeftColumn?: boolean;
  isLast: boolean;
  itemCount: number;
  showLastRowBorderBottom: boolean;
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

interface FontStyling {
  fontSize: string;
  fontFamily: string;
  color: string;
}

export interface CellStyling {
  color: string;
  background: string;
}

interface RowTitleStyling extends CellStyling {
  hoverBackground: string;
  activeBackground: string;
}

interface ColumnTitleStyling extends CellStyling {
  hoverBackground: string;
  activeBackground: string;
}

interface HeaderStyling extends Pick<FontStyling, "fontSize" | "fontFamily"> {
  background: string;
  rowTitle: RowTitleStyling;
  columnTitle: ColumnTitleStyling;
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

export interface StyleService extends StylingOptions {
  headerCellHeight: number;
  contentCellHeight: number;
  lineClamp: number;
  headerLineClamp: number;
}

export type ActivelySortedColumn = {
  colIdx: number;
  fieldId: string;
  qLibraryId?: string;
  sortDirection: SortDirection;
};

export interface Header {
  id: string;
  qLibraryId?: string;
  fieldId: string;
  label: string;
  headTextAlign: Align;
  sortDirection: SortDirection;

  // sorting in PVT
  isDim: boolean;
  colIdx: number;
  qReverseSort?: boolean;
  isActivelySorted?: boolean;
}

export type Align = "left" | "center" | "right";
export type SortDirection = "A" | "D";

export type ChangeSortOrder = (header: Header, sortOrder: SortDirection) => Promise<boolean>;
export type ChangeActivelySortedHeader = (header: Omit<Header, "isActivelySorted">) => Promise<boolean>;
