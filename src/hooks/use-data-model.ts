import { useMemo, usePromise, useState } from '@nebula.js/stardust';
import createData from '../pivot-table/data';
import { DataModel, FetchNextPage, PivotData } from '../types/types';
import useExpandOrCollapser from './use-expand-or-collapser';
import { DEFAULT_PAGE_SIZE, Q_PATH } from '../constants';
import useNebulaCallback from './use-nebula-callback';

const NOOP_PIVOT_DATA = {} as PivotData;

const getNextArea = (qWidth: number, qHeight: number) => ({
  qLeft: 0,
  qTop: 0,
  qWidth,
  qHeight
});

export default function useDataModel(layout: EngineAPI.IGenericHyperCubeLayout, model: EngineAPI.IGenericObject | undefined ): DataModel {
  const [pivotData, setPivotData] = useState<PivotData>(NOOP_PIVOT_DATA);
  const [loading, setLoading] = useState(false);
  const [hasMoreRows, setHasMoreRows] = useState(false);
  const [hasMoreColumns, setHasMoreColumns] = useState(false);
  const [qDimInfo, setDimInfo] = useState<EngineAPI.INxDimensionInfo[]>([]);
  const [qSize, setSize] = useState<EngineAPI.ISize>({ qcx: 0, qcy: 0 });
  const [maxAreaWidth, setMaxAreaWidth] = useState(DEFAULT_PAGE_SIZE);
  const [maxAreaHeight, setMaxAreaHeight] = useState(DEFAULT_PAGE_SIZE);
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

      if (qLastExpandedPos) {
        const width = (qLastExpandedPos?.qx || 0) + DEFAULT_PAGE_SIZE;
        const height = (qLastExpandedPos?.qy || 0) + DEFAULT_PAGE_SIZE;
        const area = getNextArea(Math.max(maxAreaWidth, width), Math.max(maxAreaHeight, height));

        [pivotPage] = await model.getHyperCubePivotData(Q_PATH, [area]);

        setMaxAreaWidth(prev => Math.max(prev, width));
        setMaxAreaHeight(prev => Math.max(prev, height));
      }

      setHasMoreRows(pivotPage.qArea.qHeight < layout.qHyperCube.qSize.qcy);
      setHasMoreColumns(pivotPage.qArea.qWidth < layout.qHyperCube.qSize.qcx);
      setDimInfo(layout.qHyperCube.qDimensionInfo);
      setSize(layout.qHyperCube.qSize);
      setPivotData(createData(pivotPage, layout.qHyperCube.qDimensionInfo));
    }
  }, [layout, model]);

  usePromise(() => newLayoutHandler(), [newLayoutHandler]);

  const fetchNextPage = useNebulaCallback<FetchNextPage>(async (isRow: boolean) => {
    if (loading || !model) return;

    setLoading(true);

    try {
      const width = isRow ? maxAreaWidth : maxAreaWidth + DEFAULT_PAGE_SIZE;
      const height = isRow ? maxAreaHeight + DEFAULT_PAGE_SIZE : maxAreaHeight;
      const [pivotPage] = await model.getHyperCubePivotData(Q_PATH, [getNextArea(width, height)]);

      setMaxAreaWidth(prev => Math.max(prev, width));
      setMaxAreaHeight(prev => Math.max(prev, height));
      setLoading(false);
      setHasMoreRows(pivotPage.qArea.qHeight < qSize.qcy);
      setHasMoreColumns(pivotPage.qArea.qWidth < qSize.qcx);
      setPivotData(createData(pivotPage, qDimInfo));
    } catch (error) {
      console.log('ERROR', error);
      setLoading(false);
    }
  }, [maxAreaWidth, maxAreaHeight, model, qDimInfo, qSize]);

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
  }),[fetchNextPage,
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
