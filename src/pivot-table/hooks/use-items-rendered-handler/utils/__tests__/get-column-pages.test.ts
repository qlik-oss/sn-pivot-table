import {
  ScrollDirection,
  type LayoutService,
  type MeasureData,
  type PageInfo,
  type ViewService,
} from "../../../../../types/types";
import { MIN_BUFFER } from "../../constants";
import getColumnPages from "../get-column-pages";

describe("getColumnPages", () => {
  let measureData: MeasureData;
  let pageInfo: PageInfo;
  let viewService: ViewService;
  let layoutService: LayoutService;
  let scrollDirection: React.MutableRefObject<ScrollDirection>;

  beforeEach(() => {
    pageInfo = { page: 0, rowsPerPage: 10 } as PageInfo;
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

    layoutService = {
      size: {
        x: 1000,
      },
    } as LayoutService;

    scrollDirection = { current: ScrollDirection.None };
  });

  test("should return pages when columns can be merged into a single page", () => {
    viewService.gridColumnStartIndex = 3;
    viewService.gridRowStartIndex = 0;
    viewService.gridWidth = 4;
    viewService.gridHeight = measureData.length;
    const pages = getColumnPages({ measureData, pageInfo, viewService, scrollDirection, layoutService });

    expect(pages).toEqual([
      { qLeft: 5, qTop: 0, qWidth: 12, qHeight: 5 }, // min buffer
      { qLeft: 17, qTop: 0, qWidth: 25, qHeight: 5 }, // max buffer
    ]);
  });

  test("should return pages when columns can not be merged into a single page", () => {
    measureData = [
      [{}, {}, undefined, {}, {}],
      [{}, {}, undefined, {}, {}],
      [{}, {}, undefined, {}, {}],
      [{}, {}, undefined, {}, {}],
      [{}, {}, undefined, {}, {}],
    ] as MeasureData;
    viewService.gridColumnStartIndex = 0;
    viewService.gridRowStartIndex = 0;
    viewService.gridWidth = measureData[0].length + 1;
    viewService.gridHeight = measureData.length;
    const pages = getColumnPages({ measureData, pageInfo, viewService, scrollDirection, layoutService });

    expect(pages).toEqual([
      { qLeft: 2, qTop: 0, qWidth: 1, qHeight: 5 }, // missing column
      { qLeft: 5, qTop: 0, qWidth: 11, qHeight: 5 }, // min buffer
      { qLeft: 16, qTop: 0, qWidth: 25, qHeight: 5 }, // max buffer
    ]);
  });

  test("should return pages when measure data is empty", () => {
    measureData = [];
    viewService.gridColumnStartIndex = 0;
    viewService.gridRowStartIndex = 0;
    viewService.gridWidth = 5;
    viewService.gridHeight = 5;
    const pages = getColumnPages({ measureData, pageInfo, viewService, scrollDirection, layoutService });

    expect(pages).toEqual([
      { qLeft: 0, qTop: 0, qWidth: 15, qHeight: 5 }, // min buffer
      { qLeft: 15, qTop: 0, qWidth: 25, qHeight: 5 }, // max buffer
    ]);
  });

  test("should return empty array when there are no missing columns", () => {
    measureData = Array.from({ length: 5 }, () => Array.from({ length: MIN_BUFFER + 5 }, () => ({}))) as MeasureData;
    viewService.gridColumnStartIndex = 0;
    viewService.gridRowStartIndex = 0;
    viewService.gridWidth = 5;
    viewService.gridHeight = 5;
    const pages = getColumnPages({ measureData, pageInfo, viewService, scrollDirection, layoutService });

    expect(pages).toEqual([]);
  });
});
