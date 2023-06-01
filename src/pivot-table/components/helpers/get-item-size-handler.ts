import type { LayoutService, List } from "../../../types/types";

interface ColumnWidthHandlerProps {
  list: List;
  layoutService: LayoutService;
  isLastRow: boolean;
  allMeasuresWidth: number;
  getMeasureInfoWidth: (index: number) => number;
}

type ItemSizeHandler = (index: number) => number;

export const getRowHeightHandler =
  (list: List, cellHeight: number, isLastColumn: boolean, qcy: number): ItemSizeHandler =>
  (rowIndex: number) => {
    const cell = isLastColumn ? list[rowIndex] : Object.values(list)[rowIndex];

    if (rowIndex === 0 && cell?.y > 0) {
      return (cell.leafCount + cell.y) * cellHeight;
    }

    if (cell?.leafCount > 0) {
      const isLastRow = cell.dataY === qcy - cell.leafCount;

      // if it is last row -> consider subtracting cell.ref.qUp from leafcounts
      // for cases when some of the leafnodes rendered in one page and rest in next/last page
      return (cell.leafCount - (isLastRow ? cell.ref.qUp : 0) + cell.distanceToNextCell) * cellHeight;
    }

    return cellHeight;
  };

export const getColumnWidthHandler =
  ({
    list,
    isLastRow,
    layoutService,
    allMeasuresWidth,
    getMeasureInfoWidth,
  }: ColumnWidthHandlerProps): ItemSizeHandler =>
  (colIndex: number) => {
    const cell = isLastRow ? list[colIndex] : Object.values(list)[colIndex];
    const measureInfoCount = layoutService.layout.qHyperCube.qMeasureInfo.length;

    if (colIndex === 0 && cell?.x > 0) {
      return ((cell.leafCount + cell.x) / measureInfoCount) * allMeasuresWidth;
    }

    if (cell?.leafCount > 0) {
      return ((cell.leafCount + cell.distanceToNextCell) / measureInfoCount) * allMeasuresWidth;
    }

    return getMeasureInfoWidth(layoutService.getMeasureInfoIndexFromCellIndex(cell?.x ?? colIndex));
  };
