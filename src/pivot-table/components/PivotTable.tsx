import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { VariableSizeGrid, areEqual } from 'react-window';
import toMatrix, { PivotData } from '../handle-data';
import { Model, Rect } from '../../types/types';
import { Layout, NxPageArea } from '../../types/QIX';
import CellFactory from './CellFactory';
import useDebugInformation from '../../hooks/use-debug-information';

export interface PivotTableProps {
  model: Model;
  layout: Layout;
  rect: Rect;
}

interface BatchedState {
  matrix: PivotData;
  area: NxPageArea;
  loading: boolean;
}

const DEFAULT_COLUMN_WIDTH = 100;

const getColumnWidth = (rect: Rect, columnCount: number) => Math.max(DEFAULT_COLUMN_WIDTH, (rect.width-15) / columnCount)

const getNextRow = (qArea: NxPageArea) => {
  const { qLeft, qHeight, qWidth } = qArea;

  return {
    qLeft,
    qTop: 0,
    qWidth,
    qHeight: qHeight + 50,
  };
};

const getNextColumn = (qArea: NxPageArea) => {
  const { qTop, qHeight, qWidth } = qArea;

  return {
    qLeft: 0,
    qTop,
    qWidth: qWidth + 50,
    qHeight,
  };
};

export const PivotTable = ({ rect, layout, model }: PivotTableProps): JSX.Element => {
  const [pivotData, setPivotData] = useState<PivotData>({ matrix: [[]], topMatrix: [], leftMatrix: [], nbrTopRows: 0, nbrLeftColumns: 0 });
  const [qArea, setArea] = useState<NxPageArea>(layout.qHyperCube.qPivotDataPages[0].qArea);
  const [batchedState, setBatchedState] = useState<BatchedState>(); // setState call inside async functions are not batched. This is a hack get around multiple unwanted renders for each setState call.
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<VariableSizeGrid>();
  const MemoizedCellFactory = memo(CellFactory, areEqual);

  useDebugInformation('PivotTable', { rect, layout, data: pivotData, loading, qArea });

  useMemo(() => {
    if (batchedState) {
      setPivotData(batchedState.matrix);
      setArea(batchedState.area);
      setLoading(batchedState.loading);
    }
  }, [batchedState]);

  useEffect(() => {
    if (layout) {
      const matrix = toMatrix(layout.qHyperCube.qPivotDataPages[0], layout.qHyperCube.qDimensionInfo, layout.qHyperCube.qNoOfLeftDims);
      setPivotData(matrix);
      if (gridRef.current) {
        gridRef.current.resetAfterColumnIndex(0);
      }
    }
  }, [layout]);

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    }
  }, [rect]);

  const fetchNextPage = useCallback(async (isRow) => {
    if (loading) return;

    setLoading(true);

    try {
      const [pivotPage] = await model.getHyperCubePivotData({
        "qPath": "/qHyperCubeDef",
        "qPages": [isRow ? getNextRow(qArea) : getNextColumn(qArea)]
      });
      const matrix = toMatrix(pivotPage, layout.qHyperCube.qDimensionInfo, layout.qHyperCube.qNoOfLeftDims);
      setBatchedState({
        matrix,
        area: pivotPage.qArea,
        loading: false
      });
    } catch (error) {
      console.log('ERROR', error);
      setLoading(false);
    }
  }, [qArea, model, layout, loading]);

  const onItemsRendered = ({
    visibleColumnStopIndex,
    visibleRowStopIndex
  }: OnItemsRenderedProps) => {
    if (visibleRowStopIndex >= pivotData.matrix[0].length - 1 && pivotData.matrix[0].length < layout.qHyperCube.qSize.qcy) {
      fetchNextPage(true);
    } else if (visibleColumnStopIndex >= pivotData.matrix.length - 1 && pivotData.matrix.length < layout.qHyperCube.qSize.qcx) {
      fetchNextPage(false);
    }
  };

  const columnWidth = (index: number) => index < pivotData.nbrLeftColumns ?
      Math.min(layout.qHyperCube.qDimensionInfo[index].qApprMaxGlyphCount * 8, 250) // TODO use a better hard-coded value then 8
      : 100

  return (
    <VariableSizeGrid
      ref={gridRef}
      columnCount={pivotData.matrix.length}
      columnWidth={() => getColumnWidth(rect, pivotData.matrix.length)}
      height={rect.height}
      rowCount={pivotData.matrix.length > 0 ? pivotData.matrix[0].length : 0}
      rowHeight={(index: number) => index < pivotData.nbrTopRows ? 28 : 28 }
      width={rect.width}
      itemData={{ model, pivotData }}
      onItemsRendered={onItemsRendered}
    >
      {MemoizedCellFactory}
    </VariableSizeGrid>
  );
}

