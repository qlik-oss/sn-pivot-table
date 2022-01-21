// Enigma model

import { NxPageArea, NxPivotDimensionCell, NxPivotPage, NxPivotValuePoint } from "./QIX";

export enum TYPE {
  LABEL = 'LABEL',
  DIMENSION = 'DIMENSION',
  MEASURE = 'MEASURE',
  EMPTY = 'EMPTY',
};

type ExpandFn = (qHyperCubeDef: string, rownNumber: number, column: number, option: boolean) => void;

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

export interface ItemData {
  pivotData: PivotData;
  model: Model;
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
