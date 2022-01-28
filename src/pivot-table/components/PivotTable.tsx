import React, { useEffect, useRef, memo } from 'react';
import { VariableSizeGrid, areEqual } from 'react-window';
import { DataLoader, Model, Rect } from '../../types/types';
import CellFactory from './CellFactory';
import useDebugInformation from '../../hooks/use-debug-information';

export interface PivotTableProps {
  model: Model;
  rect: Rect;
  constraints: Stardust.Constraints;
  dataLoader: DataLoader;
}

const DEFAULT_COLUMN_WIDTH = 100;

const getColumnWidth = (rect: Rect, columnCount: number) => Math.max(DEFAULT_COLUMN_WIDTH, (rect.width-15) / columnCount)

export const PivotTable = ({
  rect,
  constraints,
  dataLoader
}: PivotTableProps): JSX.Element => {
  const gridRef = useRef<ReactWindow.VariableSizeGrid>();
  const MemoizedCellFactory = memo(CellFactory, areEqual);
  const { pivotData, hasMoreColumns, hasMoreRows } = dataLoader;

  useDebugInformation('PivotTable', {
    rect,
    hasMoreColumns,
    hasMoreRows,
    constraints,
    pivotData,
    fetchNextPage: dataLoader.fetchNextPage,
    collapseLeft: dataLoader.collapseLeft,
    collapseTop: dataLoader.collapseTop,
    expandLeft: dataLoader.expandLeft,
    expandTop: dataLoader.expandTop,
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
    if (visibleRowStopIndex >= pivotData.matrix[0].length - 1 && hasMoreRows) {
      dataLoader.fetchNextPage(true);
    } else if (visibleColumnStopIndex >= pivotData.matrix.length - 1 && hasMoreColumns) {
      dataLoader.fetchNextPage(false);
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
        dataLoader,
        pivotData,
        constraints,
      }}
      onItemsRendered={onItemsRendered}
    >
      {MemoizedCellFactory}
    </VariableSizeGrid>
  );
}

