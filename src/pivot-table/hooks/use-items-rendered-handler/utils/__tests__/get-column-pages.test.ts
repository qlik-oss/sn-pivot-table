import type { MeasureData, PageInfo } from "../../../../../types/types";
import getColumnPages from "../get-column-pages";

describe("getColumnPages", () => {
  let measureData: MeasureData;
  let pageInfo: PageInfo;

  beforeEach(() => {
    pageInfo = { page: 0, rowsPerPage: 10 } as PageInfo;
    measureData = [
      [{}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}],
    ] as MeasureData;
  });

  test("should return pages when columns can be merged into a single page", () => {
    const x = 3;
    const y = 0;
    const width = 4;
    const height = measureData.length;
    const pages = getColumnPages(pageInfo, measureData, x, y, width, height);

    expect(pages).toEqual([{ qLeft: 5, qTop: 0, qHeight: 5, qWidth: 2 }]);
  });

  test("should return pages when columns can not be merged into a single page", () => {
    measureData = [
      [{}, {}, undefined, {}, {}],
      [{}, {}, undefined, {}, {}],
      [{}, {}, undefined, {}, {}],
      [{}, {}, undefined, {}, {}],
      [{}, {}, undefined, {}, {}],
    ] as MeasureData;
    const x = 0;
    const y = 0;
    const width = measureData[0].length + 1;
    const height = measureData.length;
    const pages = getColumnPages(pageInfo, measureData, x, y, width, height);

    expect(pages).toEqual([
      { qLeft: 2, qTop: 0, qHeight: 5, qWidth: 1 },
      { qLeft: 5, qTop: 0, qHeight: 5, qWidth: 1 },
    ]);
  });

  test("should return pages when measure data is empty", () => {
    measureData = [];
    const x = 0;
    const y = 0;
    const width = 5;
    const height = 5;
    const pages = getColumnPages(pageInfo, measureData, x, y, width, height);

    expect(pages).toEqual([{ qLeft: 0, qTop: 0, qHeight: 5, qWidth: 5 }]);
  });

  test("should return empty array when there are no missing columns", () => {
    const x = 0;
    const y = 0;
    const width = measureData[0].length;
    const height = measureData.length;
    const pages = getColumnPages(pageInfo, measureData, x, y, width, height);

    expect(pages).toEqual([]);
  });
});
