import { PSEUDO_DIMENSION_INDEX, PSEUDO_DIMENSION_KEY } from "../../../constants";
import type { HeadersDataMatrix, LayoutService, VisibleDimensionInfo } from "../../../types/types";
import createHeadersData from "../headers-data";
import { createDimInfos } from "./test-helper";

describe("create headers data", () => {
  let layoutService: LayoutService;

  beforeEach(() => {
    jest.resetAllMocks();
    layoutService = {
      layout: {
        qHyperCube: {
          activelySortedColumn: { colIdx: 0 },
        },
      },
      isLeftDimension: jest.fn(() => false),
      getDimensionInfoIndex: (info: VisibleDimensionInfo) => (info === -1 ? -1 : 0),
    } as unknown as LayoutService;
  });

  test("should return correct headers data", () => {
    const visibleLeftDimensionInfo = createDimInfos([1, 2]);
    const headersData = createHeadersData(layoutService, [], visibleLeftDimensionInfo);

    const headers = [[{ id: "id-1" }, { id: "id-2" }]] as HeadersDataMatrix;
    expect(headersData.data).toMatchObject(headers);
    expect(headersData.size.x).toBe(2);
    expect(headersData.size.y).toBe(1);
  });

  test("should return correct headers data with pseudo last in top dimensions", () => {
    const visibleTopDimensionInfo = createDimInfos([1, PSEUDO_DIMENSION_INDEX]);
    const visibleLeftDimensionInfo = createDimInfos([]);

    const headersData = createHeadersData(layoutService, visibleTopDimensionInfo, visibleLeftDimensionInfo);

    const headers = [[{ id: "id-1" }], [{ id: PSEUDO_DIMENSION_KEY }]] as HeadersDataMatrix;
    expect(headersData.data).toMatchObject(headers);
    expect(headersData.size.x).toBe(headers[0].length);
    expect(headersData.size.y).toBe(headers.length);
  });

  test("should return correct headers data with pseudo last in left dimensions", () => {
    const visibleTopDimensionInfo = createDimInfos([1]);
    const visibleLeftDimensionInfo = createDimInfos([PSEUDO_DIMENSION_INDEX]);

    const headersData = createHeadersData(layoutService, visibleTopDimensionInfo, visibleLeftDimensionInfo);

    const headers = [[{ id: "id-1" }]] as HeadersDataMatrix;
    expect(headersData.data).toMatchObject(headers);
    expect(headersData.size.x).toBe(headers[0].length);
    expect(headersData.size.y).toBe(headers.length);
  });

  test("should handle when there are no headers", () => {
    const headersData = createHeadersData(layoutService, [], []);

    const headers = [] as HeadersDataMatrix;
    expect(headersData.data).toEqual(headers);
    expect(headersData.size.x).toBe(0);
    expect(headersData.size.y).toBe(headers.length);
  });
});
