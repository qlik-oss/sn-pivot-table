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
  (list: List, cellHeight: number, isLast: boolean): ItemSizeHandler =>
  (rowIndex: number) => {
    const cell = isLast ? list[rowIndex] : Object.values(list)[rowIndex];

    if (rowIndex === 0 && cell?.y > 0) {
      return (cell.leafCount + cell.y) * cellHeight;
    }

    if (cell?.leafCount > 0) {
      const res = (cell.leafCount + cell.distanceToNextCell) * cellHeight;
      // console.log({ res, leafCount: cell.leafCount, dis: cell.distanceToNextCell });
      return res;
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
