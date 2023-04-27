import NxDimCellType from "../../../types/QIX";
import { Cell, Grid, LayoutService } from "../../../types/types";
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
      const data = createLeftDimensionData(dataPage, layoutService);

      expect(data.grid).toEqual(mockedReturnValue);
      expect(data.dimensionInfoIndexMap).toEqual([0]);
      expect(data.columnCount).toEqual(1);
    });
  });

  describe("add page to", () => {
    test("should add page to data", () => {
      const nextLeft = [{ 0: CELL, 1: CELL }] as Grid;
      mockedExtractLeft.mockReturnValue(nextLeft);
      const data = createLeftDimensionData(dataPage, layoutService);
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
      expect(nextData.columnCount).toEqual(1);
    });

    test("should return previous page if qLeft is an empty array", () => {
      const nextLeft = [{ 0: CELL, 1: CELL }] as Grid;
      mockedExtractLeft.mockReturnValue(nextLeft);
      const data = createLeftDimensionData(dataPage, layoutService);
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
  });
});
