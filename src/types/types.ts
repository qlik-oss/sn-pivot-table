// Enigma model

import { NxPageArea, NxPivotPage } from "./QIX";

type ExpandFn = (qHyperCubeDef: string, rownNumber: number, column: number, option: boolean) => void;
type GetHyperCubePivotDataParam = { qPath: string, qPages: Array<NxPageArea> };
type GetHyperCubePivotData = (param: GetHyperCubePivotDataParam) => Promise<NxPivotPage[]>

export interface Model {
  expandLeft: ExpandFn
  collapseLeft: ExpandFn
  expandTop: ExpandFn
  collapseTop: ExpandFn
  getHyperCubePivotData: GetHyperCubePivotData
}

export interface Rect {
  width: number;
  height: number;
}

export interface Item {
  qElemNo: number;
  column: number;
  qText: string;
  qNum: string;
}

export interface ColumnItem extends Item {
  qCanExpand: boolean;
  qCanCollapse: boolean;
  column: number;
}

export interface Column {
  headers: Array<Dimension>;
}

export interface PivotColumns {
  items: Array<ColumnItem>;
  headers: Array<Dimension>;
}

export interface PivotTableData {
  leftColumns: PivotColumns;
  topColumns: PivotColumns;
  rows: Array<Array<Item>>;
  rootIndex: Array<number>
}

// Object layout
export interface ColumnNode {
  qCanExpand: boolean;
  qCanCollapse: boolean;
  qElemNo: number;
  qSubNodes: Array<ColumnNode>;
  qText: string;
  qType: string;
  qUp: number;
  qValue: string;
}

export interface DataPage {
  qTop: Array<ColumnNode>;
  qLeft: Array<ColumnNode>;
  qData: Array<Array<Item>>;
}

export interface Dimension {
  cId: string;
  qFallbackTitle: string;
}

export type QPivotDataPages = Array<DataPage>;
export type QDimensionInfo = Array<Dimension>;
