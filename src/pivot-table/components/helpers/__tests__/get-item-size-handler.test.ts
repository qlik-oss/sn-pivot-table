import type { PivotLayout } from "../../../../types/QIX";
import type { Cell, LayoutService, List } from "../../../../types/types";
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
    const allMeasuresWidth = 10;
    const measureInfoWidth = 33;
    let layoutService: LayoutService;
    let layout: PivotLayout;
    let getMeasureInfoWidth: (index: number) => number;

    beforeEach(() => {
      layout = {
        qHyperCube: {
          qMeasureInfo: [{}, {}],
        },
      } as PivotLayout;

      layoutService = {
        layout,
        getMeasureInfoIndexFromCellIndex: (idx) => idx,
      } as LayoutService;

      getMeasureInfoWidth = () => measureInfoWidth;
    });

    test("should return a size when cell is undefined", () => {
      list = {};

      const handler = getColumnWidthHandler({
        list,
        isLastRow: false,
        layoutService,
        getMeasureInfoWidth,
        allMeasuresWidth,
      });

      expect(handler(0)).toEqual(measureInfoWidth);
    });

    test("should return a size when cell has no leaf nodes", () => {
      const index = 0;
      list[index] = {
        leafCount: 0,
        x: 0,
      } as Cell;

      const handler = getColumnWidthHandler({
        list,
        isLastRow: false,
        layoutService,
        getMeasureInfoWidth,
        allMeasuresWidth,
      });

      expect(handler(index)).toEqual(measureInfoWidth);
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

      const handler = getColumnWidthHandler({
        list,
        isLastRow: false,
        layoutService,
        getMeasureInfoWidth,
        allMeasuresWidth,
      });

      expect(handler(index)).toEqual(
        allMeasuresWidth * (leafCount / layoutService.layout.qHyperCube.qMeasureInfo.length),
      );
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

      const handler = getColumnWidthHandler({
        list,
        isLastRow: false,
        layoutService,
        getMeasureInfoWidth,
        allMeasuresWidth,
      });

      expect(handler(index)).toEqual(
        (allMeasuresWidth * (leafCount + distanceToNextCell)) / layoutService.layout.qHyperCube.qMeasureInfo.length,
      );
    });

    test("should return a size for cell when first column does not exist in list", () => {
      const index = 0;
      const leafCount = 10;
      const distanceToNextCell = 0;
      const x = 10;
      list[index] = {
        leafCount,
        distanceToNextCell,
        x,
      } as Cell;

      const handler = getColumnWidthHandler({
        list,
        isLastRow: false,
        layoutService,
        getMeasureInfoWidth,
        allMeasuresWidth,
      });

      expect(handler(index)).toEqual(
        (allMeasuresWidth * (leafCount + x)) / layoutService.layout.qHyperCube.qMeasureInfo.length,
      );
    });
  });
});
