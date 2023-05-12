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
}

export interface ListItemData extends ItemData {
  list: List;
  isLeftColumn?: boolean;
  isLast: boolean;
  itemCount: number;
}

export interface Cell {
  ref: EngineAPI.INxPivotDimensionCell;
  x: number;
  y: number;
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

type StyleProperties = {
  fontSize: string;
  fontFamily: string;
  color: string;
};

export interface StyleService {
  header: StyleProperties;
  content: StyleProperties;
  backgroundColor: string;
  lineClamp: number;
  headerCellHeight: number;
  contentCellHeight: number;
}

export interface Galaxy {
  translator: {
    get: (str: string) => string;
  };
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
