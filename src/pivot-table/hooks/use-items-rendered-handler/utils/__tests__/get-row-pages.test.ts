import type { MeasureData, PageInfo } from "../../../../../types/types";
import getRowPages from "../get-row-pages";

describe("getRowPages", () => {
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

  test("should return pages when rows can be merged into a single page", () => {
    const x = 0;
    const y = 3;
    const width = measureData[0].length;
    const height = 4;
    const pages = getRowPages(pageInfo, measureData, x, y, width, height);

    expect(pages).toEqual([{ qLeft: 0, qTop: 5, qHeight: 2, qWidth: 5 }]);
  });

  test("should return pages when rows can not be merged into a single page", () => {
    measureData = [
      [{}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}],
      [],
      [{}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}],
    ] as MeasureData;
    const x = 0;
    const y = 0;
    const width = measureData[0].length;
    const height = measureData.length + 1;
    const pages = getRowPages(pageInfo, measureData, x, y, width, height);

    expect(pages).toEqual([
      { qLeft: 0, qTop: 2, qHeight: 1, qWidth: 5 },
      { qLeft: 0, qTop: 5, qHeight: 1, qWidth: 5 },
    ]);
  });

  test("should return pages when measure data is empty", () => {
    measureData = [];
    const x = 0;
    const y = 0;
    const width = 5;
    const height = 5;
    const pages = getRowPages(pageInfo, measureData, x, y, width, height);

    expect(pages).toEqual([{ qLeft: 0, qTop: 0, qHeight: 5, qWidth: 5 }]);
  });

  test("should return empty array when there are no missing rows", () => {
    const x = 0;
    const y = 0;
    const width = measureData[0].length;
    const height = measureData.length;
    const pages = getRowPages(pageInfo, measureData, x, y, width, height);

    expect(pages).toEqual([]);
  });
});
