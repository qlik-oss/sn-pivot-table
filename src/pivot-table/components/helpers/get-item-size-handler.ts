import type { LayoutService, List } from "../../../types/types";

interface ColumnWidthHandlerProps {
  list: List;
  layoutService: LayoutService;
  isLastRow: boolean;
  allMeasuresWidth: number;
  getMeasureInfoWidth: (index: number) => number;
  leafWidth: number;
  isPseudo: boolean;
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
      return (cell.leafCount + cell.distanceToNextCell) * cellHeight;
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
    leafWidth,
    isPseudo,
  }: ColumnWidthHandlerProps): ItemSizeHandler =>
  (colIndex: number) => {
    const cell = isLastRow ? list[colIndex] : Object.values(list)[colIndex];
    // const measureInfoCount = layoutService.layout.qHyperCube.qMeasureInfo.length;

    // Dunno when this is true
    // if (colIndex === 0 && cell?.x > 0) {
    //   return ((cell.leafCount + cell.x) / measureInfoCount) * allMeasuresWidth;
    // }

    // all rows except bottom one
    if (cell?.leafCount > 0) {
      return (cell.leafCount + cell.distanceToNextCell) * leafWidth;
    }

    return isPseudo
      ? getMeasureInfoWidth(layoutService.getMeasureInfoIndexFromCellIndex(cell?.x ?? colIndex))
      : leafWidth;
  };
