/* eslint-disable no-param-reassign */

import type { Cell, Grid, PageInfo } from "../../types/types";
import createCell from "./helpers/create-cell";

const extractLeftGrid = (
  grid: Grid,
  qLeft: EngineAPI.INxPivotDimensionCell[],
  qArea: EngineAPI.INxDataAreaPage,
  pageInfo: PageInfo,
  isSnapshot: boolean
): Grid => {
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
    if (!grid[colIdx]) {
      grid[colIdx] = {};
    }

    nodes.forEach((node, idx) => {
      rowIdx += idx === 0 ? 0 : 1;
      // consider items that might be skipped based on current page
      const startPosition = qArea.qTop - pageInfo.currentPage * pageInfo.rowsPerPage;
      // Start position + current page position - previous tail size,
      const y = Math.max(0, startPosition + rowIdx - node.qUp);
      const dataY = qArea.qTop + rowIdx - node.qUp;
      const cell = createCell(node, parent, root, colIdx, y, dataY, isSnapshot);

      grid[colIdx][y] = cell;

      if (node.qSubNodes.length) {
        recursiveExtract(root || cell, cell, node.qSubNodes, colIdx + 1);
      } else {
        cell.parent?.incrementLeafCount();
      }
    });
  }

  recursiveExtract(null, null, qLeft, 0);

  return grid;
};

export default extractLeftGrid;
