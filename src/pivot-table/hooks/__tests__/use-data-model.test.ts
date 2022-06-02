import { renderHook } from '@testing-library/react-hooks';
import { Q_PATH } from '../../../constants';
import { Model } from '../../../types/QIX';
import { Point, ViewService } from '../../../types/types';
import useDataModel from '../use-data-model';

describe('useDataModel', () => {
  let model: Model;
  let nextPageHandler: (page: EngineAPI.INxPivotPage) => void;
  let moreDataHandler: (page: EngineAPI.INxPivotPage) => void;
  let size: Point;
  let viewService: ViewService;
  let hasMoreRows: boolean;
  let hasMoreColumns: boolean;

  beforeEach(() => {
    size = { x: 51, y: 62 };
    viewService = {
      gridColumnStartIndex: 0,
      gridRowStartIndex: 1,
      gridHeight: 10,
      gridWidth: 20,
    };
    hasMoreColumns = true;
    hasMoreRows = true;
    model = {
      collapseLeft: jest.fn(),
      collapseTop: jest.fn(),
      expandLeft: jest.fn(),
      expandTop: jest.fn(),
      getHyperCubePivotData: jest.fn() as jest.MockedFunction<() => Promise<EngineAPI.INxPivotPage[]>>,
    } as unknown as EngineAPI.IGenericObject;
    (model.getHyperCubePivotData as jest.Mock).mockResolvedValue([]);
    nextPageHandler = jest.fn();
    moreDataHandler = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('collapseLeft should call model.collapseLeft with correct parameters', () => {
    const { result } = renderHook(() => useDataModel({ model, nextPageHandler, moreDataHandler, hasMoreRows, hasMoreColumns, size, viewService }));
    result.current.collapseLeft(1, 2);
    expect((model as EngineAPI.IGenericObject).collapseLeft).toHaveBeenCalledWith(Q_PATH, 1, 2, false);
  });

  test('collapseTop should call model.collapseTop with correct parameters', () => {
    const { result } = renderHook(() => useDataModel({ model, nextPageHandler, moreDataHandler, hasMoreRows, hasMoreColumns, size, viewService }));
    result.current.collapseTop(1, 2);
    expect((model as EngineAPI.IGenericObject).collapseTop).toHaveBeenCalledWith(Q_PATH, 1, 2, false);
  });

  test('expandLeft should call model.expandLeft with correct parameters', () => {
    const { result } = renderHook(() => useDataModel({ model, nextPageHandler, moreDataHandler, hasMoreRows, hasMoreColumns, size, viewService }));
    result.current.expandLeft(1, 2);
    expect((model as EngineAPI.IGenericObject).expandLeft).toHaveBeenCalledWith(Q_PATH, 1, 2, false);
  });

  test('expandTop should call model.expandTop with correct parameters', () => {
    const { result } = renderHook(() => useDataModel({ model, nextPageHandler, moreDataHandler, hasMoreRows, hasMoreColumns, size, viewService }));
    result.current.expandTop(1, 2);
    expect((model as EngineAPI.IGenericObject).expandTop).toHaveBeenCalledWith(Q_PATH, 1, 2, false);
  });

  describe('fetchNextPage', () => {
    test('fetchNextPage should call not getHyperCubePivotData when model is a generic bookmark', async () => {
      // This is the case when the model is a snapshot (EngineAPI.IGenericBookmark)
      model = {
        collapseLeft: jest.fn(),
        collapseTop: jest.fn(),
        expandLeft: jest.fn(),
        expandTop: jest.fn(),
      } as unknown as EngineAPI.IGenericBookmark;

      const { result } = renderHook(() => useDataModel({ model, nextPageHandler, moreDataHandler, hasMoreRows, hasMoreColumns, size, viewService }));
      const output = await result.current.fetchNextPage(false, 2);

      expect(output).toBeFalsy();
    });

    test('fetchNextPage should call not getHyperCubePivotData when model is undefined', async () => {
      model = undefined;

      const { result } = renderHook(() => useDataModel({ model, nextPageHandler, moreDataHandler, hasMoreRows, hasMoreColumns, size, viewService }));
      const output = await result.current.fetchNextPage(false, 2);

      expect(output).toBeFalsy();
    });

    test('fetchNextPage should call not getHyperCubePivotData when there is no more row data', async () => {
      hasMoreRows = false;
      const { result } = renderHook(() => useDataModel({ model, nextPageHandler, moreDataHandler, hasMoreRows, hasMoreColumns, size, viewService }));
      const output = await result.current.fetchNextPage(true, 2);

      expect(output).toBeFalsy();
    });

    test('fetchNextPage should call not getHyperCubePivotData when there is no more column data', async () => {
      hasMoreColumns = false;
      const { result } = renderHook(() => useDataModel({ model, nextPageHandler, moreDataHandler, hasMoreRows, hasMoreColumns, size, viewService }));
      const output = await result.current.fetchNextPage(false, 2);

      expect(output).toBeFalsy();
    });

    test('fetchNextPage should call getHyperCubePivotData to fetch row data', async () => {
      const { result } = renderHook(() => useDataModel({ model, nextPageHandler, moreDataHandler, hasMoreRows, hasMoreColumns, size, viewService }));
      const output = await result.current.fetchNextPage(true, 2);

      expect(output).toBeTruthy();
      expect((model as EngineAPI.IGenericObject).getHyperCubePivotData).toHaveBeenCalledWith(Q_PATH, [{
        qLeft: 2,
        qTop: size.y,
        qHeight: 50,
        qWidth: 50,
      }]);
    });

    test('fetchNextPage should call getHyperCubePivotData to fetch column data', async () => {
      const { result } = renderHook(() => useDataModel({ model, nextPageHandler, moreDataHandler, hasMoreRows, hasMoreColumns, size, viewService }));
      const output = await result.current.fetchNextPage(false, 2);

      expect(output).toBeTruthy();
      expect((model as EngineAPI.IGenericObject).getHyperCubePivotData).toHaveBeenCalledWith(Q_PATH, [{
        qLeft: size.x,
        qTop: 2,
        qHeight: 50,
        qWidth: 50,
      }]);
    });

    test('fetchNextPage should handle when call to getHyperCubePivotData is rejected', async () => {
      const genericObjectModel = model as EngineAPI.IGenericObject;
      (genericObjectModel.getHyperCubePivotData as jest.Mock).mockRejectedValue(new Error('testing'));
      const { result } = renderHook(() => useDataModel({ model, nextPageHandler, moreDataHandler, hasMoreRows, hasMoreColumns, size, viewService }));
      const output = await result.current.fetchNextPage(false, 2);

      expect(output).toBeFalsy();
    });
  });

  describe('fetchMoreData', () => {
    test('fetchMoreData should call not getHyperCubePivotData when model is a generic bookmark', async () => {
      // This is the case when the model is a snapshot (EngineAPI.IGenericBookmark)
      model = {
        collapseLeft: jest.fn(),
        collapseTop: jest.fn(),
        expandLeft: jest.fn(),
        expandTop: jest.fn(),
      } as unknown as EngineAPI.IGenericBookmark;

      const { result } = renderHook(() => useDataModel({ model, nextPageHandler, moreDataHandler, hasMoreRows, hasMoreColumns, size, viewService }));
      const output = await result.current.fetchMoreData(1, 2, 10, 20);

      expect(output).toBeFalsy();
    });

    test('fetchMoreData should call getHyperCubePivotData to fetch more data', async () => {
      const { result } = renderHook(() => useDataModel({ model, nextPageHandler, moreDataHandler, hasMoreRows, hasMoreColumns, size, viewService }));
      const output = await result.current.fetchMoreData(1, 2, 10, 20);

      expect(output).toBeTruthy();
      expect((model as EngineAPI.IGenericObject).getHyperCubePivotData).toHaveBeenCalledWith(Q_PATH, [{
        qLeft: 1,
        qTop: 2,
        qHeight: 20,
        qWidth: 10,
      }]);
    });

    test('fetchMoreData should not try and fetch more data then available', async () => {
      size.x = 50;
      size.y = 60;
      const { result } = renderHook(() => useDataModel({ model, nextPageHandler, moreDataHandler, hasMoreRows, hasMoreColumns, size, viewService }));
      const output = await result.current.fetchMoreData(40, 50, 50, 50);

      expect(output).toBeTruthy();
      expect((model as EngineAPI.IGenericObject).getHyperCubePivotData).toHaveBeenCalledWith(Q_PATH, [{
        qLeft: 40,
        qTop: 50,
        qHeight: 10,
        qWidth: 10,
      }]);
    });

    test('fetchMoreData should handle when call to getHyperCubePivotData is rejected', async () => {
      const genericObjectModel = model as EngineAPI.IGenericObject;
      (genericObjectModel.getHyperCubePivotData as jest.Mock).mockRejectedValue(new Error('testing'));
      const { result } = renderHook(() => useDataModel({ model, nextPageHandler, moreDataHandler, hasMoreRows, hasMoreColumns, size, viewService }));
      const output = await result.current.fetchMoreData(1, 2, 10, 20);

      expect(output).toBeFalsy();
    });
  });
});
