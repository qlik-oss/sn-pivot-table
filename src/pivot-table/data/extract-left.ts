/* eslint-disable no-param-reassign */

import { Cell } from '../../types/types';
import createCell from './helpers/create-cell';

const extractLeftGrid = (
  grid: Cell[][],
  qLeft: EngineAPI.INxPivotDimensionCell[],
  qArea: EngineAPI.INxDataAreaPage,
  isSnapshot: boolean
): Cell[][] => {
  if (!qLeft.length) {
    return grid;
  }

  let rowIdx = 0;

  function recursiveExtract(
    root: Cell | null,
    parent: Cell | null,
    nodes: EngineAPI.INxPivotDimensionCell[],
    colIdx = 0
  ) {
    if (!Array.isArray(grid[colIdx])) {
      grid[colIdx] = [];
    }

    nodes.forEach((node, currRowIdx) => {
      rowIdx += currRowIdx === 0 ? 0 : 1;
      const y = qArea.qTop + rowIdx - node.qUp; // Start position + current page position - previous tail size,
      const cell = createCell(node, parent, root, colIdx, y, isSnapshot);

      grid[colIdx][y] = cell;

      if (node.qSubNodes.length) {
        recursiveExtract(root || cell, cell, node.qSubNodes, colIdx + 1);
      } else {
        cell.parent?.incrementLeafCount();
      }
    });
  }

  recursiveExtract(null, null, qLeft);

  return grid;
};

export default extractLeftGrid;
