import * as nebula from "@nebula.js/stardust";
import { act, renderHook } from "@testing-library/react";
import React from "react";
import type { PageInfo } from "../../../hooks/use-pivot-table";
import type {
  HeadersData,
  LayoutService,
  LeftDimensionData,
  MeasureData,
  TopDimensionData,
} from "../../../types/types";
import createHeadersData from "../headers-data";
import {
  addPageToLeftDimensionData,
  createLeftDimensionData,
  type AddPageToLeftDimensionDataProps,
} from "../left-dimension-data";
import { addPageToMeasureData, createMeasureData, type AddPageToMeasureDataProps } from "../measure-data";
import {
  addPageToTopDimensionData,
  createTopDimensionData,
  type AddPageToTopDimensionDataProps,
} from "../top-dimension-data";
import { usePVData } from "../use-pv-data";

jest.mock("@nebula.js/stardust", () => ({
  __esModule: true,
  useState: () => {},
  useEffect: () => {},
  useMemo: () => {},
}));
jest.mock("../top-dimension-data");
jest.mock("../measure-data");
jest.mock("../left-dimension-data");
jest.mock("../headers-data");

describe("usePvData", () => {
  // Top data mockes
  let mockedAddPageToTopDimensionData: jest.MockedFunction<(args: AddPageToTopDimensionDataProps) => TopDimensionData>;
  let mockedCreateTopDimensionData: jest.MockedFunction<
    (dataPage: EngineAPI.INxPivotPage, layoutService: LayoutService) => TopDimensionData
  >;
  // Measure data mocks
  let mockedAddPageToMeasureData: jest.MockedFunction<(args: AddPageToMeasureDataProps) => MeasureData>;
  let mockedCreateMeasureData: jest.MockedFunction<(dataPage: EngineAPI.INxPivotPage) => MeasureData>;
  // Left data mocks
  let mockedAddPageToLeftDimensionData: jest.MockedFunction<
    (args: AddPageToLeftDimensionDataProps) => LeftDimensionData
  >;
  let mockedCreateLeftDimensionData: jest.MockedFunction<
    (dataPage: EngineAPI.INxPivotPage, layoutService: LayoutService, pageInfo: PageInfo) => LeftDimensionData
  >;
  // Header data mocks
  let mockedCreateHeadersData: jest.MockedFunction<
    (qHyperCube: EngineAPI.IHyperCube, rowCount: number, dimensionInfoIndexMap: number[]) => HeadersData
  >;

  let topDimensionData: TopDimensionData;
  let leftDimensionData: LeftDimensionData;
  let measureData: MeasureData;
  let headersData: HeadersData;

  let qPivotDataPages: EngineAPI.INxPivotPage[];
  let qHyperCube: EngineAPI.IHyperCube;
  let layoutService: LayoutService;
  let pageInfo: PageInfo;

  beforeEach(() => {
    mockedAddPageToTopDimensionData = addPageToTopDimensionData as jest.MockedFunction<
      typeof addPageToTopDimensionData
    >;
    mockedCreateTopDimensionData = createTopDimensionData as jest.MockedFunction<typeof createTopDimensionData>;

    mockedAddPageToMeasureData = addPageToMeasureData as jest.MockedFunction<typeof addPageToMeasureData>;
    mockedCreateMeasureData = createMeasureData as jest.MockedFunction<typeof createMeasureData>;

    mockedAddPageToLeftDimensionData = addPageToLeftDimensionData as jest.MockedFunction<
      typeof addPageToLeftDimensionData
    >;
    mockedCreateLeftDimensionData = createLeftDimensionData as jest.MockedFunction<typeof createLeftDimensionData>;

    mockedCreateHeadersData = createHeadersData as jest.MockedFunction<typeof createHeadersData>;

    qPivotDataPages = [{} as EngineAPI.INxPivotPage];
    qHyperCube = {
      qPivotDataPages: [],
      qSize: { qcx: 10, qcy: 20 },
    } as unknown as EngineAPI.IHyperCube;

    layoutService = {
      layout: {
        qHyperCube,
      },
      size: { x: 3, y: 4 },
    } as LayoutService;

    leftDimensionData = {
      grid: [{}],
      dimensionInfoIndexMap: [0, 1, 2],
      columnCount: 3,
      layoutSize: layoutService.size,
    } as LeftDimensionData;

    topDimensionData = {
      grid: [{}],
      dimensionInfoIndexMap: [0, 1, 2],
      rowCount: 4,
      layoutSize: layoutService.size,
    } as TopDimensionData;

    headersData = {
      data: [["value"]],
      size: { x: 3, y: 4 },
    } as HeadersData;

    pageInfo = {
      currentPage: 0,
      rowsPerPage: 50,
    } as PageInfo;

    mockedAddPageToTopDimensionData.mockReturnValue(topDimensionData);
    mockedCreateTopDimensionData.mockReturnValue(topDimensionData);

    mockedAddPageToMeasureData.mockReturnValue(measureData);
    mockedCreateMeasureData.mockReturnValue(measureData);

    mockedAddPageToLeftDimensionData.mockReturnValue(leftDimensionData);
    mockedCreateLeftDimensionData.mockReturnValue(leftDimensionData);

    mockedCreateHeadersData.mockReturnValue(headersData);

    jest.spyOn(nebula, "useEffect").mockImplementation(React.useEffect);
    jest.spyOn(nebula, "useMemo").mockImplementation(React.useMemo);
    jest.spyOn(nebula, "useState").mockImplementation(React.useState);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test("should return data", () => {
    const {
      result: { current: result },
    } = renderHook(() => usePVData({ qPivotDataPages, layoutService, pageInfo }));

    expect(result.headersData).toBe(headersData);
    expect(result.measureData).toBe(measureData);
    expect(result.topDimensionData).toBe(topDimensionData);
    expect(result.leftDimensionData).toBe(leftDimensionData);
  });

  test("calling nextPageHandler should trigger data updates", () => {
    const {
      result: { current: result },
    } = renderHook(() => usePVData({ qPivotDataPages, layoutService, pageInfo }));
    const nextPage = {} as EngineAPI.INxPivotPage;

    act(() => {
      result.nextPageHandler(nextPage);
    });

    expect(mockedAddPageToTopDimensionData).toHaveBeenCalledWith({
      prevData: topDimensionData,
      nextDataPage: nextPage,
    });
    expect(mockedAddPageToLeftDimensionData).toHaveBeenCalledWith({
      prevData: leftDimensionData,
      nextDataPage: nextPage,
      pageInfo,
    });
    expect(mockedAddPageToMeasureData).toHaveBeenCalledWith({
      prevData: measureData,
      nextDataPage: nextPage,
      pageInfo,
    });
  });
});
