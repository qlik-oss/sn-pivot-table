/*  eslint-disable no-param-reassign */
import type { ColumnWidth } from "@qlik/nebula-table-utils/lib/components/ColumnAdjuster";
import { useCallback, useMemo } from "react";
import { Q_PATH } from "../../constants";
import type { Model } from "../../types/QIX";
import {
  ColumnWidthLocation,
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
      if (!genericObjectModel?.getHyperCubePivotData || pages.length === 0) return;

      try {
        const pivotPages = await genericObjectModel.getHyperCubePivotData(
          Q_PATH,
          pages.reduce<EngineAPI.INxPage[]>(
            (handledPages, page) => [...handledPages, ...handleMaxEnginePageSize(page)],
            [],
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
    (newColumnWidth, { dimensionInfoIndex, isLeftColumn, x = 0, columnWidthLocation }) => {
      const { qMeasureInfo, qDimensionInfo, topHeadersColumnWidth } = layoutService.layout.qHyperCube;
      let paths: { qPath: string; oldValue?: ColumnWidth }[] = [];

      switch (columnWidthLocation) {
        case ColumnWidthLocation.Dimension:
          paths = [
            {
              qPath: `${Q_PATH}/qDimensions/${dimensionInfoIndex}/qDef/columnWidth`,
              oldValue: qDimensionInfo[dimensionInfoIndex].columnWidth,
            },
          ];
          break;
        case ColumnWidthLocation.Measures:
          if (isLeftColumn) {
            // This updates hidden measures as well so that if a measure becomes visible again it will not affect the column width
            paths = qMeasureInfo.map((info, idx) => ({
              qPath: `${Q_PATH}/qMeasures/${idx}/qDef/columnWidth`,
              oldValue: info.columnWidth,
            }));
          } else {
            const idx = layoutService.getMeasureInfoIndexFromCellIndex(x);
            paths = [{ qPath: `${Q_PATH}/qMeasures/${idx}/qDef/columnWidth`, oldValue: qMeasureInfo[idx].columnWidth }];
          }
          break;
        case ColumnWidthLocation.Pivot:
          paths = [{ qPath: `${Q_PATH}/topHeadersColumnWidth`, oldValue: topHeadersColumnWidth }];
          break;
        default:
          break;
      }

      const patches = paths.map((value) => {
        const { qPath, oldValue } = value;
        const qOp = (oldValue ? "Replace" : "Add") as EngineAPI.NxPatchOpType;
        const qValue = JSON.stringify({ ...oldValue, ...newColumnWidth });
        return { qPath, qOp, qValue };
      });

      void model?.applyPatches(patches, true);
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
