import type { List } from "../../../types/types";

interface ColumnWidthHandlerProps {
  list: List;
  isLastRow: boolean;
  getLeafWidth: (index?: number) => number;
}

type ItemSizeHandler = (index: number) => number;

export const getRowHeightHandler =
  (list: List, cellHeight: number, isLastColumn: boolean, qcy: number): ItemSizeHandler =>
  (rowIndex: number) => {
    const cell = isLastColumn ? list[rowIndex] : Object.values(list)[rowIndex];

    if (rowIndex === 0 && cell?.pageY > 0) {
      return (cell.leafCount + cell.pageY) * cellHeight;
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
  ({ list, isLastRow, getLeafWidth }: ColumnWidthHandlerProps): ItemSizeHandler =>
  (colIndex: number) => {
    const cell = isLastRow ? list[colIndex] : Object.values(list)[colIndex];
    // const measureInfoCount = layoutService.layout.qHyperCube.qMeasureInfo.length;

    // Dunno when this is true
    // if (colIndex === 0 && cell?.x > 0) {
    //   return ((cell.leafCount + cell.x) / measureInfoCount) * allMeasuresWidth;
    // }

    // all rows except bottom one
    if (cell?.leafCount > 0) {
      return (cell.leafCount + cell.distanceToNextCell) * getLeafWidth();
    }

    return getLeafWidth(cell?.x ?? colIndex);
  };
