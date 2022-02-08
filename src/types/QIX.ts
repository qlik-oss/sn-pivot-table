export enum NxDimCellType {
  NX_DIM_CELL_VALUE = 'V',
  NX_DIM_CELL_EMPTY = 'E',
  NX_DIM_CELL_NORMAL = 'N',
  NX_DIM_CELL_TOTAL = 'T',
  NX_DIM_CELL_OTHER = 'O',
  NX_DIM_CELL_AGGR = 'A',
  NX_DIM_CELL_PSEUDO = 'P',
  NX_DIM_CELL_ROOT = 'R',
  NX_DIM_CELL_NULL = 'U',
  NX_DIM_CELL_GENERATED = 'G',
}

export interface NxAttributeExpressionValues {
  qValues: Array<NxSimpleValue>;
}

export interface NxAttributeDimValues {
  qValues: Array<NxSimpleValue>;
}

export interface NxSimpleValue {
  qText: string;
  qNum: number;
}

export interface NxPageArea {
  qLeft: number;
  qTop: number;
  qWidth: number;
  qHeight: number;
}

export interface NxCellPosition {
  qx: number;
  qy: number;
}

export interface NxPivotValuePoint {
  qLabel: string;
  qText: string;
  qNum: number | string;
  qType: NxDimCellType;
  qAttrExps: NxAttributeExpressionValues;
  qAttrDims: NxAttributeDimValues;
}

// https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxPivotDimensionCell
export interface NxPivotDimensionCell {
  qText: string;
  qElemNo: number;
  qValue: number | string;
  qCanExpand?: boolean;
  qCanCollapse?: boolean;
  qType: NxDimCellType;
  qUp: number;
  qDown: number;
  qSubNodes: Array<NxPivotDimensionCell>;
  qAttrExps?: NxAttributeExpressionValues;
  qAttrDims?: NxAttributeDimValues;
}

// https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxPivotPage
export interface NxPivotPage {
  qLeft: Array<NxPivotDimensionCell>;
  qTop: Array<NxPivotDimensionCell>;
  qData: Array<NxPivotValuePoint[]>;
  qArea: NxPageArea;
}

// https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxDimensionInfo
export interface NxDimensionInfo {
  qFallbackTitle: string;
  qApprMaxGlyphCount: number;
}

export interface NxMeasureInfo {
  qFallbackTitle: string;
}

export interface Layout {
  qHyperCube: {
    qPivotDataPages: Array<NxPivotPage>;
    qDimensionInfo: Array<NxDimensionInfo>;
    qSize: {
      qcy: number;
      qcx: number;
    },
    qNoOfLeftDims: number,
    qLastExpandedPos: NxCellPosition,
  };
}

export interface HyperCubeDef {
  qDimensions: NxDimensionInfo[];
  qMeasures: NxMeasureInfo[];
  qNoOfLeftDims: number;
  qPseudoDimPos: number;
  qInterColumnSortOrder: number[];
}

export interface GenericObjectLayout {
  qHyperCubeDef: HyperCubeDef;
}

export interface NxDimension {
  qLibraryId?: string;
}

export interface NxMeasure {
  qLibraryId?: string;
}
