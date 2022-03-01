export const extractTop = (qTop: EngineAPI.INxPivotDimensionCell[]): EngineAPI.INxPivotDimensionCell[][] => {
  if (!qTop.length) {
    return [];
  }

  const matrix = [] as EngineAPI.INxPivotDimensionCell[][];
  let colIdx = 0;

  function extract(nodes: EngineAPI.INxPivotDimensionCell[], topRowIdx = 0) {
    if (!Array.isArray(matrix[topRowIdx])) {
      matrix[topRowIdx] = [];
    }

    nodes.forEach((node, currIdx) => {
      colIdx += currIdx === 0 ? 0 : 1;
      node.rowIdx = topRowIdx;
      node.colIdx = colIdx;
      matrix[topRowIdx].push(node);

      if (node.qSubNodes.length) {
        extract(node.qSubNodes, topRowIdx + 1);
      }
    });
  };

  extract(qTop);

  return matrix;
};

export default extractTop;
