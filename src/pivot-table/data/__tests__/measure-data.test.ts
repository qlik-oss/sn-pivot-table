import type { PageInfo } from "../../../hooks/use-pivot-table";
import { addPageToMeasureData, createMeasureData } from "../measure-data";

describe("measure data", () => {
  const pageInfo = {
    currentPage: 0,
    rowsPerPage: 50,
  } as PageInfo;

  describe("create", () => {
    test("should return correct data", () => {
      const dataPage = {
        qData: [
          [{}, {}],
          [{}, {}],
        ],
        qArea: { qWidth: 1, qHeight: 2, qLeft: 3, qTop: 4 },
      } as unknown as EngineAPI.INxPivotPage;
      const data = createMeasureData(dataPage);

      expect(data).toEqual(dataPage.qData);
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
      const prevData = createMeasureData(dataPage);

      const nextDataPage = {
        qData: [
          [{}, {}],
          [{}, {}],
        ],
        qArea: { qWidth: 2, qHeight: 2, qLeft: 2, qTop: 0 },
      } as unknown as EngineAPI.INxPivotPage;

      const data = addPageToMeasureData({ prevData, nextDataPage, pageInfo });

      expect(data).toEqual([
        [{}, {}, {}, {}],
        [{}, {}, {}, {}],
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
      const prevData = createMeasureData(dataPage);

      const nextDataPage = {
        qData: [[{}, {}]],
        qArea: { qWidth: 2, qHeight: 1, qLeft: 2, qTop: 1 },
      } as unknown as EngineAPI.INxPivotPage;

      const data = addPageToMeasureData({ prevData, nextDataPage, pageInfo });

      expect(data).toEqual([
        [{}, {}, {}, {}],
        [{}, {}, {}, {}],
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
      const prevData = createMeasureData(dataPage);

      const nextDataPage = {
        qData: [],
        qArea: { qWidth: 0, qHeight: 0, qLeft: 0, qTop: 0 },
      } as unknown as EngineAPI.INxPivotPage;

      const data = addPageToMeasureData({ prevData, nextDataPage, pageInfo });

      expect(data).toEqual(prevData);
      expect(data).toBe(prevData); // Should not be referentially equal
    });
  });
});
