import { stardust } from '@nebula.js/stardust';

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
  pivotData: PivotData;
  fetchNextPage: FetchNextPage;
  fetchMoreData: FetchMoreData;
  hasMoreColumns: boolean;
  hasMoreRows: boolean;
  collapseLeft: ExpandOrCollapser;
  collapseTop: ExpandOrCollapser;
  expandLeft: ExpandOrCollapser;
  expandTop: ExpandOrCollapser;
  hasData: boolean;
  isDimensionLocked: (qType: EngineAPI.NxSelectionCellType, qRow: number, qCol: number) => boolean;
  getDimensionInfo: () => EngineAPI.INxDimensionInfo[];
  getMeasureInfo: () => EngineAPI.INxMeasureInfo[];
  getNoLeftDims: () => number;
  getMeasureInfoIndexFromCellIndex: (index: number) => number;
}

export interface ItemData {
  constraints?: stardust.Constraints;
  dataModel?: DataModel;
}

export interface GridItemData extends ItemData {
  matrix: CellValue[][] | EngineAPI.INxPivotValuePoint[][];
  isLeftColumn?: boolean;
}

export interface ListItemData extends ItemData {
  list: PivotDimensionCellWithPosition[];
  isLeftColumn?: boolean;
}

export type CellValue = EngineAPI.INxPivotDimensionCell | null;

export interface PivotDimensionCellWithPosition extends EngineAPI.INxPivotDimensionCell {
  x: number;
  y: number;
  parent: PivotDimensionCellWithPosition | null;
  root: PivotDimensionCellWithPosition | null;
  leafCount: number;
  incrementLeafCount: () => void;
}

export interface PivotData {
  qDataPages: EngineAPI.INxPivotPage[],
  left: PivotDimensionCellWithPosition[][],
  leftGrid: PivotDimensionCellWithPosition[][],
  top: PivotDimensionCellWithPosition[][],
  topGrid: PivotDimensionCellWithPosition[][],
  data: EngineAPI.INxPivotValuePoint[][],
  headers: (null | string)[][],
  leftDimensionInfoIndexMap: number[];
  topDimensionInfoIndexMap: number[];
  size: {
    headers: Point;
    top: Point;
    left: Point;
    data: Point;
    totalColumns: number;
    totalRows: number;
  }
}

export interface ExtendedSelections extends stardust.ObjectSelections {
  on: (name: string, callback: () => void) => void;
  removeListener: (name: string, callback: () => void) => void;
}

export interface ScrollService {
  shouldResetScroll: boolean;
  scrollLeftPosition: number;
  scrollTopPosition: number;
  scrollWidth: number;
  scrollHeight: number;
}
