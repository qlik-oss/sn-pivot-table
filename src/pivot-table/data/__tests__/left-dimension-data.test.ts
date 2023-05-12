import NxDimCellType from "../../../types/QIX";
import type { Cell, Grid, LayoutService, PageInfo } from "../../../types/types";
import extractLeftGrid from "../extract-left";
import { addPageToLeftDimensionData, createLeftDimensionData } from "../left-dimension-data";

jest.mock("../extract-left");
const mockedExtractLeft = extractLeftGrid as jest.MockedFunction<typeof extractLeftGrid>;

describe("left dimension data", () => {
  const pageInfo = {
    currentPage: 0,
    rowsPerPage: 100,
  } as PageInfo;
  const CELL = { ref: { qType: NxDimCellType.NX_DIM_CELL_NORMAL } } as Cell;
  const qHyperCube = {
    qEffectiveInterColumnSortOrder: [0],
  } as EngineAPI.IHyperCube;
  const dataPage = {
    qLeft: [],
    qArea: {
      qHeight: 1,
      qTop: 2,
    },
  } as unknown as EngineAPI.INxPivotPage;
  const layoutService: LayoutService = {
    size: {
      x: 100,
      y: 200,
    },
    layout: {
      qHyperCube,
    },
  } as LayoutService;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    test("should return correct data", () => {
      const mockedReturnValue = [{ 0: CELL, 1: CELL }] as Grid;
      mockedExtractLeft.mockReturnValue(mockedReturnValue);
      const data = createLeftDimensionData(dataPage, layoutService, pageInfo);

      expect(data.grid).toEqual(mockedReturnValue);
      expect(data.dimensionInfoIndexMap).toEqual([0]);
      expect(data.columnCount).toEqual(1);
    });
  });

  describe("add page to", () => {
    test("should add page to data", () => {
      const nextLeft = [{ 0: CELL, 1: CELL }] as Grid;
      mockedExtractLeft.mockReturnValue(nextLeft);
      const prevData = createLeftDimensionData(dataPage, layoutService, pageInfo);
      const nextDataPage = {
        qLeft: [{}],
        qArea: {
          qHeight: 2,
          qTop: 3,
        },
      } as unknown as EngineAPI.INxPivotPage;
      const nextData = addPageToLeftDimensionData({ prevData, nextDataPage, pageInfo });

      expect(nextData.grid).toEqual(nextLeft);
      expect(nextData.dimensionInfoIndexMap).toEqual([0]);
      expect(nextData.columnCount).toEqual(1);
    });

    test("should return previous page if qLeft is an empty array", () => {
      const nextLeft = [{ 0: CELL, 1: CELL }] as Grid;
      mockedExtractLeft.mockReturnValue(nextLeft);
      const prevData = createLeftDimensionData(dataPage, layoutService, pageInfo);
      const nextDataPage = {
        qLeft: [],
        qArea: {
          qHeight: 2,
          qTop: 3,
        },
      } as unknown as EngineAPI.INxPivotPage;
      const nextData = addPageToLeftDimensionData({ prevData, nextDataPage, pageInfo });

      expect(nextData).toBe(prevData);
    });
  });
});
