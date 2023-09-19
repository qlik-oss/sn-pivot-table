import { renderHook } from "@testing-library/react";
import { Q_PATH } from "../../../constants";
import type { Model } from "../../../types/QIX";
import type { PageInfo } from "../../../types/types";
import useDataModel from "../use-data-model";

describe("useDataModel", () => {
  let model: Model;
  let nextPageHandler: (page: EngineAPI.INxPivotPage) => void;
  let pageInfo: PageInfo;

  beforeEach(() => {
    model = {
      collapseLeft: jest.fn(),
      collapseTop: jest.fn(),
      expandLeft: jest.fn(),
      expandTop: jest.fn(),
      getHyperCubePivotData: jest.fn() as jest.MockedFunction<() => Promise<EngineAPI.INxPivotPage[]>>,
    } as unknown as EngineAPI.IGenericObject;
    (model.getHyperCubePivotData as jest.Mock).mockResolvedValue([]);
    nextPageHandler = jest.fn();
    pageInfo = {
      page: 0,
      rowsPerPage: 100,
    } as PageInfo;
  });

  const renderer = () => renderHook(() => useDataModel({ model, nextPageHandler, pageInfo })).result.current;

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
      const output = await fetchMoreData(1, 2, 10, 20);

      expect(output).toBeFalsy();
    });

    test("fetchMoreData should call getHyperCubePivotData to fetch more data", async () => {
      const { fetchMoreData } = renderer();
      const output = await fetchMoreData(1, 2, 10, 20);

      expect(output).toBeTruthy();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect((model as EngineAPI.IGenericObject).getHyperCubePivotData).toHaveBeenCalledWith(Q_PATH, [
        {
          qLeft: 1,
          qTop: 2,
          qHeight: 20,
          qWidth: 10,
        },
      ]);
    });

    test("fetchMoreData should consider `pageInfo` while calling getHyperCubePivotData to fetch more data", async () => {
      pageInfo = {
        ...pageInfo,
        page: 5,
      };
      const { fetchMoreData } = renderer();
      const output = await fetchMoreData(1, 2, 10, 20);

      expect(output).toBeTruthy();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect((model as EngineAPI.IGenericObject).getHyperCubePivotData).toHaveBeenCalledWith(Q_PATH, [
        {
          qLeft: 1,
          qTop: pageInfo.page * pageInfo.rowsPerPage + 2,
          qHeight: 20,
          qWidth: 10,
        },
      ]);
    });

    test("fetchMoreData should not try and fetch more data then available", async () => {
      const { fetchMoreData } = renderer();
      const output = await fetchMoreData(40, 50, 50, 60);

      expect(output).toBeTruthy();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect((model as EngineAPI.IGenericObject).getHyperCubePivotData).toHaveBeenCalledWith(Q_PATH, [
        {
          qLeft: 40,
          qTop: 50,
          qHeight: 60,
          qWidth: 50,
        },
      ]);
    });

    test("fetchMoreData should handle when call to getHyperCubePivotData is rejected", async () => {
      const genericObjectModel = model as EngineAPI.IGenericObject;
      (genericObjectModel.getHyperCubePivotData as jest.Mock).mockRejectedValue(new Error("testing"));
      const { fetchMoreData } = renderer();
      const output = await fetchMoreData(1, 2, 10, 20);

      expect(output).toBeFalsy();
    });
  });
});
