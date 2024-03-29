import NxDimCellType from "../../../types/QIX";
import type { AttrExprInfoIndex, Cell, Grid, LayoutService, VisibleDimensionInfo } from "../../../types/types";
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
  const visibleTopDimensionInfo: VisibleDimensionInfo[] = [];
  const attrExprInfoIndexes: AttrExprInfoIndex[] = [];

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    test("should return correct data", () => {
      const mockedReturnValue = [{ 0: CELL, 1: CELL }] as Grid;
      mockedExtractTop.mockReturnValue(mockedReturnValue);
      const headerRows = 1;
      const data = createTopDimensionData(
        dataPage,
        layoutService,
        visibleTopDimensionInfo,
        attrExprInfoIndexes,
        headerRows,
      );

      expect(data.grid).toEqual(mockedReturnValue);
      expect(data.rowCount).toEqual(1);
    });
  });

  describe("add page to", () => {
    test("should add page to data", () => {
      const nextTop = [{ 0: CELL, 1: CELL }] as Grid;
      mockedExtractTop.mockReturnValue(nextTop);
      const headerRows = 1;
      const prevData = createTopDimensionData(
        dataPage,
        layoutService,
        visibleTopDimensionInfo,
        attrExprInfoIndexes,
        headerRows,
      );
      const nextDataPage = {
        qTop: [{}],
        qArea: {
          qWidth: 2,
          qLeft: 3,
        },
      } as unknown as EngineAPI.INxPivotPage;
      const nextData = addPageToTopDimensionData({
        prevData,
        nextDataPage,
        layoutService,
        visibleTopDimensionInfo,
        attrExprInfoIndexes,
        headerRows,
      });

      expect(nextData).not.toBe(prevData);
      expect(nextData.grid).toEqual(nextTop);
      expect(nextData.rowCount).toEqual(1);
    });

    test("should return previous page if qLeft is an empty array", () => {
      const nextTop = [{ 0: CELL, 1: CELL }] as Grid;
      const headerRows = 1;
      mockedExtractTop.mockReturnValue(nextTop);
      const prevData = createTopDimensionData(
        dataPage,
        layoutService,
        visibleTopDimensionInfo,
        attrExprInfoIndexes,
        headerRows,
      );
      const nextDataPage = {
        qTop: [],
        qArea: {
          qWidth: 2,
          qLeft: 3,
        },
      } as unknown as EngineAPI.INxPivotPage;
      const nextData = addPageToTopDimensionData({
        prevData,
        nextDataPage,
        layoutService,
        visibleTopDimensionInfo,
        attrExprInfoIndexes,
        headerRows,
      });

      expect(nextData).toBe(prevData);
    });
  });
});
