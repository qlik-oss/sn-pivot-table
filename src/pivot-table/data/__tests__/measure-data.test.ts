import { createMeasureData, addPageToMeasureData } from '../measure-data';

describe('measure data', () => {
  describe('create', () => {
    test('should return correct data', () => {
      const dataPage = {
        qData: [
          [{}, {}],
          [{}, {}]
        ],
        qArea: { qWidth: 1, qHeight: 2, qLeft: 3, qTop: 4 }
      } as unknown as EngineAPI.INxPivotPage;
      const data = createMeasureData(dataPage, false);

      expect(data.data).toEqual(dataPage.qData);
      expect(data.data).not.toBe(dataPage.qData); // Should not be referentially equal
      expect(data.size.x).toEqual(dataPage.qArea.qWidth + dataPage.qArea.qLeft);
      expect(data.size.y).toEqual(dataPage.qArea.qHeight + dataPage.qArea.qTop);
    });

    test('should return correct data size in snapshot mode', () => {
      const dataPage = {
        qData: [
          [{}, {}],
          [{}, {}]
        ],
        qArea: { qWidth: 1, qHeight: 2, qLeft: 3, qTop: 4 }
      } as unknown as EngineAPI.INxPivotPage;
      const data = createMeasureData(dataPage, true);

      expect(data.size.x).toEqual(dataPage.qArea.qWidth);
      expect(data.size.y).toEqual(dataPage.qArea.qHeight);
    });
  });

  describe('add page to data', () => {
    test('should add page to data', () => {
      const dataPage = {
        qData: [
          [{}, {}],
          [{}, {}]
        ],
        qArea: { qWidth: 2, qHeight: 2, qLeft: 0, qTop: 0 }
      } as unknown as EngineAPI.INxPivotPage;
      const prevData = createMeasureData(dataPage, false);

      const nextDataPage = {
        qData: [
          [{}, {}],
          [{}, {}],
        ],
        qArea: { qWidth: 2, qHeight: 2, qLeft: 2, qTop: 0 }
      } as unknown as EngineAPI.INxPivotPage;

      const data = addPageToMeasureData(prevData, nextDataPage);

      expect(data.data).toEqual([
        [{}, {}, {}, {}],
        [{}, {}, {}, {}],
      ]);
      expect(data.size.x).toEqual(nextDataPage.qArea.qWidth + nextDataPage.qArea.qLeft);
      expect(data.size.y).toEqual(nextDataPage.qArea.qHeight + nextDataPage.qArea.qTop);
    });

    test('should fill gaps in data', () => {
      const dataPage = {
        qData: [
          [{}, {}, {}, {}],
          [{}, {}]
        ],
        qArea: { qWidth: 2, qHeight: 2, qLeft: 0, qTop: 0 }
      } as unknown as EngineAPI.INxPivotPage;
      const prevData = createMeasureData(dataPage, false);

      const nextDataPage = {
        qData: [
          [{}, {}],
        ],
        qArea: { qWidth: 2, qHeight: 1, qLeft: 2, qTop: 1 }
      } as unknown as EngineAPI.INxPivotPage;

      const data = addPageToMeasureData(prevData, nextDataPage);

      expect(data.data).toEqual([
        [{}, {}, {}, {}],
        [{}, {}, {}, {}],
      ]);
      expect(data.size.x).toEqual(nextDataPage.qArea.qWidth + nextDataPage.qArea.qLeft);
      expect(data.size.y).toEqual(nextDataPage.qArea.qHeight + nextDataPage.qArea.qTop);
    });

    test('should return previous page if qData is an empty array', () => {
      const dataPage = {
        qData: [
          [{}, {}],
          [{}, {}]
        ],
        qArea: { qWidth: 2, qHeight: 2, qLeft: 0, qTop: 0 }
      } as unknown as EngineAPI.INxPivotPage;
      const prevData = createMeasureData(dataPage, false);

      const nextDataPage = {
        qData: [],
        qArea: { qWidth: 0, qHeight: 0, qLeft: 0, qTop: 0 }
      } as unknown as EngineAPI.INxPivotPage;

      const data = addPageToMeasureData(prevData, nextDataPage);

      expect(data.data).toEqual(prevData.data);
      expect(data.data).toBe(prevData.data); // Should not be referentially equal
    });

    test('should compare size with previous data and return the largest value', () => {
      const dataPage = {
        qData: [
          [{}, {}],
          [{}, {}]
        ],
        qArea: { qWidth: 20, qHeight: 20, qLeft: 0, qTop: 0 }
      } as unknown as EngineAPI.INxPivotPage;
      const prevData = createMeasureData(dataPage, false);

      const nextDataPage = {
        qData: [
          [{}, {}],
          [{}, {}],
        ],
        qArea: { qWidth: 2, qHeight: 2, qLeft: 2, qTop: 2 }
      } as unknown as EngineAPI.INxPivotPage;

      const data = addPageToMeasureData(prevData, nextDataPage);

      expect(data.size.x).toEqual(prevData.size.x);
      expect(data.size.y).toEqual(prevData.size.y);
    });
  });
});
