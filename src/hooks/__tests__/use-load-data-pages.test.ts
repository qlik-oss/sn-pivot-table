import { renderHook, waitFor } from "@testing-library/react";
import { DEFAULT_PAGE_SIZE, Q_PATH } from "../../constants";
import type { Model } from "../../types/QIX";
import type { LayoutService, PageInfo, ViewService } from "../../types/types";
import useLoadDataPages, { isMissingLayoutData, shouldFetchAdditionalData } from "../use-load-data-pages";

describe("useLoadDataPages", () => {
  let layoutService: LayoutService;
  let viewService: ViewService;
  let pageInfo: PageInfo;
  let model: Model;
  let qLastExpandedPos: EngineAPI.INxCellPosition | undefined;

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
      currentPage: 0,
      rowsPerPage: 100,
    } as PageInfo;
  });

  describe("shouldFetchAdditionalData", () => {
    beforeEach(() => {
      qLastExpandedPos = {
        qx: 0,
        qy: 0,
      };
    });

    test("should return false if there was no `qLastExpandedPos`", () => {
      qLastExpandedPos = undefined;
      expect(shouldFetchAdditionalData(qLastExpandedPos, viewService)).toBe(false);
    });

    test("should return true if viewService indicates that we are scrolling in x axis", () => {
      viewService = {
        ...viewService,
        gridColumnStartIndex: 50,
        gridWidth: 100,
      };
      expect(shouldFetchAdditionalData(qLastExpandedPos, viewService)).toBe(true);
    });

    test("should return true if viewService indicates that we are scrolling in y axis", () => {
      viewService = {
        ...viewService,
        gridRowStartIndex: 50,
        gridHeight: 100,
      };
      expect(shouldFetchAdditionalData(qLastExpandedPos, viewService)).toBe(true);
    });

    test("should return false if viewService is still within the boundary of `DEFAULT_PAGE_SIZE`", () => {
      viewService = {
        gridColumnStartIndex: 20,
        gridWidth: 10,
        gridRowStartIndex: 20,
        gridHeight: 10,
      };
      expect(shouldFetchAdditionalData(qLastExpandedPos, viewService)).toBe(false);
    });
  });

  describe("isMissingLayoutData", () => {
    test("should return true in case of new page and while qTop is falling behind current page", () => {
      pageInfo = {
        ...pageInfo,
        currentPage: 5,
      };
      expect(isMissingLayoutData(layoutService.layout, pageInfo)).toBe(true);
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
      expect(isMissingLayoutData(layoutService.layout, pageInfo)).toBe(true);
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
      expect(isMissingLayoutData(layoutService.layout, pageInfo)).toBe(true);
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
      expect(isMissingLayoutData(layoutService.layout, pageInfo)).toBe(false);
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
      expect(isMissingLayoutData(layoutService.layout, pageInfo)).toBe(true);
    });
  });

  describe("useLoadDataPages", () => {
    let getHyperCubePivotDataMock: jest.MockedFunction<() => Promise<EngineAPI.INxPivotPage[]>>;

    const renderer = () => renderHook(() => useLoadDataPages({ model, layoutService, viewService, pageInfo }));

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
              qLastExpandedPos: {
                qx: 0,
                qy: 0,
              },
            },
          },
        } as LayoutService;

        renderer();
        await waitFor(() => {
          expect(getHyperCubePivotDataMock).toHaveBeenCalledTimes(1);
          expect(getHyperCubePivotDataMock).toHaveBeenCalledWith(Q_PATH, [
            {
              qLeft: viewService.gridColumnStartIndex,
              qTop: 0,
              qWidth: viewService.gridWidth,
              qHeight: DEFAULT_PAGE_SIZE,
            },
          ]);
        });
      });

      test("should fetch data if only `isMissingLayoutData()` returns true", async () => {
        // make isMissingLayoutData() returns true by fake arguments
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
          expect(getHyperCubePivotDataMock).toHaveBeenCalledWith(Q_PATH, [
            {
              qLeft: viewService.gridColumnStartIndex,
              qTop: 0,
              qWidth: DEFAULT_PAGE_SIZE,
              qHeight: DEFAULT_PAGE_SIZE,
            },
          ]);
        });
      });

      test("should fetch data and conside pagination", async () => {
        // make isMissingLayoutData() returns true by fake arguments
        pageInfo = {
          ...pageInfo,
          currentPage: 5,
        };

        renderer();
        await waitFor(() => {
          expect(getHyperCubePivotDataMock).toHaveBeenCalledTimes(1);
          expect(getHyperCubePivotDataMock).toHaveBeenCalledWith(Q_PATH, [
            {
              qLeft: viewService.gridColumnStartIndex,
              qTop: pageInfo.currentPage * pageInfo.rowsPerPage + 0,
              qWidth: DEFAULT_PAGE_SIZE,
              qHeight: DEFAULT_PAGE_SIZE,
            },
          ]);
        });
      });

      test("should fetch data and conside pagination and qLastExpandedPos if any expanded", async () => {
        // make isMissingLayoutData() returns true by fake arguments
        pageInfo = {
          ...pageInfo,
          currentPage: 5,
        };
        viewService = {
          ...viewService,
          gridRowStartIndex: 75,
        };
        layoutService = {
          layout: {
            qHyperCube: {
              ...layoutService.layout.qHyperCube,
              qLastExpandedPos: {
                qx: 0,
                qy: 0,
              },
            },
          },
        } as LayoutService;

        renderer();
        await waitFor(() => {
          expect(getHyperCubePivotDataMock).toHaveBeenCalledTimes(1);
          expect(getHyperCubePivotDataMock).toHaveBeenCalledWith(Q_PATH, [
            {
              qLeft: viewService.gridColumnStartIndex,
              qTop: pageInfo.currentPage * pageInfo.rowsPerPage + viewService.gridRowStartIndex,
              qWidth: DEFAULT_PAGE_SIZE,
              qHeight: DEFAULT_PAGE_SIZE,
            },
          ]);
        });
      });
    });
  });
});
