import { PSEUDO_DIMENSION_INDEX, PSEUDO_DIMENSION_KEY } from "../../../constants";
import { ColumnWidthLocation, type LayoutService, type VisibleDimensionInfo } from "../../../types/types";
import extractHeaders from "../extract-headers";
import { createDimInfos } from "./test-helper";

describe("extractHeaders", () => {
  const mockedIsLeftDimension: jest.MockedFunction<(index: number) => boolean> = jest.fn();
  const mockedGetDimensionInfoIndex: jest.MockedFunction<(info: VisibleDimensionInfo) => number> = jest.fn();
  let layoutService: LayoutService;

  beforeEach(() => {
    mockedIsLeftDimension.mockReturnValue(false);
    mockedGetDimensionInfoIndex.mockImplementation((info: VisibleDimensionInfo) => (info === -1 ? -1 : 0));
    layoutService = {
      layout: {
        qHyperCube: {
          activelySortedColumn: { colIdx: 0 },
        },
      },
      isLeftDimension: mockedIsLeftDimension,
      getDimensionInfoIndex: mockedGetDimensionInfoIndex,
    } as unknown as LayoutService;
  });

  test("should extract headers with row count 1 and column count 0", () => {
    const sortedLeftDimensionInfo = createDimInfos([]);
    const sortedTopDimensionInfo = createDimInfos([1]);
    const headers = extractHeaders(layoutService, sortedTopDimensionInfo, sortedLeftDimensionInfo);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(1);
    expect(headers[0][0]?.label).toBe("dim 1");
    expect(headers[0][0]?.id).toBe("id-1");
  });

  test("should extract headers with row count 0 and column count 1", () => {
    const sortedLeftDimensionInfo = createDimInfos([1]);
    const sortedTopDimensionInfo = createDimInfos([]);
    const headers = extractHeaders(layoutService, sortedTopDimensionInfo, sortedLeftDimensionInfo);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(1);
    expect(headers[0][0]?.label).toBe("dim 1");
    expect(headers[0][0]?.id).toBe("id-1");
  });

  test("should extract headers with row count 0 and column count 2 and a pseudo dimension on last column", () => {
    const sortedLeftDimensionInfo = createDimInfos([1, PSEUDO_DIMENSION_INDEX]);
    const sortedTopDimensionInfo = createDimInfos([]);
    const headers = extractHeaders(layoutService, sortedTopDimensionInfo, sortedLeftDimensionInfo);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(2);
    expect(headers[0][0]?.label).toBe("dim 1");
    expect(headers[0][0]?.id).toBe("id-1");
    expect(headers[0][1]?.id).toBe(PSEUDO_DIMENSION_KEY);
  });

  test("should extract headers with row count 2 and column count 0 and a pseudo dimension on last row", () => {
    const sortedLeftDimensionInfo = createDimInfos([]);
    const sortedTopDimensionInfo = createDimInfos([1, PSEUDO_DIMENSION_INDEX]);
    const headers = extractHeaders(layoutService, sortedTopDimensionInfo, sortedLeftDimensionInfo);

    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveLength(1);
    expect(headers[0][0]?.label).toBe("dim 1");
    expect(headers[0][0]?.id).toBe("id-1");
    expect(headers[1][0]?.id).toBe(PSEUDO_DIMENSION_KEY);
  });

  test("should extract headers with row count 1 and column count 1", () => {
    const sortedLeftDimensionInfo = createDimInfos([0]);
    const sortedTopDimensionInfo = createDimInfos([1]);
    const headers = extractHeaders(layoutService, sortedTopDimensionInfo, sortedLeftDimensionInfo);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(2);
    expect(headers[0][0]?.label).toBe("dim 0");
    expect(headers[0][0]?.id).toBe("id-0");
    expect(headers[0][1]?.label).toBe("dim 1");
    expect(headers[0][1]?.id).toBe("id-1");
  });

  test("should extract headers with row count 1 and column count 2", () => {
    const sortedLeftDimensionInfo = createDimInfos([0, 1]);
    const sortedTopDimensionInfo = createDimInfos([]);
    const headers = extractHeaders(layoutService, sortedTopDimensionInfo, sortedLeftDimensionInfo);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(2);
    expect(headers[0][0]?.label).toBe("dim 0");
    expect(headers[0][0]?.id).toBe("id-0");
    expect(headers[0][1]?.label).toBe("dim 1");
    expect(headers[0][1]?.id).toBe("id-1");
  });

  test("should extract headers with row count 1 and column count 2 and a pseudo dimension on first column", () => {
    const sortedLeftDimensionInfo = createDimInfos([PSEUDO_DIMENSION_INDEX, 0]);
    const sortedTopDimensionInfo = createDimInfos([1]);
    const headers = extractHeaders(layoutService, sortedTopDimensionInfo, sortedLeftDimensionInfo);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(3);
    expect(headers[0][0]?.label).toBe("");
    expect(headers[0][0]?.id).toBe(PSEUDO_DIMENSION_KEY);
    expect(headers[0][1]?.label).toBe("dim 0");
    expect(headers[0][1]?.id).toBe("id-0");
    expect(headers[0][2]?.label).toBe("dim 1");
    expect(headers[0][2]?.id).toBe("id-1");
  });

  test("should extract headers with row count 1 and column count 2 and a pseudo dimension on last column", () => {
    const sortedLeftDimensionInfo = createDimInfos([0, PSEUDO_DIMENSION_INDEX]);
    const sortedTopDimensionInfo = createDimInfos([1]);
    const headers = extractHeaders(layoutService, sortedTopDimensionInfo, sortedLeftDimensionInfo);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(2);
    expect(headers[0][0]?.label).toBe("dim 0");
    expect(headers[0][0]?.id).toBe("id-0");
    expect(headers[0][1]?.label).toBe("dim 1");
    expect(headers[0][1]?.id).toBe("id-1");
  });

  test("should extract headers with row count 2 and column count 1", () => {
    const sortedLeftDimensionInfo = createDimInfos([0]);
    const sortedTopDimensionInfo = createDimInfos([1, 2]);
    const headers = extractHeaders(layoutService, sortedTopDimensionInfo, sortedLeftDimensionInfo);

    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveLength(2);
    expect(headers[0][0]).toBe(null);
    expect(headers[0][1]?.label).toBe("dim 1");
    expect(headers[0][1]?.id).toBe("id-1");
    expect(headers[1][0]?.label).toBe("dim 0");
    expect(headers[1][0]?.id).toBe("id-0");
    expect(headers[1][1]?.label).toBe("dim 2");
    expect(headers[1][1]?.id).toBe("id-2");
  });

  test("should extract headers with row count 2 and column count 2", () => {
    const sortedLeftDimensionInfo = createDimInfos([0, 1]);
    const sortedTopDimensionInfo = createDimInfos([2, 3]);
    const headers = extractHeaders(layoutService, sortedTopDimensionInfo, sortedLeftDimensionInfo);

    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveLength(3);
    expect(headers[0][0]).toBe(null);
    expect(headers[0][1]).toBe(null);
    expect(headers[0][2]?.label).toBe("dim 2");
    expect(headers[0][2]?.id).toBe("id-2");
    expect(headers[1][0]?.label).toBe("dim 0");
    expect(headers[1][0]?.id).toBe("id-0");
    expect(headers[1][1]?.label).toBe("dim 1");
    expect(headers[1][1]?.id).toBe("id-1");
    expect(headers[1][2]?.label).toBe("dim 3");
    expect(headers[1][2]?.id).toBe("id-3");
  });

  describe("ColumnWidthLocation", () => {
    test("should have ColumnWidthLocation measures on any pseudo dimension in left", () => {
      const sortedLeftDimensionInfo = createDimInfos([PSEUDO_DIMENSION_INDEX, 1]);
      const sortedTopDimensionInfo = createDimInfos([2]);
      const headers = extractHeaders(layoutService, sortedTopDimensionInfo, sortedLeftDimensionInfo);

      expect(headers[0][0]?.columnWidthLocation).toBe(ColumnWidthLocation.Measures);
    });

    test("should have ColumnWidthLocation measures on last left", () => {
      const sortedLeftDimensionInfo = createDimInfos([1, PSEUDO_DIMENSION_INDEX]);
      const sortedTopDimensionInfo = createDimInfos([2]);
      const headers = extractHeaders(layoutService, sortedTopDimensionInfo, sortedLeftDimensionInfo);

      expect(headers[0][1]?.isLeftDimension).toBeFalsy();
      expect(headers[0][1]?.columnWidthLocation).toBe(ColumnWidthLocation.Measures);
    });

    test("should have ColumnWidthLocation pivot on last left", () => {
      const sortedLeftDimensionInfo = createDimInfos([PSEUDO_DIMENSION_INDEX, 1]);
      const sortedTopDimensionInfo = createDimInfos([2]);
      layoutService.hasPseudoDimOnLeft = true;
      mockedIsLeftDimension.mockImplementation((index: number) => index !== 2);

      mockedGetDimensionInfoIndex.mockImplementation((info) =>
        info === PSEUDO_DIMENSION_INDEX
          ? PSEUDO_DIMENSION_INDEX
          : [...sortedLeftDimensionInfo, ...sortedTopDimensionInfo].indexOf(info),
      );
      const headers = extractHeaders(layoutService, sortedTopDimensionInfo, sortedLeftDimensionInfo);

      expect(headers[0][2]?.columnWidthLocation).toBe(ColumnWidthLocation.Pivot);
    });
  });
});
