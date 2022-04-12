import { PivotDimensionCellWithPosition } from '../../types/types';

const extractLeft = (
  qLeft: EngineAPI.INxPivotDimensionCell[],
  qArea: EngineAPI.INxDataAreaPage
): PivotDimensionCellWithPosition[][] => {
  if (!qLeft.length) {
    return [];
  }

  let rowIdx = 0;
  const matrix = [] as PivotDimensionCellWithPosition[][];

  function extract(
    root: PivotDimensionCellWithPosition | null,
    parent: PivotDimensionCellWithPosition | null,
    nodes: EngineAPI.INxPivotDimensionCell[],
    colIdx = 0
  ) {
    if (!Array.isArray(matrix[colIdx])) {
      matrix[colIdx] = [];
    }

    nodes.forEach((node, currIdx) => {
      rowIdx += currIdx === 0 ? 0 : 1;

      const nodeWithPosition = {
        ...node,
        x: colIdx,
        y: qArea.qTop + rowIdx - node.qUp, // Start position + current page position - previous tail size,
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
      matrix[colIdx].push(nodeWithPosition);

      if (node.qSubNodes.length) {
        extract(root || nodeWithPosition, nodeWithPosition, node.qSubNodes, colIdx + 1);
      } else {
        // This is a leaf node, increase leaf count on all nodes above it
        nodeWithPosition?.parent?.incrementLeafCount();
      }
    });
  }

  extract(null, null, qLeft);

  return matrix;
};

export default extractLeft;
