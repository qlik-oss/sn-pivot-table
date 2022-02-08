import { NxDimCellType, NxPageArea, NxPivotDimensionCell } from "../../types/QIX";
import { Cell } from "../../types/types";
import createCell from './cell';

const extractLeft = (qLeft: NxPivotDimensionCell[], qArea: NxPageArea): Cell[][] => {
  if (!qLeft.length) {
    return [];
  }

  const mapToInitRowValue = (value: undefined, i: number) => createCell(value, `null-${0}-${i}`);
  let rowIdx = 0;

  function extract(nodes: NxPivotDimensionCell[], matrix: Cell[][] = [], colIdx = 0): Cell[][] {
    if (!Array.isArray(matrix[colIdx])) {
      matrix[colIdx] = Array.from({ length: qArea.qHeight }, mapToInitRowValue);  // eslint-disable-line no-param-reassign
    }

    return nodes.reduce((innerMatrix: Cell[][], node) => {
      if (node.qType !== NxDimCellType.NX_DIM_CELL_TOTAL) {
        innerMatrix[colIdx][rowIdx] = createCell(node, `${node.qType}-${colIdx}-${rowIdx}-${node.qElemNo}`); // eslint-disable-line no-param-reassign
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
