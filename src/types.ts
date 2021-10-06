// Enigma model

export interface Model {
  expandLeft: (qHyperCubeDef: string, rownNumber: number, column: number, option: boolean) => void;
  collapseLeft: (qHyperCubeDef: string, rownNumber: number, column: number, option: boolean) => void;
}

// Created pivot data model

export interface Item {
  qElemNo: number;
  column: number;
  qText: string;
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

export interface Layout {
  qHyperCube: {
    qPivotDataPages: QPivotDataPages;
    qDimensionInfo: QDimensionInfo;
  };
}
