import { PivotDimensionCellWithPosition } from '../../types/types';

const extractTop = (qTop: EngineAPI.INxPivotDimensionCell[]): PivotDimensionCellWithPosition[][] => {
  if (!qTop.length) {
    return [];
  }

  const matrix = [] as PivotDimensionCellWithPosition[][];
  let colIdx = 0;

  function extract(nodes: EngineAPI.INxPivotDimensionCell[], topRowIdx = 0) {
    if (!Array.isArray(matrix[topRowIdx])) {
      matrix[topRowIdx] = [];
    }

    nodes.forEach((node, currIdx) => {
      colIdx += currIdx === 0 ? 0 : 1;
      const nodeWithPosition = {
        ...node,
        x: colIdx,
        y: topRowIdx
      };
      matrix[topRowIdx].push(nodeWithPosition);

      if (node.qSubNodes.length) {
        extract(node.qSubNodes, topRowIdx + 1);
      }
    });
  };

  extract(qTop);

  return matrix;
};

export default extractTop;
