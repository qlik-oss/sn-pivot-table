import type { ColumnWidth } from "@qlik/nebula-table-utils/lib/components/ColumnAdjuster";
import { ColumnWidthType } from "@qlik/nebula-table-utils/lib/constants";
import { renderHook } from "@testing-library/react";
import { Q_PATH } from "../../../constants";
import { type ExtendedDimensionInfo, type ExtendedMeasureInfo, type Model } from "../../../types/QIX";
import type { AdjusterCellInfo, LayoutService, PageInfo } from "../../../types/types";
import useDataModel from "../use-data-model";

const pivotPage = {};

describe("useDataModel", () => {
  let model: Model;
  let nextPageHandler: (pages: EngineAPI.INxPivotPage[]) => void;
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

  describe("fetchPages", () => {
    test("should not call getHyperCubePivotData when model is a generic bookmark", async () => {
      // This is the case when the model is a snapshot (EngineAPI.IGenericBookmark)
      model = {
        collapseLeft: jest.fn(),
        collapseTop: jest.fn(),
        expandLeft: jest.fn(),
        expandTop: jest.fn(),
      } as unknown as EngineAPI.IGenericBookmark;

      const { fetchPages } = renderer();
      await fetchPages([{ qLeft: 0, qTop: 0, qWidth: 1, qHeight: 1 }]);

      expect(getHyperCubePivotDataMock).not.toHaveBeenCalled();
      expect(nextPageHandler).not.toHaveBeenCalled();
    });

    test("should call getHyperCubePivotData to fetch more data", async () => {
      const { fetchPages } = renderer();
      const pages = [
        {
          qLeft: 1,
          qTop: 2,
          qHeight: 20,
          qWidth: 10,
        },
      ];
      await fetchPages(pages);

      expect(getHyperCubePivotDataMock).toHaveBeenCalledWith(Q_PATH, pages);
      expect(nextPageHandler).toHaveBeenCalledWith([pivotPage]);
    });

    test("should handle when call to getHyperCubePivotData is rejected", async () => {
      getHyperCubePivotDataMock.mockRejectedValue(new Error("testing"));
      const { fetchPages } = renderer();
      await fetchPages([
        {
          qLeft: 1,
          qTop: 2,
          qHeight: 20,
          qWidth: 10,
        },
      ]);

      expect(nextPageHandler).not.toHaveBeenCalled();
    });

    test("should handle when page is changed during fetch", async () => {
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

      const pages = [
        {
          qLeft: 1,
          qTop: 2,
          qHeight: 20,
          qWidth: 10,
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      result.current.fetchPages(pages);

      rerender({ ...pageInfo, page: 1 });

      expect(getHyperCubePivotDataMock).toHaveBeenCalledWith(Q_PATH, pages);
      expect(nextPageHandler).not.toHaveBeenCalled();
    });
  });

  describe("applyColumnWidth", () => {
    const dimension = {} as ExtendedDimensionInfo;
    const measure = {} as ExtendedMeasureInfo;
    let newColumnWidth: ColumnWidth;
    let cellInfo: AdjusterCellInfo;
    let patch: EngineAPI.INxPatch;

    beforeEach(() => {
      newColumnWidth = { type: ColumnWidthType.Pixels, pixels: 100 };
      cellInfo = { dimensionInfoIndex: 0, isLeftColumn: false } as AdjusterCellInfo;
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

    test("should call applyPatches with qPath for dimension", () => {
      const { applyColumnWidth } = renderer();
      applyColumnWidth(newColumnWidth, cellInfo);

      expect(model?.applyPatches).toHaveBeenCalledWith([patch], true);
    });

    test("should call applyPatches with qOp replace when columnWidth exists on dimension", () => {
      layoutService.layout.qHyperCube.qDimensionInfo[0].columnWidth = { type: ColumnWidthType.Auto };
      patch.qOp = "Replace";

      const { applyColumnWidth } = renderer();
      applyColumnWidth(newColumnWidth, cellInfo);

      expect(model?.applyPatches).toHaveBeenCalledWith([patch], true);
    });

    test("should call applyPatches with qPath for top grid measure", async () => {
      cellInfo.dimensionInfoIndex = -1;
      patch.qPath = "/qHyperCubeDef/qMeasures/0/qDef/columnWidth";

      const { applyColumnWidth } = renderer();
      applyColumnWidth(newColumnWidth, cellInfo);

      expect(model?.applyPatches).toHaveBeenCalledWith([patch], true);
    });

    test("should call applyPatches with patches for all measures when resizing header grid pseudo dimension", async () => {
      cellInfo.dimensionInfoIndex = -1;
      cellInfo.isLeftColumn = true;
      const patches = [
        { ...patch, qPath: "/qHyperCubeDef/qMeasures/0/qDef/columnWidth" },
        { ...patch, qPath: "/qHyperCubeDef/qMeasures/1/qDef/columnWidth" },
      ];

      const { applyColumnWidth } = renderer();
      applyColumnWidth(newColumnWidth, cellInfo);

      expect(model?.applyPatches).toHaveBeenCalledWith(patches, true);
    });
  });
});
