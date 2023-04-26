import { act, renderHook } from "@testing-library/react";
import { SnapshotData } from "../../../types/QIX";
import { HeadersData, LeftDimensionData, MeasureData, TopDimensionData } from "../../../types/types";
import createHeadersData from "../../data/headers-data";
import { addPageToLeftDimensionData, createLeftDimensionData } from "../../data/left-dimension-data";
import { addPageToMeasureData, createMeasureData } from "../../data/measure-data";
import { addPageToTopDimensionData, createTopDimensionData } from "../../data/top-dimension-data";
import useData from "../use-data";

jest.mock("../../data/top-dimension-data");
jest.mock("../../data/measure-data");
jest.mock("../../data/left-dimension-data");
jest.mock("../../data/headers-data");

describe("useData", () => {
  // Top data mockes
  let mockedAddPageToTopDimensionData: jest.MockedFunction<
    (prevData: TopDimensionData, nextDataPage: EngineAPI.INxPivotPage) => TopDimensionData
  >;
  let mockedCreateTopDimensionData: jest.MockedFunction<
    (dataPage: EngineAPI.INxPivotPage, qHyperCube: EngineAPI.IHyperCube, isSnapshot: boolean) => TopDimensionData
  >;
  // Measure data mocks
  let mockedAddPageToMeasureData: jest.MockedFunction<
    (prevData: MeasureData, nextDataPage: EngineAPI.INxPivotPage) => MeasureData
  >;
  let mockedCreateMeasureData: jest.MockedFunction<
    (dataPage: EngineAPI.INxPivotPage, qHyperCube: EngineAPI.IHyperCube, isSnapshot: boolean) => MeasureData
  >;
  // Left data mocks
  let mockedAddPageToLeftDimensionData: jest.MockedFunction<
    (prevData: LeftDimensionData, nextDataPage: EngineAPI.INxPivotPage) => LeftDimensionData
  >;
  let mockedCreateLeftDimensionData: jest.MockedFunction<
    (dataPage: EngineAPI.INxPivotPage, qHyperCube: EngineAPI.IHyperCube, isSnapshot: boolean) => LeftDimensionData
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
  let snapshotData: SnapshotData | undefined;

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

    leftDimensionData = {
      grid: [{}],
      dimensionInfoIndexMap: [0, 1, 2],
      size: { x: 3, y: 4 },
      qSize: { qcx: 3, qcy: 4 },
    } as LeftDimensionData;

    topDimensionData = {
      grid: [{}],
      dimensionInfoIndexMap: [0, 1, 2],
      size: { x: 3, y: 4 },
      qSize: { qcx: 3, qcy: 4 },
    } as TopDimensionData;

    measureData = {
      size: { x: 3, y: 4 },
    } as MeasureData;

    headersData = {
      data: [["value"]],
      size: { x: 3, y: 4 },
    } as HeadersData;

    mockedAddPageToTopDimensionData.mockReturnValue(topDimensionData);
    mockedCreateTopDimensionData.mockReturnValue(topDimensionData);

    mockedAddPageToMeasureData.mockReturnValue(measureData);
    mockedCreateMeasureData.mockReturnValue(measureData);

    mockedAddPageToLeftDimensionData.mockReturnValue(leftDimensionData);
    mockedCreateLeftDimensionData.mockReturnValue(leftDimensionData);

    mockedCreateHeadersData.mockReturnValue(headersData);

    qPivotDataPages = [{} as EngineAPI.INxPivotPage];
    qHyperCube = {
      qPivotDataPages: [],
      qSize: { qcx: 10, qcy: 20 },
    } as unknown as EngineAPI.IHyperCube;
    snapshotData = {} as SnapshotData;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should return data", () => {
    const { result } = renderHook(() => useData(qPivotDataPages, qHyperCube, snapshotData));

    expect(result.current.headersData).toBe(headersData);
    expect(result.current.measureData).toBe(measureData);
    expect(result.current.topDimensionData).toBe(topDimensionData);
    expect(result.current.leftDimensionData).toBe(leftDimensionData);
  });

  test("calling nextPageHandler should trigger data updates", () => {
    const { result } = renderHook(() => useData(qPivotDataPages, qHyperCube, snapshotData));
    const nextPage = {} as EngineAPI.INxPivotPage;

    act(() => {
      result.current.nextPageHandler(nextPage);
    });

    expect(mockedAddPageToTopDimensionData).toHaveBeenCalledWith(topDimensionData, nextPage);
    expect(mockedAddPageToLeftDimensionData).toHaveBeenCalledWith(leftDimensionData, nextPage);
    expect(mockedAddPageToMeasureData).toHaveBeenCalledWith(measureData, nextPage);
  });
});
