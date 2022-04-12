import { useMemo, usePromise, useState, useEffect } from '@nebula.js/stardust';
import { debouncer } from 'qlik-chart-modules';
import createData, { appendLeftData, appendTopData, appendData } from '../pivot-table/data';
import { DataModel, FetchMoreData, FetchNextPage, PivotData } from '../types/types';
import useExpandOrCollapser from './use-expand-or-collapser';
import { DEFAULT_PAGE_SIZE, PSEUDO_DIMENSION_INDEX, Q_PATH } from '../constants';
import useNebulaCallback from './use-nebula-callback';
import { NxSelectionCellType } from '../types/QIX';

const NOOP_PIVOT_DATA = {} as PivotData;

const getNextArea = (qWidth: number, qHeight: number) => ({
  qLeft: 0,
  qTop: 0,
  qWidth,
  qHeight
});

const getNextPage = (qLeft: number, qTop: number) => ({
  qLeft,
  qTop,
  qWidth: DEFAULT_PAGE_SIZE,
  qHeight: DEFAULT_PAGE_SIZE
});

export default function useDataModel(layout: EngineAPI.IGenericHyperCubeLayout, model: EngineAPI.IGenericObject | undefined ): DataModel {
  const [loading, setLoading] = useState<boolean>(false);
  const [pivotData, setPivotData] = useState<PivotData>(NOOP_PIVOT_DATA);
  const [hasMoreRows, setHasMoreRows] = useState(false);
  const [hasMoreColumns, setHasMoreColumns] = useState(false);
  const [qHyperCube, setHyperCube] = useState<EngineAPI.IHyperCube>({} as EngineAPI.IHyperCube);
  const [maxAreaWidth, setMaxAreaWidth] = useState(DEFAULT_PAGE_SIZE);
  const [maxAreaHeight, setMaxAreaHeight] = useState(DEFAULT_PAGE_SIZE);
  const [qArea, setArea] = useState<EngineAPI.IRect>(layout.qHyperCube?.qPivotDataPages[0]?.qArea);
  const {
    collapseLeft,
    collapseTop,
    expandLeft,
    expandTop,
  } = useExpandOrCollapser(model);

  useEffect(() => console.debug('new qArea', qArea), [qArea]);

  useEffect(() => console.debug('maxAreaHeight, maxAreaWidth', maxAreaHeight, maxAreaWidth), [maxAreaHeight, maxAreaWidth]);

  const resetArea = useNebulaCallback(() => {
    setArea({
      qLeft: 0,
      qTop: 0,
      qWidth: DEFAULT_PAGE_SIZE,
      qHeight: DEFAULT_PAGE_SIZE,
    });
  }, []);

  const newLayoutHandler = useNebulaCallback(async () => {
    if (layout && model) {
      const { qLastExpandedPos, qPivotDataPages } = layout.qHyperCube;
      let pivotPage = qPivotDataPages[0];

      if (qLastExpandedPos) {
        const width = Math.min((qLastExpandedPos?.qx || 0) + DEFAULT_PAGE_SIZE, layout.qHyperCube.qSize.qcx);
        const height = Math.min((qLastExpandedPos?.qy || 0) + DEFAULT_PAGE_SIZE, layout.qHyperCube.qSize.qcy);
        const area = getNextArea(Math.max(maxAreaWidth, width), Math.max(maxAreaHeight, height));

        [pivotPage] = await model.getHyperCubePivotData(Q_PATH, [area]);

        setArea(pivotPage.qArea);
        setMaxAreaWidth(prev => Math.max(prev, width));
        setMaxAreaHeight(prev => Math.max(prev, height));
      }

      setHasMoreRows(pivotPage.qArea.qTop + pivotPage.qArea.qHeight < layout.qHyperCube.qSize.qcy);
      setHasMoreColumns(pivotPage.qArea.qLeft + pivotPage.qArea.qWidth < layout.qHyperCube.qSize.qcx);
      setHyperCube(layout.qHyperCube);
      setPivotData(createData(pivotPage, layout.qHyperCube));
    }
  }, [layout, model]);

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
        const nextArea = getNextPage(startIndex, qArea.qHeight + qArea.qTop);
        [nextPivotPage] = await model.getHyperCubePivotData(Q_PATH, [nextArea]);
        nextPivotData = appendLeftData({ ...pivotData }, nextPivotPage);
        setHasMoreRows(nextPivotPage.qArea.qTop + nextPivotPage.qArea.qHeight < qHyperCube.qSize.qcy);
      } else {
        const nextArea = getNextPage(qArea.qLeft + qArea.qWidth, startIndex);
        [nextPivotPage] = await model.getHyperCubePivotData(Q_PATH, [nextArea]);
        nextPivotData = appendTopData({ ...pivotData }, nextPivotPage);
        setHasMoreColumns(nextPivotPage.qArea.qLeft + nextPivotPage.qArea.qWidth < qHyperCube.qSize.qcx);
      }
      console.debug('nextPivotPage', nextPivotPage);
      setArea(nextPivotPage.qArea);
      setMaxAreaWidth(prev => Math.min(Math.max(prev, nextPivotPage.qArea.qLeft + nextPivotPage.qArea.qWidth), qHyperCube.qSize.qcx));
      setMaxAreaHeight(prev => Math.min(Math.max(prev, nextPivotPage.qArea.qTop + nextPivotPage.qArea.qHeight), qHyperCube.qSize.qcy));
      setLoading(false);
      setPivotData(nextPivotData);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [maxAreaWidth, maxAreaHeight, model, qHyperCube, loading]);

  const fetchMoreData = useNebulaCallback<FetchMoreData>(debouncer(async (left: number, top: number, width: number, height: number) => {
    if (loading || !model) return;

    setLoading(true);

    try {
      const nextArea = {
        qLeft: left,
        qTop: top,
        qWidth: Math.min(width, maxAreaWidth - left),
        qHeight: Math.min(height, maxAreaHeight - top)
      };
      const [nextPivotPage] = await model.getHyperCubePivotData(Q_PATH, [nextArea]);
      const nextPivotData = appendData({ ...pivotData }, nextPivotPage);
      console.debug('fetchMoreData', nextArea);
      setLoading(false);
      setPivotData(nextPivotData);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, 100), [model, qHyperCube, loading]);

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
    resetArea,
    getMeasureInfoIndexFromCellIndex
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
    resetArea,
    getMeasureInfoIndexFromCellIndex
  ]);

  return dataModel;
}
