import NxDimCellType from '../../../types/QIX';
import { PivotDimensionCellWithPosition } from '../../../types/types';

const findParentPseudoDimension = (cell: PivotDimensionCellWithPosition): PivotDimensionCellWithPosition | null => {
  if (cell.qType === NxDimCellType.NX_DIM_CELL_PSEUDO) return cell;

  let { parent } = cell;

  if (!parent) return parent;

  while (parent.qType !== NxDimCellType.NX_DIM_CELL_PSEUDO) {
    if (parent.parent) {
      parent = parent.parent;
    } else {
      return null;
    }
  }

  return parent;
};

export default findParentPseudoDimension;
