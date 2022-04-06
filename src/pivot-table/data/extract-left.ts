import { PivotDimensionCellWithPosition } from '../../types/types';

const extractLeft = (qLeft: EngineAPI.INxPivotDimensionCell[]): PivotDimensionCellWithPosition[][] => {
  if (!qLeft.length) {
    return [];
  }

  let rowIdx = 0;
  const matrix = [] as PivotDimensionCellWithPosition[][];

  function extract(parent: PivotDimensionCellWithPosition | null, nodes: EngineAPI.INxPivotDimensionCell[], colIdx = 0) {
    if (!Array.isArray(matrix[colIdx])) {
      matrix[colIdx] = [];
    }

    nodes.forEach((node, currIdx) => {
      rowIdx += currIdx === 0 ? 0 : 1;
      const nodeWithPosition = {
        ...node,
        x: colIdx,
        y: rowIdx,
        parent,
        leafCount: 0,
      };
      matrix[colIdx].push(nodeWithPosition);

      if (node.qSubNodes.length) {
        extract(nodeWithPosition, node.qSubNodes, colIdx + 1);
      }
    });
  }

  extract(null, qLeft);

  return matrix;
};

export default extractLeft;
