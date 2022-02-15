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
}

export interface ItemData {
  constraints?: stardust.Constraints;
  dataModel: DataModel;
  matrix: CellValue[][] | EngineAPI.INxPivotValuePoint[][];
  isLeftColumn?: boolean;
  isHeader?: boolean;
}

export type CellValue = EngineAPI.INxPivotDimensionCell | string | null;

export interface PivotData {
  left: CellValue[][],
  top: CellValue[][],
  data: EngineAPI.INxPivotValuePoint[][],
  headers: CellValue[][],
  size: {
    headers: Point;
    top: Point;
    left: Point;
    data: Point;
    totalColumns: number;
    totalRows: number;
  }
}
