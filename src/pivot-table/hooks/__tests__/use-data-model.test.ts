import { renderHook } from "@testing-library/react";
import { Q_PATH } from "../../../constants";
import {
  ColumnWidthType,
  type ColumnWidth,
  type ExtendedDimensionInfo,
  type ExtendedMeasureInfo,
  type Model,
} from "../../../types/QIX";
import type { Cell, LayoutService, PageInfo } from "../../../types/types";
import useDataModel from "../use-data-model";

const pivotPage = {};

describe("useDataModel", () => {
  let model: Model;
  let nextPageHandler: (page: EngineAPI.INxPivotPage) => void;
  let pageInfo: PageInfo;
  let layoutService: LayoutService;
  let getHyperCubePivotDataMock: jest.MockedFunction<() => Promise<EngineAPI.INxPivotPage[]>>;
  let applyPatchesMock: jest.MockedFunction<() => Promise<void>>;

  beforeEach(() => {
    getHyperCubePivotDataMock = jest.fn() as jest.MockedFunction<() => Promise<EngineAPI.INxPivotPage[]>>;
    applyPatchesMock = jest.fn() as jest.MockedFunction<() => Promise<void>>;
    model = {
      collapseLeft: jest.fn(),
      collapseTop: jest.fn(),
      expandLeft: jest.fn(),
      expandTop: jest.fn(),
      getHyperCubePivotData: getHyperCubePivotDataMock,
      applyPatches: applyPatchesMock,
    } as unknown as EngineAPI.IGenericObject;
    (model.getHyperCubePivotData as jest.Mock).mockResolvedValue([pivotPage]);
    (model.applyPatches as jest.Mock).mockResolvedValue({ then: () => {} });
    nextPageHandler = jest.fn();
    pageInfo = {
      page: 0,
      rowsPerPage: 100,
    } as PageInfo;
    layoutService = {} as LayoutService;
  });

  const renderer = () =>
    renderHook(() => useDataModel({ model, nextPageHandler, pageInfo, layoutService })).result.current;

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("collapseLeft should call model.collapseLeft with correct parameters", () => {
    const { collapseLeft } = renderer();
    collapseLeft(1, 2);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect((model as EngineAPI.IGenericObject).collapseLeft).toHaveBeenCalledWith(Q_PATH, 1, 2, false);
  });

  test("collapseTop should call model.collapseTop with correct parameters", () => {
    const { collapseTop } = renderer();
    collapseTop(1, 2);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect((model as EngineAPI.IGenericObject).collapseTop).toHaveBeenCalledWith(Q_PATH, 1, 2, false);
  });

  test("expandLeft should call model.expandLeft with correct parameters", () => {
    const { expandLeft } = renderer();
    expandLeft(1, 2);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect((model as EngineAPI.IGenericObject).expandLeft).toHaveBeenCalledWith(Q_PATH, 1, 2, false);
  });

  test("expandTop should call model.expandTop with correct parameters", () => {
    const { expandTop } = renderer();
    expandTop(1, 2);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect((model as EngineAPI.IGenericObject).expandTop).toHaveBeenCalledWith(Q_PATH, 1, 2, false);
  });

  describe("fetchMoreData", () => {
    test("fetchMoreData should not call getHyperCubePivotData when model is a generic bookmark", async () => {
      // This is the case when the model is a snapshot (EngineAPI.IGenericBookmark)
      model = {
        collapseLeft: jest.fn(),
        collapseTop: jest.fn(),
        expandLeft: jest.fn(),
        expandTop: jest.fn(),
      } as unknown as EngineAPI.IGenericBookmark;

      const { fetchMoreData } = renderer();
      await fetchMoreData(1, 2, 10, 20);

      expect(getHyperCubePivotDataMock).not.toHaveBeenCalled();
      expect(nextPageHandler).not.toHaveBeenCalled();
    });

    test("fetchMoreData should call getHyperCubePivotData to fetch more data", async () => {
      const { fetchMoreData } = renderer();
      await fetchMoreData(1, 2, 10, 20);

      expect(getHyperCubePivotDataMock).toHaveBeenCalledWith(Q_PATH, [
        {
          qLeft: 1,
          qTop: 2,
          qHeight: 20,
          qWidth: 10,
        },
      ]);
      expect(nextPageHandler).toHaveBeenCalledWith(pivotPage);
    });

    test("fetchMoreData should consider `pageInfo` while calling getHyperCubePivotData to fetch more data", async () => {
      pageInfo = {
        ...pageInfo,
        page: 5,
      };
      const { fetchMoreData } = renderer();
      await fetchMoreData(1, 2, 10, 20);

      expect(getHyperCubePivotDataMock).toHaveBeenCalledWith(Q_PATH, [
        {
          qLeft: 1,
          qTop: pageInfo.page * pageInfo.rowsPerPage + 2,
          qHeight: 20,
          qWidth: 10,
        },
      ]);
      expect(nextPageHandler).toHaveBeenCalledWith(pivotPage);
    });

    test("fetchMoreData should not try and fetch more data then available", async () => {
      const { fetchMoreData } = renderer();
      await fetchMoreData(40, 50, 50, 60);

      expect(getHyperCubePivotDataMock).toHaveBeenCalledWith(Q_PATH, [
        {
          qLeft: 40,
          qTop: 50,
          qHeight: 60,
          qWidth: 50,
        },
      ]);
      expect(nextPageHandler).toHaveBeenCalledWith(pivotPage);
    });

    test("fetchMoreData should handle when call to getHyperCubePivotData is rejected", async () => {
      getHyperCubePivotDataMock.mockRejectedValue(new Error("testing"));
      const { fetchMoreData } = renderer();
      await fetchMoreData(1, 2, 10, 20);

      expect(getHyperCubePivotDataMock).toHaveBeenCalledWith(Q_PATH, [
        {
          qLeft: 1,
          qTop: 2,
          qHeight: 20,
          qWidth: 10,
        },
      ]);
      expect(nextPageHandler).not.toHaveBeenCalled();
    });

    test("fetchMoreData should handle when page is changed during fetch", async () => {
      getHyperCubePivotDataMock.mockResolvedValueOnce(
        new Promise((resolve) => {
          setTimeout(() => {
            resolve([]);
          }, 1000);
        }),
      );
      const { rerender, result } = renderHook(
        (pi: PageInfo) => useDataModel({ model, nextPageHandler, pageInfo: pi, layoutService }),
        {
          initialProps: pageInfo,
        },
      );

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      result.current.fetchMoreData(1, 2, 10, 20);

      rerender({ ...pageInfo, page: 1 });

      expect(getHyperCubePivotDataMock).toHaveBeenCalledWith(Q_PATH, [
        {
          qLeft: 1,
          qTop: 2,
          qHeight: 20,
          qWidth: 10,
        },
      ]);
      expect(nextPageHandler).not.toHaveBeenCalled();
    });
  });

  describe("applyColumnWidth", () => {
    const dimension = {} as ExtendedDimensionInfo;
    const measure = {} as ExtendedMeasureInfo;
    let newColumnWidth: ColumnWidth;
    let cell: Cell;
    let patch: EngineAPI.INxPatch;

    beforeEach(() => {
      newColumnWidth = { type: ColumnWidthType.Pixels, pixels: 100 };
      cell = { isPseudoDimension: false, isAncestorPseudoDimension: false, isLeftColumn: false, x: 0, y: 0 } as Cell;
      layoutService = {
        layout: {
          qHyperCube: { qDimensionInfo: [dimension, dimension], qMeasureInfo: [measure, measure], qNoOfLeftDims: 0 },
        },
        hasPseudoDimOnLeft: false,
        getMeasureInfoIndexFromCellIndex: (index: number) => index,
      } as unknown as LayoutService;

      patch = {
        qPath: "/qHyperCubeDef/qDimensions/0/qDef/columnWidth",
        qOp: "Add",
        qValue: JSON.stringify(newColumnWidth),
      };
    });

    test("should call applyPatches with qPath for top grid dimension", () => {
      const { applyColumnWidth } = renderer();
      applyColumnWidth(newColumnWidth, cell);

      expect(model?.applyPatches).toHaveBeenCalledWith([patch], true);
    });

    test("should call applyPatches with qPath for header grid dimension", () => {
      layoutService.layout.qHyperCube.qNoOfLeftDims = 1;
      cell.isLeftColumn = true;

      const { applyColumnWidth } = renderer();
      applyColumnWidth(newColumnWidth, cell);

      expect(model?.applyPatches).toHaveBeenCalledWith([patch], true);
    });

    test("should call applyPatches with qPath for top grid dimension with pseudo as ancestor", () => {
      layoutService.layout.qHyperCube.qNoOfLeftDims = 1;
      cell.isAncestorPseudoDimension = true;
      cell.y = 1;
      patch.qPath = "/qHyperCubeDef/qDimensions/1/qDef/columnWidth";

      const { applyColumnWidth } = renderer();
      applyColumnWidth(newColumnWidth, cell);

      expect(model?.applyPatches).toHaveBeenCalledWith([patch], true);
    });

    test("should call applyPatches with qPath for top grid dimension when hasPseudoDimOnLeft is true", () => {
      layoutService.layout.qHyperCube.qNoOfLeftDims = 1;
      layoutService.hasPseudoDimOnLeft = true;
      cell.y = 1;
      patch.qPath = "/qHyperCubeDef/qDimensions/1/qDef/columnWidth";

      const { applyColumnWidth } = renderer();
      applyColumnWidth(newColumnWidth, cell);

      expect(model?.applyPatches).toHaveBeenCalledWith([patch], true);
    });

    test("should call applyPatches with qOp replace when columnWidth exists on dimension", () => {
      layoutService.layout.qHyperCube.qDimensionInfo[0].columnWidth = { type: ColumnWidthType.Auto };
      patch.qOp = "Replace";

      const { applyColumnWidth } = renderer();
      applyColumnWidth(newColumnWidth, cell);

      expect(model?.applyPatches).toHaveBeenCalledWith([patch], true);
    });

    test("should call applyPatches with qPath for top grid measure", async () => {
      cell.isPseudoDimension = true;
      patch.qPath = "/qHyperCubeDef/qMeasures/0/qDef/columnWidth";

      const { applyColumnWidth } = renderer();
      applyColumnWidth(newColumnWidth, cell);

      expect(model?.applyPatches).toHaveBeenCalledWith([patch], true);
    });

    test("should call applyPatches with patches for all measures when resizing header grid pseudo dimension", async () => {
      cell.isPseudoDimension = true;
      cell.isLeftColumn = true;
      const patches = [
        { ...patch, qPath: "/qHyperCubeDef/qMeasures/0/qDef/columnWidth" },
        { ...patch, qPath: "/qHyperCubeDef/qMeasures/1/qDef/columnWidth" },
      ];

      const { applyColumnWidth } = renderer();
      applyColumnWidth(newColumnWidth, cell);

      expect(model?.applyPatches).toHaveBeenCalledWith(patches, true);
    });
  });
});
