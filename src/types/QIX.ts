enum NxDimCellType {
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

export enum NxSelectionCellType {
  NX_CELL_DATA = 'D',
  NX_CELL_TOP = 'T',
  NX_CELL_LEFT = 'L'
}

type Size = {
  w: number;
  h: number;
};

export interface SnapshotData {
  content?: {
    qPivotDataPages?: EngineAPI.INxPivotPage[];
  },
  object: {
    size: Size
  }
}

interface NullValueRepresentation {
  text?: string;
}

export interface PivotLayout extends EngineAPI.IGenericHyperCubeLayout {
  nullValueRepresentation?: NullValueRepresentation;
  title: string;
  snapshotData?: SnapshotData
}

export interface SnapshotLayout extends EngineAPI.IGenericObjectLayout {
  nullValueRepresentation?: NullValueRepresentation;
  title?: string;
  snapshotData?: SnapshotData
}

export default NxDimCellType;
