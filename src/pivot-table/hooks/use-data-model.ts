/*  eslint-disable no-param-reassign */
import { useCallback, useMemo } from "react";
import { Q_PATH } from "../../constants";
import { Model } from "../../types/QIX";
import { DataModel, ExpandOrCollapser, FetchMoreData } from "../../types/types";

interface UseDataModelProps {
  model: Model;
  nextPageHandler: (page: EngineAPI.INxPivotPage) => void;
  moreDataHandler: (page: EngineAPI.INxPivotPage) => void;
}

export default function useDataModel({ model, nextPageHandler, moreDataHandler }: UseDataModelProps): DataModel {
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

  const fetchMoreData = useCallback<FetchMoreData>(
    async (left: number, top: number, width: number, height: number): Promise<boolean> => {
      if (!genericObjectModel?.getHyperCubePivotData) return false;
      if (ref.isLoading) return false;

      ref.isLoading = true;

      try {
        const nextArea = {
          qLeft: left,
          qTop: top,
          qWidth: width,
          qHeight: height,
        };
        const [pivotPage] = await genericObjectModel.getHyperCubePivotData(Q_PATH, [nextArea]);
        moreDataHandler(pivotPage);
        nextPageHandler(pivotPage);

        ref.isLoading = false;
        return true;
      } catch (error) {
        console.error(error);
        ref.isLoading = false;
        return false;
      }
    },
    [genericObjectModel, moreDataHandler, nextPageHandler, ref]
  );

  const dataModel = useMemo<DataModel>(
    () => ({
      fetchMoreData,
      collapseLeft,
      collapseTop,
      expandLeft,
      expandTop,
    }),
    [fetchMoreData, collapseLeft, collapseTop, expandLeft, expandTop]
  );

  return dataModel;
}
