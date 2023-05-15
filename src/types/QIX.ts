enum NxDimCellType {
  NX_DIM_CELL_VALUE = "V",
  NX_DIM_CELL_EMPTY = "E",
  NX_DIM_CELL_NORMAL = "N",
  NX_DIM_CELL_TOTAL = "T",
  NX_DIM_CELL_OTHER = "O",
  NX_DIM_CELL_AGGR = "A",
  NX_DIM_CELL_PSEUDO = "P",
  NX_DIM_CELL_ROOT = "R",
  NX_DIM_CELL_NULL = "U",
  NX_DIM_CELL_GENERATED = "G",
}

export enum NxSelectionCellType {
  NX_CELL_DATA = "D",
  NX_CELL_TOP = "T",
  NX_CELL_LEFT = "L",
}

type Size = {
  w: number;
  h: number;
};

export interface SnapshotData {
  content?: {
    qPivotDataPages?: EngineAPI.INxPivotPage[];
  };
  object: {
    size: Size;
  };
}

interface NullValueRepresentation {
  text?: string;
}

export interface RowHeight {
  linesCount: number;
}

export interface PaletteColor {
  index?: number;
  color?: string;
}
export interface Component {
  key: "general" | "theme";
  rowHeight?: RowHeight;
  header?: {
    fontFamily?: string;
    fontSize?: number;
    fontColor?: PaletteColor;
  };
  content?: {
    fontFamily?: string;
    fontSize?: number;
    fontColor?: PaletteColor;
  };
}

export interface CurrentTheme {
  object?: {
    pivotTable?: {
      header?: {
        fontSize?: string;
        fontFamily?: string;
        color?: string;
      };
      content?: {
        fontSize?: string;
        fontFamily?: string;
        color?: string;
      };
    };
  };
  fontSize: string;
  fontFamily: string;
  color: string;
}

export interface Args {
  theme: {
    current(): CurrentTheme;
  };
}

export enum ColumnWidthType {
  Auto = "auto",
  fitToContent = "fitToContent",
  Pixels = "pixels",
  Percentage = "percentage",
}

export interface ColumnWidth {
  type: ColumnWidthType;
  pixels?: number;
  percentage?: number;
}

export interface ExtendedNxDimensionInfo extends EngineAPI.INxDimensionInfo {
  columnWidth: ColumnWidth;
}

export interface ExtendedNxMeasureInfo extends EngineAPI.INxMeasureInfo {
  columnWidth: ColumnWidth;
}

export interface ExtendedHyperCube extends Omit<EngineAPI.IHyperCube, "qDimensionInfo" | "qMeasureInfo"> {
  qColumnOrder: number[];
  qDimensionInfo: ExtendedNxDimensionInfo[];
  qMeasureInfo: ExtendedNxMeasureInfo[];
}

export interface PivotLayout extends Omit<EngineAPI.IGenericHyperCubeLayout, "qHyperCube"> {
  nullValueRepresentation?: NullValueRepresentation;
  title: string;
  snapshotData?: SnapshotData;
  components?: Component[];
  qHyperCube: ExtendedHyperCube;
}

export interface SnapshotLayout extends EngineAPI.IGenericObjectLayout {
  nullValueRepresentation?: NullValueRepresentation;
  title?: string;
  snapshotData?: SnapshotData;
}

export interface ExtendedDimensionInfo extends EngineAPI.INxDimensionInfo {
  cId?: string;
  qLibraryId?: string;
}

export type Model = EngineAPI.IGenericObject | EngineAPI.IGenericBookmark | undefined;

export default NxDimCellType;
