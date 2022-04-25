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

export interface PivotLayout extends EngineAPI.IGenericHyperCubeLayout {
  nullValueRepresentation?: {
    text?: string;
  };
}

export default NxDimCellType;
