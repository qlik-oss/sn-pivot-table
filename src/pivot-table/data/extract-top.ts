/* eslint-disable no-param-reassign */

import type { Cell, Grid, LayoutService, VisibleDimensionInfo } from "../../types/types";
import createCell from "./helpers/create-cell";

const extractTopGrid = (
  grid: Grid,
  qTop: EngineAPI.INxPivotDimensionCell[],
  qArea: EngineAPI.INxDataAreaPage,
  layoutService: LayoutService,
  visibleTopDimensionInfo: VisibleDimensionInfo[]
): Grid => {
  if (!qTop.length) {
    return grid;
  }

  let colIdx = 0;

  function recursiveExtract(
    root: Cell | null,
    parent: Cell | null,
    nodes: EngineAPI.INxPivotDimensionCell[],
    rowIdx = 0
  ): void {
    if (!grid[rowIdx]) {
      grid[rowIdx] = {};
    }

    nodes.forEach((node, currColIdx) => {
      colIdx += currColIdx === 0 ? 0 : 1;
      const x = qArea.qLeft + colIdx - node.qUp; // Start position + current page position - previous tail size
      const cell = createCell(
        node,
        parent,
        root,
        x,
        rowIdx,
        rowIdx,
        layoutService.isSnapshot,
        visibleTopDimensionInfo[rowIdx]
      );

      grid[rowIdx][x] = cell;

      if (node.qSubNodes.length) {
        recursiveExtract(root || cell, cell, node.qSubNodes, rowIdx + 1);
      } else {
        cell.parent?.incrementLeafCount();
      }
    });
  }

  recursiveExtract(null, null, qTop);
  // const lastRow = grid[grid.length - 1];
  // grid.push(
  //   Object.keys(lastRow).map((key, index) => {
  //     const cell = lastRow[index];
  //     return createCell(
  //       null,
  //       cell,
  //       cell,
  //       index,
  //       cell.y + 1,
  //       cell.y + 1,
  //       layoutService.isSnapshot,
  //       PSEUDO_DIMENSION_INDEX
  //     );
  //   })
  // );
  // grid.push((grid as Cell[][])[grid.length - 1].map((cell, index) => {}))
  // (grid as Cell[][])[grid.length - 1].map((cell, _index) => cell);
  // grid.push(grid[grid.length - 1]);

  return grid;
};

export default extractTopGrid;
