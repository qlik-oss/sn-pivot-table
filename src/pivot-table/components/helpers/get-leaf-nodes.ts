const getLeafNodes = (root: EngineAPI.INxPivotDimensionCell[], nodes: EngineAPI.INxPivotDimensionCell[]): EngineAPI.INxPivotDimensionCell[] => root.reduce((ary: EngineAPI.INxPivotDimensionCell[], cell) => {
  if (cell.qSubNodes.length) {
    return getLeafNodes(cell.qSubNodes, ary);
  }

  ary.push(cell);

  return ary;
}, nodes);

export default getLeafNodes;
