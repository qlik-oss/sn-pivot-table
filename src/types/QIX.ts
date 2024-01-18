import type { ColumnWidth } from "@qlik/nebula-table-utils/lib/components/ColumnAdjuster";
import type { ActivelySortedColumn } from "./types";

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
    rowPartialHeight?: number;
    scrollLeft?: number;
    scrollTopRatio?: number;
    visibleLeft?: number;
    visibleWidth?: number;
    visibleTop?: number;
    visibleHeight?: number;
    page?: number;
  };
  object: {
    size: Size;
  };
}

interface NullValueRepresentation {
  text?: string;
}

export interface PaletteColor {
  index?: number;
  color?: string;
}

export type FontStyleOptions = "bold" | "italic" | "underline";

export interface Component {
  key: "theme";
  header?: {
    fontFamily?: string;
    fontSize?: string;
    fontStyle?: FontStyleOptions[];
    fontColor?: PaletteColor;
    background?: PaletteColor;
  };
  dimensionValues?: {
    fontFamily?: string;
    fontSize?: string;
    fontColor?: PaletteColor;
    fontStyle?: FontStyleOptions[];
    background?: PaletteColor;
  };
  measureValues: {
    fontFamily?: string;
    fontSize?: string;
    fontColor?: PaletteColor;
    fontStyle?: FontStyleOptions[];
    background?: PaletteColor;
  };
  measureLabels?: {
    fontStyle?: FontStyleOptions[];
    fontColor?: PaletteColor;
    background?: PaletteColor;
  };
  totalValues?: {
    fontStyle?: FontStyleOptions[];
    fontColor?: PaletteColor;
    background?: PaletteColor;
  };
  nullValues?: {
    fontStyle?: FontStyleOptions[];
    fontColor?: PaletteColor;
    background?: PaletteColor;
  };
  grid?: {
    lineClamp?: number;
    border?: PaletteColor;
    divider?: PaletteColor;
    background?: PaletteColor;
  };
}

type ThemeColorAttributes = {
  color?: string;
  backgroundColor?: string;
};

type ThemeFontAttributes = {
  fontFamily?: string;
  fontSize?: string;
};

type ThemeStylingOptions = {
  dimension?: {
    label?: {
      name?: ThemeColorAttributes & ThemeFontAttributes;
      value?: ThemeColorAttributes & ThemeFontAttributes;
    };
  };
  measure?: {
    label?: {
      name?: ThemeColorAttributes;
      value?: ThemeColorAttributes & ThemeFontAttributes;
    };
  };
  total?: {
    label?: {
      value?: ThemeColorAttributes;
    };
  };
  null?: {
    label?: {
      value?: ThemeColorAttributes;
    };
  };
  grid?: {
    lineClamp?: number;
    backgroundColor?: string;
    borderColor?: string;
    divider: {
      borderColor?: string;
    };
  };
};

export interface CurrentTheme {
  object?: {
    pivotTableV2?: ThemeStylingOptions;
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

export interface ExtendedDimensionInfo extends EngineAPI.INxDimensionInfo {
  cId?: string;
  qLibraryId?: string;
  qCardinalities: {
    qHypercubeCardinal: number;
  };
  columnWidth?: ColumnWidth;
}

export interface ExtendedMeasureInfo extends EngineAPI.INxMeasureInfo {
  columnWidth?: ColumnWidth;
}

export interface ExtendedHyperCube extends EngineAPI.IHyperCube {
  qDimensionInfo: ExtendedDimensionInfo[];
  qMeasureInfo: ExtendedMeasureInfo[];
  activelySortedColumn: ActivelySortedColumn;
  topHeadersColumnWidth: ColumnWidth;
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

export type Model = EngineAPI.IGenericObject | EngineAPI.IGenericBookmark | undefined;

export type App = EngineAPI.IApp | undefined;

export default NxDimCellType;

// types for properties
interface ExtendedInlineDimensionDef extends EngineAPI.INxInlineDimensionDef {
  columnWidth: ColumnWidth;
}

interface ExtendedInlineMeasureDef extends EngineAPI.INxInlineMeasureDef {
  columnWidth: ColumnWidth;
}

export interface DimensionOrMeasureDef {
  qDef: ExtendedInlineDimensionDef | ExtendedInlineMeasureDef;
}

export interface ExtendedNxAttrExprInfo extends EngineAPI.INxAttrExprInfo {
  id: string;
}
