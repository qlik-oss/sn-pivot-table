/* eslint-disable no-param-reassign */

import { Cell } from '../../types/types';
import createNode from './helpers/create-node';

const extractTopGrid = (
  grid: Cell[][],
  qTop: EngineAPI.INxPivotDimensionCell[],
  qArea: EngineAPI.INxDataAreaPage
): Cell[][] => {
  if (!qTop.length) {
    return grid;
  }

  let colIdx = 0;

  function recursiveExtract(
    root: Cell | null,
    parent: Cell | null,
    dimensionCells: EngineAPI.INxPivotDimensionCell[],
    topRowIdx = 0
  ): void {
    if (!Array.isArray(grid[topRowIdx])) {
      grid[topRowIdx] = [];
    }

    dimensionCells.forEach((cell, currIdx) => {
      colIdx += currIdx === 0 ? 0 : 1;
      const x = qArea.qLeft + colIdx - cell.qUp; // Start position + current page position - previous tail size
      const gridNode = createNode(cell, parent, root, x, topRowIdx);

      grid[topRowIdx][x] = gridNode;

      if (cell.qSubNodes.length) {
        recursiveExtract(root || gridNode, gridNode, cell.qSubNodes, topRowIdx + 1);
      } else {
        gridNode.parent?.incrementLeafCount();
      }
    });
  };

  recursiveExtract(null, null, qTop);

  return grid;
};

export default extractTopGrid;
