import { NxPageArea, NxPivotDimensionCell, NxPivotPage, NxPivotValuePoint } from "./QIX";

export enum TYPE {
  LABEL = 'LABEL',
  DIMENSION = 'DIMENSION',
  MEASURE = 'MEASURE',
  EMPTY = 'EMPTY',
};

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

export interface DataModel {
  pivotData: PivotData;
  stickyData: StickyData;
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
  matrix: Cell[][];
  isLeftColumn?: boolean;
  isHeader?: boolean;
}

export interface Cell {
  key: number | string;
  type: string;
  value: CellValue;
}

export type CellValue = NxPivotValuePoint | NxPivotDimensionCell | string | null | undefined;

export type Matrix = Array<Cell[]>;

export interface PivotData {
  matrix: Matrix;
  leftMatrix: Matrix,
  topMatrix: Matrix,
  nbrTopRows: number;
  nbrLeftColumns: number;
}

export interface StickyData {
  left: Cell[][],
  top: Cell[][],
  data: Cell[][],
  headers: Cell[][],
  nbrTopRows: number;
  nbrLeftColumns: number;
  size: {
    columns: number;
    rows: number;
  }
}
