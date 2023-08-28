import { act, renderHook } from "@testing-library/react";
import type {
  HeadersData,
  LayoutService,
  LeftDimensionData,
  MeasureData,
  PageInfo,
  TopDimensionData,
  VisibleDimensionInfo,
} from "../../../types/types";
import createHeadersData from "../../data/headers-data";
import {
  addPageToLeftDimensionData,
  createLeftDimensionData,
  type AddPageToLeftDimensionDataProps,
} from "../../data/left-dimension-data";
import { addPageToMeasureData, createMeasureData, type AddPageToMeasureDataProps } from "../../data/measure-data";
import {
  addPageToTopDimensionData,
  createTopDimensionData,
  type AddPageToTopDimensionDataProps,
} from "../../data/top-dimension-data";
import useData from "../use-data";

jest.mock("../../data/top-dimension-data");
jest.mock("../../data/measure-data");
jest.mock("../../data/left-dimension-data");
jest.mock("../../data/headers-data");

describe("useData", () => {
  // Top data mockes
  let mockedAddPageToTopDimensionData: jest.MockedFunction<(args: AddPageToTopDimensionDataProps) => TopDimensionData>;
  let mockedCreateTopDimensionData: jest.MockedFunction<
    (
      dataPage: EngineAPI.INxPivotPage,
      layoutService: LayoutService,
      visibleTopDimensionInfo: VisibleDimensionInfo[],
    ) => TopDimensionData
  >;
  // Measure data mocks
  let mockedAddPageToMeasureData: jest.MockedFunction<(args: AddPageToMeasureDataProps) => MeasureData>;
  let mockedCreateMeasureData: jest.MockedFunction<
    (dataPage: EngineAPI.INxPivotPage, pageInfo: PageInfo) => MeasureData
  >;
  // Left data mocks
  let mockedAddPageToLeftDimensionData: jest.MockedFunction<
    (args: AddPageToLeftDimensionDataProps) => LeftDimensionData
  >;
  let mockedCreateLeftDimensionData: jest.MockedFunction<
    (
      dataPage: EngineAPI.INxPivotPage,
      layoutService: LayoutService,
      pageInfo: PageInfo,
      visibleLeftDimensionInfo: VisibleDimensionInfo[],
    ) => LeftDimensionData
  >;
  // Header data mocks
  let mockedCreateHeadersData: jest.MockedFunction<
    (rowCount: number, sortedLeftDimensionInfo: VisibleDimensionInfo[]) => HeadersData
  >;

  let topDimensionData: TopDimensionData;
  let leftDimensionData: LeftDimensionData;
  let measureData: MeasureData;
  let headersData: HeadersData;

  let qPivotDataPages: EngineAPI.INxPivotPage[];
  let qHyperCube: EngineAPI.IHyperCube;
  let layoutService: LayoutService;
  let pageInfo: PageInfo;
  let visibleLeftDimensionInfo: VisibleDimensionInfo[];
  let visibleTopDimensionInfo: VisibleDimensionInfo[];

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

    qPivotDataPages = [{}, {}] as EngineAPI.INxPivotPage[];
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
      columnCount: 3,
      layoutSize: layoutService.size,
    } as LeftDimensionData;

    topDimensionData = {
      grid: [{}],
      rowCount: 4,
      layoutSize: layoutService.size,
    } as TopDimensionData;

    headersData = {
      data: [[{ id: "value", title: "value" }]],
      size: { x: 3, y: 4 },
    } as HeadersData;

    pageInfo = {
      currentPage: 0,
      rowsPerPage: 100,
    } as PageInfo;

    visibleLeftDimensionInfo = [];
    visibleTopDimensionInfo = [];

    mockedAddPageToTopDimensionData.mockReturnValue(topDimensionData);
    mockedCreateTopDimensionData.mockReturnValue(topDimensionData);

    mockedAddPageToMeasureData.mockReturnValue(measureData);
    mockedCreateMeasureData.mockReturnValue(measureData);

    mockedAddPageToLeftDimensionData.mockReturnValue(leftDimensionData);
    mockedCreateLeftDimensionData.mockReturnValue(leftDimensionData);

    mockedCreateHeadersData.mockReturnValue(headersData);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should return data", () => {
    const { result } = renderHook(() =>
      useData(qPivotDataPages, layoutService, pageInfo, visibleLeftDimensionInfo, visibleTopDimensionInfo),
    );

    expect(result.current.headersData).toBe(headersData);
    expect(result.current.measureData).toBe(measureData);
    expect(result.current.topDimensionData).toBe(topDimensionData);
    expect(result.current.leftDimensionData).toBe(leftDimensionData);
  });

  test("calling nextPageHandler should trigger data updates", () => {
    const { result } = renderHook(() =>
      useData(qPivotDataPages, layoutService, pageInfo, visibleLeftDimensionInfo, visibleTopDimensionInfo),
    );
    const nextPage = {} as EngineAPI.INxPivotPage;

    act(() => {
      result.current.nextPageHandler(nextPage);
    });

    expect(mockedAddPageToTopDimensionData).toHaveBeenCalledWith({
      prevData: topDimensionData,
      nextDataPage: nextPage,
      layoutService,
      visibleTopDimensionInfo,
    });
    expect(mockedAddPageToLeftDimensionData).toHaveBeenCalledWith({
      prevData: leftDimensionData,
      nextDataPage: nextPage,
      pageInfo,
      layoutService,
      visibleLeftDimensionInfo,
    });
    expect(mockedAddPageToMeasureData).toHaveBeenCalledWith({
      prevData: measureData,
      nextDataPage: nextPage,
      pageInfo,
    });
  });
});
