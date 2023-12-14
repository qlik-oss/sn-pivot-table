import { ColumnWidthType, ColumnWidthValues } from "@qlik/nebula-table-utils/lib/constants";
import {
  useMeasureText,
  type EstimateLineCount,
  type MeasureTextHook,
  type UseMeasureTextProps,
} from "@qlik/nebula-table-utils/lib/hooks";
import { act, renderHook } from "@testing-library/react";
import useColumnWidth from "..";
import { PSEUDO_DIMENSION_INDEX } from "../../../../constants";
import type { ExtendedDimensionInfo, ExtendedMeasureInfo } from "../../../../types/QIX";
import {
  ColumnWidthLocation,
  type HeadersData,
  type LayoutService,
  type VisibleDimensionInfo,
} from "../../../../types/types";
import { GRID_BORDER } from "../../../constants";
import { createDimInfos } from "../../../data/__tests__/test-helper";
import createHeadersData from "../../../data/headers-data";
import { EXPAND_ICON_SIZE, LOCK_ICON_SIZE, MENU_ICON_SIZE, TOTAL_CELL_PADDING } from "../constants";

type MeasureTextMock = jest.MockedFunction<(text: string) => number>;
type EstimateWidthMock = jest.MockedFunction<(length: number) => number>;
type EstimateLineCountMock = jest.MockedFunction<EstimateLineCount>;

jest.mock("@qlik/nebula-table-utils/lib/hooks");
jest.mock("../../../contexts/StyleProvider");

