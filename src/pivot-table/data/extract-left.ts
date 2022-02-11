import { NxPivotDimensionCell } from '../../types/QIX';
import { CellValue } from '../../types/types';
import estimateCount from './estimate-count';

const extractLeft = (qLeft: NxPivotDimensionCell[], rowCount: number): CellValue[][] => {
  if (!qLeft.length) {
    return [];
  }

  let rowIdx = 0;
  const columnCount = estimateCount(qLeft);
  const matrix = Array(columnCount)
    .fill(null)
    .map(() => Array(rowCount).fill(null));

  function extract(nodes: NxPivotDimensionCell[], colIdx = 0) {
    nodes.forEach(node => {
      matrix[colIdx][rowIdx] = node; // eslint-disable-line no-param-reassign

      if (node.qSubNodes.length) {
        extract(node.qSubNodes, colIdx + 1);
      } else {
        rowIdx += 1;
      }
    });
  }

  extract(qLeft);

  return matrix;
};

export default extractLeft;
