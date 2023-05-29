import NxDimCellType from "../../../types/QIX";
import type { Cell, Grid, LayoutService } from "../../../types/types";
import extractTopGrid from "../extract-top";
import { addPageToTopDimensionData, createTopDimensionData } from "../top-dimension-data";

jest.mock("../extract-top");
const mockedExtractTop = extractTopGrid as jest.MockedFunction<typeof extractTopGrid>;

describe("top dimension data", () => {
  const CELL = { ref: { qType: NxDimCellType.NX_DIM_CELL_NORMAL } } as Cell;
  const qHyperCube = {
    qEffectiveInterColumnSortOrder: [0],
    qNoOfLeftDims: 0,
    qSize: { qcx: 0, qxy: 0 },
  } as unknown as EngineAPI.IHyperCube;
  const dataPage = {
    qTop: [],
    qArea: {
      qWidth: 1,
      qLeft: 2,
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
      mockedExtractTop.mockReturnValue(mockedReturnValue);
      const data = createTopDimensionData(dataPage, layoutService);

      expect(data.grid).toEqual(mockedReturnValue);
      expect(data.dimensionInfoIndexMap).toEqual([0]);
      expect(data.rowCount).toEqual(1);
    });
  });

  describe("add page to", () => {
    test("should add page to data", () => {
      const nextTop = [{ 0: CELL, 1: CELL }] as Grid;
      mockedExtractTop.mockReturnValue(nextTop);
      const prevData = createTopDimensionData(dataPage, layoutService);
      const nextDataPage = {
        qTop: [{}],
        qArea: {
          qWidth: 2,
          qLeft: 3,
        },
      } as unknown as EngineAPI.INxPivotPage;
      const nextData = addPageToTopDimensionData({ prevData, nextDataPage });

      expect(nextData).not.toBe(prevData);
      expect(nextData.grid).toEqual(nextTop);
      expect(nextData.dimensionInfoIndexMap).toEqual([0]);
      expect(nextData.rowCount).toEqual(1);
    });

    test("should return previous page if qLeft is an empty array", () => {
      const nextTop = [{ 0: CELL, 1: CELL }] as Grid;
      mockedExtractTop.mockReturnValue(nextTop);
      const prevData = createTopDimensionData(dataPage, layoutService);
      const nextDataPage = {
        qTop: [],
        qArea: {
          qWidth: 2,
          qLeft: 3,
        },
      } as unknown as EngineAPI.INxPivotPage;
      const nextData = addPageToTopDimensionData({ prevData, nextDataPage });

      expect(nextData).toBe(prevData);
    });
  });
});
