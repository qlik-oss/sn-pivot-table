import { useMemo, usePromise, useState, useEffect } from '@nebula.js/stardust';
// import { throttler } from 'qlik-chart-modules';
import createData, { appendTopData } from '../pivot-table/data';
import { DataModel, FetchNextPage, PivotData } from '../types/types';
import useExpandOrCollapser from './use-expand-or-collapser';
import { DEFAULT_PAGE_SIZE, Q_PATH } from '../constants';
import useNebulaCallback from './use-nebula-callback';
import { NxSelectionCellType } from '../types/QIX';

const NOOP_PIVOT_DATA = {} as PivotData;

const getNextArea = (qWidth: number, qHeight: number) => ({
  qLeft: 0,
  qTop: 0,
  qWidth,
  qHeight
});

const getNextPage = (qWidth: number, qHeight: number) => ({
  qLeft: qWidth,
  qTop: 0,
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
        const width = (qLastExpandedPos?.qx || 0) + DEFAULT_PAGE_SIZE;
        const height = (qLastExpandedPos?.qy || 0) + DEFAULT_PAGE_SIZE;
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

  const fetchNextPage = useNebulaCallback<FetchNextPage>(async (isRow: boolean) => {
    if (loading || !model) return;
    if (isRow && !hasMoreRows) return;
    if (!isRow && !hasMoreColumns) return;

    setLoading(true);

    try {
      const width = isRow ? maxAreaWidth : maxAreaWidth + DEFAULT_PAGE_SIZE;
      const height = isRow ? maxAreaHeight + DEFAULT_PAGE_SIZE : maxAreaHeight;
      // const [pivotPage] = await model.getHyperCubePivotData(Q_PATH, [getNextArea(width, height)]);
      const nextArea = getNextPage(qArea.qLeft + qArea.qWidth, qArea.qTop + qArea.qHeight);
      const [newPivotPage] = await model.getHyperCubePivotData(Q_PATH, [nextArea]);
      const newPivotData = appendTopData({ ...pivotData }, newPivotPage, qHyperCube);
      console.debug('newPivotPage', newPivotPage);
      // const [test1] = await model.getHyperCubePivotData(Q_PATH, [{ qLeft: 50, qTop: 0, qWidth: qHyperCube.qPivotDataPages[0].qTop[1].qDown + 1, qHeight: 50 }]);
      // const [test2] = await model.getHyperCubePivotData(Q_PATH, [{ qLeft: 50, qTop: 0, qWidth: 50, qHeight: 50 }]);
      // const [test3] = await model.getHyperCubePivotData(Q_PATH, [{ qLeft: 100, qTop: 0, qWidth: 50, qHeight: 50 }]);
      // console.log('test1', test1);
      // console.log('test2', test2);
      // console.log('test3', test3);
      setArea(newPivotPage.qArea);
      setMaxAreaWidth(prev => Math.max(prev, width));
      setMaxAreaHeight(prev => Math.max(prev, height));
      setLoading(false);
      setHasMoreRows(newPivotPage.qArea.qTop + newPivotPage.qArea.qHeight < qHyperCube.qSize.qcy);
      setHasMoreColumns(newPivotPage.qArea.qLeft + newPivotPage.qArea.qWidth < qHyperCube.qSize.qcx);
      // setPivotData(createData(pivotPage, qHyperCube));
      setPivotData(newPivotData);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [maxAreaWidth, maxAreaHeight, model, qHyperCube, loading]);

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

  const dataModel = useMemo<DataModel>(() => ({
    fetchNextPage,
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
    resetArea
  }),[fetchNextPage,
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
    resetArea
  ]);

  return dataModel;
}
