import type { ActivelySortedColumn, StylingOptions } from "./types";

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

interface ComponentCellStyling {
  background?: PaletteColor;
  fontColor?: PaletteColor;
}

export interface Component {
  key: "general" | "theme";
  rowHeight?: RowHeight;
  header: {
    fontFamily?: string;
    fontSize?: string;
    background?: PaletteColor;
    rowTitle?: ComponentCellStyling;
    columnTitle?: ComponentCellStyling;
  };
  content: {
    fontFamily?: string;
    fontSize?: string;
    fontColor?: PaletteColor;
    background?: PaletteColor;
    nullValue?: ComponentCellStyling;
    totalValue?: ComponentCellStyling;
  };
  rowContent: {
    fontFamily?: string;
    fontSize?: string;
    fontColor?: PaletteColor;
    background?: PaletteColor;
    nullValue?: ComponentCellStyling;
    totalLabel?: ComponentCellStyling;
    measureLabel?: ComponentCellStyling;
  };
  columnContent: {
    fontFamily?: string;
    fontSize?: string;
    fontColor?: PaletteColor;
    background?: PaletteColor;
    nullValue?: ComponentCellStyling;
    totalLabel?: ComponentCellStyling;
    measureLabel?: ComponentCellStyling;
  };
  grid: {
    rowHeight?: "compact";
    lineCount?: number;
    border?: PaletteColor;
    divider?: PaletteColor;
  };
}

export interface CurrentTheme {
  object?: {
    pivotTableV2?: StylingOptions;
  };
  fontSize: string;
  fontSizes?: string[];
  fontFamily: string;
  fontFamilies?: string[];
  color: string;
}

export interface Args {
  theme: {
    current(): CurrentTheme;
  };
}

export enum ColumnWidthType {
  Auto = "auto",
  FitToContent = "fitToContent",
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
  activelySortedColumn: ActivelySortedColumn;
}

export interface PivotLayout extends EngineAPI.IGenericHyperCubeLayout {
  qHyperCube: ExtendedHyperCube;
  nullValueRepresentation?: NullValueRepresentation;
  title: string;
  snapshotData?: SnapshotData;
  components?: Component[];
}

export interface SnapshotLayout extends EngineAPI.IGenericObjectLayout {
  nullValueRepresentation?: NullValueRepresentation;
  title?: string;
  snapshotData?: SnapshotData;
}

export interface ExtendedDimensionInfo extends EngineAPI.INxDimensionInfo {
  cId?: string;
  qLibraryId?: string;
  qCardinalities: {
    qHypercubeCardinal: number;
  };
  columnWidth: ColumnWidth;
}

export type Model = EngineAPI.IGenericObject | EngineAPI.IGenericBookmark | undefined;

export default NxDimCellType;

// types for properties
interface ExtendedInlineDimensionDef extends EngineAPI.INxInlineDimensionDef {
  columnWidth: ColumnWidth;
}

interface ExtendedInlineMeasureDef extends EngineAPI.INxInlineMeasureDef {
  columnWidth: ColumnWidth;
}

export interface DimensionOrMeasure {
  qDef: ExtendedInlineDimensionDef | ExtendedInlineMeasureDef;
}
