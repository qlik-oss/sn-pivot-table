import { NxPageArea, NxPivotDimensionCell, NxPivotPage, NxPivotValuePoint } from './QIX';

type ExpandFn = (qHyperCubeDef: string, rownNumber: number, column: number, option: boolean) => Promise<void>;

export type ExpandOrCollapser = (rowIndex: number, columnIndex: number) => void;

export type FetchNextPage = (isRow: boolean) => void;

export interface Model {
  expandLeft: ExpandFn
  collapseLeft: ExpandFn
  expandTop: ExpandFn
  collapseTop: ExpandFn
  getHyperCubePivotData: (param: { qPath: string, qPages: Array<NxPageArea> }) => Promise<NxPivotPage[]>
}

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
  collapseLeft: ExpandOrCollapser
  collapseTop: ExpandOrCollapser
  expandLeft: ExpandOrCollapser
  expandTop: ExpandOrCollapser
}

export interface ItemData {
  constraints?: Stardust.Constraints;
  dataModel: DataModel;
  matrix: CellValue[][] | NxPivotValuePoint[][];
  isLeftColumn?: boolean;
  isHeader?: boolean;
}

export type CellValue = NxPivotDimensionCell | string | null;

export interface PivotData {
  left: CellValue[][],
  top: CellValue[][],
  data: NxPivotValuePoint[][],
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
