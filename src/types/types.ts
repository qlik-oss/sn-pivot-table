import { stardust } from '@nebula.js/stardust';
import { PivotLayout } from './QIX';

export type ExpandOrCollapser = (rowIndex: number, columnIndex: number) => void;

export type FetchNextPage = (isRow: boolean, startIndex: number) => void;

export type FetchMoreData = (left: number, top: number, width: number, height: number) => void;

export interface Rect {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface DataModel {
  fetchNextPage: FetchNextPage;
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
  list: Cell[];
  isLeftColumn?: boolean;
}

export interface Cell {
  ref: EngineAPI.INxPivotDimensionCell;
  x: number;
  y: number;
  parent: Cell | null;
  root: Cell | null;
  leafCount: number;
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
  qDataPages: EngineAPI.INxPivotPage[],
  left: Cell[][],
  leftGrid: Cell[][],
  top: Cell[][],
  topGrid: Cell[][],
  data: EngineAPI.INxPivotValuePoint[][],
  headers: (null | string)[][],
  leftDimensionInfoIndexMap: number[];
  topDimensionInfoIndexMap: number[];
  size: PivotDataSize;
}

export interface TopDimensionData {
  data: Cell[][];
  grid: Cell[][];
  dimensionInfoIndexMap: number[];
  size: Point;
}

export interface LeftDimensionData {
  data: Cell[][];
  grid: Cell[][];
  dimensionInfoIndexMap: number[];
  size: Point;
}

export interface HeadersData {
  data: (null | string)[][];
  size: Point;
}

export interface MeasureData {
  data: EngineAPI.INxPivotValuePoint[][];
  size: Point;
}

export interface Data {
  headersData: HeadersData;
  measureData: MeasureData;
  topDimensionData: TopDimensionData;
  leftDimensionData: LeftDimensionData;
  hasMoreRows: boolean;
  hasMoreColumns: boolean;
  nextPageHandler: (nextPage: EngineAPI.INxPivotPage) => void;
  moreDataHandler: (nextPage: EngineAPI.INxPivotPage) => void;
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
  layout: PivotLayout,
  isDimensionLocked: (qType: EngineAPI.NxSelectionCellType, qRow: number, qCol: number) => boolean;
  getMeasureInfoIndexFromCellIndex: (index: number) => number;
  getNullValueText: () => string;
}

export interface DataService {
  addPage: (nextDataPage: EngineAPI.INxPivotPage) => void;
  addDataPage: (nextDataPage: EngineAPI.INxPivotPage) => void;
  hasMoreRows: boolean;
  hasMoreColumns: boolean;
  data: PivotData;
  size: PivotDataSize;
}

type StyleProperties = Record<string, string>;

export interface StyleService {
  header: StyleProperties;
  content: StyleProperties;
  title: StyleProperties;
  backgroundColor: string;
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
