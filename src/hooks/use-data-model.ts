/*  eslint-disable no-param-reassign */
import { useMemo, usePromise, useState } from '@nebula.js/stardust';
import createData, { addDataPage, addPage } from '../pivot-table/data';
import { DataModel, FetchMoreData, FetchNextPage, PivotData, ScrollService } from '../types/types';
import useExpandOrCollapser from './use-expand-or-collapser';
import { DEFAULT_PAGE_SIZE, PSEUDO_DIMENSION_INDEX, Q_PATH } from '../constants';
import useNebulaCallback from './use-nebula-callback';
import { NxSelectionCellType } from '../types/QIX';

const NOOP_PIVOT_DATA = {} as PivotData;

const MAX_GRID_SIZE = 10000;

const getPagesToTheTop = (scrollService: ScrollService, maxHeight: number): EngineAPI.IRect[] => {
  const { scrollLeftPosition: left, scrollTopPosition: top, scrollWidth: width, scrollHeight: height } = scrollService;
  const pages = [] as EngineAPI.IRect[];

  if (width === 0 && height === 0) {
    return pages;
  }

  const totalHeight = Math.min(top + (height * 2), maxHeight);
  const batchSize = Math.floor(MAX_GRID_SIZE / width);
  let batchTop = Math.max(0, totalHeight - batchSize);
  let batchHeight = totalHeight - batchTop;

  do {
    pages.unshift({
      qLeft: left,
      qTop: Math.max(0, batchTop),
      qWidth: width,
      qHeight: batchHeight,
    });

    batchHeight = Math.min(batchHeight, batchTop);
    batchTop -= batchSize;

  } while (pages[0]?.qTop > 0);

  return pages;
};

const getPagesToTheLeft = (scrollService: ScrollService, maxWidth: number): EngineAPI.IRect[] => {
  const { scrollLeftPosition: left, scrollTopPosition: top, scrollWidth: width, scrollHeight: height } = scrollService;
  const pages = [] as EngineAPI.IRect[];

  if (width === 0 && height === 0) {
    return pages;
  }

  const totalWidth = Math.min(left + (width * 2), maxWidth);
  const batchSize = Math.floor(MAX_GRID_SIZE / height);
  let batchLeft = Math.max(0, totalWidth - batchSize);
  let batchWidth = totalWidth - batchLeft;

  do {
    pages.unshift({
      qLeft: Math.max(0, batchLeft),
      qTop: top,
      qWidth: batchWidth,
      qHeight: height,
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
  layout: EngineAPI.IGenericHyperCubeLayout,
  model: EngineAPI.IGenericObject | undefined,
  scrollService: ScrollService
): DataModel {
  const [loading, setLoading] = useState<boolean>(false);
  const [pivotData, setPivotData] = useState<PivotData>(NOOP_PIVOT_DATA);
  const [hasMoreRows, setHasMoreRows] = useState(false);
  const [hasMoreColumns, setHasMoreColumns] = useState(false);
  const [qHyperCube, setHyperCube] = useState<EngineAPI.IHyperCube>({} as EngineAPI.IHyperCube);
  const {
    collapseLeft,
    collapseTop,
    expandLeft,
    expandTop,
  } = useExpandOrCollapser(model);

  const newLayoutHandler = useNebulaCallback(async () => {
    if (layout && model) {
      const { qLastExpandedPos, qPivotDataPages, qSize } = layout.qHyperCube;
      const pivotPage = qPivotDataPages[0];
      let nextPivotData = createData(pivotPage, layout.qHyperCube);

      if (qLastExpandedPos) {
        const pages = [
          ...getPagesToTheLeft(scrollService, qSize.qcx),
          ...getPagesToTheTop(scrollService, qSize.qcy)
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

        scrollService.shouldResetScroll = false;
      } else {
        // Layout was received because of a property change or selection change (confirmed or cancelled)
        scrollService.shouldResetScroll = true;
      }

      setHasMoreRows(nextPivotData.size.data.y < layout.qHyperCube.qSize.qcy);
      setHasMoreColumns(nextPivotData.size.data.x < layout.qHyperCube.qSize.qcx);
      setHyperCube(layout.qHyperCube);
      setPivotData(nextPivotData);
    }
  }, [layout, model, scrollService]);

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
        setHasMoreRows(nextPivotData.size.data.y < qHyperCube.qSize.qcy);
      } else {
        const nextArea = getNextPage(pivotData.size.data.x, startIndex);
        [nextPivotPage] = await model.getHyperCubePivotData(Q_PATH, [nextArea]);
        nextPivotData = addPage(pivotData, nextPivotPage);
        setHasMoreColumns(nextPivotData.size.data.x < qHyperCube.qSize.qcx);
      }

      setLoading(false);
      setPivotData(nextPivotData);
      scrollService.shouldResetScroll = false;
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [model, qHyperCube, loading, pivotData, scrollService]);

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
  }, [model, qHyperCube, loading, pivotData]);

  const isDimensionLocked = useNebulaCallback((qType: EngineAPI.NxSelectionCellType, qRow: number, qCol: number) => {
    if (qType === NxSelectionCellType.NX_CELL_LEFT) {
      return qHyperCube.qDimensionInfo.slice(0, qHyperCube.qNoOfLeftDims)?.[qCol]?.qLocked;
    }

    if (qType === NxSelectionCellType.NX_CELL_TOP) {
      return qHyperCube.qDimensionInfo.slice(qHyperCube.qNoOfLeftDims)?.[qRow]?.qLocked;
    }

    return false;
  }, [qHyperCube]);

  const getDimensionInfo = useNebulaCallback(() => qHyperCube.qDimensionInfo, [qHyperCube]);

  const getMeasureInfo = useNebulaCallback(() => qHyperCube.qMeasureInfo, [qHyperCube]);

  const getNoLeftDims = useNebulaCallback(() => qHyperCube.qNoOfLeftDims, [qHyperCube]);

  const getMeasureInfoIndexFromCellIndex = useNebulaCallback((index: number) => {
    const { qNoOfLeftDims, qEffectiveInterColumnSortOrder, qMeasureInfo } = qHyperCube;
    const pIndex = qEffectiveInterColumnSortOrder.findIndex((num) => num === PSEUDO_DIMENSION_INDEX);
    if (pIndex < qNoOfLeftDims) {
      return 0;
    }

    return index % qMeasureInfo.length;
  }, [qHyperCube]);

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
    isDimensionLocked,
    getDimensionInfo,
    getMeasureInfo,
    getNoLeftDims,
    getMeasureInfoIndexFromCellIndex,
  }),[fetchNextPage,
    fetchMoreData,
    hasMoreColumns,
    hasMoreRows,
    collapseLeft,
    collapseTop,
    expandLeft,
    expandTop,
    pivotData,
    isDimensionLocked,
    getDimensionInfo,
    getMeasureInfo,
    getNoLeftDims,
    getMeasureInfoIndexFromCellIndex,
  ]);

  return dataModel;
}
