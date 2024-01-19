import { ScrollDirection, type MeasureData, type PageInfo, type ViewService } from "../../../../../types/types";
import { MIN_BUFFER } from "../../constants";
import getRowPages, { getMinBufferArea } from "../get-row-pages";

describe("getRowPages", () => {
  let measureData: MeasureData;
  let pageInfo: PageInfo;
  let viewService: ViewService;
  let scrollDirection: React.MutableRefObject<ScrollDirection>;

  beforeEach(() => {
    pageInfo = { page: 0, rowsPerPage: 1000, rowsOnCurrentPage: 1000 } as PageInfo;

    measureData = [
      [{}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}],
    ] as MeasureData;

    viewService = {
      gridColumnStartIndex: 0,
      gridRowStartIndex: 0,
      gridWidth: 0,
      gridHeight: 0,
    };

    scrollDirection = { current: ScrollDirection.None };
  });

  describe("getMinBufferArea", () => {
    test("should add backward buffer", () => {
      scrollDirection.current = ScrollDirection.Backward;
      viewService.gridRowStartIndex = 50;
      const area = getMinBufferArea(pageInfo, viewService, scrollDirection);

      expect(area).toEqual({ startTop: 40, endTop: 50, qLeft: 0, qWidth: 0 });
    });

    test("backward buffer should not cause negative start top index", () => {
      scrollDirection.current = ScrollDirection.Backward;
      viewService.gridRowStartIndex = 5;
      const area = getMinBufferArea(pageInfo, viewService, scrollDirection);

      expect(area).toEqual({ startTop: 0, endTop: 10, qLeft: 0, qWidth: 0 });
    });

    test("forward buffer should not exceed rowsOnCurrentPage", () => {
      scrollDirection.current = ScrollDirection.Forward;
      pageInfo.rowsOnCurrentPage = 100;
      viewService.gridRowStartIndex = pageInfo.rowsOnCurrentPage - 1;
      const area = getMinBufferArea(pageInfo, viewService, scrollDirection);

      expect(area).toEqual({ startTop: 99, endTop: 100, qLeft: 0, qWidth: 0 });
    });
  });

  test("should return pages when rows can be merged into a single page", () => {
    viewService.gridColumnStartIndex = 0;
    viewService.gridRowStartIndex = 3;
    viewService.gridWidth = measureData[0].length;
    viewService.gridHeight = 4;
    const pages = getRowPages({ pageInfo, measureData, viewService, scrollDirection });

    expect(pages).toEqual([
      { qLeft: 0, qTop: 5, qWidth: 5, qHeight: 12 }, // min buffer
      { qLeft: 0, qTop: 17, qWidth: 5, qHeight: 25 }, // max buffer
    ]);
  });

  test("should return pages when rows can not be merged into a single page", () => {
    measureData = [
      [{}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}],
      [],
      [{}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}],
    ] as MeasureData;
    viewService.gridColumnStartIndex = 0;
    viewService.gridRowStartIndex = 0;
    viewService.gridWidth = measureData[0].length;
    viewService.gridHeight = measureData.length + 1;
    const pages = getRowPages({ pageInfo, measureData, viewService, scrollDirection });

    expect(pages).toEqual([
      { qLeft: 0, qTop: 2, qWidth: 5, qHeight: 1 }, // missing row
      { qLeft: 0, qTop: 5, qWidth: 5, qHeight: 11 }, // min buffer
      { qLeft: 0, qTop: 16, qWidth: 5, qHeight: 25 }, // max buffer
    ]);
  });

  test("should return pages when measure data is empty", () => {
    measureData = [];
    viewService.gridColumnStartIndex = 0;
    viewService.gridRowStartIndex = 0;
    viewService.gridWidth = 5;
    viewService.gridHeight = 5;
    const pages = getRowPages({ pageInfo, measureData, viewService, scrollDirection });

    expect(pages).toEqual([
      { qLeft: 0, qTop: 0, qWidth: 5, qHeight: 15 }, // min buffer
      { qLeft: 0, qTop: 15, qWidth: 5, qHeight: 25 }, // max buffer
    ]);
  });

  test("should return empty array when there are no missing rows", () => {
    measureData = Array.from({ length: MIN_BUFFER + 5 }, () => [{}, {}, {}, {}, {}]) as MeasureData;

    viewService.gridColumnStartIndex = 0;
    viewService.gridRowStartIndex = 0;
    viewService.gridWidth = 5;
    viewService.gridHeight = 5;
    const pages = getRowPages({ pageInfo, measureData, viewService, scrollDirection });

    expect(pages).toEqual([]);
  });
});
