/*  eslint-disable no-param-reassign */
import React, { memo, useCallback, useLayoutEffect } from 'react';
import { debouncer } from 'qlik-chart-modules';
import { VariableSizeGrid, areEqual, GridOnItemsRenderedProps } from 'react-window';
import { DataModel, DataService, GridItemData, LayoutService, Point, ViewService } from '../../../types/types';
import DataCell from '../cells/DataCell';
import useDebug from '../../hooks/use-debug';

interface DataGridProps {
  dataModel: DataModel;
  dataGridRef: React.RefObject<VariableSizeGrid>;
  getMeasureInfoWidth: (index: number) => number;
  height: number;
  rowHightCallback: () => number;
  width: number;
  viewService: ViewService;
  layoutService: LayoutService;
  dataService: DataService;
  data: EngineAPI.INxPivotValuePoint[][];
  size: Point;
}

type FetchModeData = (
  dataModel: DataModel,
  data: EngineAPI.INxPivotValuePoint[][],
  size: Point,
  overscanColumnStartIndex: number,
  overscanColumnStopIndex: number,
  overscanRowStartIndex: number,
  overscanRowStopIndex: number
) => void;

const OFF_VIEW_THRESHOLD = 1;

const gridStyle: React.CSSProperties = { overflow: 'hidden' };

const isMissingData = (
  data: EngineAPI.INxPivotValuePoint[][],
  visibleColumnStartIndex: number,
  visibleColumnStopIndex: number,
  visibleRowStartIndex: number,
  visibleRowStopIndex: number
) => {
  for (let rowIndex = visibleRowStartIndex; rowIndex <= visibleRowStopIndex; rowIndex++) {
    for (let colIndex = visibleColumnStartIndex; colIndex <= visibleColumnStopIndex; colIndex++) {
      if (!data[rowIndex]?.[colIndex]){
        return true;
      }
    }
  }

  return false;
};

const debouncedFetchMoreData: FetchModeData = debouncer((
  dataModel: DataModel,
  data: EngineAPI.INxPivotValuePoint[][],
  size: Point,
  overscanColumnStartIndex: number,
  overscanColumnStopIndex: number,
  overscanRowStartIndex: number,
  overscanRowStopIndex: number
) => {
  if (overscanColumnStartIndex > size.x) {
    return;
  }

  if (overscanRowStartIndex > size.y) {
    return;
  }

  const shouldFetchData = isMissingData(
    data,
    overscanColumnStartIndex,
    overscanColumnStopIndex,
    overscanRowStartIndex,
    overscanRowStopIndex
  );
  if (shouldFetchData) {
    dataModel.fetchMoreData(
      overscanColumnStartIndex,
      overscanRowStartIndex,
      overscanColumnStopIndex - overscanColumnStartIndex + 1,
      overscanRowStopIndex - overscanRowStartIndex + 1
    );
  }
}, 150);

const DataGrid = ({
  dataModel,
  dataGridRef,
  getMeasureInfoWidth,
  height,
  rowHightCallback,
  width,
  viewService,
  layoutService,
  dataService,
  data,
  size,
}: DataGridProps): JSX.Element | null => {
  if (size.x === 0) {
    return null;
  }

  const MemoizedDataCell = memo(DataCell, areEqual);
  useDebug('DataGrid', {
    dataModel,
    dataGridRef,
    getMeasureInfoWidth,
    height,
    rowHightCallback,
    width,
    viewService,
    dataService,
    layoutService,
    data,
    size,
    data: dataService.data.data,
  });

  useLayoutEffect(() => {
    if (dataGridRef.current) {
      dataGridRef.current.resetAfterColumnIndex(0); // Needs to be re-computed every time the data changes
    }
  }, [dataModel, dataService.data.data]);

  useLayoutEffect(() => {
    if (dataGridRef.current) {
      dataGridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    }
  }, [width, height, dataService.data.data]);

  const onItemsRendered = useCallback(({
    overscanColumnStartIndex,
    overscanColumnStopIndex,
    overscanRowStartIndex,
    overscanRowStopIndex,
    visibleColumnStartIndex,
    visibleColumnStopIndex,
    visibleRowStartIndex,
    visibleRowStopIndex
  }: GridOnItemsRenderedProps) => {
    viewService.gridColumnStartIndex = visibleColumnStartIndex;
    viewService.gridRowStartIndex = visibleRowStartIndex;
    viewService.gridWidth = overscanColumnStopIndex - overscanColumnStartIndex + 1;
    viewService.gridHeight = overscanRowStopIndex - overscanRowStartIndex + 1;

    if (dataService.hasMoreRows && visibleRowStopIndex >= size.y - OFF_VIEW_THRESHOLD) {
      dataModel.fetchNextPage(true, overscanColumnStartIndex);
      return;
    }

    if (dataService.hasMoreColumns && visibleColumnStopIndex >= size.x - OFF_VIEW_THRESHOLD) {
      dataModel.fetchNextPage(false, overscanRowStartIndex);
      return;
    }

    debouncedFetchMoreData(
      dataModel,
      data,
      size,
      overscanColumnStartIndex,
      overscanColumnStopIndex,
      overscanRowStartIndex,
      overscanRowStopIndex
    );
  }, [dataModel, dataService, data, size.x, size.y]);

  const getColumnWidth = useCallback(
    (index) => getMeasureInfoWidth(layoutService.getMeasureInfoIndexFromCellIndex(index)),
    [getMeasureInfoWidth, layoutService.getMeasureInfoIndexFromCellIndex]
  );

  return (
    <VariableSizeGrid
      ref={dataGridRef}
      style={gridStyle}
      columnCount={size.x}
      columnWidth={getColumnWidth}
      height={height}
      rowCount={size.y}
      rowHeight={rowHightCallback}
      width={width}
      itemData={{
        layoutService,
        grid: data,
        dataModel
      } as GridItemData}
      onItemsRendered={onItemsRendered}
    >
      {MemoizedDataCell}
    </VariableSizeGrid>
  );
};

export default DataGrid;
