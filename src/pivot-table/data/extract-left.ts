import { NxDimCellType, NxPageArea, NxPivotDimensionCell } from "../../types/QIX";
import { CellValue } from "../../types/types";

const extractLeft = (qLeft: NxPivotDimensionCell[], qArea: NxPageArea): CellValue[][] => {
  if (!qLeft.length) {
    return [];
  }

  let rowIdx = 0;

  function extract(nodes: NxPivotDimensionCell[], matrix: CellValue[][] = [], colIdx = 0): CellValue[][] {
    if (!Array.isArray(matrix[colIdx])) {
      matrix[colIdx] = Array.from({ length: qArea.qHeight }, () => null);  // eslint-disable-line no-param-reassign
    }

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

  return extract(qLeft);
};

export default extractLeft;
