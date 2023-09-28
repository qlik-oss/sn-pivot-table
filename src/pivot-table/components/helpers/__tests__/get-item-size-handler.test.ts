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
    let index: number;
    let leafCount: number;
    let distanceToNextCell: number;
    let x: number;
    let getRightGridColumnWidth: (index?: number) => number;

    beforeEach(() => {
      index = 0;
      leafCount = 10;
      distanceToNextCell = 5;
      x = 0;
      list[index] = {
        leafCount,
        distanceToNextCell,
        x,
      } as Cell;

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
      expect(handler(index)).toEqual(columnWidth);
    });

    test("should return a size when cell has no leaf nodes", () => {
      leafCount = 0;
      list[index] = {
        leafCount,
        x,
      } as Cell;

      const handler = getHandler();
      expect(handler(index)).toEqual(columnWidth);
    });

    test("should return a size when cell has leaf nodes", () => {
      distanceToNextCell = 0;
      list[index] = {
        leafCount,
        distanceToNextCell,
        x,
      } as Cell;

      const handler = getHandler();
      expect(handler(index)).toEqual(leafCount * columnWidth);
    });

    test("should return a size when cell has leaf nodes and distanceToNextCell", () => {
      const handler = getHandler();
      expect(handler(index)).toEqual((leafCount + distanceToNextCell) * columnWidth);
    });

    test("should return a size when colIndex is 0 but cell.x is > 0", () => {
      x = 5;
      list[index] = {
        leafCount,
        distanceToNextCell,
        x,
      } as Cell;

      const handler = getHandler();
      expect(handler(index)).toEqual((leafCount + distanceToNextCell + x) * columnWidth);
    });
  });
});
