import { renderHook } from "@testing-library/react";
import type { GridOnItemsRenderedProps } from "react-window";
import useItemsRenderedHandler from "..";
import type { DataModel, LayoutService, MeasureData, PageInfo, ViewService } from "../../../../types/types";
import { ScrollDirection } from "../../../../types/types";
import { debouncedFetchPages, throttledFetchPages } from "../utils/fetch-pages";

jest.mock("../utils/fetch-pages");
const mockedThrottledFetchPages = throttledFetchPages as jest.MockedFunction<typeof throttledFetchPages>;
const mockedDebouncedFetchPages = debouncedFetchPages as jest.MockedFunction<typeof debouncedFetchPages>;

describe("useItemsRenderedHandler", () => {
  let viewService: ViewService;
  let layoutService: LayoutService;
  let dataModel: DataModel;
  let measureData: MeasureData;
  let pageInfo: PageInfo;
  let leftColumnCount: number;
  let topRowCount: number;
  let verticalScrollDirection: React.MutableRefObject<ScrollDirection>;
  let horizontalScrollDirection: React.MutableRefObject<ScrollDirection>;

  beforeEach(() => {
    viewService = {} as ViewService;
    layoutService = {} as LayoutService;
    measureData = {} as MeasureData;
    dataModel = {} as DataModel;
    pageInfo = {} as PageInfo;
    leftColumnCount = 1;
    topRowCount = 1;
    verticalScrollDirection = { current: ScrollDirection.None };
    horizontalScrollDirection = { current: ScrollDirection.None };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should call throttled page fetch", async () => {
    const { result } = renderHook(() =>
      useItemsRenderedHandler({
        viewService,
        dataModel,
        measureData,
        layoutService,
        pageInfo,
        leftColumnCount,
        topRowCount,
        verticalScrollDirection,
        horizontalScrollDirection,
      }),
    );

    await result.current({
      overscanColumnStartIndex: 0,
      overscanColumnStopIndex: 10,
      overscanRowStartIndex: 0,
      overscanRowStopIndex: 20,
      visibleColumnStartIndex: 0,
    } as GridOnItemsRenderedProps);

    expect(mockedThrottledFetchPages).toHaveBeenCalled();
  });

  test("should call debounced page fetch when grid height and width is above the threshold", async () => {
    const { result } = renderHook(() =>
      useItemsRenderedHandler({
        viewService,
        dataModel,
        measureData,
        layoutService,
        pageInfo,
        leftColumnCount,
        topRowCount,
        verticalScrollDirection,
        horizontalScrollDirection,
      }),
    );

    await result.current({
      overscanColumnStartIndex: 0,
      overscanColumnStopIndex: 50,
      overscanRowStartIndex: 0,
      overscanRowStopIndex: 50,
      visibleColumnStartIndex: 0,
    } as GridOnItemsRenderedProps);

    expect(mockedDebouncedFetchPages).toHaveBeenCalled();
  });

  test("should call debounced page fetch when top and left count plus buffer is above the threshold", async () => {
    // Get 39*39 in estimated width * height to get above the threshold
    leftColumnCount = 9;
    topRowCount = 9;
    verticalScrollDirection.current = ScrollDirection.Forward;
    horizontalScrollDirection.current = ScrollDirection.Forward;

    const { result } = renderHook(() =>
      useItemsRenderedHandler({
        viewService,
        dataModel,
        measureData,
        layoutService,
        pageInfo,
        leftColumnCount,
        topRowCount,
        verticalScrollDirection,
        horizontalScrollDirection,
      }),
    );

    await result.current({
      overscanColumnStartIndex: 0,
      overscanColumnStopIndex: 20,
      overscanRowStartIndex: 0,
      overscanRowStopIndex: 20,
      visibleColumnStartIndex: 0,
    } as GridOnItemsRenderedProps);

    expect(mockedDebouncedFetchPages).toHaveBeenCalled();
  });
});
