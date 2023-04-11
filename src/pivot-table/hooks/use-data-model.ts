/*  eslint-disable no-param-reassign */
import { useCallback, useMemo } from "react";
import { DEFAULT_PAGE_SIZE, Q_PATH } from "../../constants";
import { Model } from "../../types/QIX";
import { DataModel, ExpandOrCollapser, FetchMoreData, FetchNextPage, Point, ViewService } from "../../types/types";

const getNextPage = (qLeft: number, qTop: number) => ({
  qLeft,
  qTop,
  qWidth: DEFAULT_PAGE_SIZE,
  qHeight: DEFAULT_PAGE_SIZE,
});

interface UseDataModelProps {
  model: Model;
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
  viewService,
}: UseDataModelProps): DataModel {
  const ref = useMemo(() => ({ isLoading: false }), []);
  const genericObjectModel = model as EngineAPI.IGenericObject | undefined;

  const collapseLeft = useCallback<ExpandOrCollapser>(
    async (rowIndex: number, colIndex: number) => {
      await genericObjectModel?.collapseLeft?.(Q_PATH, rowIndex, colIndex, false);
    },
    [genericObjectModel]
  );

  const collapseTop = useCallback<ExpandOrCollapser>(
    async (rowIndex: number, colIndex: number) => {
      await genericObjectModel?.collapseTop(Q_PATH, rowIndex, colIndex, false);
    },
    [genericObjectModel]
  );

  const expandLeft = useCallback<ExpandOrCollapser>(
    async (rowIndex: number, colIndex: number) => {
      await genericObjectModel?.expandLeft(Q_PATH, rowIndex, colIndex, false);
    },
    [genericObjectModel]
  );

  const expandTop = useCallback<ExpandOrCollapser>(
    async (rowIndex: number, colIndex: number) => {
      await genericObjectModel?.expandTop(Q_PATH, rowIndex, colIndex, false);
    },
    [genericObjectModel]
  );

  const fetchNextPage = useCallback<FetchNextPage>(
    async (isRow: boolean, startIndex: number): Promise<boolean> => {
      if (!genericObjectModel?.getHyperCubePivotData) return false;
      if (ref.isLoading) return false;
      if (isRow && !hasMoreRows) return false;
      if (!isRow && !hasMoreColumns) return false;

      ref.isLoading = true;

      try {
        if (isRow) {
          const nextArea = getNextPage(startIndex, size.y);
          const [page] = await genericObjectModel.getHyperCubePivotData(Q_PATH, [nextArea]);
          nextPageHandler(page);
        } else {
          const nextArea = getNextPage(size.x, startIndex);
          const [page] = await genericObjectModel.getHyperCubePivotData(Q_PATH, [nextArea]);
          nextPageHandler(page);
        }

        ref.isLoading = false;
        return true;
      } catch (error) {
        console.error(error);
        ref.isLoading = false;
        return false;
      }
    },
    [genericObjectModel, ref, viewService, size.x, size.y, hasMoreRows, hasMoreColumns]
  );

  const fetchMoreData = useCallback<FetchMoreData>(
    async (left: number, top: number, width: number, height: number): Promise<boolean> => {
      if (!genericObjectModel?.getHyperCubePivotData) return false;
      if (ref.isLoading) return false;

      ref.isLoading = true;

      try {
        const nextArea = {
          qLeft: left,
          qTop: top,
          qWidth: Math.min(width, size.x - left),
          qHeight: Math.min(height, size.y - top),
        };

        const [pivotPage] = await genericObjectModel.getHyperCubePivotData(Q_PATH, [nextArea]);
        moreDataHandler(pivotPage);
        ref.isLoading = false;
        return true;
      } catch (error) {
        console.error(error);
        ref.isLoading = false;
        return false;
      }
    },
    [genericObjectModel, ref, size.x, size.y]
  );

  const dataModel = useMemo<DataModel>(
    () => ({
      fetchNextPage,
      fetchMoreData,
      collapseLeft,
      collapseTop,
      expandLeft,
      expandTop,
    }),
    [fetchNextPage, fetchMoreData, collapseLeft, collapseTop, expandLeft, expandTop]
  );

  return dataModel;
}
