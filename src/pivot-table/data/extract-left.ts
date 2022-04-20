/* eslint-disable no-param-reassign */

import { PivotDimensionCellWithPosition } from '../../types/types';
import createNode from './helpers/create-node';

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
      const nodeWithPosition = createNode(node, parent, root, colIdx, y);

      grid[colIdx][y] = nodeWithPosition;

      if (node.qSubNodes.length) {
        recursiveExtract(root || nodeWithPosition, nodeWithPosition, node.qSubNodes, colIdx + 1);
      } else {
        nodeWithPosition.parent?.incrementLeafCount();
      }
    });
  }

  recursiveExtract(null, null, qLeft);

  return grid;
};

export default extractLeftGrid;
