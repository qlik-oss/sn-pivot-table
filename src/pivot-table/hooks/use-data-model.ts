/*  eslint-disable no-param-reassign */
import { useCallback, useMemo } from "react";
import { Q_PATH } from "../../constants";
import type { Model } from "../../types/QIX";
import type { DataModel, ExpandOrCollapser, FetchMoreData, PageInfo } from "../../types/types";
import useMutableProp from "./use-mutable-prop";

export interface UseDataModelProps {
  model: Model;
  nextPageHandler: (page: EngineAPI.INxPivotPage) => void;
  pageInfo: PageInfo;
}

export default function useDataModel({ model, nextPageHandler, pageInfo }: UseDataModelProps): DataModel {
  const currentPage = useMutableProp(pageInfo.page);
  const genericObjectModel = model as EngineAPI.IGenericObject | undefined;

  const collapseLeft = useCallback<ExpandOrCollapser>(
    async (rowIndex: number, colIndex: number) => {
      await genericObjectModel?.collapseLeft?.(Q_PATH, rowIndex, colIndex, false);
    },
    [genericObjectModel],
  );

  const collapseTop = useCallback<ExpandOrCollapser>(
    async (rowIndex: number, colIndex: number) => {
      await genericObjectModel?.collapseTop(Q_PATH, rowIndex, colIndex, false);
    },
    [genericObjectModel],
  );

  const expandLeft = useCallback<ExpandOrCollapser>(
    async (rowIndex: number, colIndex: number) => {
      await genericObjectModel?.expandLeft(Q_PATH, rowIndex, colIndex, false);
    },
    [genericObjectModel],
  );

  const expandTop = useCallback<ExpandOrCollapser>(
    async (rowIndex: number, colIndex: number) => {
      await genericObjectModel?.expandTop(Q_PATH, rowIndex, colIndex, false);
    },
    [genericObjectModel],
  );

  const fetchMoreData = useCallback<FetchMoreData>(
    async (left: number, top: number, width: number, height: number): Promise<void> => {
      if (!genericObjectModel?.getHyperCubePivotData) return;

      try {
        const nextArea = {
          qLeft: left,
          qTop: pageInfo.page * pageInfo.rowsPerPage + top,
          qWidth: width,
          qHeight: height,
        };

        const [pivotPage] = await genericObjectModel.getHyperCubePivotData(Q_PATH, [nextArea]);

        // Guard against page changes
        if (currentPage.current === pageInfo.page) {
          nextPageHandler(pivotPage);
        }
      } catch (error) {
        console.error(error); // eslint-disable-line
      }
    },
    [genericObjectModel, nextPageHandler, pageInfo, currentPage],
  );

  const dataModel = useMemo<DataModel>(
    () => ({
      fetchMoreData,
      collapseLeft,
      collapseTop,
      expandLeft,
      expandTop,
    }),
    [fetchMoreData, collapseLeft, collapseTop, expandLeft, expandTop],
  );

  return dataModel;
}
