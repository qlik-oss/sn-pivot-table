/*  eslint-disable no-param-reassign */
import React, { memo, useCallback, useLayoutEffect } from 'react';
import { debouncer } from 'qlik-chart-modules';
import { VariableSizeGrid, areEqual, GridOnItemsRenderedProps } from 'react-window';
import { DataModel, GridItemData, LayoutService, ViewService } from '../../../types/types';
import DataCell from '../cells/DataCell';
// import useDebug from '../../hooks/use-debug';

interface DataGridProps {
  dataModel: DataModel;
  dataGridRef: React.RefObject<VariableSizeGrid>;
  getMeasureInfoWidth: (index: number) => number;
  height: number;
  rowHightCallback: () => number;
  width: number;
  viewService: ViewService;
  layoutService: LayoutService;
}

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

const DataGrid = ({
  dataModel,
  dataGridRef,
  getMeasureInfoWidth,
  height,
  rowHightCallback,
  width,
  viewService,
  layoutService,
}: DataGridProps): JSX.Element | null => {
  if (dataModel.pivotData.size.data.x === 0) {
    return null;
  }

  const MemoizedDataCell = memo(DataCell, areEqual);
  // useDebug('DataGrid', {
  //   dataModel,
  //   dataGridRef,
  //   getMeasureInfoWidth,
  //   height,
  //   rowHightCallback,
  //   width,
  //   viewService
  // });

  useLayoutEffect(() => {
    if (dataGridRef.current) {
      dataGridRef.current.resetAfterColumnIndex(0); // Needs to be re-computed every time the data changes
    }
  }, [dataModel]);

  useLayoutEffect(() => {
    if (dataGridRef.current) {
      dataGridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    }
  }, [width, height]);

  const debouncedFetchMoreData = debouncer((
    overscanColumnStartIndex: number,
    overscanColumnStopIndex: number,
    overscanRowStartIndex: number,
    overscanRowStopIndex: number
  ) => {
    if (overscanColumnStartIndex > dataModel.pivotData.size.data.x) {
      return;
    }

    if (overscanRowStartIndex > dataModel.pivotData.size.data.y) {
      return;
    }

    const shouldFetchData = isMissingData(
      dataModel.pivotData.data,
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

    if (dataModel.hasMoreRows && visibleRowStopIndex >= dataModel.pivotData.size.data.y - OFF_VIEW_THRESHOLD) {
      dataModel.fetchNextPage(true, overscanColumnStartIndex);
      return;
    }

    if (dataModel.hasMoreColumns && visibleColumnStopIndex >= dataModel.pivotData.size.data.x - OFF_VIEW_THRESHOLD) {
      dataModel.fetchNextPage(false, overscanRowStartIndex);
      return;
    }

    debouncedFetchMoreData(overscanColumnStartIndex, overscanColumnStopIndex, overscanRowStartIndex, overscanRowStopIndex);
  }, [dataModel]);

  const getColumnWidth = useCallback(
    (index) => getMeasureInfoWidth(layoutService.getMeasureInfoIndexFromCellIndex(index)),
    [getMeasureInfoWidth, layoutService.getMeasureInfoIndexFromCellIndex]
  );

  return (
    <VariableSizeGrid
      ref={dataGridRef}
      style={gridStyle}
      columnCount={dataModel.pivotData.size.data.x}
      columnWidth={getColumnWidth}
      height={height}
      rowCount={dataModel.pivotData.size.data.y}
      rowHeight={rowHightCallback}
      width={width}
      itemData={{
        layoutService,
        grid: dataModel.pivotData.data,
        dataModel
      } as GridItemData}
      onItemsRendered={onItemsRendered}
    >
      {MemoizedDataCell}
    </VariableSizeGrid>
  );
};

export default DataGrid;
