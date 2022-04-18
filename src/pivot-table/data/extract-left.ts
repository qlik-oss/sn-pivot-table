/* eslint-disable no-param-reassign */

import { PivotDimensionCellWithPosition } from '../../types/types';

const extractLeftGrid = (
  grid: PivotDimensionCellWithPosition[][],
  qLeft: EngineAPI.INxPivotDimensionCell[],
  qArea: EngineAPI.INxDataAreaPage
): PivotDimensionCellWithPosition[][] => {
  if (!qLeft.length) {
    return [];
  }

  let rowIdx = 0;

  function recursiveExtract(
    root: PivotDimensionCellWithPosition | null,
    parent: PivotDimensionCellWithPosition | null,
    nodes: EngineAPI.INxPivotDimensionCell[],
    colIdx = 0
  ) {
    if (!Array.isArray(grid[colIdx])) {
      grid[colIdx] = [];
    }

    nodes.forEach((node, currIdx) => {
      rowIdx += currIdx === 0 ? 0 : 1;
      const y = qArea.qTop + rowIdx - node.qUp; // Start position + current page position - previous tail size,
      const nodeFromPrevPage = grid[colIdx][y];
      const nodeWithPosition = {
        ...node,
        x: colIdx,
        y,
        parent,
        root,
        leafCount:nodeFromPrevPage?.leafCount ?? 0, // Append leafcount from previous page
        incrementLeafCount() {
          this.leafCount += 1;
          if (parent) {
            parent.incrementLeafCount();
          }
        },
      };

      grid[colIdx][y] = nodeWithPosition;

      if (node.qSubNodes.length) {
        recursiveExtract(root || nodeWithPosition, nodeWithPosition, node.qSubNodes, colIdx + 1);
      } else if (nodeFromPrevPage?.qUp !== node.qUp && nodeFromPrevPage?.qDown !== node.qDown) { // Check if node this is a new page for the node
        // This is a leaf node, increase leaf count on all nodes above it
        nodeWithPosition?.parent?.incrementLeafCount();
      }
    });
  }

  recursiveExtract(null, null, qLeft);

  return grid;
};

export default extractLeftGrid;
