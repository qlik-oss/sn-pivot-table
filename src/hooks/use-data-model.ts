import { useMemo, usePromise, useState } from '@nebula.js/stardust';
import createData from '../pivot-table/data';
import { DataModel, FetchNextPage, PivotData } from '../types/types';
import useExpandOrCollapser from './use-expand-or-collapser';

const DEFAULT_PAGE_SIZE = 50;
const DEF_PATH = '/qHyperCubeDef';
const NOOP_PIVOT_DATA = {} as PivotData;

const getNextRow = (qArea: EngineAPI.IRect, lastExpandPos = 0) => {
  const { qLeft, qHeight, qWidth } = qArea;

  return {
    qLeft,
    qTop: 0,
    qWidth,
    qHeight: Math.max(qHeight, lastExpandPos) + DEFAULT_PAGE_SIZE,
  };
};

const getNextColumn = (qArea: EngineAPI.IRect, lastExpandPos = 0) => {
  const { qTop, qHeight, qWidth } = qArea;

  return {
    qLeft: 0,
    qTop,
    qWidth: Math.max(qWidth, lastExpandPos) + DEFAULT_PAGE_SIZE,
    qHeight,
  };
};

export default function useDataModel(layout: EngineAPI.IGenericHyperCubeLayout, model: EngineAPI.IGenericObject | undefined ): DataModel {
  const [pivotData, setPivotData] = useState<PivotData>(NOOP_PIVOT_DATA);
  const [loading, setLoading] = useState(false);
  const [qArea, setArea] = useState(layout?.qHyperCube.qPivotDataPages[0].qArea);
  const [hasMoreRows, setHasMoreRows] = useState(false);
  const [hasMoreColumns, setHasMoreColumns] = useState(false);
  const [qDimInfo, setDimInfo] = useState<EngineAPI.INxDimensionInfo[]>([]);
  const [qSize, setSize] = useState<EngineAPI.ISize>({ qcx: 0, qcy: 0 });
  const {
    expandOrCollapseIndex,
    collapseLeft,
    collapseTop,
    expandLeft,
    expandTop,
  } = useExpandOrCollapser(model);

  const newLayoutHandler = useMemo(() => async () => {
    if (layout && model) {
      let pivotPage = layout.qHyperCube.qPivotDataPages[0];

      if (expandOrCollapseIndex.hasChanged && expandOrCollapseIndex.direction === 'column') {
        [pivotPage] = await model.getHyperCubePivotData(
          DEF_PATH,
          [getNextColumn(layout.qHyperCube.qPivotDataPages[0].qArea, expandOrCollapseIndex.colIndex)]
        );
      } else if (expandOrCollapseIndex.hasChanged && expandOrCollapseIndex.direction === 'row') {
        [pivotPage] = await model.getHyperCubePivotData(
          DEF_PATH,
          [getNextRow(layout.qHyperCube.qPivotDataPages[0].qArea, expandOrCollapseIndex.rowIndex)]
        );
      }

      setHasMoreRows(pivotPage.qArea.qHeight < layout.qHyperCube.qSize.qcy);
      setHasMoreColumns(pivotPage.qArea.qWidth < layout.qHyperCube.qSize.qcx);
      setArea(pivotPage.qArea);
      setDimInfo(layout.qHyperCube.qDimensionInfo);
      setSize(layout.qHyperCube.qSize);
      setPivotData(createData(pivotPage, layout.qHyperCube.qDimensionInfo));
    }
  }, [layout, model]);

  usePromise(() => newLayoutHandler(), [newLayoutHandler]);

  // To avoid unnecessary rerenders. Only recreate fetchNextPage function if dependencies changes. A crude version of useCallback.
  const fetchNextPage: FetchNextPage = useMemo(() => async (isRow: boolean) => {
    if (loading || !model) return;

    setLoading(true);

    try {
      const [pivotPage] = await model.getHyperCubePivotData(DEF_PATH, [isRow
        ? getNextRow(qArea)
        : getNextColumn(qArea)
      ]);

      setArea(pivotPage.qArea);
      setLoading(false);
      setHasMoreRows(pivotPage.qArea.qHeight < qSize.qcy);
      setHasMoreColumns(pivotPage.qArea.qWidth < qSize.qcx);
      setPivotData(createData(pivotPage, qDimInfo));
    } catch (error) {
      console.log('ERROR', error);
      setLoading(false);
    }
  }, [qArea, model, qDimInfo, qSize]);

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
