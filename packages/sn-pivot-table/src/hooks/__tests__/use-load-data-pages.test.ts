import type { stardust } from "@nebula.js/stardust";
import { renderHook, waitFor } from "@testing-library/react";
import { MAX_COLUMN_COUNT, MAX_ROW_COUNT } from "../../pivot-table/constants";
import type { Model } from "../../types/QIX";
import type { LayoutService, PageInfo, ViewService } from "../../types/types";
import useLoadDataPages, {
  getFetchArea,
  isMissingInitialDataPages,
  shouldFetchExpandOrCollapseData,
} from "../use-load-data-pages";

describe("useLoadDataPages", () => {
  const DEFAULT_PAGE_SIZE = 50;
  let layoutService: LayoutService;
  let viewService: ViewService;
  let pageInfo: PageInfo;
  let model: Model;
  let rect: stardust.Rect;

  beforeEach(() => {
    viewService = {
      gridColumnStartIndex: 0,
      gridRowStartIndex: 0,
      gridHeight: 0,
      gridWidth: 0,
    };
    layoutService = {
      layout: {
        qHyperCube: {
          qSize: {
            qcx: 100,
            qcy: 100,
          },
          qPivotDataPages: [{ qArea: { qTop: 0, qHeight: 50, qWidth: 50, qLeft: 0 } }],
        },
      },
    } as LayoutService;
    pageInfo = {
      page: 0,
      rowsPerPage: 100,
    } as PageInfo;

    rect = {
      left: 0,
      top: 0,
      width: 200,
      height: 100,
    };
  });

  describe("shouldFetchExpandOrCollapseData", () => {
    test("should return false if there was no `qLastExpandedPos`", () => {
      expect(shouldFetchExpandOrCollapseData(false, viewService, 50, 50)).toBe(false);
    });

    test("should return true if viewService indicates that we are scrolling in x axis", () => {
      viewService = {
        ...viewService,
        gridColumnStartIndex: 50,
        gridWidth: 100,
      };
      expect(shouldFetchExpandOrCollapseData(true, viewService, 50, 50)).toBe(true);
    });

    test("should return true if viewService indicates that we are scrolling in y axis", () => {
      viewService = {
        ...viewService,
        gridRowStartIndex: 50,
        gridHeight: 100,
      };
      expect(shouldFetchExpandOrCollapseData(true, viewService, 50, 50)).toBe(true);
    });

    test("should return false if viewService is still within the boundary of `DEFAULT_PAGE_SIZE`", () => {
      viewService = {
        gridColumnStartIndex: 20,
        gridWidth: 10,
        gridRowStartIndex: 20,
        gridHeight: 10,
      };
      expect(shouldFetchExpandOrCollapseData(true, viewService, 50, 50)).toBe(false);
    });
  });

  describe("isMissingInitialDataPages", () => {
    test("should return true in case of new page and while qTop is falling behind current page", () => {
      pageInfo = {
        ...pageInfo,
        page: 5,
      };
      expect(isMissingInitialDataPages(layoutService.layout, pageInfo, 50, 50)).toBe(true);
    });

    test("should return true if we are missing data in x axis (columns)", () => {
      layoutService = {
        layout: {
          qHyperCube: {
            ...layoutService.layout.qHyperCube,
            qPivotDataPages: [{ qArea: { qTop: 0, qHeight: 25, qWidth: 100, qLeft: 0 } }],
          },
        },
      } as LayoutService;
      expect(isMissingInitialDataPages(layoutService.layout, pageInfo, 50, 50)).toBe(true);
    });

    test("should return true if we are missing data in y axis (rows)", () => {
      layoutService = {
        layout: {
          qHyperCube: {
            ...layoutService.layout.qHyperCube,
            qPivotDataPages: [{ qArea: { qTop: 0, qHeight: 100, qWidth: 25, qLeft: 0 } }],
          },
        },
      } as LayoutService;
      expect(isMissingInitialDataPages(layoutService.layout, pageInfo, 50, 50)).toBe(true);
    });

    test("should return false if both axis are fulfilled with data", () => {
      layoutService = {
        layout: {
          qHyperCube: {
            ...layoutService.layout.qHyperCube,
            qPivotDataPages: [{ qArea: { qTop: 0, qHeight: 100, qWidth: 100, qLeft: 0 } }],
          },
        },
      } as LayoutService;
      expect(isMissingInitialDataPages(layoutService.layout, pageInfo, 50, 50)).toBe(false);
    });

    test("should return fallback to default `qArea` if it is not provided (an enforced fetch trigger basically)", () => {
      layoutService = {
        layout: {
          qHyperCube: {
            ...layoutService.layout.qHyperCube,
            qPivotDataPages: [{}],
          },
        },
      } as LayoutService;
      expect(isMissingInitialDataPages(layoutService.layout, pageInfo, 50, 50)).toBe(true);
    });
  });

  describe("getFetchArea", () => {
    test("should return null if page does not exist any more", () => {
      layoutService.layout.qHyperCube.qSize.qcy = pageInfo.page * pageInfo.rowsPerPage - 1;

      expect(
        getFetchArea(
          true,
          viewService,
          layoutService.layout.qHyperCube.qSize,
          pageInfo,
          DEFAULT_PAGE_SIZE,
          DEFAULT_PAGE_SIZE,
        ),
      ).toBe(null);
    });

    test("should return default area when a node has not been collapsed or expanded", () => {
      expect(
        getFetchArea(
          false,
          viewService,
          layoutService.layout.qHyperCube.qSize,
          pageInfo,
          DEFAULT_PAGE_SIZE,
          DEFAULT_PAGE_SIZE,
        ),
      ).toEqual({
        qLeft: 0,
        qTop: 0,
        qWidth: DEFAULT_PAGE_SIZE,
        qHeight: DEFAULT_PAGE_SIZE,
      });
    });

    test("should return page based area when a node has not been collapsed or expanded", () => {
      pageInfo.page = 1;
      layoutService.layout.qHyperCube.qSize.qcy = pageInfo.rowsPerPage * 2;

      expect(
        getFetchArea(
          false,
          viewService,
          layoutService.layout.qHyperCube.qSize,
          pageInfo,
          DEFAULT_PAGE_SIZE,
          DEFAULT_PAGE_SIZE,
        ),
      ).toEqual({
        qLeft: 0,
        qTop: pageInfo.rowsPerPage,
        qWidth: DEFAULT_PAGE_SIZE,
        qHeight: DEFAULT_PAGE_SIZE,
      });
    });

    describe("qLeft", () => {
      test("should return area when a node has been collapsed or expanded and column index still exists", () => {
        viewService.gridColumnStartIndex = 100;
        viewService.gridWidth = 25;
        viewService.gridRowStartIndex = 0;
        viewService.gridHeight = 50;
        layoutService.layout.qHyperCube.qSize.qcx = 1000;

        expect(
          getFetchArea(
            true,
            viewService,
            layoutService.layout.qHyperCube.qSize,
            pageInfo,
            DEFAULT_PAGE_SIZE,
            DEFAULT_PAGE_SIZE,
          ),
        ).toEqual({
          qLeft: viewService.gridColumnStartIndex,
          qTop: 0,
          qWidth: DEFAULT_PAGE_SIZE,
          qHeight: DEFAULT_PAGE_SIZE,
        });
      });

      test("should return area when a node has been collapsed and column index does not exists anymore", () => {
        viewService.gridColumnStartIndex = 100;
        viewService.gridWidth = 25;
        viewService.gridRowStartIndex = 0;
        viewService.gridHeight = 50;
        layoutService.layout.qHyperCube.qSize.qcx = 75;

        expect(
          getFetchArea(
            true,
            viewService,
            layoutService.layout.qHyperCube.qSize,
            pageInfo,
            DEFAULT_PAGE_SIZE,
            DEFAULT_PAGE_SIZE,
          ),
        ).toEqual({
          qLeft: 25,
          qTop: 0,
          qWidth: DEFAULT_PAGE_SIZE,
          qHeight: DEFAULT_PAGE_SIZE,
        });
      });
    });

    describe("qTop", () => {
      test("should return area when a node has been collapsed and row index still exists", () => {
        viewService.gridColumnStartIndex = 0;
        viewService.gridWidth = 50;
        viewService.gridRowStartIndex = 100;
        viewService.gridHeight = 25;
        layoutService.layout.qHyperCube.qSize.qcy = 1000;
        pageInfo.rowsPerPage = MAX_ROW_COUNT;

        expect(
          getFetchArea(
            true,
            viewService,
            layoutService.layout.qHyperCube.qSize,
            pageInfo,
            DEFAULT_PAGE_SIZE,
            DEFAULT_PAGE_SIZE,
          ),
        ).toEqual({
          qLeft: 0,
          qTop: viewService.gridRowStartIndex,
          qWidth: DEFAULT_PAGE_SIZE,
          qHeight: DEFAULT_PAGE_SIZE,
        });
      });

      test("should return area when a node has been collapsed or expanded and position does not exists anymore", () => {
        viewService.gridColumnStartIndex = 0;
        viewService.gridWidth = 50;
        viewService.gridRowStartIndex = 100;
        viewService.gridHeight = 25;
        layoutService.layout.qHyperCube.qSize.qcy = 75;
        pageInfo.rowsPerPage = MAX_ROW_COUNT;

        expect(
          getFetchArea(
            true,
            viewService,
            layoutService.layout.qHyperCube.qSize,
            pageInfo,
            DEFAULT_PAGE_SIZE,
            DEFAULT_PAGE_SIZE,
          ),
        ).toEqual({
          qLeft: 0,
          qTop: 25,
          qWidth: DEFAULT_PAGE_SIZE,
          qHeight: DEFAULT_PAGE_SIZE,
        });
      });
    });

    describe("qWidth", () => {
      test("should return area when qWidth is clamped by MAX_COLUMN_COUNT", () => {
        viewService.gridColumnStartIndex = MAX_COLUMN_COUNT - 10;
        viewService.gridWidth = 10;
        layoutService.layout.qHyperCube.qSize.qcx = MAX_COLUMN_COUNT * 2;

        expect(
          getFetchArea(
            true,
            viewService,
            layoutService.layout.qHyperCube.qSize,
            pageInfo,
            DEFAULT_PAGE_SIZE,
            DEFAULT_PAGE_SIZE,
          ),
        ).toEqual({
          qLeft: viewService.gridColumnStartIndex,
          qTop: viewService.gridRowStartIndex,
          qWidth: 10,
          qHeight: DEFAULT_PAGE_SIZE,
        });
      });

      test("should return area when qWidth is clamped by qSize.qcx", () => {
        layoutService.layout.qHyperCube.qSize.qcx = 1000;
        viewService.gridColumnStartIndex = layoutService.layout.qHyperCube.qSize.qcx - 10;
        viewService.gridWidth = 10;

        expect(
          getFetchArea(
            true,
            viewService,
            layoutService.layout.qHyperCube.qSize,
            pageInfo,
            DEFAULT_PAGE_SIZE,
            DEFAULT_PAGE_SIZE,
          ),
        ).toEqual({
          qLeft: 990,
          qTop: viewService.gridRowStartIndex,
          qWidth: viewService.gridWidth,
          qHeight: DEFAULT_PAGE_SIZE,
        });
      });
    });

    describe("qHeight", () => {
      test("should return area when qHeight is clamped by end of page", () => {
        viewService.gridHeight = 10;
        viewService.gridRowStartIndex = MAX_ROW_COUNT - 10;
        layoutService.layout.qHyperCube.qSize.qcy = MAX_ROW_COUNT * 2;
        pageInfo.rowsPerPage = MAX_ROW_COUNT;
        pageInfo.page = 0;

        expect(
          getFetchArea(
            true,
            viewService,
            layoutService.layout.qHyperCube.qSize,
            pageInfo,
            DEFAULT_PAGE_SIZE,
            DEFAULT_PAGE_SIZE,
          ),
        ).toEqual({
          qLeft: 0,
          qTop: viewService.gridRowStartIndex,
          qWidth: DEFAULT_PAGE_SIZE,
          qHeight: 10,
        });
      });

      test("should return area when qHeight is clamped by qSize.qcy", () => {
        layoutService.layout.qHyperCube.qSize.qcy = 1000;
        viewService.gridHeight = 10;
        viewService.gridRowStartIndex = layoutService.layout.qHyperCube.qSize.qcy - 10;
        pageInfo.rowsPerPage = MAX_ROW_COUNT;
        pageInfo.page = 0;

        expect(
          getFetchArea(
            true,
            viewService,
            layoutService.layout.qHyperCube.qSize,
            pageInfo,
            DEFAULT_PAGE_SIZE,
            DEFAULT_PAGE_SIZE,
          ),
        ).toEqual({
          qLeft: 0,
          qTop: 990,
          qWidth: DEFAULT_PAGE_SIZE,
          qHeight: 10,
        });
      });
    });
  });

  describe("useLoadDataPages", () => {
    let getHyperCubePivotDataMock: jest.MockedFunction<() => Promise<EngineAPI.INxPivotPage[]>>;

    const renderer = () => renderHook(() => useLoadDataPages({ model, layoutService, viewService, pageInfo, rect }));

    beforeEach(() => {
      getHyperCubePivotDataMock = jest.fn();
      model = {
        getHyperCubePivotData: getHyperCubePivotDataMock,
      } as unknown as Model;
    });

    test("should set `qPivotDataPages` from layout if there was any", async () => {
      const { result } = renderer();
      await waitFor(() => expect(result.current[0]).toEqual(layoutService.layout.qHyperCube.qPivotDataPages));
    });

    test("should return snapshotData if it is available", async () => {
      const fakeSnapshotData = {
        content: { qPivotDataPages: [{ pivotData: true }] },
        object: { size: { w: 100, h: 100 } },
      };
      layoutService = {
        ...layoutService,
        isSnapshot: true,
        layout: { ...layoutService.layout, snapshotData: fakeSnapshotData },
      } as unknown as LayoutService;

      const { result } = renderer();

      await waitFor(() => expect(result.current[0]).toEqual(fakeSnapshotData.content.qPivotDataPages));
    });

    describe("should fetch data and return data", () => {
      test("should not try to fetch data if there is no `getHyperCubePivotData` on model", async () => {
        model = {
          getHyperCubePivotData: undefined,
        } as unknown as Model;
        renderer();

        await waitFor(() => expect(getHyperCubePivotDataMock).toHaveBeenCalledTimes(0));
      });

      test("should fetch data if only `shouldFetchAdditionalData()` returns true", async () => {
        viewService = {
          ...viewService,
          gridColumnStartIndex: 50,
          gridWidth: 100,
        };
        layoutService = {
          layout: {
            qHyperCube: {
              ...layoutService.layout.qHyperCube,
            },
          },
          triggerdByExpandOrCollapse: true,
        } as LayoutService;

        renderer();
        await waitFor(() => {
          expect(getHyperCubePivotDataMock).toHaveBeenCalledTimes(1);
        });
      });

      test("should fetch data if only `isMissingLayoutData()` returns true", async () => {
        // make isMissingLayoutData() returns true by fake arguments
        rect.height = 10000;
        rect.width = 10000;
        layoutService = {
          layout: {
            qHyperCube: {
              ...layoutService.layout.qHyperCube,
              qPivotDataPages: [{ qArea: { qTop: 0, qHeight: 25, qWidth: 100, qLeft: 0 } }],
            },
          },
        } as LayoutService;

        renderer();
        await waitFor(() => {
          expect(getHyperCubePivotDataMock).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
