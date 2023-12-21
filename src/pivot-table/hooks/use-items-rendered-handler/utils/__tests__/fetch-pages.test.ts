import type { DataModel, LayoutService, MeasureData, PageInfo, ViewService } from "../../../../../types/types";
import { ScrollDirection } from "../../../../../types/types";
import { fetchPages } from "../fetch-pages";
import getColumnPages from "../get-column-pages";
import getRowPages, { getPages } from "../get-row-pages";

jest.mock("../get-row-pages");
jest.mock("../get-column-pages");
const mockedGetRowPages = getRowPages as jest.MockedFunction<typeof getRowPages>;
const mockedGetPages = getPages as jest.MockedFunction<typeof getPages>;
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
    mockedGetPages.mockReturnValue([]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should fetch pages if both scroll directions are None", async () => {
    horizontalScrollDirection.current = ScrollDirection.None;
    verticalScrollDirection.current = ScrollDirection.None;
    mockedGetPages.mockReturnValue([{ qLeft: 0, qTop: 0, qWidth: 1, qHeight: 1 }]);
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
    expect(mockedGetRowPages).toHaveBeenCalledWith({
      pageInfo,
      measureData,
      viewService,
      scrollDirection: verticalScrollDirection,
    });
    expect(mockedGetColumnPages).toHaveBeenCalledWith({
      pageInfo,
      measureData,
      viewService,
      scrollDirection: horizontalScrollDirection,
      layoutService,
    });
  });
});
