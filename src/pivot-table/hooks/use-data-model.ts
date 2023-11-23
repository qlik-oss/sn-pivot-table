/*  eslint-disable no-param-reassign */
import { useCallback, useMemo } from "react";
import { PSEUDO_DIMENSION_INDEX, Q_PATH } from "../../constants";
import type { Model } from "../../types/QIX";
import {
  type ApplyColumnWidth,
  type DataModel,
  type ExpandOrCollapser,
  type FetchPages,
  type LayoutService,
  type PageInfo,
} from "../../types/types";
import handleMaxEnginePageSize from "../../utils/handle-max-engine-size";
import useMutableProp from "./use-mutable-prop";

export interface UseDataModelProps {
  model: Model;
  nextPageHandler: (pages: EngineAPI.INxPivotPage[]) => void;
  pageInfo: PageInfo;
  layoutService: LayoutService;
}

export default function useDataModel({
  model,
  nextPageHandler,
  pageInfo,
  layoutService,
}: UseDataModelProps): DataModel {
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

  const fetchPages = useCallback<FetchPages>(
    async (pages: EngineAPI.INxPage[]): Promise<void> => {
      if (!genericObjectModel?.getHyperCubePivotData) return;

      try {
        const pivotPages = await genericObjectModel.getHyperCubePivotData(
          Q_PATH,
          pages.reduce(
            (handlesPages, page) => [...handlesPages, ...handleMaxEnginePageSize(page)],
            [] as EngineAPI.INxPage[],
          ),
        );

        // Guard against page changes
        if (currentPage.current === pageInfo.page) {
          nextPageHandler(pivotPages);
        }
      } catch (error) {
        console.error(error); // eslint-disable-line
      }
    },
    [genericObjectModel, nextPageHandler, pageInfo, currentPage],
  );

  const applyColumnWidth = useCallback<ApplyColumnWidth>(
    (newColumnWidth, { dimensionInfoIndex, isLeftColumn, x = 0 }) => {
      const { qMeasureInfo, qDimensionInfo } = layoutService.layout.qHyperCube;
      const isPseudoDimension = dimensionInfoIndex === PSEUDO_DIMENSION_INDEX;
      let indexes: number[];

      if (isPseudoDimension) {
        indexes = isLeftColumn
          ? [...Array(qMeasureInfo.length).keys()] // apply column width to all measures, since they are in the same column
          : [layoutService.getMeasureInfoIndexFromCellIndex(x)];
      } else {
        // cell indexes don't correspond to dimension indexes, so we need to compensate for potential prior pseudo dim (and left side dims)
        indexes = [dimensionInfoIndex];
      }

      const patches = indexes.map((idx) => {
        const qPath = `${Q_PATH}/${isPseudoDimension ? "qMeasures" : "qDimensions"}/${idx}/qDef/columnWidth`;
        const oldColumnWidth = isPseudoDimension ? qMeasureInfo[idx].columnWidth : qDimensionInfo[idx].columnWidth;

        return oldColumnWidth
          ? {
              qPath,
              qOp: "Replace" as EngineAPI.NxPatchOpType,
              qValue: JSON.stringify({ ...oldColumnWidth, ...newColumnWidth }),
            }
          : {
              qPath,
              qOp: "Add" as EngineAPI.NxPatchOpType,
              qValue: JSON.stringify(newColumnWidth),
            };
      });

      // typescript doesn't like unresolved promises, so we have to do a no-op .then()
      // there is nothing that needs to happen after applyPatches, so no need for this function to be async
      model?.applyPatches(patches, true).then(
        () => {},
        () => {},
      );
    },
    [model, layoutService],
  );

  const dataModel = useMemo<DataModel>(
    () => ({
      collapseLeft,
      collapseTop,
      expandLeft,
      expandTop,
      applyColumnWidth,
      fetchPages,
    }),
    [collapseLeft, collapseTop, expandLeft, expandTop, applyColumnWidth, fetchPages],
  );

  return dataModel;
}
