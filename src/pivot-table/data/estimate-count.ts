const estimateCount = (data: EngineAPI.INxPivotDimensionCell[]): number => {
  let count = 1;
  let [node] = data;

  while (node.qSubNodes.length) {
    [node] = node.qSubNodes;
    count += 1;
  }

  return count;
};

export default estimateCount;
