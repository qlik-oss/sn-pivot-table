import { useCallback } from "react";
import type { Cell, LeftDimensionData, TopDimensionData } from "../../types/types";

export const shouldShowTotalCellDivider = (cell: Cell | undefined, totalDividerIndex: number) => {
  if (cell === undefined) {
    return false;
  }

  if (cell.isLeafNode) {
    return cell.mainAxisPageCoord === totalDividerIndex;
  }

  return cell.mainAxisPageCoord + cell.leafCount - 1 === totalDividerIndex;
};

export const useShouldShowTotalCellBottomDivider = (leftDimensionData: LeftDimensionData) =>
  useCallback(
    (y: number) => {
      const cell = leftDimensionData.grid.at(-1)?.[y];

      return shouldShowTotalCellDivider(cell, leftDimensionData.totalDividerIndex);
    },
    [leftDimensionData],
  );

export const useShouldShowTotalCellRightDivider = (topDimensionData: TopDimensionData) =>
  useCallback(
    (x: number) => {
      const cell = topDimensionData.grid.at(-1)?.[x];

      return shouldShowTotalCellDivider(cell, topDimensionData.totalDividerIndex);
    },
    [topDimensionData],
  );

export const useIsTotalValue = (leftDimensionData: LeftDimensionData, topDimensionData: TopDimensionData) =>
  useCallback(
    (x: number, y: number) =>
      !!(topDimensionData.grid.at(-1)?.[x]?.isTotal || leftDimensionData.grid.at(-1)?.[y]?.isTotal),
    [topDimensionData, leftDimensionData],
  );
