import type { AttrExprInfoIndex, LayoutService, MeasureCell, PageInfo } from "../../../types/types";
import { addPageToMeasureData, createMeasureData } from "../measure-data";

jest.mock("../helpers/get-random-uuid");

describe("measure data", () => {
  const pageInfo = {
    page: 0,
    rowsPerPage: 100,
  } as PageInfo;
  const attrExprInfoIndexes: AttrExprInfoIndex[] = [];
  const layoutService: LayoutService = { hasPseudoDimOnLeft: false } as LayoutService;
  const testCell = {
    id: "mocked-id",
    ref: {},
    isNull: false,
    expressionColor: { color: null, background: null },
  } as MeasureCell;

  describe("create", () => {
    test("should return correct data", () => {
      const dataPage = {
        qData: [
          [{}, {}],
          [{}, {}],
        ],
        qArea: { qWidth: 2, qHeight: 2, qLeft: 0, qTop: 0 },
      } as unknown as EngineAPI.INxPivotPage;
      const data = createMeasureData(dataPage, pageInfo, attrExprInfoIndexes, layoutService);

      expect(data).toEqual([
        [testCell, testCell],
        [testCell, testCell],
      ]);
    });

    test("should return correct data when not starting at qTop zero index", () => {
      const dataPage = {
        qData: [[{}, {}]],
        qArea: { qWidth: 2, qHeight: 1, qLeft: 0, qTop: 1 },
      } as unknown as EngineAPI.INxPivotPage;
      const data = createMeasureData(dataPage, pageInfo, attrExprInfoIndexes, layoutService);

      expect(data).toEqual([undefined, [testCell, testCell]]);
      expect(data).not.toBe(dataPage.qData); // Should not be referentially equal
    });

    test("should return correct data when not starting at qLeft zero index", () => {
      const dataPage = {
        qData: [[{}, {}]],
        qArea: { qWidth: 2, qHeight: 1, qLeft: 1, qTop: 0 },
      } as unknown as EngineAPI.INxPivotPage;
      const data = createMeasureData(dataPage, pageInfo, attrExprInfoIndexes, layoutService);

      expect(data).toEqual([[undefined, testCell, testCell]]);
      expect(data).not.toBe(dataPage.qData); // Should not be referentially equal
    });
  });

  describe("add page to data", () => {
    test("should add page to data", () => {
      const dataPage = {
        qData: [
          [{}, {}],
          [{}, {}],
        ],
        qArea: { qWidth: 2, qHeight: 2, qLeft: 0, qTop: 0 },
      } as unknown as EngineAPI.INxPivotPage;
      const prevData = createMeasureData(dataPage, pageInfo, attrExprInfoIndexes, layoutService);

      const nextDataPage = {
        qData: [
          [{}, {}],
          [{}, {}],
        ],
        qArea: { qWidth: 2, qHeight: 2, qLeft: 2, qTop: 0 },
      } as unknown as EngineAPI.INxPivotPage;

      const data = addPageToMeasureData({
        prevData,
        dataPage: nextDataPage,
        pageInfo,
        attrExprInfoIndexes,
        layoutService,
      });

      expect(data).toEqual([
        [testCell, testCell, testCell, testCell],
        [testCell, testCell, testCell, testCell],
      ]);
    });

    test("should fill gaps in data", () => {
      const dataPage = {
        qData: [
          [{}, {}, {}, {}],
          [{}, {}],
        ],
        qArea: { qWidth: 2, qHeight: 2, qLeft: 0, qTop: 0 },
      } as unknown as EngineAPI.INxPivotPage;
      const prevData = createMeasureData(dataPage, pageInfo, attrExprInfoIndexes, layoutService);

      const nextDataPage = {
        qData: [[{}, {}]],
        qArea: { qWidth: 2, qHeight: 1, qLeft: 2, qTop: 1 },
      } as unknown as EngineAPI.INxPivotPage;

      const data = addPageToMeasureData({
        prevData,
        dataPage: nextDataPage,
        pageInfo,
        attrExprInfoIndexes,
        layoutService,
      });

      expect(data).toEqual([
        [testCell, testCell, testCell, testCell],
        [testCell, testCell, testCell, testCell],
      ]);
    });

    test("should return previous page if qData is an empty array", () => {
      const dataPage = {
        qData: [
          [{}, {}],
          [{}, {}],
        ],
        qArea: { qWidth: 2, qHeight: 2, qLeft: 0, qTop: 0 },
      } as unknown as EngineAPI.INxPivotPage;
      const prevData = createMeasureData(dataPage, pageInfo, attrExprInfoIndexes, layoutService);

      const nextDataPage = {
        qData: [],
        qArea: { qWidth: 0, qHeight: 0, qLeft: 0, qTop: 0 },
      } as unknown as EngineAPI.INxPivotPage;

      const data = addPageToMeasureData({
        prevData,
        dataPage: nextDataPage,
        pageInfo,
        attrExprInfoIndexes,
        layoutService,
      });

      expect(data).toEqual(prevData);
      expect(data).toBe(prevData); // Should be referentially equal
    });
  });
});
