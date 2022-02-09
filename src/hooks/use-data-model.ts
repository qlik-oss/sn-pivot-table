import { useEffect, useMemo, useState } from '@nebula.js/stardust';
import createData from '../pivot-table/data';
import { Layout, NxPageArea } from '../types/QIX';
import { DataModel, FetchNextPage, Model } from '../types/types';
import useExpandOrCollapser from './use-expand-or-collapser';

const DEFAULT_PAGE_SIZE = 50;

const getNextRow = (qArea: NxPageArea, lastExpandPos = 0) => {
  const { qLeft, qHeight, qWidth } = qArea;

  return {
    qLeft,
    qTop: 0,
    qWidth,
    qHeight: Math.max(qHeight, lastExpandPos) + DEFAULT_PAGE_SIZE,
  };
};

const getNextColumn = (qArea: NxPageArea, lastExpandPos = 0) => {
  const { qTop, qHeight, qWidth } = qArea;

  return {
    qLeft: 0,
    qTop,
    qWidth: Math.max(qWidth, lastExpandPos) + DEFAULT_PAGE_SIZE,
    qHeight,
  };
};

export default function useDataModel(layout: Layout, model: Model): DataModel {
  const [pivotData, setPivotData] = useState();
  const [loading, setLoading] = useState(false);
  const [qArea, setArea] = useState(layout?.qHyperCube.qPivotDataPages[0].qArea);
  const [hasMoreRows, setHasMoreRows] = useState(false);
  const [hasMoreColumns, setHasMoreColumns] = useState(false);
  const [qDimInfo, setDimInfo] = useState();
  const [qSize, setSize] = useState();
  const [qNoOfLeftDims, setNoOfLeftDims] = useState();
  const {
    expandOrCollapseIndex,
    collapseLeft,
    collapseTop,
    expandLeft,
    expandTop,
  } = useExpandOrCollapser(model);

  useEffect(async () => {
    if (layout) {
      let pivotPage = layout.qHyperCube.qPivotDataPages[0];

      if (expandOrCollapseIndex.hasChanged && expandOrCollapseIndex.direction === 'column') {
        [pivotPage] = await model.getHyperCubePivotData({
          qPath: '/qHyperCubeDef',
          qPages: [getNextColumn(layout.qHyperCube.qPivotDataPages[0].qArea, expandOrCollapseIndex.colIndex)]
        });
      } else if (expandOrCollapseIndex.hasChanged && expandOrCollapseIndex.direction === 'row') {
        [pivotPage] = await model.getHyperCubePivotData({
          qPath: '/qHyperCubeDef',
          qPages: [getNextRow(layout.qHyperCube.qPivotDataPages[0].qArea, expandOrCollapseIndex.rowIndex)]
        });
      }

      setHasMoreRows(pivotPage.qArea.qHeight < layout.qHyperCube.qSize.qcy);
      setHasMoreColumns(pivotPage.qArea.qWidth < layout.qHyperCube.qSize.qcx);
      setArea(pivotPage.qArea);
      setDimInfo(layout.qHyperCube.qDimensionInfo);
      setSize(layout.qHyperCube.qSize);
      setNoOfLeftDims(layout.qHyperCube.qNoOfLeftDims);
      setPivotData(createData(pivotPage, layout.qHyperCube.qDimensionInfo));
    }
  }, [layout]);

  // To avoid unnecessary rerenders. Only recreate fetchNextPage function if dependencies changes. A crude version of useCallback.
  const fetchNextPage: FetchNextPage = useMemo(() => async (isRow: boolean) => {
    if (loading) return;

    setLoading(true);

    try {
      const [pivotPage] = await model.getHyperCubePivotData({
        'qPath': '/qHyperCubeDef',
        'qPages': [isRow
          ? getNextRow(qArea)
          : getNextColumn(qArea)
        ]
      });

      setArea(pivotPage.qArea);
      setLoading(false);
      setHasMoreRows(pivotPage.qArea.qHeight < qSize.qcy);
      setHasMoreColumns(pivotPage.qArea.qWidth < qSize.qcx);
      setPivotData(createData(pivotPage, qDimInfo));
    } catch (error) {
      console.log('ERROR', error);
      setLoading(false);
    }
  }, [qArea, model, qDimInfo, qSize, qNoOfLeftDims]);

  const dataModel: DataModel = useMemo(() => ({
    fetchNextPage,
    hasMoreColumns,
    hasMoreRows,
    collapseLeft,
    collapseTop,
    expandLeft,
    expandTop,
    pivotData
  }),[fetchNextPage,
    hasMoreColumns,
    hasMoreRows,
    collapseLeft,
    collapseTop,
    expandLeft,
    expandTop,
    pivotData
  ]);

  return dataModel;
}
