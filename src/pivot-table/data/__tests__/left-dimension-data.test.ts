import NxDimCellType from "../../../types/QIX";
import type {
  AttrExprInfoIndex,
  Cell,
  Grid,
  LayoutService,
  PageInfo,
  VisibleDimensionInfo,
} from "../../../types/types";
import extractLeftGrid from "../extract-left";
import { addPageToLeftDimensionData, createLeftDimensionData } from "../left-dimension-data";

jest.mock("../extract-left");
const mockedExtractLeft = extractLeftGrid as jest.MockedFunction<typeof extractLeftGrid>;

describe("left dimension data", () => {
  const pageInfo = {
    page: 0,
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
  } as unknown as LayoutService;
  const visibleLeftDimensionInfo: VisibleDimensionInfo[] = [];
  const attrExprInfoIndexes: AttrExprInfoIndex[] = [];

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("create left dimension data", () => {
    test("should return correct data", () => {
      const mockedReturnValue = [{ 0: CELL, 1: CELL }] as Grid;
      mockedExtractLeft.mockReturnValue(mockedReturnValue);
      const data = createLeftDimensionData(
        dataPage,
        layoutService,
        pageInfo,
        visibleLeftDimensionInfo,
        attrExprInfoIndexes,
      );

      expect(mockedExtractLeft).toHaveBeenCalledWith(
        [],
        dataPage.qLeft,
        dataPage.qArea,
        pageInfo,
        layoutService,
        visibleLeftDimensionInfo,
        attrExprInfoIndexes,
      );
      expect(data.grid).toEqual(mockedReturnValue);
      expect(data.columnCount).toEqual(1);
    });
  });

  describe("add page to left dimension data", () => {
    test("should add page to data", () => {
      const nextLeft = [{ 0: CELL, 1: CELL }] as Grid;
      mockedExtractLeft.mockReturnValue(nextLeft);
      const prevData = createLeftDimensionData(
        dataPage,
        layoutService,
        pageInfo,
        visibleLeftDimensionInfo,
        attrExprInfoIndexes,
      );
      const nextDataPage = {
        qLeft: [{}],
        qArea: {
          qHeight: 2,
          qTop: 3,
        },
      } as unknown as EngineAPI.INxPivotPage;
      const nextData = addPageToLeftDimensionData({
        prevData,
        nextDataPage,
        pageInfo,
        layoutService,
        visibleLeftDimensionInfo,
        attrExprInfoIndexes,
      });

      expect(mockedExtractLeft).toHaveBeenCalledWith(
        [],
        dataPage.qLeft,
        dataPage.qArea,
        pageInfo,
        layoutService,
        visibleLeftDimensionInfo,
        attrExprInfoIndexes,
      );
      expect(nextData.grid).toEqual(nextLeft);
      expect(nextData.columnCount).toEqual(1);
    });

    test("should return previous page if qLeft is an empty array", () => {
      const nextLeft = [{ 0: CELL, 1: CELL }] as Grid;
      mockedExtractLeft.mockReturnValue(nextLeft);
      const prevData = createLeftDimensionData(
        dataPage,
        layoutService,
        pageInfo,
        visibleLeftDimensionInfo,
        attrExprInfoIndexes,
      );
      const nextDataPage = {
        qLeft: [],
        qArea: {
          qHeight: 2,
          qTop: 3,
        },
      } as unknown as EngineAPI.INxPivotPage;
      const nextData = addPageToLeftDimensionData({
        prevData,
        nextDataPage,
        pageInfo,
        layoutService,
        visibleLeftDimensionInfo,
        attrExprInfoIndexes,
      });

      expect(nextData).toBe(prevData);
    });
  });
});
