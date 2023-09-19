import { renderHook } from "@testing-library/react";
import type { Cell, LeftDimensionData, TopDimensionData } from "../../../types/types";
import {
  shouldShowTotalCellDivider,
  useIsTotalValue,
  useShouldShowTotalCellBottomDivider,
  useShouldShowTotalCellRightDivider,
} from "../use-is-total-cell";

describe("useIsTotalCell", () => {
  let cell: Cell;
  let leftDimensionData: LeftDimensionData;
  let topDimensionData: TopDimensionData;

  beforeEach(() => {
    cell = { mainAxisPageCoord: 0, leafCount: 0, isLeafNode: true } as Cell;

    leftDimensionData = { grid: [[cell]], totalDividerIndex: 0 } as unknown as LeftDimensionData;
    topDimensionData = { grid: [[cell]], totalDividerIndex: 0 } as unknown as TopDimensionData;
  });

  describe("shouldShowTotalCellDivider", () => {
    test("should return false for if cell is undefined", () => {
      const show = shouldShowTotalCellDivider(undefined, 0);

      expect(show).toBe(false);
    });

    test("should return true if a leaf node matches total divider index", () => {
      cell.isLeafNode = true;
      cell.mainAxisPageCoord = 1337;
      const show = shouldShowTotalCellDivider(cell, 1337);

      expect(show).toBe(true);
    });

    test("should return true a branch node matches total divider index", () => {
      cell.isLeafNode = false;
      cell.mainAxisPageCoord = 1337;
      cell.leafCount = 10;
      const show = shouldShowTotalCellDivider(cell, 1337 + 10 - 1);

      expect(show).toBe(true);
    });
  });

  describe("useShouldShowTotalCellBottomDivider", () => {
    test("should resolve cell at coordinate", () => {
      const callback = renderHook(() => useShouldShowTotalCellBottomDivider(leftDimensionData)).result.current;

      expect(callback(0)).toBe(true);
    });

    test("should handle when no cell is at coordinate", () => {
      const callback = renderHook(() => useShouldShowTotalCellBottomDivider(leftDimensionData)).result.current;

      expect(callback(999)).toBe(false);
    });
  });

  describe("useShouldShowTotalCellRightDivider", () => {
    test("should resolve cell at coordinate", () => {
      const callback = renderHook(() => useShouldShowTotalCellRightDivider(topDimensionData)).result.current;

      expect(callback(0)).toBe(true);
    });

    test("should handle when no cell is at coordinate", () => {
      const callback = renderHook(() => useShouldShowTotalCellRightDivider(topDimensionData)).result.current;

      expect(callback(999)).toBe(false);
    });
  });

  describe("useIsTotalValue", () => {
    beforeEach(() => {
      cell.isTotal = true;
    });

    test("should resolve cell at coordinate when cell is total cell in left dimension data", () => {
      topDimensionData.grid[0][0] = { isTotal: false } as Cell;
      const callback = renderHook(() => useIsTotalValue(leftDimensionData, topDimensionData)).result.current;

      expect(callback(0, 0)).toBe(true);
    });

    test("should resolve cell at coordinate when cell is total cell in top dimension data", () => {
      leftDimensionData.grid[0][0] = { isTotal: false } as Cell;
      const callback = renderHook(() => useIsTotalValue(leftDimensionData, topDimensionData)).result.current;

      expect(callback(0, 0)).toBe(true);
    });

    test("should resolve cell at coordinate when cell is not total cell", () => {
      cell.isTotal = false;
      const callback = renderHook(() => useIsTotalValue(leftDimensionData, topDimensionData)).result.current;

      expect(callback(0, 0)).toBe(false);
    });

    test("should handle when no cell is at cooridnate", () => {
      const callback = renderHook(() => useIsTotalValue(leftDimensionData, topDimensionData)).result.current;

      expect(callback(999, 909)).toBe(false);
    });
  });
});
