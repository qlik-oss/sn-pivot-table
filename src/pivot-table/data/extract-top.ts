import { CellValue } from '../../types/types';
import estimateCount from './estimate-count';

const extractTop = (qTop: EngineAPI.INxPivotDimensionCell[], columnCount: number): CellValue[][] => {
  if (!qTop.length) {
    return [];
  }

  let colIdx = 0;
  const rowCount = estimateCount(qTop);
  const matrix = Array(columnCount)
    .fill(null)
    .map(() => Array(rowCount).fill(null));

  function extract(nodes: EngineAPI.INxPivotDimensionCell[], topRowIdx = 0) {
    nodes.forEach((node, currIdx) => {
      colIdx += currIdx === 0 ? 0 : 1;
      matrix[colIdx][topRowIdx] = node; // eslint-disable-line no-param-reassign

      if (node.qSubNodes.length) {
        extract(node.qSubNodes, topRowIdx + 1);
      }
    });
  };

  extract(qTop);

  return matrix;
};

export default extractTop;
