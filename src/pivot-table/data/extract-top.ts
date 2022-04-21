/* eslint-disable no-param-reassign */

import { PivotDimensionCellWithPosition } from '../../types/types';
import createNode from './helpers/create-node';

const extractTopGrid = (
  grid: PivotDimensionCellWithPosition[][],
  qTop: EngineAPI.INxPivotDimensionCell[],
  qArea: EngineAPI.INxDataAreaPage
): PivotDimensionCellWithPosition[][] => {
  if (!qTop.length) {
    return grid;
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
      const nodeWithPosition = createNode(node, parent, root, x, topRowIdx);

      grid[topRowIdx][x] = nodeWithPosition;

      if (node.qSubNodes.length) {
        recursiveExtract(root || nodeWithPosition, nodeWithPosition, node.qSubNodes, topRowIdx + 1);
      } else {
        nodeWithPosition.parent?.incrementLeafCount();
      }
    });
  };

  recursiveExtract(null, null, qTop);

  return grid;
};

export default extractTopGrid;
