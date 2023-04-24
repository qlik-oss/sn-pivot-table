import NxDimCellType from "../../../types/QIX";
import { Cell, Grid } from "../../../types/types";
import extractLeftGrid from "../extract-left";
import { addPageToLeftDimensionData, createLeftDimensionData } from "../left-dimension-data";

jest.mock("../extract-left");
const mockedExtractLeft = extractLeftGrid as jest.MockedFunction<typeof extractLeftGrid>;

describe("left dimension data", () => {
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

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    test("should return correct data", () => {
      const mockedReturnValue = [{ 0: CELL, 1: CELL }] as Grid;
      mockedExtractLeft.mockReturnValue(mockedReturnValue);
      const data = createLeftDimensionData(dataPage, qHyperCube, false);

      expect(data.grid).toEqual(mockedReturnValue);
      expect(data.dimensionInfoIndexMap).toEqual([0]);
      expect(data.size.x).toEqual(1);
      expect(data.size.y).toEqual(dataPage.qArea.qHeight + dataPage.qArea.qTop);
    });

    test("should return correct data size in snapshot mode", () => {
      const mockedReturnValue = [{ 0: CELL, 1: CELL }] as Grid;
      mockedExtractLeft.mockReturnValue(mockedReturnValue);
      const data = createLeftDimensionData(dataPage, qHyperCube, true);

      expect(data.size.y).toEqual(dataPage.qArea.qHeight);
    });
  });

  describe("add page to", () => {
    test("should add page to data", () => {
      const nextLeft = [{ 0: CELL, 1: CELL }] as Grid;
      mockedExtractLeft.mockReturnValue(nextLeft);
      const data = createLeftDimensionData(dataPage, qHyperCube, false);
      const nextDataPage = {
        qLeft: [{}],
        qArea: {
          qHeight: 2,
          qTop: 3,
        },
      } as unknown as EngineAPI.INxPivotPage;
      const nextData = addPageToLeftDimensionData(data, nextDataPage);

      expect(nextData.grid).toEqual(nextLeft);
      expect(nextData.dimensionInfoIndexMap).toEqual([0]);
      expect(nextData.size.x).toEqual(1);
      expect(nextData.size.y).toEqual(nextDataPage.qArea.qHeight + nextDataPage.qArea.qTop);
    });

    test("should return previous page if qLeft is an empty array", () => {
      const nextLeft = [{ 0: CELL, 1: CELL }] as Grid;
      mockedExtractLeft.mockReturnValue(nextLeft);
      const data = createLeftDimensionData(dataPage, qHyperCube, false);
      const nextDataPage = {
        qLeft: [],
        qArea: {
          qHeight: 2,
          qTop: 3,
        },
      } as unknown as EngineAPI.INxPivotPage;
      const nextData = addPageToLeftDimensionData(data, nextDataPage);

      expect(nextData).toBe(data);
    });

    test("should compare height with previous data and return the largest value", () => {
      const nextLeft = [{ 0: CELL, 1: CELL }] as Grid;
      mockedExtractLeft.mockReturnValue(nextLeft);
      const data = createLeftDimensionData(dataPage, qHyperCube, false);
      const nextDataPage = {
        qLeft: [{}],
        qArea: {
          qHeight: 2,
          qTop: 3,
        },
      } as unknown as EngineAPI.INxPivotPage;
      data.size.y = 100;
      const nextData = addPageToLeftDimensionData(data, nextDataPage);

      expect(nextData.size.y).toEqual(data.size.y);
    });
  });
});
