import { renderHook } from "@testing-library/react";
import { Q_PATH } from "../../../constants";
import { Model } from "../../../types/QIX";
import useDataModel from "../use-data-model";

describe("useDataModel", () => {
  let model: Model;
  let nextPageHandler: (page: EngineAPI.INxPivotPage) => void;

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
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("collapseLeft should call model.collapseLeft with correct parameters", () => {
    const { result } = renderHook(() => useDataModel({ model, nextPageHandler }));
    result.current.collapseLeft(1, 2);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect((model as EngineAPI.IGenericObject).collapseLeft).toHaveBeenCalledWith(Q_PATH, 1, 2, false);
  });

  test("collapseTop should call model.collapseTop with correct parameters", () => {
    const { result } = renderHook(() => useDataModel({ model, nextPageHandler }));
    result.current.collapseTop(1, 2);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect((model as EngineAPI.IGenericObject).collapseTop).toHaveBeenCalledWith(Q_PATH, 1, 2, false);
  });

  test("expandLeft should call model.expandLeft with correct parameters", () => {
    const { result } = renderHook(() => useDataModel({ model, nextPageHandler }));
    result.current.expandLeft(1, 2);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect((model as EngineAPI.IGenericObject).expandLeft).toHaveBeenCalledWith(Q_PATH, 1, 2, false);
  });

  test("expandTop should call model.expandTop with correct parameters", () => {
    const { result } = renderHook(() => useDataModel({ model, nextPageHandler }));
    result.current.expandTop(1, 2);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect((model as EngineAPI.IGenericObject).expandTop).toHaveBeenCalledWith(Q_PATH, 1, 2, false);
  });

  describe("fetchMoreData", () => {
    test("fetchMoreData should call not getHyperCubePivotData when model is a generic bookmark", async () => {
      // This is the case when the model is a snapshot (EngineAPI.IGenericBookmark)
      model = {
        collapseLeft: jest.fn(),
        collapseTop: jest.fn(),
        expandLeft: jest.fn(),
        expandTop: jest.fn(),
      } as unknown as EngineAPI.IGenericBookmark;

      const { result } = renderHook(() => useDataModel({ model, nextPageHandler }));
      const output = await result.current.fetchMoreData(1, 2, 10, 20);

      expect(output).toBeFalsy();
    });

    test("fetchMoreData should call getHyperCubePivotData to fetch more data", async () => {
      const { result } = renderHook(() => useDataModel({ model, nextPageHandler }));
      const output = await result.current.fetchMoreData(1, 2, 10, 20);

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

    test("fetchMoreData should not try and fetch more data then available", async () => {
      const { result } = renderHook(() => useDataModel({ model, nextPageHandler }));
      const output = await result.current.fetchMoreData(40, 50, 50, 60);

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
      const { result } = renderHook(() => useDataModel({ model, nextPageHandler }));
      const output = await result.current.fetchMoreData(1, 2, 10, 20);

      expect(output).toBeFalsy();
    });
  });
});
