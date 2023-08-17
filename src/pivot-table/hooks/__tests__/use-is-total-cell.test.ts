import { renderHook } from "@testing-library/react";
import type { Cell, LeftDimensionData, TopDimensionData } from "../../../types/types";
import {
  shouldShowTotalCellDivider,
  useIsTotalCellAt,
  useShouldShowTotalCellBottomDivider,
  useShouldShowTotalCellRightDivider,
} from "../use-is-total-cell";

describe("useIsTotalCell", () => {
  let cell: Cell;
  let rootCell: Cell;
  let leftDimensionData: LeftDimensionData;
  let topDimensionData: TopDimensionData;

  beforeEach(() => {
    rootCell = { root: null, isTotalCell: true, isPseudoDimensionCell: false } as Cell;
    cell = { root: rootCell, isLastChild: true } as Cell;

    leftDimensionData = { grid: [[cell]] } as unknown as LeftDimensionData;
    topDimensionData = { grid: [[cell]] } as unknown as TopDimensionData;
  });

  describe("shouldShowTotalCellDivider", () => {
    test("should return false for if cell is undefined", () => {
      const show = shouldShowTotalCellDivider(undefined);

      expect(show).toBe(false);
    });

    test("should handle root cell", () => {
      const show = shouldShowTotalCellDivider(rootCell);

      expect(show).toBe(true);
    });

    test("should return false if root cell is pseudo dimension cell", () => {
      cell.isTotalCell = true;
      rootCell.isPseudoDimensionCell = true;
      const show = shouldShowTotalCellDivider(cell);

      expect(show).toBe(false);
    });

    test("should return true if root cell is total cell and cell is last child", () => {
      cell.isLastChild = true;
      rootCell.isTotalCell = true;
      const show = shouldShowTotalCellDivider(cell);

      expect(show).toBe(true);
    });

    test("should return false if root cell is not total cell and cell is last child", () => {
      cell.isLastChild = true;
      rootCell.isTotalCell = false;
      const show = shouldShowTotalCellDivider(cell);

      expect(show).toBe(false);
    });

    test("should return false if root cell is total cell and cell is not last child", () => {
      cell.isLastChild = false;
      rootCell.isTotalCell = true;
      const show = shouldShowTotalCellDivider(cell);

      expect(show).toBe(false);
    });
  });

  describe("useShouldShowTotalCellBottomDivider", () => {
    test("should resolve cell at coordinate", () => {
      const callback = renderHook(() => useShouldShowTotalCellBottomDivider(leftDimensionData)).result.current;

      expect(callback(0)).toBe(true);
    });

    test("should handle when no cell is at cooridnate", () => {
      const callback = renderHook(() => useShouldShowTotalCellBottomDivider(leftDimensionData)).result.current;

      expect(callback(999)).toBe(false);
    });
  });

  describe("useShouldShowTotalCellRightDivider", () => {
    test("should resolve cell at coordinate", () => {
      const callback = renderHook(() => useShouldShowTotalCellRightDivider(topDimensionData)).result.current;

      expect(callback(0)).toBe(true);
    });

    test("should handle when no cell is at cooridnate", () => {
      const callback = renderHook(() => useShouldShowTotalCellRightDivider(topDimensionData)).result.current;

      expect(callback(999)).toBe(false);
    });
  });

  describe("useIsTotalCellAt", () => {
    beforeEach(() => {
      cell.isTotalCell = true;
    });

    test("should resolve cell at coordinate when cell is total cell in left dimension data", () => {
      topDimensionData.grid[0][0] = { isTotalCell: false } as Cell;
      const callback = renderHook(() => useIsTotalCellAt(leftDimensionData, topDimensionData)).result.current;

      expect(callback(0, 0)).toBe(true);
    });

    test("should resolve cell at coordinate when cell is total cell in top dimension data", () => {
      leftDimensionData.grid[0][0] = { isTotalCell: false } as Cell;
      const callback = renderHook(() => useIsTotalCellAt(leftDimensionData, topDimensionData)).result.current;

      expect(callback(0, 0)).toBe(true);
    });

    test("should resolve cell at coordinate when cell is not total cell", () => {
      cell.isTotalCell = false;
      const callback = renderHook(() => useIsTotalCellAt(leftDimensionData, topDimensionData)).result.current;

      expect(callback(0, 0)).toBe(false);
    });

    test("should handle when no cell is at cooridnate", () => {
      const callback = renderHook(() => useIsTotalCellAt(leftDimensionData, topDimensionData)).result.current;

      expect(callback(999, 909)).toBe(false);
    });
  });
});
