import { PivotDimensionCellWithPosition } from '../../types/types';

const extractTop = (
  qTop: EngineAPI.INxPivotDimensionCell[],
  qArea: EngineAPI.INxDataAreaPage
): PivotDimensionCellWithPosition[][] => {
  if (!qTop.length) {
    return [];
  }

  const matrix = [] as PivotDimensionCellWithPosition[][];
  let colIdx = 0;

  function recursiveExtract(
    root: PivotDimensionCellWithPosition | null,
    parent: PivotDimensionCellWithPosition | null,
    nodes: EngineAPI.INxPivotDimensionCell[],
    topRowIdx = 0
  ): void {
    if (!Array.isArray(matrix[topRowIdx])) {
      matrix[topRowIdx] = [];
    }

    nodes.forEach((node, currIdx) => {
      colIdx += currIdx === 0 ? 0 : 1;
      const nodeWithPosition = {
        ...node,
        x: qArea.qLeft + colIdx - node.qUp, // Start position + current page position - previous tail size
        y: topRowIdx,
        parent,
        root,
        leafCount: 0,
        incrementLeafCount() {
          this.leafCount += 1;
          if (parent) {
            parent.incrementLeafCount();
          }
        },
      };
      matrix[topRowIdx].push(nodeWithPosition);

      if (node.qSubNodes.length) {
        recursiveExtract(root || nodeWithPosition ,nodeWithPosition, node.qSubNodes, topRowIdx + 1);
      } else {
        // This is a leaf node, increase leaf count on all nodes above it
        nodeWithPosition?.parent?.incrementLeafCount();
      }
    });
  };

  recursiveExtract(null, null, qTop);

  return matrix;
};

export default extractTop;
