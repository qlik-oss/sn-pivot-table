import { addPageToMeasureData, createMeasureData } from "../measure-data";

describe("measure data", () => {
  const qHyperCube = {
    qSize: {
      qcx: 1,
      qcy: 2,
    },
  } as EngineAPI.IHyperCube;

  describe("create", () => {
    test("should return correct data", () => {
      const dataPage = {
        qData: [
          [{}, {}],
          [{}, {}],
        ],
        qArea: { qWidth: 1, qHeight: 2, qLeft: 3, qTop: 4 },
      } as unknown as EngineAPI.INxPivotPage;
      const data = createMeasureData(dataPage, qHyperCube, false);

      expect(data.data).toEqual(dataPage.qData);
      expect(data.data).not.toBe(dataPage.qData); // Should not be referentially equal
      expect(data.size.x).toEqual(qHyperCube.qSize.qcx);
      expect(data.size.y).toEqual(qHyperCube.qSize.qcy);
    });

    test("should return correct data size in snapshot mode", () => {
      const dataPage = {
        qData: [
          [{}, {}],
          [{}, {}],
        ],
        qArea: { qWidth: 1, qHeight: 2, qLeft: 3, qTop: 4 },
      } as unknown as EngineAPI.INxPivotPage;
      const data = createMeasureData(dataPage, qHyperCube, true);

      expect(data.size.x).toEqual(dataPage.qArea.qWidth);
      expect(data.size.y).toEqual(dataPage.qArea.qHeight);
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
      const prevData = createMeasureData(dataPage, qHyperCube, false);

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
      expect(data.size.x).toEqual(qHyperCube.qSize.qcx);
      expect(data.size.y).toEqual(qHyperCube.qSize.qcy);
    });

    test("should fill gaps in data", () => {
      const dataPage = {
        qData: [
          [{}, {}, {}, {}],
          [{}, {}],
        ],
        qArea: { qWidth: 2, qHeight: 2, qLeft: 0, qTop: 0 },
      } as unknown as EngineAPI.INxPivotPage;
      const prevData = createMeasureData(dataPage, qHyperCube, false);

      const nextDataPage = {
        qData: [[{}, {}]],
        qArea: { qWidth: 2, qHeight: 1, qLeft: 2, qTop: 1 },
      } as unknown as EngineAPI.INxPivotPage;

      const data = addPageToMeasureData(prevData, nextDataPage);

      expect(data.data).toEqual([
        [{}, {}, {}, {}],
        [{}, {}, {}, {}],
      ]);
      expect(data.size.x).toEqual(qHyperCube.qSize.qcx);
      expect(data.size.y).toEqual(qHyperCube.qSize.qcy);
    });

    test("should return previous page if qData is an empty array", () => {
      const dataPage = {
        qData: [
          [{}, {}],
          [{}, {}],
        ],
        qArea: { qWidth: 2, qHeight: 2, qLeft: 0, qTop: 0 },
      } as unknown as EngineAPI.INxPivotPage;
      const prevData = createMeasureData(dataPage, qHyperCube, false);

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
