/*  eslint-disable no-param-reassign */
import { useMemo, usePromise, useState } from '@nebula.js/stardust';
import createData, { addDataPage, addPage } from '../pivot-table/data';
import { DataModel, FetchMoreData, FetchNextPage, LayoutService, PivotData, ViewService } from '../types/types';
import useExpandOrCollapser from './use-expand-or-collapser';
import { DEFAULT_PAGE_SIZE, Q_PATH } from '../constants';
import useNebulaCallback from './use-nebula-callback';

const NOOP_PIVOT_DATA = {} as PivotData;

const MAX_GRID_SIZE = 10000;

const getPagesToTheTop = (viewService: ViewService, maxHeight: number): EngineAPI.IRect[] => {
  const { gridColumnStartIndex, gridRowStartIndex, gridWidth, gridHeight } = viewService;
  const pages = [] as EngineAPI.IRect[];

  if (!gridWidth && !gridHeight) { // handle zero size and when viewService has not yet been initialized
    return pages;
  }

  const totalHeight = Math.min(gridRowStartIndex + (gridHeight * 2), maxHeight);
  const batchSize = Math.floor(MAX_GRID_SIZE / gridWidth);
  let batchTop = Math.max(0, totalHeight - batchSize);
  let batchHeight = totalHeight - batchTop;

  do {
    pages.unshift({
      qLeft: gridColumnStartIndex,
      qTop: Math.max(0, batchTop),
      qWidth: gridWidth,
      qHeight: batchHeight,
    });

    batchHeight = Math.min(batchHeight, batchTop);
    batchTop -= batchSize;

  } while (pages[0]?.qTop > 0);

  return pages;
};

const getPagesToTheLeft = (viewService: ViewService, maxWidth: number): EngineAPI.IRect[] => {
  const { gridColumnStartIndex, gridRowStartIndex, gridWidth, gridHeight } = viewService;
  const pages = [] as EngineAPI.IRect[];

  if (!gridWidth && !gridHeight) { // handle zero size and when viewService has not yet been initialized
    return pages;
  }

  const totalWidth = Math.min(gridColumnStartIndex + (gridWidth * 2), maxWidth);
  const batchSize = Math.floor(MAX_GRID_SIZE / gridHeight);
  let batchLeft = Math.max(0, totalWidth - batchSize);
  let batchWidth = totalWidth - batchLeft;

  do {
    pages.unshift({
      qLeft: Math.max(0, batchLeft),
      qTop: gridRowStartIndex,
      qWidth: batchWidth,
      qHeight: gridHeight,
    });

    batchWidth = Math.min(batchWidth, batchLeft);
    batchLeft -= batchSize;

  } while (pages[0]?.qLeft > 0);

  return pages;
};

const getNextPage = (qLeft: number, qTop: number) => ({
  qLeft,
  qTop,
  qWidth: DEFAULT_PAGE_SIZE,
  qHeight: DEFAULT_PAGE_SIZE
});

export default function useDataModel(
  layoutService: LayoutService,
  model: EngineAPI.IGenericObject | undefined,
  viewService: ViewService
): DataModel {
  const [loading, setLoading] = useState<boolean>(false);
  const [pivotData, setPivotData] = useState<PivotData>(NOOP_PIVOT_DATA);
  const [hasMoreRows, setHasMoreRows] = useState(false);
  const [hasMoreColumns, setHasMoreColumns] = useState(false);
  const {
    collapseLeft,
    collapseTop,
    expandLeft,
    expandTop,
  } = useExpandOrCollapser(model);
  const { qHyperCube } = layoutService.layout;
  const { qLastExpandedPos, qPivotDataPages, qSize } = qHyperCube;

  const newLayoutHandler = useNebulaCallback(async () => {
    if (model) {
      const [pivotPage] = qPivotDataPages;
      let nextPivotData = createData(pivotPage, qHyperCube);

      if (qLastExpandedPos) {
        const pages = [
          ...getPagesToTheLeft(viewService, qSize.qcx),
          ...getPagesToTheTop(viewService, qSize.qcy)
        ];
        const fetchPageQueries = pages.map(async (page) => {
          const [nextPivotPage] = await model.getHyperCubePivotData(Q_PATH, [page]);
          nextPivotData = addPage(nextPivotData, nextPivotPage);
        });
        await Promise.all(fetchPageQueries)
          .catch(e => {
            // TODO handle error
            console.error(e);
          });

          viewService.shouldResetScroll = false;
      } else {
        // Layout was received because of a property change or selection change (confirmed or cancelled)
        viewService.shouldResetScroll = true;
      }

      setHasMoreRows(nextPivotData.size.data.y < qSize.qcy);
      setHasMoreColumns(nextPivotData.size.data.x < qSize.qcx);
      // setHyperCube(layout.qHyperCube);
      setPivotData(nextPivotData);
    }
  }, [qHyperCube, qLastExpandedPos, qPivotDataPages, qSize, model, viewService]);

  usePromise(() => newLayoutHandler(), [newLayoutHandler]);

  const fetchNextPage = useNebulaCallback<FetchNextPage>(async (isRow: boolean, startIndex: number) => {
    if (loading || !model) return;
    if (isRow && !hasMoreRows) return;
    if (!isRow && !hasMoreColumns) return;

    setLoading(true);

    try {
      let nextPivotPage: EngineAPI.INxPivotPage;
      let nextPivotData: PivotData;
      if (isRow) {
        const nextArea = getNextPage(startIndex, pivotData.size.data.y);
        [nextPivotPage] = await model.getHyperCubePivotData(Q_PATH, [nextArea]);
        nextPivotData = addPage(pivotData, nextPivotPage);
        setHasMoreRows(nextPivotData.size.data.y < qSize.qcy);
      } else {
        const nextArea = getNextPage(pivotData.size.data.x, startIndex);
        [nextPivotPage] = await model.getHyperCubePivotData(Q_PATH, [nextArea]);
        nextPivotData = addPage(pivotData, nextPivotPage);
        setHasMoreColumns(nextPivotData.size.data.x < qSize.qcx);
      }

      setLoading(false);
      setPivotData(nextPivotData);
      viewService.shouldResetScroll = false;
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [model, qSize.qcy, qSize.qcx, loading, pivotData, viewService]);

  const fetchMoreData = useNebulaCallback<FetchMoreData>(async (left: number, top: number, width: number, height: number) => {
    if (loading || !model) return;

    setLoading(true);

    try {
      const nextArea = {
        qLeft: left,
        qTop: top,
        qWidth: Math.min(width, pivotData.size.data.x - left),
        qHeight: Math.min(height, pivotData.size.data.y - top)
      };

      const [nextPivotPage] = await model.getHyperCubePivotData(Q_PATH, [nextArea]);
      const nextPivotData = addDataPage(pivotData, nextPivotPage);
      setLoading(false);
      setPivotData(nextPivotData);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [model, loading, pivotData]);

  const dataModel = useMemo<DataModel>(() => ({
    fetchNextPage,
    fetchMoreData,
    hasMoreColumns,
    hasMoreRows,
    collapseLeft,
    collapseTop,
    expandLeft,
    expandTop,
    pivotData,
    hasData: pivotData !== NOOP_PIVOT_DATA,
  }),[fetchNextPage,
    fetchMoreData,
    hasMoreColumns,
    hasMoreRows,
    collapseLeft,
    collapseTop,
    expandLeft,
    expandTop,
    pivotData,
  ]);

  return dataModel;
}
