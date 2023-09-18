/* eslint-disable no-param-reassign */

import type { Cell, Grid, LayoutService, PageInfo, VisibleDimensionInfo } from "../../types/types";
import createCell from "./helpers/create-cell";

const extractLeftGrid = (
  grid: Grid,
  qLeft: EngineAPI.INxPivotDimensionCell[],
  qArea: EngineAPI.INxDataAreaPage,
  pageInfo: PageInfo,
  layoutService: LayoutService,
  visibleLeftDimensionInfo: VisibleDimensionInfo[],
): Grid => {
  if (!qLeft.length) {
    return grid;
  }

  let rowIdx = 0;

  function recursiveExtract(
    root: Cell | null,
    parent: Cell | null,
    nodes: EngineAPI.INxPivotDimensionCell[],
    colIdx = 0,
  ) {
    if (!grid[colIdx]) {
      grid[colIdx] = {};
    }

    nodes.forEach((node, idx) => {
      rowIdx += idx === 0 ? 0 : 1;
      // consider items that might be skipped based on current page
      const startPosition = qArea.qTop - pageInfo.page * pageInfo.rowsPerPage;
      // Start position + current page position - previous tail size,
      const pageY = Math.max(0, startPosition + rowIdx - node.qUp);
      const y = qArea.qTop + rowIdx - node.qUp;

      // If cell already exist do not create a new cell
      const cell =
        grid[colIdx][pageY] ??
        createCell(
          node,
          parent,
          root,
          colIdx,
          y,
          pageY,
          layoutService.isSnapshot,
          visibleLeftDimensionInfo[colIdx],
          true,
        );

      grid[colIdx][pageY] = cell;

      if (node.qSubNodes.length) {
        recursiveExtract(root || cell, cell, node.qSubNodes, colIdx + 1);
      }
    });
  }

  recursiveExtract(null, null, qLeft, 0);

  return grid;
};

export default extractLeftGrid;
