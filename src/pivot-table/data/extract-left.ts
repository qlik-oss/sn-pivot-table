import { NxDimCellType, NxPivotDimensionCell } from '../../types/QIX';
import { CellValue } from '../../types/types';

const extractLeft = (qLeft: NxPivotDimensionCell[], rowCount: number, columnCount: number): CellValue[][] => {
  if (!qLeft.length) {
    return [];
  }

  let rowIdx = 0;
  const nullMatrix = Array(columnCount)
    .fill(null)
    .map(() => Array(rowCount).fill(null));

  function extract(nodes: NxPivotDimensionCell[], matrix: CellValue[][] = [], colIdx = 0): CellValue[][] {
    return nodes.reduce((innerMatrix: CellValue[][], node) => {
      if (node.qType !== NxDimCellType.NX_DIM_CELL_TOTAL) {
        innerMatrix[colIdx][rowIdx] = node; // eslint-disable-line no-param-reassign
        rowIdx += node.qCanCollapse ? 0 : 1;
      }

      if (node.qCanCollapse) {
        return extract(node.qSubNodes, innerMatrix, colIdx + 1);
      }

      return innerMatrix;
    }, matrix);
  }

  return extract(qLeft, nullMatrix);
};

export default extractLeft;
