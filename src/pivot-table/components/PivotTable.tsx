import React, { useEffect, useRef, memo } from 'react';
import { VariableSizeGrid, areEqual } from 'react-window';
import { DataModel, Model, Rect } from '../../types/types';
import CellFactory from './CellFactory';
import useDebug from '../../hooks/use-debug';

export interface PivotTableProps {
  model: Model;
  rect: Rect;
  constraints: Stardust.Constraints;
  dataModel: DataModel;
}

const DEFAULT_COLUMN_WIDTH = 100;

const getColumnWidth = (rect: Rect, columnCount: number) => Math.max(DEFAULT_COLUMN_WIDTH, (rect.width-15) / columnCount)

export const PivotTable = ({
  rect,
  constraints,
  dataModel
}: PivotTableProps): JSX.Element => {
  const gridRef = useRef<ReactWindow.VariableSizeGrid>();
  const MemoizedCellFactory = memo(CellFactory, areEqual);
  const { pivotData, hasMoreColumns, hasMoreRows } = dataModel;

  useDebug('PivotTable', {
    rect,
    hasMoreColumns,
    hasMoreRows,
    constraints,
    pivotData,
    fetchNextPage: dataModel.fetchNextPage,
    collapseLeft: dataModel.collapseLeft,
    collapseTop: dataModel.collapseTop,
    expandLeft: dataModel.expandLeft,
    expandTop: dataModel.expandTop,
  });

  useEffect(() => {
    if (pivotData) {
      if (gridRef.current) {
        gridRef.current.resetAfterColumnIndex(0);
      }
    }
  }, [pivotData]);

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    }
  }, [rect]);

  const onItemsRendered = ({
    visibleColumnStopIndex,
    visibleRowStopIndex
  }: ReactWindow.OnItemsRenderedProps) => {
    if (visibleRowStopIndex > pivotData.matrix[0].length - 1 && hasMoreRows) {
      dataModel.fetchNextPage(true);
    } else if (visibleColumnStopIndex > pivotData.matrix.length - 1 && hasMoreColumns) {
      dataModel.fetchNextPage(false);
    }
  };

  // const columnWidth = (index: number) => index < pivotData.nbrLeftColumns ?
  //     Math.min(layout.qHyperCube.qDimensionInfo[index].qApprMaxGlyphCount * 8, 250) // TODO use a better hard-coded value then 8
  //     : 100

  return (
    <VariableSizeGrid
      ref={gridRef}
      style={{ overflow: constraints.active ? 'hidden' : 'auto' }}
      columnCount={pivotData?.matrix.length}
      columnWidth={() => getColumnWidth(rect, pivotData.matrix.length)}
      height={rect.height}
      rowCount={pivotData?.matrix.length > 0 ? pivotData.matrix[0]?.length : 0}
      rowHeight={(index: number) => index < pivotData.nbrTopRows ? 28 : 28 }
      width={rect.width}
      itemData={{
        dataModel,
        pivotData,
        constraints,
      }}
      onItemsRendered={onItemsRendered}
      overscanRowCount={10}
      overscanColumnsCount={10}
    >
      {MemoizedCellFactory}
    </VariableSizeGrid>
  );
}

