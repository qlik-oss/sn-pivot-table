import { renderHook } from "@testing-library/react";
import type { HeadersData, LayoutService, Rect } from "../../../types/types";
import { createDims, createMeasures } from "../../__tests__/test-helper";
import { GRID_BORDER } from "../../constants";
import createHeadersData from "../../data/headers-data";
import useColumnWidth, { EXPAND_ICON_WIDTH } from "../use-column-width";
import useMeasureText, { type MeasureTextHook } from "../use-measure-text";

jest.mock("../use-measure-text");
jest.mock("../../contexts/StyleProvider");

describe("useColumnWidth", () => {
  let rect: Rect;
  let mockedUseMeasureText: jest.MockedFunction<(size: string, fam: string) => MeasureTextHook>;
  let mockedMeasureText: MeasureTextHook;
  let layoutService: LayoutService;
  let headerData: HeadersData;

  const setupTestData = (leftDimensionIds: number[], topDimensionIds: number[]) => {
    const visibleTopDimensionInfo = createDims(...topDimensionIds);
    const visibleLeftDimensionInfo = createDims(...leftDimensionIds);

    layoutService = {
      layout: {
        qHyperCube: {
          qMeasureInfo: createMeasures(1, 2, 3),
          qNoOfLeftDims: visibleLeftDimensionInfo.length,
        },
      },
      size: {
        x: 3,
        y: 1,
      },
    } as unknown as LayoutService;

    headerData = createHeadersData(visibleTopDimensionInfo, visibleLeftDimensionInfo);
  };

  beforeEach(() => {
    rect = { width: 200, height: 100 };
    mockedUseMeasureText = useMeasureText as jest.MockedFunction<typeof useMeasureText>;

    mockedMeasureText = {
      measureText: jest.fn() as jest.MockedFunction<(text: string) => number>,
      estimateWidth: jest.fn() as jest.MockedFunction<(length: number) => number>,
    };
    mockedUseMeasureText.mockReturnValue(mockedMeasureText);
    setupTestData([0, 1, 2], [3, 4, 5]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("grid width", () => {
    test("should return left and right grid widths with only dimension cells and glyph size > then text size", () => {
      rect.width = 350;
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(25);

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      const expectedLeftGridWidth = (50 + EXPAND_ICON_WIDTH) * 2 + 50 + 50;
      expect(result.current.leftGridWidth).toBe(expectedLeftGridWidth);
      expect(result.current.rightGridWidth).toBe(rect.width - expectedLeftGridWidth - GRID_BORDER);
    });

    test("should return left and right grid widths with only dimension cells and glyph size < then text size", () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(25);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(50);

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      expect(result.current.leftGridWidth).toBeCloseTo(150);
      expect(result.current.rightGridWidth).toBeCloseTo(50 - GRID_BORDER);
    });

    test("should return left and right grid width with dimension and pseudo dimension cells", () => {
      setupTestData([0, -1, 2], [3, 4, 5]);
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(35);

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      expect(result.current.leftGridWidth).toBe(150);
      expect(result.current.rightGridWidth).toBe(50 - GRID_BORDER);
    });

    test("should return left and right grid width pseudo dimension cell last in left grid", () => {
      setupTestData([0, 1, -1], [3, 4, 5]);

      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(35);

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      expect(result.current.leftGridWidth).toBeCloseTo(150);
      expect(result.current.rightGridWidth).toBeCloseTo(50 - GRID_BORDER);
    });

    test("should return left and right grid width pseudo dimension cell in top grid", () => {
      setupTestData([0, 1, 2], [3, -1, 5]);

      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(35);

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      expect(result.current.leftGridWidth).toBeCloseTo(150);
      expect(result.current.rightGridWidth).toBeCloseTo(50 - GRID_BORDER);
    });

    test("should return left and right grid width pseudo dimension cell last in top grid", () => {
      setupTestData([0, 1, 2], [3, 4, -1]);

      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(35);

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      expect(result.current.leftGridWidth).toBeCloseTo(150);
      expect(result.current.rightGridWidth).toBeCloseTo(50 - GRID_BORDER);
    });

    test("left grid can not take more space then 75% of the total width available", () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(100);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(50);

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      expect(result.current.leftGridWidth).toBeCloseTo(rect.width * 0.75);
      expect(result.current.rightGridWidth).toBeCloseTo(rect.width * 0.25 - GRID_BORDER);
    });
  });

  describe("getLeftColumnWidth", () => {
    /**
     * |        |        |      | id-0 |
     * |        |        |      | id-1 |
     * | + id-3 | + id-4 | id-5 | id-2 |
     */
    test("should return left column width", () => {
      rect.width = 500;
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValueOnce(25);
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValueOnce(50);
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValueOnce(75);
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValueOnce(100);
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValueOnce(100);
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValueOnce(100);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(5);

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      expect(result.current.getLeftColumnWidth(0)).toBe(25 + EXPAND_ICON_WIDTH);
      expect(result.current.getLeftColumnWidth(1)).toBe(50 + EXPAND_ICON_WIDTH);
      expect(result.current.getLeftColumnWidth(2)).toBe(75);
      expect(result.current.getLeftColumnWidth(3)).toBe(100);
    });

    /**
     * | -1 | id-1 |
     */
    test("Should return column width with 1 dimension and pseudo first in left and no top dimensions", () => {
      setupTestData([-1, 1], []);

      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(25);

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      expect(result.current.getLeftColumnWidth(0)).toBe(25);
      expect(result.current.getLeftColumnWidth(1)).toBe(50);
    });

    /**
     * | id-1 | -1 |
     */
    test("Should return column width with 1 dimension and pseudo last in left and no top dimensions", () => {
      setupTestData([1, -1], []);

      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(25);

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      // TODO: VIZ-2686 Should not be EXPAND_ICON_WIDTH in first column
      expect(result.current.getLeftColumnWidth(0)).toBe(50 + EXPAND_ICON_WIDTH);
      expect(result.current.getLeftColumnWidth(1)).toBe(25);
    });

    /**
     * | id-1 |
     * |  -1  |
     */
    test("Should return column width with 1 dimension and pseudo in top and no left dimensions", () => {
      setupTestData([], [1, -1]);

      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(25);

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      expect(result.current.getLeftColumnWidth(0)).toBe(50);
    });

    /**
     * | id-1 | id-0 |
     */
    test("Should return column width with 1 dimension and pseudo last in left and 1 top dimensions", () => {
      setupTestData([1, -1], [0]);

      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(25);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(50);

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      expect(result.current.getLeftColumnWidth(0)).toBe(50);
      expect(result.current.getLeftColumnWidth(1)).toBe(50);
    });

    /**
     * | id-0 |
     * | id-1 |
     */
    test("Should return column width with 1 dimension in left and 1 dimension and pseudo last in top", () => {
      setupTestData([1], [0, -1]);

      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(25);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(50);

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      expect(result.current.getLeftColumnWidth(0)).toBe(50);
    });
  });

  describe("getDataColumnWidth", () => {
    test("should return minimum data column width of 100", () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(50);
      layoutService.size.x = 3;

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      expect(result.current.getDataColumnWidth(0)).toBe(100);
      expect(result.current.getDataColumnWidth(1)).toBe(100);
      expect(result.current.getDataColumnWidth(2)).toBe(100);
    });

    test("should return data column width based of available right grid width", () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(10);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(10);
      layoutService.size.x = 3;
      rect.width = 602;

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      expect(result.current.getDataColumnWidth(0)).toBeCloseTo(167);
      expect(result.current.getDataColumnWidth(1)).toBeCloseTo(167);
      expect(result.current.getDataColumnWidth(2)).toBeCloseTo(167);
    });

    test("should not return data column width based of available right grid width when total data column width is larger than available right grid width", () => {
      const m0 = { qFallbackTitle: "m0", qApprMaxGlyphCount: 0 } as unknown as EngineAPI.INxMeasureInfo;
      const m1 = { qFallbackTitle: "m1", qApprMaxGlyphCount: 0 } as unknown as EngineAPI.INxMeasureInfo;
      const m2 = { qFallbackTitle: "m2", qApprMaxGlyphCount: 0 } as unknown as EngineAPI.INxMeasureInfo;
      layoutService.layout.qHyperCube.qMeasureInfo = [m0, m1, m2];
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(10);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockImplementation((title) => {
        switch (title) {
          case "m0":
            return 600;
          case "m1":
            return 200;
          case "m2":
            return 150;
          default:
            return 10;
        }
      });
      layoutService.size.x = 3;
      rect.width = 600;

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      expect(result.current.getDataColumnWidth(0)).toBe(600);
      expect(result.current.getDataColumnWidth(1)).toBe(200);
      expect(result.current.getDataColumnWidth(2)).toBe(150);
    });

    test("should return data column width based of estimated width", () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(150);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(10);
      layoutService.size.x = 3;
      rect.width = 600;

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      expect(result.current.getDataColumnWidth(0)).toBe(150);
      expect(result.current.getDataColumnWidth(1)).toBe(150);
      expect(result.current.getDataColumnWidth(2)).toBe(150);
    });

    test("should return data column width based of measured title width", () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(250);
      layoutService.size.x = 3;
      rect.width = 600;

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      expect(result.current.getDataColumnWidth(0)).toBe(250);
      expect(result.current.getDataColumnWidth(1)).toBe(250);
      expect(result.current.getDataColumnWidth(2)).toBe(250);
    });
  });

  describe("getTotalWidth", () => {
    test("should return total width", () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(100);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(100);
      layoutService.size.x = 30;

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      expect(result.current.getTotalWidth()).toBe(150 + 30 * 100);
    });
  });

  describe("totalMeasureInfoColumnWidth", () => {
    test("should return total width", () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(100);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(175);
      layoutService.size.x = 30;

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, headerData));
      expect(result.current.totalMeasureInfoColumnWidth).toBe(175 * 3);
    });
  });
});
