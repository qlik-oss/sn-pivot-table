import type { Rect } from "../../../../types/types";
import getScrollableAreasDimensions from "../get-scrollable-areas-dimensions";

describe("getScrollableAreasDimensions()", () => {
  let tableRect: Rect;
  let containerHeight: number;
  let headerGridHeight: number;
  let leftGridHeight: number;
  let topGridHeight: number;
  let dataGridHeight: number;
  let allRowsVisible: boolean;

  let totalWidth: number;
  let leftGridWidth: number;
  let rightGridWidth: number;
  let verticalScrollbarWidth: number;
  let horizontalScrollbarHeight: number;

  beforeEach(() => {
    tableRect = { width: 200, height: 340 };
    containerHeight = 340;
    headerGridHeight = 30;
    leftGridHeight = 300;
    topGridHeight = 40;
    dataGridHeight = 300;
    allRowsVisible = false;

    totalWidth = 200;
    leftGridWidth = 80;
    rightGridWidth = 120;
    verticalScrollbarWidth = 13;
    horizontalScrollbarHeight = 13;
  });

  const callFunction = () =>
    getScrollableAreasDimensions({
      tableRect,
      containerHeight,
      headerGridHeight,
      leftGridHeight,
      topGridHeight,
      dataGridHeight,
      allRowsVisible,
      totalWidth,
      leftGridWidth,
      rightGridWidth,
      verticalScrollbarWidth,
      horizontalScrollbarHeight,
    });

  test("should return expected results", () => {
    expect(callFunction()).toEqual({
      rootWrapper: {
        scrollable: { width: 200, height: 340 },
        fullSize: { width: 187, height: 353 },
        sticky: { width: 187, height: 340 },
      },
      leftWrapper: {
        containers: {
          scrollable: { width: 80, height: 340 },
          fullSize: { width: 80, height: 340 },
          sticky: { width: 80, height: 327 },
        },
        headerGrid: { width: -1, height: 30 },
        leftGrid: { width: 80, height: 287 },
      },
      rightWrapper: {
        containers: {
          // one extra pixel because of GRID_BORDER
          scrollable: { width: 108, height: 340 },
          fullSize: { width: 107, height: 340 },
          sticky: { width: 107, height: 327 },
        },
        topGrid: { width: 107, height: 40 },
        dataGrid: { width: 107, height: 287 },
      },
    });
  });

  test("should return expected results when `allRowsVisible` is true", () => {
    allRowsVisible = true;

    expect(callFunction()).toEqual({
      rootWrapper: {
        scrollable: { width: 200, height: 340 },
        fullSize: { width: 200, height: 340 },
        sticky: { width: 200, height: 340 },
      },
      leftWrapper: {
        containers: {
          scrollable: { width: 80, height: 354 },
          fullSize: { width: 80, height: 340 },
          sticky: { width: 80, height: 340 },
        },
        headerGrid: { width: -1, height: 30 },
        leftGrid: { width: 80, height: 300 },
      },
      rightWrapper: {
        containers: {
          // one extra pixel because of GRID_BORDER
          scrollable: { width: 121, height: 354 },
          fullSize: { width: 120, height: 340 },
          sticky: { width: 120, height: 340 },
        },
        topGrid: { width: 120, height: 40 },
        dataGrid: { width: 120, height: 300 },
      },
    });
  });

  test("should return the actual width that right grid takes when totalWidth of the table is less than table rect width", () => {
    tableRect = { width: 500, height: 300 };
    totalWidth = 300;

    expect(callFunction()).toEqual({
      rootWrapper: {
        scrollable: { width: 500, height: 300 },
        fullSize: { width: 287, height: 353 },
        sticky: { width: 487, height: 300 },
      },
      leftWrapper: {
        containers: {
          scrollable: { width: 80, height: 300 },
          fullSize: { width: 80, height: 340 },
          sticky: { width: 80, height: 287 },
        },
        headerGrid: { width: -1, height: 30 },
        leftGrid: { width: 80, height: 287 },
      },
      rightWrapper: {
        containers: {
          scrollable: { width: 108, height: 300 },
          fullSize: { width: 207, height: 340 },
          sticky: { width: 207, height: 287 },
        },
        topGrid: { width: 107, height: 40 },
        dataGrid: { width: 107, height: 287 },
      },
    });
  });
});
