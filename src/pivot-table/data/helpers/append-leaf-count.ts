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

const appendLeafCount = (matrix: PivotDimensionCellWithPosition[][], leafCells: PivotDimensionCellWithPosition[]): void => {
  matrix.forEach((rowOrColumn) => {
    rowOrColumn.forEach(cell => {
      if (cell.qSubNodes.length) {
        const leafNodes = leafCells.filter(leafCell => isParentNode(leafCell, cell));
        cell.leafCount = leafNodes.length; // eslint-disable-line no-param-reassign
      }
    });
  });
};

export default appendLeafCount;
