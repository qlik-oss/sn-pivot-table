/*  eslint-disable no-param-reassign */
import { useMemo, useState } from '@nebula.js/stardust';
import { DataModel, DataService, FetchMoreData, FetchNextPage, LayoutService, ViewService } from '../types/types';
import useExpandOrCollapser from './use-expand-or-collapser';
import { DEFAULT_PAGE_SIZE, Q_PATH } from '../constants';
import useNebulaCallback from './use-nebula-callback';

const getNextPage = (qLeft: number, qTop: number) => ({
  qLeft,
  qTop,
  qWidth: DEFAULT_PAGE_SIZE,
  qHeight: DEFAULT_PAGE_SIZE
});

export default function useDataModel(
  model: EngineAPI.IGenericObject | undefined,
  setNextPivotPage: (page: EngineAPI.INxPivotPage) => void,
  dataService: DataService,
  viewService: ViewService
): DataModel {
  const ref = useMemo(() => ({ isLoading: false }), []);
  const {
    collapseLeft,
    collapseTop,
    expandLeft,
    expandTop,
  } = useExpandOrCollapser(model);

  const fetchNextPage = useNebulaCallback<FetchNextPage>(async (isRow: boolean, startIndex: number) => {
    if (ref.isLoading || !model) return;
    if (isRow && !dataService.hasMoreRows) return;
    if (!isRow && !dataService.hasMoreColumns) return;

    ref.isLoading = true;

    try {
      if (isRow) {
        const nextArea = getNextPage(startIndex, dataService.size.data.y);
        const [nextPivotPage] = await model.getHyperCubePivotData(Q_PATH, [nextArea]);
        setNextPivotPage(nextPivotPage);
      } else {
        const nextArea = getNextPage(dataService.size.data.x, startIndex);
        const [nextPivotPage] = await model.getHyperCubePivotData(Q_PATH, [nextArea]);
        setNextPivotPage(nextPivotPage);
      }

      ref.isLoading = false;
      viewService.shouldResetScroll = false;
    } catch (error) {
      console.error(error);
      ref.isLoading = false;
    }
  }, [model, ref, viewService, dataService]);

  const fetchMoreData = useNebulaCallback<FetchMoreData>(async (left: number, top: number, width: number, height: number) => {
    if (ref.isLoading || !model) return;

    ref.isLoading = true;

    try {
      const nextArea = {
        qLeft: left,
        qTop: top,
        qWidth: Math.min(width, dataService.size.data.x - left),
        qHeight: Math.min(height, dataService.size.data.y - top)
      };

      const [pivotPage] = await model.getHyperCubePivotData(Q_PATH, [nextArea]);
      setNextPivotPage(pivotPage);
      ref.isLoading = false;
    } catch (error) {
      console.error(error);
      ref.isLoading = false;
    }
  }, [model, ref, dataService]);

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
