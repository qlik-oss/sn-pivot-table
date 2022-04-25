/*  eslint-disable no-param-reassign */
import { useMemo, usePromise, useState } from '@nebula.js/stardust';
import { DataModel, DataService, FetchMoreData, FetchNextPage, LayoutService, PivotData, ViewService } from '../types/types';
import useExpandOrCollapser from './use-expand-or-collapser';
import { DEFAULT_PAGE_SIZE, Q_PATH } from '../constants';
import useNebulaCallback from './use-nebula-callback';

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
  model: EngineAPI.IGenericObject | undefined,
  layoutService: LayoutService,
  dataService: DataService,
  viewService: ViewService
): DataModel {
  const [loading, setLoading] = useState<boolean>(false);
  const [pivotData, setPivotData] = useState<PivotData>(dataService.getData());
  const [hasMoreRows, setHasMoreRows] = useState(dataService.hasMoreRows());
  const [hasMoreColumns, setHasMoreColumns] = useState(dataService.hasMoreColumns());
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
      if (qLastExpandedPos) {
        const pages = [
          ...getPagesToTheLeft(viewService, qSize.qcx),
          ...getPagesToTheTop(viewService, qSize.qcy)
        ];
        const fetchPageQueries = pages.map(async (page) => {
          const [nextPivotPage] = await model.getHyperCubePivotData(Q_PATH, [page]);
          dataService.addPage(nextPivotPage);
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

      setHasMoreRows(dataService.hasMoreRows());
      setHasMoreColumns(dataService.hasMoreColumns());
      // setHyperCube(layout.qHyperCube);
      setPivotData(dataService.getData());
    }
  }, [qHyperCube, qLastExpandedPos, qPivotDataPages, qSize, model, viewService, dataService]);

  usePromise(() => newLayoutHandler(), [newLayoutHandler]);

  const fetchNextPage = useNebulaCallback<FetchNextPage>(async (isRow: boolean, startIndex: number) => {
    if (loading || !model) return;
    if (isRow && !dataService.hasMoreRows()) return;
    if (!isRow && !dataService.hasMoreColumns()) return;

    setLoading(true);

    try {
      if (isRow) {
        const nextArea = getNextPage(startIndex, dataService.getData().size.data.y);
        const [nextPivotPage] = await model.getHyperCubePivotData(Q_PATH, [nextArea]);
        dataService.addPage(nextPivotPage);
        setHasMoreRows(dataService.hasMoreRows());
      } else {
        const nextArea = getNextPage(dataService.getData().size.data.x, startIndex);
        const [nextPivotPage] = await model.getHyperCubePivotData(Q_PATH, [nextArea]);
        dataService.addPage(nextPivotPage);
        setHasMoreColumns(dataService.hasMoreColumns());
      }

      setLoading(false);
      setPivotData(dataService.getData());
      viewService.shouldResetScroll = false;
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [model, qSize.qcy, qSize.qcx, loading, viewService, dataService]);

  const fetchMoreData = useNebulaCallback<FetchMoreData>(async (left: number, top: number, width: number, height: number) => {
    if (loading || !model) return;

    setLoading(true);

    try {
      const nextArea = {
        qLeft: left,
        qTop: top,
        qWidth: Math.min(width, dataService.getData().size.data.x - left),
        qHeight: Math.min(height, dataService.getData().size.data.y - top)
      };

      const [nextPivotPage] = await model.getHyperCubePivotData(Q_PATH, [nextArea]);
      dataService.addDataPage(nextPivotPage);
      setLoading(false);
      setPivotData(dataService.getData());
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [model, loading, dataService]);

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
