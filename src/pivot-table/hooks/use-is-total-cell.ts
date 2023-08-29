import { useCallback } from "react";
import type { Cell, LeftDimensionData, TopDimensionData } from "../../types/types";

export const shouldShowTotalCellDivider = (cell?: Cell) => {
  if (cell === undefined) {
    return false;
  }

  const rootCell = cell.root;

  if (rootCell === null) {
    return cell.isTotal;
  }

  // Special case when the pseudo dimension is the first cell in a column or row
  if (rootCell.isPseudoDimension) {
    return false;
  }

  return rootCell.isTotal && cell.isLastChild;
};

export const useShouldShowTotalCellBottomDivider = (leftDimensionData: LeftDimensionData) =>
  useCallback(
    (y: number) => {
      const lastColumnIndex = leftDimensionData.grid.length - 1;
      const cell = leftDimensionData.grid[lastColumnIndex]?.[y] as Cell | undefined;

      return shouldShowTotalCellDivider(cell);
    },
    [leftDimensionData],
  );

export const useShouldShowTotalCellRightDivider = (topDimensionData: TopDimensionData) =>
  useCallback(
    (x: number) => {
      const cell = topDimensionData.grid.at(-1)?.[x];

      return shouldShowTotalCellDivider(cell);
    },
    [topDimensionData],
  );

export const useIsTotalValue = (leftDimensionData: LeftDimensionData, topDimensionData: TopDimensionData) =>
  useCallback(
    (x: number, y: number) =>
      !!(topDimensionData.grid.at(-1)?.[x]?.isTotal || leftDimensionData.grid.at(-1)?.[y]?.isTotal),
    [topDimensionData, leftDimensionData],
  );
