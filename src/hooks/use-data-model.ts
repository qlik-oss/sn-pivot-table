import { useEffect, useMemo, useState } from '@nebula.js/stardust';
import toMatrix from '../pivot-table/handle-data';
import { Layout, NxPageArea } from "../types/QIX";
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
  const [qDimensionInfo, setDimInfo] = useState(layout?.qHyperCube.qDimensionInfo);
  const [qNoOfLeftDims, setNoOfLeftDims] = useState(layout?.qHyperCube.qNoOfLeftDims);
  const [hasMoreRows, setHasMoreRows] = useState(false);
  const [hasMoreColumns, setHasMoreColumns] = useState(false);
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
          "qPath": "/qHyperCubeDef",
          "qPages": [getNextColumn(layout.qHyperCube.qPivotDataPages[0].qArea, expandOrCollapseIndex.colIndex)]
        });
      } else if (expandOrCollapseIndex.hasChanged && expandOrCollapseIndex.direction === 'row') {
        [pivotPage] = await model.getHyperCubePivotData({
          "qPath": "/qHyperCubeDef",
          "qPages": [getNextRow(layout.qHyperCube.qPivotDataPages[0].qArea, expandOrCollapseIndex.rowIndex)]
        });
      }

      const matrix = toMatrix(pivotPage, layout.qHyperCube.qDimensionInfo, layout.qHyperCube.qNoOfLeftDims);
      setPivotData(matrix);
      setDimInfo(layout.qHyperCube.qDimensionInfo);
      setNoOfLeftDims(layout.qHyperCube.qNoOfLeftDims);
      setHasMoreRows(pivotData?.matrix[0]?.length < layout.qHyperCube.qSize.qcy);
      setHasMoreColumns(pivotData?.matrix.length < layout.qHyperCube.qSize.qcx);
      setArea(pivotPage.qArea);
      console.debug('layout', layout)
      console.debug('pivotPage', pivotPage)
      console.debug('expandOrCollapseIndex', expandOrCollapseIndex);
    }
  }, [layout]);

  // To avoid unnecessary rerenders. Only recreate fetchNextPage function if dependencies changes. A crude version of useCallback.
  const fetchNextPage: FetchNextPage = useMemo(() => async (isRow: boolean) => {
    if (loading) return;

    setLoading(true);

    try {
      const [pivotPage] = await model.getHyperCubePivotData({
        "qPath": "/qHyperCubeDef",
        "qPages": [isRow
          ? getNextRow(qArea)
          : getNextColumn(qArea)
        ]
      });
      const matrix = toMatrix(pivotPage, qDimensionInfo, qNoOfLeftDims);
      setPivotData(matrix);
      setArea(pivotPage.qArea);
      setLoading(false);
    } catch (error) {
      console.log('ERROR', error);
      setLoading(false);
    }
  }, [qArea, model, qNoOfLeftDims, qDimensionInfo]);

  const dataModel: DataModel = useMemo(() => ({
    pivotData,
    fetchNextPage,
    hasMoreColumns,
    hasMoreRows,
    collapseLeft,
    collapseTop,
    expandLeft,
    expandTop,
  }),[pivotData,
    fetchNextPage,
    hasMoreColumns,
    hasMoreRows,
    collapseLeft,
    collapseTop,
    expandLeft,
    expandTop]);

  return dataModel;
}
