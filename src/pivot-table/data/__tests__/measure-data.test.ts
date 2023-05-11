import { addPageToMeasureData, createMeasureData } from "../measure-data";

describe("measure data", () => {
  describe("create", () => {
    test("should return correct data", () => {
      const dataPage = {
        qData: [
          [{}, {}],
          [{}, {}],
        ],
        qArea: { qWidth: 2, qHeight: 2, qLeft: 0, qTop: 0 },
      } as unknown as EngineAPI.INxPivotPage;
      const data = createMeasureData(dataPage);

      expect(data).toEqual([
        [{}, {}],
        [{}, {}],
      ]);
      expect(data).not.toBe(dataPage.qData); // Should not be referentially equal
    });

    test("should return correct data when not starting at qTop zero index", () => {
      const dataPage = {
        qData: [[{}, {}]],
        qArea: { qWidth: 2, qHeight: 1, qLeft: 0, qTop: 1 },
      } as unknown as EngineAPI.INxPivotPage;
      const data = createMeasureData(dataPage);

      expect(data).toEqual([undefined, [{}, {}]]);
      expect(data).not.toBe(dataPage.qData); // Should not be referentially equal
    });

    test("should return correct data when not starting at qLeft zero index", () => {
      const dataPage = {
        qData: [[{}, {}]],
        qArea: { qWidth: 2, qHeight: 1, qLeft: 1, qTop: 0 },
      } as unknown as EngineAPI.INxPivotPage;
      const data = createMeasureData(dataPage);

      expect(data).toEqual([[undefined, {}, {}]]);
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

      const data = addPageToMeasureData(prevData, nextDataPage);

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

      const data = addPageToMeasureData(prevData, nextDataPage);

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

      const data = addPageToMeasureData(prevData, nextDataPage);

      expect(data).toEqual(prevData);
      expect(data).toBe(prevData); // Should not be referentially equal
    });
  });
});
