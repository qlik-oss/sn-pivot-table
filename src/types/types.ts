import { stardust } from '@nebula.js/stardust';

export type ExpandOrCollapser = (rowIndex: number, columnIndex: number) => void;

export type FetchNextPage = (isRow: boolean) => void;

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
}

export interface ItemData {
  constraints?: stardust.Constraints;
  dataModel?: DataModel;
}

export interface GridItemData extends ItemData {
  matrix: CellValue[][] | EngineAPI.INxPivotValuePoint[][];
  isLeftColumn?: boolean;
  isHeader?: boolean;
}

export interface ListItemData extends ItemData {
  list: PivotDimensionCellWithPosition[];
}

export type CellValue = EngineAPI.INxPivotDimensionCell | string | null;

export interface PivotDimensionCellWithPosition extends EngineAPI.INxPivotDimensionCell {
  x: number;
  y: number;
  parent: PivotDimensionCellWithPosition | null;
}

export interface PivotData {
  left: CellValue[][],
  top: PivotDimensionCellWithPosition[][],
  data: EngineAPI.INxPivotValuePoint[][],
  headers: CellValue[][],
  measureInfoIndexMap: number[];
  dimensionInfoIndexMap: number[];
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
