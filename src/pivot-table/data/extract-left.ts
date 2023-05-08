/* eslint-disable no-param-reassign */
import type { PageInfo } from "../../hooks/use-pivot-table";
import type { Cell, Grid } from "../../types/types";
import createCell from "./helpers/create-cell";

const extractLeftGrid = (
  grid: Grid,
  qLeft: EngineAPI.INxPivotDimensionCell[],
  qArea: EngineAPI.INxDataAreaPage,
  isSnapshot: boolean,
  isNewPage: boolean,
  pageInfo: PageInfo
): Grid => {
  if (!qLeft.length) {
    return grid;
  }

  let rowIdx = 0;

  function recursiveExtract(
    root: Cell | null,
    parent: Cell | null,
    nodes: EngineAPI.INxPivotDimensionCell[],
    newPage: boolean,
    pgInfo: PageInfo,
    colIdx = 0
  ) {
    if (!grid[colIdx]) {
      grid[colIdx] = {};
    }

    nodes.forEach((node, currRowIdx) => {
      rowIdx += currRowIdx === 0 ? 0 : 1;
      // if new page start from 0 else consider items that might be skipped based on current page
      const startPosition = newPage ? 0 : qArea.qTop - pgInfo.currentPage * pgInfo.rowsPerPage;
      // Start position + current page position - previous tail size,
      const y = startPosition + rowIdx - node.qUp;
      const cell = createCell(node, parent, root, colIdx, y, isSnapshot);

      grid[colIdx][y] = cell;

      if (node.qSubNodes.length) {
        recursiveExtract(root || cell, cell, node.qSubNodes, newPage, pgInfo, colIdx + 1);
      } else {
        cell.parent?.incrementLeafCount();
      }
    });
  }

  recursiveExtract(null, null, qLeft, isNewPage, pageInfo, 0);

  return grid;
};

export default extractLeftGrid;
