import type { DataModel, LayoutService, MeasureData, PageInfo, ViewService } from "../../../../../types/types";
import { ScrollDirection } from "../../../../../types/types";
import { MIN_BUFFER, fetchPages } from "../fetch-pages";
import getColumnPages from "../get-column-pages";
import getRowPages from "../get-row-pages";

jest.mock("../get-row-pages");
jest.mock("../get-column-pages");
const mockedGetRowPages = getRowPages as jest.MockedFunction<typeof getRowPages>;
const mockedGetColumnPages = getColumnPages as jest.MockedFunction<typeof getColumnPages>;

describe("fetchPages", () => {
  let dataModel: DataModel;
  let layoutService: LayoutService;
  let measureData: MeasureData;
  let pageInfo: PageInfo;
  let viewService: ViewService;
  let verticalScrollDirection: React.MutableRefObject<ScrollDirection>;
  let horizontalScrollDirection: React.MutableRefObject<ScrollDirection>;

  beforeEach(() => {
    dataModel = {
      fetchPages: jest.fn().mockResolvedValue([]),
    } as unknown as DataModel;

    layoutService = {
      size: { x: 100, y: 200 },
    } as LayoutService;

    measureData = [];
    pageInfo = {} as PageInfo;
    viewService = {
      gridColumnStartIndex: 0,
      gridRowStartIndex: 1,
      gridWidth: 2,
      gridHeight: 3,
    };
    verticalScrollDirection = { current: ScrollDirection.None };
    horizontalScrollDirection = { current: ScrollDirection.None };

    mockedGetColumnPages.mockReturnValue([]);
    mockedGetRowPages.mockReturnValue([]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should fetch pages if both scroll directions are None", async () => {
    horizontalScrollDirection.current = ScrollDirection.None;
    verticalScrollDirection.current = ScrollDirection.None;
    mockedGetRowPages.mockReturnValue([{ qLeft: 0, qTop: 0, qWidth: 1, qHeight: 1 }]);
    await fetchPages(
      dataModel,
      layoutService,
      measureData,
      pageInfo,
      viewService,
      verticalScrollDirection,
      horizontalScrollDirection,
    );

    expect(dataModel.fetchPages).toHaveBeenCalledWith([{ qLeft: 0, qTop: 0, qWidth: 1, qHeight: 1 }]);
  });

  test("should fetch both row and column pages", async () => {
    horizontalScrollDirection.current = ScrollDirection.Forward;
    verticalScrollDirection.current = ScrollDirection.Forward;
    mockedGetRowPages.mockReturnValue([{ qLeft: 0, qTop: 0, qWidth: 1, qHeight: 1 }]);
    mockedGetColumnPages.mockReturnValue([{ qLeft: 1, qTop: 1, qWidth: 1, qHeight: 1 }]);

    await fetchPages(
      dataModel,
      layoutService,
      measureData,
      pageInfo,
      viewService,
      verticalScrollDirection,
      horizontalScrollDirection,
    );

    expect(dataModel.fetchPages).toHaveBeenCalledWith([
      { qLeft: 0, qTop: 0, qWidth: 1, qHeight: 1 },
      { qLeft: 1, qTop: 1, qWidth: 1, qHeight: 1 },
    ]);
    expect(mockedGetRowPages).toHaveBeenCalledWith(pageInfo, measureData, 0, 1, 2, 13);
    expect(mockedGetColumnPages).toHaveBeenCalledWith(pageInfo, measureData, 0, 1, 12, 3);
  });

  test("should add backward buffer when resolving pages", async () => {
    viewService.gridColumnStartIndex = 20;
    viewService.gridRowStartIndex = 30;
    horizontalScrollDirection.current = ScrollDirection.Backward;
    verticalScrollDirection.current = ScrollDirection.Backward;

    await fetchPages(
      dataModel,
      layoutService,
      measureData,
      pageInfo,
      viewService,
      verticalScrollDirection,
      horizontalScrollDirection,
    );

    expect(mockedGetRowPages).toHaveBeenCalledWith(pageInfo, measureData, 20, 20, 2, 13);
    expect(mockedGetColumnPages).toHaveBeenCalledWith(pageInfo, measureData, 10, 30, 12, 3);
  });

  test("backward buffer should not cause negative start column/row index", async () => {
    viewService.gridColumnStartIndex = 0;
    viewService.gridRowStartIndex = 0;
    horizontalScrollDirection.current = ScrollDirection.Backward;
    verticalScrollDirection.current = ScrollDirection.Backward;

    await fetchPages(
      dataModel,
      layoutService,
      measureData,
      pageInfo,
      viewService,
      verticalScrollDirection,
      horizontalScrollDirection,
    );

    expect(mockedGetRowPages).toHaveBeenCalledWith(pageInfo, measureData, 0, 0, 2, 13);
    expect(mockedGetColumnPages).toHaveBeenCalledWith(pageInfo, measureData, 0, 0, 12, 3);
  });

  test("forward buffer should not exceed layout size", async () => {
    const halfBuffer = MIN_BUFFER / 2;
    viewService.gridColumnStartIndex = layoutService.size.x - halfBuffer;
    viewService.gridRowStartIndex = layoutService.size.y - halfBuffer;
    viewService.gridWidth = layoutService.size.x;
    viewService.gridHeight = layoutService.size.y;
    horizontalScrollDirection.current = ScrollDirection.Forward;
    verticalScrollDirection.current = ScrollDirection.Forward;

    await fetchPages(
      dataModel,
      layoutService,
      measureData,
      pageInfo,
      viewService,
      verticalScrollDirection,
      horizontalScrollDirection,
    );

    expect(mockedGetRowPages).toHaveBeenCalledWith(
      pageInfo,
      measureData,
      viewService.gridColumnStartIndex,
      viewService.gridRowStartIndex,
      100,
      halfBuffer,
    );
    expect(mockedGetColumnPages).toHaveBeenCalledWith(
      pageInfo,
      measureData,
      viewService.gridColumnStartIndex,
      viewService.gridRowStartIndex,
      halfBuffer,
      200,
    );
  });
});
