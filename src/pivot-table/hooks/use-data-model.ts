/*  eslint-disable no-param-reassign */
import { useMemo, useCallback } from 'react';
import { DataModel, ExpandOrCollapser, FetchMoreData, FetchNextPage, Point, ViewService } from '../../types/types';
import { DEFAULT_PAGE_SIZE, Q_PATH } from '../../constants';

const getNextPage = (qLeft: number, qTop: number) => ({
  qLeft,
  qTop,
  qWidth: DEFAULT_PAGE_SIZE,
  qHeight: DEFAULT_PAGE_SIZE
});

interface UseDataModelProps {
  model: EngineAPI.IGenericObject;
  nextPageHandler: (page: EngineAPI.INxPivotPage) => void;
  moreDataHandler: (page: EngineAPI.INxPivotPage) => void;
  hasMoreRows: boolean;
  hasMoreColumns: boolean;
  size: Point;
  viewService: ViewService;
}

export default function useDataModel({
  model,
  nextPageHandler,
  moreDataHandler,
  hasMoreRows,
  hasMoreColumns,
  size,
  viewService
}: UseDataModelProps): DataModel {
  const ref = useMemo(() => ({ isLoading: false }), []);

  const collapseLeft = useCallback<ExpandOrCollapser>(async (rowIndex: number, colIndex: number) => {
    await model.collapseLeft(Q_PATH, rowIndex, colIndex, false);
  }, [model]);

  const collapseTop = useCallback<ExpandOrCollapser>(async (rowIndex: number, colIndex: number) => {
    await model.collapseTop(Q_PATH, rowIndex, colIndex, false);
  }, [model]);

  const expandLeft = useCallback<ExpandOrCollapser>(async (rowIndex: number, colIndex: number) => {
    await model.expandLeft(Q_PATH, rowIndex, colIndex, false);
  }, [model]);

  const expandTop = useCallback<ExpandOrCollapser>(async (rowIndex: number, colIndex: number) => {
    await model.expandTop(Q_PATH, rowIndex, colIndex, false);
  }, [model]);

  const fetchNextPage = useCallback<FetchNextPage>(async (isRow: boolean, startIndex: number) => {
    if (ref.isLoading) return;
    if (isRow && !hasMoreRows) return;
    if (!isRow && !hasMoreColumns) return;

    ref.isLoading = true;

    try {
      if (isRow) {
        const nextArea = getNextPage(startIndex, size.y);
        const [page] = await model.getHyperCubePivotData(Q_PATH, [nextArea]);
        nextPageHandler(page);
      } else {
        const nextArea = getNextPage(size.x, startIndex);
        const [page] = await model.getHyperCubePivotData(Q_PATH, [nextArea]);
        nextPageHandler(page);
      }

      ref.isLoading = false;
    } catch (error) {
      console.error(error);
      ref.isLoading = false;
    }
  }, [model, ref, viewService, size.x, size.y, hasMoreRows, hasMoreColumns]);

  const fetchMoreData = useCallback<FetchMoreData>(async (left: number, top: number, width: number, height: number) => {
    if (ref.isLoading) return;

    ref.isLoading = true;

    try {
      const nextArea = {
        qLeft: left,
        qTop: top,
        qWidth: Math.min(width, size.x - left),
        qHeight: Math.min(height, size.y - top)
      };

      const [pivotPage] = await model.getHyperCubePivotData(Q_PATH, [nextArea]);
      moreDataHandler(pivotPage);
      ref.isLoading = false;
    } catch (error) {
      console.error(error);
      ref.isLoading = false;
    }
  }, [model, ref, size.x, size.y]);

  const dataModel = useMemo<DataModel>(() => ({
    fetchNextPage,
    fetchMoreData,
    collapseLeft,
    collapseTop,
    expandLeft,
    expandTop,
  }),[fetchNextPage,
    fetchMoreData,
    collapseLeft,
    collapseTop,
    expandLeft,
    expandTop,
  ]);

  return dataModel;
}
