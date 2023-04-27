import { renderHook } from "@testing-library/react";
import NxDimCellType from "../../../types/QIX";
import { Cell, LayoutService, LeftDimensionData, MeasureData, Rect, StyleService } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import useColumnWidth, { EXPAND_ICON_WIDTH } from "../use-column-width";
import useMeasureText, { MeasureTextHook } from "../use-measure-text";

jest.mock("../use-measure-text");
jest.mock("../../contexts/StyleProvider");

describe("useColumnWidth", () => {
  let rect: Rect;
  let mockedUseMeasureText: jest.MockedFunction<(size: string, fam: string) => MeasureTextHook>;
  let mockedUseStyleContext: jest.MockedFunction<() => StyleService>;
  let leftDimensionData: LeftDimensionData;
  let measureData: MeasureData;
  let mockedMeasureText: MeasureTextHook;
  let layoutService: LayoutService;

  beforeEach(() => {
    const cell = {
      ref: {
        qType: NxDimCellType.NX_DIM_CELL_NORMAL,
      },
    } as Cell;
    const dimInfo = { qApprMaxGlyphCount: 1 } as EngineAPI.INxDimensionInfo;
    const meaInfo = { qFallbackTitle: 1, qApprMaxGlyphCount: 0 } as unknown as EngineAPI.INxMeasureInfo;
    rect = { width: 200, height: 100 };
    mockedUseMeasureText = useMeasureText as jest.MockedFunction<typeof useMeasureText>;
    mockedUseStyleContext = useStyleContext as jest.MockedFunction<typeof useStyleContext>;
    leftDimensionData = {
      grid: [{ 0: cell }, { 0: cell }, { 0: cell }],
      dimensionInfoIndexMap: [0, 1, 2],
      columnCount: 3,
      layoutSize: { x: 3, y: 1 },
    } as LeftDimensionData;
    measureData = {
      size: {
        x: 3,
      },
    } as MeasureData;

    layoutService = {
      layout: {
        qHyperCube: {
          qDimensionInfo: [dimInfo, dimInfo, dimInfo],
          qMeasureInfo: [meaInfo, meaInfo, meaInfo],
          qNoOfLeftDims: 3,
        },
      },
      size: {
        x: 3,
        y: 1,
      },
    } as unknown as LayoutService;

    mockedMeasureText = {
      measureText: jest.fn() as jest.MockedFunction<(text: string) => number>,
      estimateWidth: jest.fn() as jest.MockedFunction<(length: number) => number>,
    };
    mockedUseMeasureText.mockReturnValue(mockedMeasureText);
    mockedUseStyleContext.mockReturnValue({
      header: {
        fontSize: "size",
        fontFamily: "font",
      },
      content: {
        fontSize: "size",
        fontFamily: "font",
      },
    } as unknown as StyleService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("grid width", () => {
    test("should return left and right grid widths with only dimension cells and glyph size > then text size", () => {
      rect.width = 290;
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(25);

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, leftDimensionData, measureData));
      expect(result.current.leftGridWidth).toBe((50 + EXPAND_ICON_WIDTH) * 2 + 50);
      expect(result.current.rightGridWidth).toBe(80);
    });

    test("should return left and right grid widths with only dimension cells and glyph size < then text size", () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(25);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(50);

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, leftDimensionData, measureData));
      expect(result.current.leftGridWidth).toBe(150);
      expect(result.current.rightGridWidth).toBe(50);
    });

    test("should return left and right grid width with dimension and pseudo dimension cells", () => {
      const cell = { ref: { qType: NxDimCellType.NX_DIM_CELL_NORMAL } } as Cell;
      const pCell = { ref: { qType: NxDimCellType.NX_DIM_CELL_PSEUDO } } as Cell;
      const dimInfo = { qApprMaxGlyphCount: 1 } as EngineAPI.INxDimensionInfo;
      const meaInfo = { qFallbackTitle: 1 } as unknown as EngineAPI.INxMeasureInfo;
      leftDimensionData.grid = [{ 0: cell }, { 0: pCell }, { 0: cell }];
      leftDimensionData.dimensionInfoIndexMap = [0, -1, 1];
      layoutService.layout.qHyperCube.qDimensionInfo = [dimInfo, dimInfo, dimInfo];
      layoutService.layout.qHyperCube.qMeasureInfo = [meaInfo];

      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(35);

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, leftDimensionData, measureData));
      expect(result.current.leftGridWidth).toBe(150);
      expect(result.current.rightGridWidth).toBe(50);
    });

    test("left grid can not take more space then 75% of the total width available", () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(100);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(50);

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, leftDimensionData, measureData));
      expect(result.current.leftGridWidth).toBe(rect.width * 0.75);
      expect(result.current.rightGridWidth).toBe(rect.width * 0.25);
    });
  });

  describe("getLeftColumnWidth", () => {
    test("should return left column width", () => {
      rect.width = 500;
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValueOnce(25);
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValueOnce(50);
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValueOnce(75);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(5);

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, leftDimensionData, measureData));
      expect(result.current.getLeftColumnWidth(0)).toBe(25 + EXPAND_ICON_WIDTH);
      expect(result.current.getLeftColumnWidth(1)).toBe(50 + EXPAND_ICON_WIDTH);
      expect(result.current.getLeftColumnWidth(2)).toBe(75);
    });
  });

  describe("getDataColumnWidth", () => {
    test("should return minimum data column width of 100", () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(50);
      measureData.size.x = 3;

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, leftDimensionData, measureData));
      expect(result.current.getDataColumnWidth(0)).toBe(100);
      expect(result.current.getDataColumnWidth(1)).toBe(100);
      expect(result.current.getDataColumnWidth(2)).toBe(100);
    });

    test("should return data column width based of available right grid width", () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(10);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(10);
      measureData.size.x = 3;
      rect.width = 600;

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, leftDimensionData, measureData));
      expect(result.current.getDataColumnWidth(0)).toBe(170);
      expect(result.current.getDataColumnWidth(1)).toBe(170);
      expect(result.current.getDataColumnWidth(2)).toBe(170);
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
      measureData.size.x = 3;
      rect.width = 600;

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, leftDimensionData, measureData));
      expect(result.current.getDataColumnWidth(0)).toBe(600);
      expect(result.current.getDataColumnWidth(1)).toBe(200);
      expect(result.current.getDataColumnWidth(2)).toBe(150);
    });

    test("should return data column width based of estimated width", () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(150);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(10);
      measureData.size.x = 3;
      rect.width = 600;

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, leftDimensionData, measureData));
      expect(result.current.getDataColumnWidth(0)).toBe(150);
      expect(result.current.getDataColumnWidth(1)).toBe(150);
      expect(result.current.getDataColumnWidth(2)).toBe(150);
    });

    test("should return data column width based of measured title width", () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(250);
      measureData.size.x = 3;
      rect.width = 600;

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, leftDimensionData, measureData));
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

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, leftDimensionData, measureData));
      expect(result.current.getTotalWidth()).toBe(150 + 30 * 100);
    });
  });

  describe("totalMeasureInfoColumnWidth", () => {
    test("should return total width", () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(100);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(175);
      layoutService.size.x = 30;

      const { result } = renderHook(() => useColumnWidth(layoutService, rect, leftDimensionData, measureData));
      expect(result.current.totalMeasureInfoColumnWidth).toBe(175 * 3);
    });
  });
});