describe("useColumnWidth", () => {
  let dimInfo: ExtendedDimensionInfo;
  let meaInfo: ExtendedMeasureInfo;
  let tableWidth: number;
  let percentageConversion: number;
  let mockedUseMeasureText: jest.MockedFunction<(styling: UseMeasureTextProps) => MeasureTextHook>;
  let mockedMeasureText: MeasureTextHook;
  let mockedIsLeftDimension: jest.MockedFunction<(index: number) => boolean>;
  let mockedGetDimensionInfoIndex: jest.MockedFunction<(info: VisibleDimensionInfo) => number>;
  let layoutService: LayoutService;
  let visibleLeftDimensionInfo: VisibleDimensionInfo[];
  let visibleTopDimensionInfo: VisibleDimensionInfo[];
  let verticalScrollbarWidth: number;
  let horizontalScrollbarHeightSetter: (shouldResetHeight?: boolean) => void;
  let headersData: HeadersData;

  beforeEach(() => {
    dimInfo = { qApprMaxGlyphCount: 1, qGroupFieldDefs: [""], qGroupPos: 0 } as ExtendedDimensionInfo;
    meaInfo = { qFallbackTitle: "1", qApprMaxGlyphCount: 0 } as ExtendedMeasureInfo;

    tableWidth = 400;
    percentageConversion = tableWidth / 100;
    mockedUseMeasureText = useMeasureText as jest.MockedFunction<typeof useMeasureText>;
    mockedIsLeftDimension = jest.fn().mockReturnValue(true);
    mockedGetDimensionInfoIndex = jest.fn().mockReturnValue(0);

    layoutService = {
      layout: {
        qHyperCube: {
          qDimensionInfo: [dimInfo, dimInfo, dimInfo],
          qMeasureInfo: [meaInfo, meaInfo, meaInfo],
          qNoOfLeftDims: 3,
          qEffectiveInterColumnSortOrder: [0, 1, 2, -1],
        },
      },
      size: {
        x: 3,
        y: 1,
      },
      getMeasureInfoIndexFromCellIndex: (index: number) => index,
      getDimensionInfoIndex: mockedGetDimensionInfoIndex,
      isLeftDimension: mockedIsLeftDimension,
    } as unknown as LayoutService;

    visibleLeftDimensionInfo = [dimInfo, dimInfo, dimInfo];
    visibleTopDimensionInfo = [-1];

    mockedMeasureText = {
      measureText: jest.fn().mockReturnValue(0) as MeasureTextMock,
      estimateWidth: jest.fn().mockReturnValue(0) as EstimateWidthMock,
      estimateLineCount: jest.fn().mockReturnValue(0) as EstimateLineCountMock,
    };
    mockedUseMeasureText.mockReturnValue(mockedMeasureText);
    verticalScrollbarWidth = 0;
    horizontalScrollbarHeightSetter = jest.fn();
    headersData = createHeadersData(layoutService, visibleTopDimensionInfo, visibleLeftDimensionInfo);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderUseColumnWidth = () => {
    const {
      result: { current },
    } = renderHook(() =>
      useColumnWidth({
        layoutService,
        tableWidth,
        headersData,
        visibleTopDimensionInfo,
        verticalScrollbarWidth,
        horizontalScrollbarHeightSetter,
      }),
    );
    return current;
  };

  const mockEstimateWidth = (value: number) =>
    (mockedMeasureText.estimateWidth as EstimateWidthMock).mockReturnValue(value);
  const mockMeasureText = (value: number) => (mockedMeasureText.measureText as MeasureTextMock).mockReturnValue(value);

  describe("leftGridColumnWidths + leftGridWidth", () => {
    test("should return left column width for auto setting", () => {
      const width = 25;
      mockEstimateWidth(width);
      mockMeasureText(width);

      const { leftGridColumnWidths } = renderUseColumnWidth();

      expect(leftGridColumnWidths[0]).toBe(width + EXPAND_ICON_SIZE + TOTAL_CELL_PADDING);
      expect(leftGridColumnWidths[1]).toBe(width + EXPAND_ICON_SIZE + TOTAL_CELL_PADDING);
      expect(leftGridColumnWidths[2]).toBe(width + TOTAL_CELL_PADDING + MENU_ICON_SIZE);
    });

    test("should return left column width for auto setting with no expanded columns", () => {
      const width = 25;
      mockEstimateWidth(width);
      mockMeasureText(width);

      visibleLeftDimensionInfo = createDimInfos([0]);
      visibleTopDimensionInfo = createDimInfos([1, PSEUDO_DIMENSION_INDEX]);
      headersData = createHeadersData(layoutService, visibleTopDimensionInfo, visibleLeftDimensionInfo);

      const { leftGridColumnWidths } = renderUseColumnWidth();

      expect(leftGridColumnWidths.length).toBe(1);
      expect(leftGridColumnWidths[0]).toBe(width + EXPAND_ICON_SIZE + TOTAL_CELL_PADDING);
    });

    test("should return left column width for auto setting, no left dimension, 3 top dimension and pseudo last", () => {
      const width = 25;
      mockEstimateWidth(width);
      mockMeasureText(width);
      mockedIsLeftDimension.mockReturnValue(false);
      visibleLeftDimensionInfo = createDimInfos([]);
      visibleTopDimensionInfo = createDimInfos([0, 1, PSEUDO_DIMENSION_INDEX]);
      headersData = createHeadersData(layoutService, visibleTopDimensionInfo, visibleLeftDimensionInfo);

      const { leftGridColumnWidths } = renderUseColumnWidth();
      expect(leftGridColumnWidths[0]).toBe(width + TOTAL_CELL_PADDING + MENU_ICON_SIZE);
    });

    test("should return left column width for pixel setting, 2 left dimensions and pseudo last", () => {
      const width = 25;
      mockEstimateWidth(width);
      mockMeasureText(width);
      visibleLeftDimensionInfo = createDimInfos([0, PSEUDO_DIMENSION_INDEX]);
      visibleTopDimensionInfo = createDimInfos([1, 2]);
      layoutService.layout.qHyperCube.qMeasureInfo = [
        { columnWidth: { type: ColumnWidthType.Pixels, pixels: 30 } } as ExtendedMeasureInfo,
      ];
      mockedGetDimensionInfoIndex.mockImplementation((info) =>
        [...visibleLeftDimensionInfo, ...visibleTopDimensionInfo].indexOf(info),
      );
      mockedIsLeftDimension.mockImplementation((idx) => idx < visibleLeftDimensionInfo.length);
      headersData = createHeadersData(layoutService, visibleTopDimensionInfo, visibleLeftDimensionInfo);

      const { leftGridColumnWidths } = renderUseColumnWidth();
      expect(leftGridColumnWidths[0]).toBe(width + TOTAL_CELL_PADDING + EXPAND_ICON_SIZE);
      expect(leftGridColumnWidths[1]).toBe(30);
    });

    test("should return left column width for pixel setting", () => {
      // need to make the width bigger so the col widths are not scaled
      tableWidth = 800;
      const pixels = 50;
      dimInfo = {
        columnWidth: { type: ColumnWidthType.Pixels, pixels },
        qGroupFieldDefs: [""],
      } as ExtendedDimensionInfo;
      const dimInfoWithoutPixels = {
        columnWidth: { type: ColumnWidthType.Pixels },
        qGroupFieldDefs: [""],
      } as ExtendedDimensionInfo;
      const dimInfoWithNaN = {
        columnWidth: { type: ColumnWidthType.Pixels, pixels: NaN },
        qGroupFieldDefs: [""],
      } as ExtendedDimensionInfo;
      visibleLeftDimensionInfo = [dimInfo, dimInfoWithoutPixels, dimInfoWithNaN];
      headersData = createHeadersData(layoutService, visibleTopDimensionInfo, visibleLeftDimensionInfo);

      const { leftGridColumnWidths } = renderUseColumnWidth();
      expect(leftGridColumnWidths[0]).toBe(pixels);
      expect(leftGridColumnWidths[1]).toBe(ColumnWidthValues.PixelsDefault);
      expect(leftGridColumnWidths[2]).toBe(ColumnWidthValues.PixelsDefault);
    });

    test("should return left column width for percentage setting", () => {
      const percentage = 10;
      dimInfo = {
        columnWidth: { type: ColumnWidthType.Percentage, percentage },
        qGroupFieldDefs: [""],
      } as ExtendedDimensionInfo;
      const dimInfoWithoutPixels = {
        columnWidth: { type: ColumnWidthType.Percentage },
        qGroupFieldDefs: [""],
      } as ExtendedDimensionInfo;
      const dimInfoWithNaN = {
        columnWidth: { type: ColumnWidthType.Percentage, percentage: NaN },
        qGroupFieldDefs: [""],
      } as ExtendedDimensionInfo;
      visibleLeftDimensionInfo = [dimInfo, dimInfoWithoutPixels, dimInfoWithNaN];
      headersData = createHeadersData(layoutService, visibleTopDimensionInfo, visibleLeftDimensionInfo);

      const { leftGridColumnWidths } = renderUseColumnWidth();
      expect(leftGridColumnWidths[0]).toBe(percentage * percentageConversion);
      expect(leftGridColumnWidths[1]).toBe(ColumnWidthValues.PercentageDefault * percentageConversion);
      expect(leftGridColumnWidths[2]).toBe(ColumnWidthValues.PercentageDefault * percentageConversion);
    });

    test("should return left column width for pseudo dimension where all measures have different settings", () => {
      visibleLeftDimensionInfo = [dimInfo, dimInfo, dimInfo, -1];
      visibleTopDimensionInfo = [];

      mockEstimateWidth(10);
      mockMeasureText(40);
      layoutService.layout.qHyperCube.qMeasureInfo = [
        meaInfo,
        { columnWidth: { type: ColumnWidthType.Percentage, percentage: 10 } } as ExtendedMeasureInfo,
        { columnWidth: { type: ColumnWidthType.Pixels, pixels: 60 } } as ExtendedMeasureInfo,
      ];
      headersData = createHeadersData(layoutService, visibleTopDimensionInfo, visibleLeftDimensionInfo);

      const { leftGridColumnWidths } = renderUseColumnWidth();
      expect(leftGridColumnWidths[3]).toBe(60);
    });

    test("should return the original width of left columns", () => {
      const pixels = 100;
      dimInfo = {
        columnWidth: { type: ColumnWidthType.Pixels, pixels },
        qGroupFieldDefs: [""],
      } as ExtendedDimensionInfo;
      const dimInfoWithoutPixels = {
        columnWidth: { type: ColumnWidthType.Pixels },
        qGroupFieldDefs: [""],
      } as ExtendedDimensionInfo;
      visibleLeftDimensionInfo = [dimInfo, dimInfo, dimInfoWithoutPixels];
      headersData = createHeadersData(layoutService, visibleTopDimensionInfo, visibleLeftDimensionInfo);

      const { leftGridColumnWidths } = renderUseColumnWidth();
      expect(leftGridColumnWidths[0]).toBe(pixels);
      expect(leftGridColumnWidths[1]).toBe(pixels);
      expect(leftGridColumnWidths[2]).toBe(ColumnWidthValues.PixelsDefault);
    });

    test("should return left column width when overridden using overrideLeftColumnWidth", () => {
      const width = 25;
      mockEstimateWidth(width);
      mockMeasureText(width);

      // Need to render this explicitly, since renderUseColumnWidth returns current, and thus leftGridColumnWidths wont update after overrideLeftGridWidth()
      const { result } = renderHook(() =>
        useColumnWidth({
          layoutService,
          tableWidth,
          headersData,
          visibleTopDimensionInfo,
          verticalScrollbarWidth,
          horizontalScrollbarHeightSetter,
        }),
      );

      act(() => result.current.overrideLeftGridWidth(width * 3, 0));

      expect(result.current.leftGridColumnWidths[0]).toBe(width * 3);
      expect(result.current.leftGridColumnWidths[1]).toBe(width + EXPAND_ICON_SIZE + TOTAL_CELL_PADDING);
      expect(result.current.leftGridColumnWidths[2]).toBe(width + TOTAL_CELL_PADDING + MENU_ICON_SIZE);
    });

    test("should return left column width when column location is set to pivot", () => {
      const width = 25;
      mockEstimateWidth(width);
      mockMeasureText(width);

      const topHeadersColumnWidth = 100;

      visibleLeftDimensionInfo = createDimInfos([PSEUDO_DIMENSION_INDEX, 0]);
      visibleTopDimensionInfo = createDimInfos([1]);
      layoutService.layout.qHyperCube.topHeadersColumnWidth = {
        type: ColumnWidthType.Pixels,
        pixels: topHeadersColumnWidth,
      };
      headersData = createHeadersData(layoutService, visibleTopDimensionInfo, visibleLeftDimensionInfo);
      headersData.data[0][2]!.isLeftDimension = false;
      headersData.data[0][2]!.columnWidthLocation = ColumnWidthLocation.Pivot;

      const { leftGridColumnWidths } = renderUseColumnWidth();
      expect(leftGridColumnWidths[2]).toBe(topHeadersColumnWidth);
    });
  });

  describe("getRightGridColumnWidth", () => {
    beforeEach(() => {
      const leftSideWidth = 50;
      tableWidth = 350;
      percentageConversion = (tableWidth - leftSideWidth) / 100;
      layoutService.layout.qHyperCube.qNoOfLeftDims = 1;
      visibleLeftDimensionInfo = [
        {
          columnWidth: { type: ColumnWidthType.Pixels, pixels: leftSideWidth - GRID_BORDER },
          qGroupFieldDefs: [""],
        } as ExtendedDimensionInfo,
      ];
      visibleTopDimensionInfo = [dimInfo, dimInfo, -1];
      headersData = createHeadersData(layoutService, visibleTopDimensionInfo, visibleLeftDimensionInfo);
    });

    test("should return right column width when columnWidth is undefined", () => {
      const { getRightGridColumnWidth } = renderUseColumnWidth();

      expect(getRightGridColumnWidth(0)).toBe(100);
      expect(getRightGridColumnWidth(1)).toBe(100);
      expect(getRightGridColumnWidth(2)).toBe(100);
    });

    test("should return right column width for auto setting", () => {
      meaInfo = { columnWidth: { type: ColumnWidthType.Auto } } as ExtendedMeasureInfo;
      layoutService.layout.qHyperCube.qMeasureInfo = [meaInfo, meaInfo, meaInfo];

      const { getRightGridColumnWidth } = renderUseColumnWidth();
      expect(getRightGridColumnWidth(0)).toBe(100);
      expect(getRightGridColumnWidth(1)).toBe(100);
      expect(getRightGridColumnWidth(2)).toBe(100);
    });

    test("should return right column width for auto setting when all columns can't fit (scroll)", () => {
      tableWidth = 110;
      meaInfo = { columnWidth: { type: ColumnWidthType.Auto } } as ExtendedMeasureInfo;
      layoutService.layout.qHyperCube.qMeasureInfo = [meaInfo, meaInfo, meaInfo];

      const { getRightGridColumnWidth } = renderUseColumnWidth();
      expect(getRightGridColumnWidth(0)).toBe(ColumnWidthValues.AutoMin);
      expect(getRightGridColumnWidth(1)).toBe(ColumnWidthValues.AutoMin);
      expect(getRightGridColumnWidth(2)).toBe(ColumnWidthValues.AutoMin);
    });

    test("should return right column width for fit to content setting", () => {
      const width = 50;
      const estimatedWidth = width + 1;
      mockEstimateWidth(estimatedWidth);
      mockMeasureText(width);
      meaInfo = { columnWidth: { type: ColumnWidthType.FitToContent } } as ExtendedMeasureInfo;
      layoutService.layout.qHyperCube.qMeasureInfo = [meaInfo, meaInfo, meaInfo];

      const { getRightGridColumnWidth } = renderUseColumnWidth();
      expect(getRightGridColumnWidth(0)).toBe(estimatedWidth + TOTAL_CELL_PADDING);
      expect(getRightGridColumnWidth(1)).toBe(estimatedWidth + TOTAL_CELL_PADDING);
      expect(getRightGridColumnWidth(2)).toBe(estimatedWidth + TOTAL_CELL_PADDING);
    });

    test("should return right column width for pixel setting", () => {
      const pixels = 60;
      meaInfo = { columnWidth: { type: ColumnWidthType.Pixels, pixels } } as ExtendedMeasureInfo;
      const meaInfoWithoutValue = { columnWidth: { type: ColumnWidthType.Pixels } } as ExtendedMeasureInfo;
      const meaInfoWithNaN = { columnWidth: { type: ColumnWidthType.Pixels, pixels: NaN } } as ExtendedMeasureInfo;
      layoutService.layout.qHyperCube.qMeasureInfo = [meaInfo, meaInfoWithoutValue, meaInfoWithNaN];

      const { getRightGridColumnWidth } = renderUseColumnWidth();
      expect(getRightGridColumnWidth(0)).toBe(pixels);
      expect(getRightGridColumnWidth(1)).toBe(ColumnWidthValues.PixelsDefault);
      expect(getRightGridColumnWidth(2)).toBe(ColumnWidthValues.PixelsDefault);
    });

    test("should return right column width for percentage setting", () => {
      const percentage = 60;
      meaInfo = { columnWidth: { type: ColumnWidthType.Percentage, percentage } } as ExtendedMeasureInfo;
      const meaInfoWithoutValue = { columnWidth: { type: ColumnWidthType.Percentage } } as ExtendedMeasureInfo;
      const meaInfoWithNaN = {
        columnWidth: { type: ColumnWidthType.Percentage, percentage: NaN },
      } as ExtendedMeasureInfo;
      layoutService.layout.qHyperCube.qMeasureInfo = [meaInfo, meaInfoWithoutValue, meaInfoWithNaN];

      const { getRightGridColumnWidth } = renderUseColumnWidth();
      expect(getRightGridColumnWidth(0)).toBe(percentage * percentageConversion);
      expect(getRightGridColumnWidth(1)).toBe(ColumnWidthValues.PercentageDefault * percentageConversion);
      expect(getRightGridColumnWidth(2)).toBe(ColumnWidthValues.PercentageDefault * percentageConversion);
    });

    test("should return right column width for column that reaches the min pixel value", () => {
      const pixels = 20;
      meaInfo = { columnWidth: { type: ColumnWidthType.Pixels, pixels } } as ExtendedMeasureInfo;
      layoutService.layout.qHyperCube.qMeasureInfo = [meaInfo, meaInfo, meaInfo];

      const { getRightGridColumnWidth } = renderUseColumnWidth();
      expect(getRightGridColumnWidth(0)).toBe(ColumnWidthValues.PixelsMin);
      expect(getRightGridColumnWidth(1)).toBe(ColumnWidthValues.PixelsMin);
      expect(getRightGridColumnWidth(2)).toBe(ColumnWidthValues.PixelsMin);
    });

    test("should return right column widths for columns with mixed settings", () => {
      const width = 50;
      const estimatedWidth = width + 1;
      const pixels = 100;
      mockEstimateWidth(estimatedWidth);
      mockMeasureText(width);
      const meaInfoPixels = { columnWidth: { type: ColumnWidthType.Pixels, pixels } } as ExtendedMeasureInfo;
      const meaInfoFitToContent = {
        columnWidth: { type: ColumnWidthType.FitToContent },
      } as ExtendedMeasureInfo;
      layoutService.layout.qHyperCube.qMeasureInfo = [meaInfo, meaInfoPixels, meaInfoFitToContent];

      const { getRightGridColumnWidth } = renderUseColumnWidth();
      expect(getRightGridColumnWidth(0)).toBe(131);
      expect(getRightGridColumnWidth(1)).toBe(pixels);
      expect(getRightGridColumnWidth(2)).toBe(estimatedWidth + TOTAL_CELL_PADDING);
    });

    test("should return right column width for non-pseudo dimension", () => {
      dimInfo.columnWidth = { type: ColumnWidthType.Pixels, pixels: 40 };
      visibleTopDimensionInfo = [dimInfo, -1, dimInfo];
      layoutService.layout.qHyperCube.qEffectiveInterColumnSortOrder = [0, 1, -1, 2];

      const { getRightGridColumnWidth } = renderUseColumnWidth();
      expect(getRightGridColumnWidth()).toBe(40);
    });

    test("should return right column width for non-pseudo dimension for fit to content", () => {
      const width = 40;
      mockEstimateWidth(width);
      mockMeasureText(width);

      dimInfo.columnWidth = { type: ColumnWidthType.FitToContent };
      visibleTopDimensionInfo = [dimInfo, -1, dimInfo];
      layoutService.layout.qHyperCube.qEffectiveInterColumnSortOrder = [0, 1, -1, 2];

      const { getRightGridColumnWidth } = renderUseColumnWidth();
      expect(getRightGridColumnWidth()).toBe(width + TOTAL_CELL_PADDING);
    });

    test("should return right column width for non-pseudo dimension for fit to content when dimension is collapsed", () => {
      const width = 40;
      mockEstimateWidth(width);
      mockMeasureText(width + 1);

      dimInfo.columnWidth = { type: ColumnWidthType.FitToContent };
      visibleTopDimensionInfo = [-1, dimInfo];
      layoutService.layout.qHyperCube.qEffectiveInterColumnSortOrder = [0, -1, 1, 2];

      const { getRightGridColumnWidth } = renderUseColumnWidth();
      expect(getRightGridColumnWidth()).toBe(width + EXPAND_ICON_SIZE + TOTAL_CELL_PADDING);
    });

    test("should subtract scrollbar width from columns", () => {
      tableWidth = 110;
      meaInfo.columnWidth = { type: ColumnWidthType.Auto };
      // normal scrollbar width on mac, it will be automatically calculated on each operating system
      verticalScrollbarWidth = 14;
      visibleTopDimensionInfo = [dimInfo, dimInfo, dimInfo];
      const { getRightGridColumnWidth } = renderUseColumnWidth();
      const targetColWidth = ColumnWidthValues.AutoMin - verticalScrollbarWidth / visibleTopDimensionInfo.length;

      expect(getRightGridColumnWidth(0)).toBeCloseTo(targetColWidth, 12);
      expect(getRightGridColumnWidth(1)).toBeCloseTo(targetColWidth, 12);
      expect(getRightGridColumnWidth(2)).toBeCloseTo(targetColWidth, 12);
    });

    test("should not subtract scrollbar width from columns when all rows are visible", () => {
      tableWidth = 110;
      meaInfo = { columnWidth: { type: ColumnWidthType.Auto } } as ExtendedMeasureInfo;
      verticalScrollbarWidth = 0;
      visibleTopDimensionInfo = [dimInfo, dimInfo, dimInfo];

      const { getRightGridColumnWidth } = renderUseColumnWidth();

      expect(getRightGridColumnWidth(0)).toBeCloseTo(ColumnWidthValues.AutoMin);
      expect(getRightGridColumnWidth(1)).toBeCloseTo(ColumnWidthValues.AutoMin);
      expect(getRightGridColumnWidth(2)).toBeCloseTo(ColumnWidthValues.AutoMin);
    });
  });

  describe("grid widths", () => {
    let expectedLeftGridWidth: number;

    beforeEach(() => {
      expectedLeftGridWidth = 150;
      // This makes the total of the left grid 3 * 50 px cells
      mockEstimateWidth(5);
      mockMeasureText(expectedLeftGridWidth / 3 - TOTAL_CELL_PADDING - MENU_ICON_SIZE);
    });

    test("should return grid and total widths when sum of all widths is tableWidth", () => {
      tableWidth = 500;
      const { leftGridWidth, rightGridWidth, totalWidth, showLastRightBorder } = renderUseColumnWidth();
      expect(leftGridWidth).toBe(expectedLeftGridWidth);
      expect(rightGridWidth).toBe(tableWidth - expectedLeftGridWidth - GRID_BORDER);
      expect(totalWidth).toEqual(tableWidth);
      expect(showLastRightBorder).toBe(false);
    });

    test("should return grid and total widths when sum of all widths is greater than tableWidth", () => {
      const measureWidth = 100;
      meaInfo = { columnWidth: { type: ColumnWidthType.Pixels, pixels: measureWidth } } as ExtendedMeasureInfo;
      layoutService.layout.qHyperCube.qMeasureInfo = [meaInfo, meaInfo, meaInfo];

      const { leftGridWidth, rightGridWidth, totalWidth, showLastRightBorder } = renderUseColumnWidth();
      expect(leftGridWidth).toBe(expectedLeftGridWidth);
      expect(rightGridWidth).toBe(tableWidth - expectedLeftGridWidth - GRID_BORDER);
      expect(totalWidth).toBe(expectedLeftGridWidth + measureWidth * 3 + GRID_BORDER);
      expect(totalWidth).toBeGreaterThan(tableWidth);
      expect(showLastRightBorder).toBe(false);
    });

    test("should return grid and total widths when sum of all widths is smaller than tableWidth", () => {
      const measureWidth = 40;
      meaInfo = { columnWidth: { type: ColumnWidthType.Pixels, pixels: measureWidth } } as ExtendedMeasureInfo;
      layoutService.layout.qHyperCube.qMeasureInfo = [meaInfo, meaInfo, meaInfo];

      const { leftGridWidth, rightGridWidth, totalWidth, showLastRightBorder } = renderUseColumnWidth();
      expect(leftGridWidth).toBe(expectedLeftGridWidth);
      expect(rightGridWidth).toBe(measureWidth * 3);
      expect(totalWidth).toBe(leftGridWidth + measureWidth * 3 + GRID_BORDER);
      expect(totalWidth).toBeLessThan(tableWidth);
      expect(showLastRightBorder).toBe(true);
    });
  });

  describe("getHeaderCellsIconsVisibilityStatus", () => {
    const columnWidthInPixels = 100;

    test("should return `shouldShowMenuIcon` as true, b/c estimated width for text is small and there is enough space in each column", () => {
      dimInfo.columnWidth = {
        type: ColumnWidthType.Pixels,
        pixels: columnWidthInPixels,
      };
      headersData = createHeadersData(layoutService, visibleTopDimensionInfo, visibleLeftDimensionInfo);
      mockMeasureText(columnWidthInPixels - TOTAL_CELL_PADDING - MENU_ICON_SIZE);

      const { getHeaderCellsIconsVisibilityStatus } = renderUseColumnWidth();
      const res = getHeaderCellsIconsVisibilityStatus(0, false);

      expect(res.shouldShowMenuIcon).toBe(true);
      expect(res.shouldShowLockIcon).toBe(false);
    });

    test("should return false for any icon, b/c estimated text width is greater than colWidth", () => {
      dimInfo.columnWidth = {
        type: ColumnWidthType.Pixels,
        pixels: columnWidthInPixels + MENU_ICON_SIZE - 1, // -1 is what makes the test pass
      };
      headersData = createHeadersData(layoutService, visibleTopDimensionInfo, visibleLeftDimensionInfo);
      mockMeasureText(columnWidthInPixels - TOTAL_CELL_PADDING);

      const { getHeaderCellsIconsVisibilityStatus } = renderUseColumnWidth();
      const res = getHeaderCellsIconsVisibilityStatus(0, false);

      expect(res.shouldShowMenuIcon).toBe(false);
      expect(res.shouldShowLockIcon).toBe(false);
    });

    describe("if `isLocked` is true:", () => {
      test("should return `shouldShowLockIcon` as true, b/c estimated width for text is small, there is enough space on each column and we are passing `isLocked` as true", () => {
        dimInfo.columnWidth = {
          type: ColumnWidthType.Pixels,
          pixels: columnWidthInPixels,
        };
        headersData = createHeadersData(layoutService, visibleTopDimensionInfo, visibleLeftDimensionInfo);
        mockMeasureText(columnWidthInPixels - TOTAL_CELL_PADDING - LOCK_ICON_SIZE - MENU_ICON_SIZE);

        const { getHeaderCellsIconsVisibilityStatus } = renderUseColumnWidth();
        const res = getHeaderCellsIconsVisibilityStatus(0, true);

        expect(res.shouldShowMenuIcon).toBe(true);
        expect(res.shouldShowLockIcon).toBe(true);
      });

      test("should prioritize lock icon over menu, if there is enough space for only one icon", () => {
        dimInfo.columnWidth = {
          type: ColumnWidthType.Pixels,
          pixels: columnWidthInPixels,
        };
        headersData = createHeadersData(layoutService, visibleTopDimensionInfo, visibleLeftDimensionInfo);
        // Mock the measureTextForHeader call inside getHeaderCellsIconsVisibilityStatus()
        mockMeasureText(columnWidthInPixels - TOTAL_CELL_PADDING - LOCK_ICON_SIZE);

        const { getHeaderCellsIconsVisibilityStatus } = renderUseColumnWidth();
        const res = getHeaderCellsIconsVisibilityStatus(0, true);

        expect(res.shouldShowMenuIcon).toBe(false);
        expect(res.shouldShowLockIcon).toBe(true);
      });
    });
  });
});
