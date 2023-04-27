import { LayoutService } from "../../../types/types";
import { addPageToMeasureData, createMeasureData } from "../measure-data";

describe("measure data", () => {
  const qHyperCube = {
    qSize: {
      qcx: 1,
      qcy: 2,
    },
  } as EngineAPI.IHyperCube;
  const layoutService: LayoutService = {
    size: {
      x: 1,
      y: 2,
    },
    layout: {
      qHyperCube,
    },
  } as LayoutService;

  describe("create", () => {
    test("should return correct data", () => {
      const dataPage = {
        qData: [
          [{}, {}],
          [{}, {}],
        ],
        qArea: { qWidth: 1, qHeight: 2, qLeft: 3, qTop: 4 },
      } as unknown as EngineAPI.INxPivotPage;
      const data = createMeasureData(dataPage, layoutService);

      expect(data.data).toEqual(dataPage.qData);
      expect(data.data).not.toBe(dataPage.qData); // Should not be referentially equal
      expect(data.size).toBe(layoutService.size);
    });

    test("should return correct data size in snapshot mode", () => {
      const dataPage = {
        qData: [
          [{}, {}],
          [{}, {}],
        ],
        qArea: { qWidth: 1, qHeight: 2, qLeft: 3, qTop: 4 },
      } as unknown as EngineAPI.INxPivotPage;
      const data = createMeasureData(dataPage, layoutService);

      expect(data.size).toBe(layoutService.size);
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
      const prevData = createMeasureData(dataPage, layoutService);

      const nextDataPage = {
        qData: [
          [{}, {}],
          [{}, {}],
        ],
        qArea: { qWidth: 2, qHeight: 2, qLeft: 2, qTop: 0 },
      } as unknown as EngineAPI.INxPivotPage;

      const data = addPageToMeasureData(prevData, nextDataPage);

      expect(data.data).toEqual([
        [{}, {}, {}, {}],
        [{}, {}, {}, {}],
      ]);
      expect(data.size).toBe(layoutService.size);
    });

    test("should fill gaps in data", () => {
      const dataPage = {
        qData: [
          [{}, {}, {}, {}],
          [{}, {}],
        ],
        qArea: { qWidth: 2, qHeight: 2, qLeft: 0, qTop: 0 },
      } as unknown as EngineAPI.INxPivotPage;
      const prevData = createMeasureData(dataPage, layoutService);

      const nextDataPage = {
        qData: [[{}, {}]],
        qArea: { qWidth: 2, qHeight: 1, qLeft: 2, qTop: 1 },
      } as unknown as EngineAPI.INxPivotPage;

      const data = addPageToMeasureData(prevData, nextDataPage);

      expect(data.data).toEqual([
        [{}, {}, {}, {}],
        [{}, {}, {}, {}],
      ]);
      expect(data.size).toBe(layoutService.size);
    });

    test("should return previous page if qData is an empty array", () => {
      const dataPage = {
        qData: [
          [{}, {}],
          [{}, {}],
        ],
        qArea: { qWidth: 2, qHeight: 2, qLeft: 0, qTop: 0 },
      } as unknown as EngineAPI.INxPivotPage;
      const prevData = createMeasureData(dataPage, layoutService);

      const nextDataPage = {
        qData: [],
        qArea: { qWidth: 0, qHeight: 0, qLeft: 0, qTop: 0 },
      } as unknown as EngineAPI.INxPivotPage;

      const data = addPageToMeasureData(prevData, nextDataPage);

      expect(data.data).toEqual(prevData.data);
      expect(data.data).toBe(prevData.data); // Should not be referentially equal
    });
  });
});
