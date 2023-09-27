import type { Cell, List } from "../../../../types/types";
import { getColumnWidthHandler, getRowHeightHandler } from "../get-item-size-handler";

describe("getItemSizeHandler", () => {
  let list: List;

  beforeEach(() => {
    list = {};
  });

  describe("getRowHeightHandler", () => {
    const cellHeight = 24;
    const qcy = 100;

    test("should return a size when cell is undefined", () => {
      const handler = getRowHeightHandler(list, cellHeight, false, qcy);

      expect(handler(0)).toEqual(cellHeight);
    });

    test("should return a size when cell has leaf nodes", () => {
      const index = 0;
      const leafCount = 10;
      list[index] = {
        leafCount,
        distanceToNextCell: 0,
      } as Cell;
      const handler = getRowHeightHandler(list, cellHeight, false, qcy);

      expect(handler(0)).toEqual(cellHeight * leafCount);
    });

    test("should return a size when cell has leaf nodes and distanceToNextCell", () => {
      const index = 0;
      const leafCount = 10;
      const distanceToNextCell = 5;
      list[index] = {
        leafCount,
        distanceToNextCell,
      } as Cell;
      const handler = getRowHeightHandler(list, cellHeight, false, qcy);

      expect(handler(0)).toEqual(cellHeight * (leafCount + distanceToNextCell));
    });

    test("should return a size for cell when first row does not exist in list", () => {
      const index = 1;
      const leafCount = 10;
      const pageY = 1;
      const distanceToNextCell = 1;
      list[index] = {
        leafCount,
        pageY,
        distanceToNextCell,
      } as Cell;
      const handler = getRowHeightHandler(list, cellHeight, false, qcy);

      expect(handler(0)).toEqual(cellHeight * (leafCount + pageY + distanceToNextCell));
    });
  });

  describe("getColumnWidthHandler", () => {
    const columnWidth = 33;
    let getRightGridColumnWidth: (index?: number) => number;

    beforeEach(() => {
      getRightGridColumnWidth = () => columnWidth;
    });

    const getHandler = () =>
      getColumnWidthHandler({
        list,
        isLastRow: false,
        getRightGridColumnWidth,
      });

    test("should return a size when cell is undefined", () => {
      list = {};

      const handler = getHandler();
      expect(handler(0)).toEqual(columnWidth);
    });

    test("should return a size when cell has no leaf nodes", () => {
      const index = 0;
      list[index] = {
        leafCount: 0,
        x: 0,
      } as Cell;

      const handler = getHandler();
      expect(handler(index)).toEqual(columnWidth);
    });

    test("should return a size when cell has leaf nodes", () => {
      const index = 0;
      const leafCount = 10;
      const distanceToNextCell = 0;
      list[index] = {
        leafCount,
        distanceToNextCell,
        x: 0,
      } as Cell;

      const handler = getHandler();
      expect(handler(index)).toEqual(columnWidth * leafCount);
    });

    test("should return a size when cell has leaf nodes and distanceToNextCell", () => {
      const index = 0;
      const leafCount = 10;
      const distanceToNextCell = 5;
      list[index] = {
        leafCount,
        distanceToNextCell,
        x: 0,
      } as Cell;

      const handler = getHandler();
      expect(handler(index)).toEqual((leafCount + distanceToNextCell) * columnWidth);
    });

    // TODO: Will update this test when I fix the corner case, see comment in code
    // test("should return a size for cell when first column does not exist in list", () => {
    //   const index = 0;
    //   const leafCount = 10;
    //   const distanceToNextCell = 0;
    //   const x = 10;
    //   list[index] = {
    //     leafCount,
    //     distanceToNextCell,
    //     x,
    //   } as Cell;

    //   const handler = getColumnWidthHandler({
    //     list,
    //     isLastRow: false,
    //     layoutService,
    //     getMeasureInfoWidth,
    //     allMeasuresWidth,
    //   });

    //   expect(handler(index)).toEqual(
    //     (allMeasuresWidth * (leafCount + x)) / layoutService.layout.qHyperCube.qMeasureInfo.length,
    //   );
    // });
  });
});
