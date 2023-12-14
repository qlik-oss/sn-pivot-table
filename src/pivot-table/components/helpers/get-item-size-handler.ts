import type { Cell, List } from "../../../types/types";

interface ColumnWidthHandlerProps {
  list: List;
  listValues: Cell[];
  isLastRow: boolean;
  getRightGridColumnWidth: (index?: number) => number;
}

type ItemSizeHandler = (index: number) => number;

export const getRowHeightHandler =
  (list: List, listValues: Cell[], cellHeight: number, isLastColumn: boolean, qcy: number): ItemSizeHandler =>
  (rowIndex: number) => {
    const cell = isLastColumn ? list[rowIndex] : listValues[rowIndex];

    if (rowIndex === 0 && cell?.pageY > 0) {
      return (cell.leafCount + cell.pageY + cell.distanceToNextCell) * cellHeight;
    }

    if (cell?.leafCount > 0) {
      const isLastRow = cell.y === qcy - cell.leafCount;

      // if it is last row -> consider subtracting cell.ref.qUp from leafcounts
      // for cases when some of the leafnodes rendered in one page and rest in next/last page
      return (cell.leafCount - (isLastRow ? cell.ref.qUp : 0) + cell.distanceToNextCell) * cellHeight;
    }

    return cellHeight;
  };

export const getColumnWidthHandler =
  ({ list, listValues, isLastRow, getRightGridColumnWidth }: ColumnWidthHandlerProps): ItemSizeHandler =>
  (colIndex: number) => {
    const cell = isLastRow ? list[colIndex] : listValues[colIndex];
    // const measureInfoCount = layoutService.layout.qHyperCube.qMeasureInfo.length;

    // TODO: This a bit of a special case but if you are on a different page then the first.
    // Scroll down a bit and expand a node. The "first row" does not exist yet as data has only been
    // fetched for the rows that are visible to the user.
    if (colIndex === 0 && cell?.x > 0) {
      return (cell.leafCount + cell.x + cell.distanceToNextCell) * getRightGridColumnWidth();
    }

    // all rows except bottom one
    if (!isLastRow && cell !== undefined) {
      return (cell.leafCount + cell.distanceToNextCell) * getRightGridColumnWidth();
    }

    return getRightGridColumnWidth(cell?.x ?? colIndex);
  };
