import { PivotDimensionCellWithPosition } from '../../../types/types';

const isParentNode = (leafCell: PivotDimensionCellWithPosition, possibleParent: PivotDimensionCellWithPosition): boolean => {
  if (leafCell.qElemNo === possibleParent.qElemNo && leafCell.y === possibleParent.y) return false;

  let { parent: parentCell } = leafCell;
  while (parentCell) {
    if (parentCell.qElemNo === possibleParent.qElemNo && parentCell.y === possibleParent.y) return true;
    if (!parentCell.parent) return false;
    parentCell = parentCell.parent;
  }

  return false;
};

export default isParentNode;
