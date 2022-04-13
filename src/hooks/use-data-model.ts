import { useMemo, usePromise, useState } from '@nebula.js/stardust';
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
  const [shouldResetScroll, setShouldResetScroll] = useState(false); // TODO Call it someting else use some service for it?
  const {
    collapseLeft,
    collapseTop,
    expandLeft,
    expandTop,
  } = useExpandOrCollapser(model);

  const newLayoutHandler = useNebulaCallback(async () => {
    if (layout && model) {
      const { qLastExpandedPos, qPivotDataPages } = layout.qHyperCube;
      let pivotPage = qPivotDataPages[0];
      console.debug('newLayoutHandler', qLastExpandedPos);

      if (qLastExpandedPos) {
        const width = Math.min((qLastExpandedPos?.qx || 0) + DEFAULT_PAGE_SIZE, layout.qHyperCube.qSize.qcx);
        const height = Math.min((qLastExpandedPos?.qy || 0) + DEFAULT_PAGE_SIZE, layout.qHyperCube.qSize.qcy);
        const area = getNextArea(width, height);

        [pivotPage] = await model.getHyperCubePivotData(Q_PATH, [area]);
        console.debug('newLayoutHandler', 'pivotPage', pivotPage, width, height);
        setShouldResetScroll(false);
      } else {
        // Layout was recieved because of a property change or selection change (confirmed or cancelled)
        setShouldResetScroll(true);
      }

      const nextPivotData = createData(pivotPage, layout.qHyperCube);
      setHasMoreRows(nextPivotData.size.data.y < layout.qHyperCube.qSize.qcy);
      setHasMoreColumns(nextPivotData.size.data.x < layout.qHyperCube.qSize.qcx);
      setHyperCube(layout.qHyperCube);
      setPivotData(nextPivotData);
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
        const nextArea = getNextPage(startIndex, pivotData.size.data.y);
        [nextPivotPage] = await model.getHyperCubePivotData(Q_PATH, [nextArea]);
        nextPivotData = appendLeftData({ ...pivotData }, nextPivotPage);
        setHasMoreRows(nextPivotData.size.data.y < qHyperCube.qSize.qcy);
      } else {
        const nextArea = getNextPage(pivotData.size.data.x, startIndex); // TODO should I data size? Or try columnsLoaded in a ref instead?
        [nextPivotPage] = await model.getHyperCubePivotData(Q_PATH, [nextArea]);
        nextPivotData = appendTopData({ ...pivotData }, nextPivotPage);
        setHasMoreColumns(nextPivotData.size.data.x < qHyperCube.qSize.qcx);
      }
      // console.debug('nextPivotPage', nextPivotPage);
      setLoading(false);
      setShouldResetScroll(false);
      setPivotData(nextPivotData);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [model, qHyperCube, loading, pivotData]);

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
      const nextPivotData = appendData({ ...pivotData }, nextPivotPage);
      // console.debug('fetchMoreData', nextArea);
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
    shouldResetScroll,
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
    shouldResetScroll,
  ]);

  return dataModel;
}
