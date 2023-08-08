import type { stardust } from "@nebula.js/stardust";
import type { PivotLayout } from "./QIX";

export type ExpandOrCollapser = (rowIndex: number, columnIndex: number) => void;

export type FetchNextPage = (isRow: boolean, startIndex: number) => Promise<boolean>;

export type FetchMoreData = (left: number, top: number, width: number, height: number) => Promise<boolean>;

export type List = Record<number, Cell>;

export type Grid = List[];

export type HeaderTitle = {
  id: string;
  title: string;
};

export type MeasureData = EngineAPI.INxPivotValuePoint[][];

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
  constraints?: stardust.Constraints;
  dataModel?: DataModel;
  layoutService: LayoutService;
}

export interface GridItemData extends ItemData {
  grid: EngineAPI.INxPivotValuePoint[][];
  isLeftColumn?: boolean;
  showLastRowBorderBottom: boolean;
}

export interface ListItemData extends ItemData {
  list: List;
  isLeftColumn?: boolean;
  isLast: boolean;
  itemCount: number;
  showLastRowBorderBottom: boolean;
}

export interface Cell {
  ref: EngineAPI.INxPivotDimensionCell;
  x: number; // x position of cell in dataset
  y: number; // y position of cell in dataset
  pageX: number; // X position of cell in page
  pageY: number; // Y position of cell in page
  parent: Cell | null;
  root: Cell | null;
  leafCount: number;
  distanceToNextCell: number;
  incrementLeafCount: () => void;
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
  leftDimensionInfoIndexMap: number[];
  topDimensionInfoIndexMap: number[];
  size: PivotDataSize;
}

export interface TopDimensionData {
  grid: Grid;
  dimensionInfoIndexMap: number[];
  rowCount: number;
  layoutSize: Point;
}

export interface LeftDimensionData {
  grid: Grid;
  dimensionInfoIndexMap: number[];
  columnCount: number;
  layoutSize: Point;
}

export interface HeadersData {
  data: (null | HeaderTitle)[][];
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

export interface ExtendedTheme extends stardust.Theme {
  name: () => string;
}

export interface ExtendedTranslator extends stardust.Translator {
  language(): string;
}

export interface ViewService {
  gridColumnStartIndex: number;
  gridRowStartIndex: number;
  gridWidth: number;
  gridHeight: number;
}

export interface LayoutService {
  layout: PivotLayout;
  isDimensionLocked: (qType: EngineAPI.NxSelectionCellType, qRow: number, qCol: number) => boolean;
  getMeasureInfoIndexFromCellIndex: (index: number) => number;
  getNullValueText: () => string;
  size: Point;
  isSnapshot: boolean;
  hasLimitedData: boolean;
  hasLeftDimensions: boolean;
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
  currentPage: number;
  shouldShowPagination: boolean;
  totalPages: number;
  rowsPerPage: number;
  totalRowCount: number;
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

export interface StyleService extends StylingOptions {
  headerCellHeight: number;
  contentCellHeight: number;
  lineClamp: number;
}
