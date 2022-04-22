/* eslint-disable no-param-reassign */

import { Cell } from '../../types/types';
import createNode from './helpers/create-node';

const extractLeftGrid = (
  grid: Cell[][],
  qLeft: EngineAPI.INxPivotDimensionCell[],
  qArea: EngineAPI.INxDataAreaPage
): Cell[][] => {
  if (!qLeft.length) {
    return grid;
  }

  let rowIdx = 0;

  function recursiveExtract(
    root: Cell | null,
    parent: Cell | null,
    dimensionCells: EngineAPI.INxPivotDimensionCell[],
    colIdx = 0
  ) {
    if (!Array.isArray(grid[colIdx])) {
      grid[colIdx] = [];
    }

    dimensionCells.forEach((cell, currIdx) => {
      rowIdx += currIdx === 0 ? 0 : 1;
      const y = qArea.qTop + rowIdx - cell.qUp; // Start position + current page position - previous tail size,
      const gridNode = createNode(cell, parent, root, colIdx, y);

      grid[colIdx][y] = gridNode;

      if (cell.qSubNodes.length) {
        recursiveExtract(root || gridNode, gridNode, cell.qSubNodes, colIdx + 1);
      } else {
        gridNode.parent?.incrementLeafCount();
      }
    });
  }

  recursiveExtract(null, null, qLeft);

  return grid;
};

export default extractLeftGrid;
