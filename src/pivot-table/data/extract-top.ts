/* eslint-disable no-param-reassign */

import { PivotDimensionCellWithPosition } from '../../types/types';

const extractTopGrid = (
  grid: PivotDimensionCellWithPosition[][],
  qTop: EngineAPI.INxPivotDimensionCell[],
  qArea: EngineAPI.INxDataAreaPage
): PivotDimensionCellWithPosition[][] => {
  if (!qTop.length) {
    return [];
  }

  let colIdx = 0;

  function recursiveExtract(
    root: PivotDimensionCellWithPosition | null,
    parent: PivotDimensionCellWithPosition | null,
    nodes: EngineAPI.INxPivotDimensionCell[],
    topRowIdx = 0
  ): void {
    if (!Array.isArray(grid[topRowIdx])) {
      grid[topRowIdx] = [];
    }

    nodes.forEach((node, currIdx) => {
      colIdx += currIdx === 0 ? 0 : 1;
      const x = qArea.qLeft + colIdx - node.qUp; // Start position + current page position - previous tail size
      const nodeFromPrevPage = grid[topRowIdx][x];
      const nodeWithPosition = {
        ...node,
        x,
        y: topRowIdx,
        parent,
        root,
        leafCount: nodeFromPrevPage?.leafCount ?? 0, // Append leafcount from previous page
        incrementLeafCount() {
          this.leafCount += 1;
          if (parent) {
            parent.incrementLeafCount();
          }
        },
      };

      grid[topRowIdx][x] = nodeWithPosition;

      if (node.qSubNodes.length) {
        recursiveExtract(root || nodeWithPosition, nodeWithPosition, node.qSubNodes, topRowIdx + 1);
      } else if (nodeFromPrevPage?.qUp !== node.qUp && nodeFromPrevPage?.qDown !== node.qDown) { // Check if node this is a new page for the node
        // This is a leaf node, increase leaf count on all nodes above it
        nodeWithPosition?.parent?.incrementLeafCount();
      }
    });
  };

  recursiveExtract(null, null, qTop);

  return grid;
};

export default extractTopGrid;
