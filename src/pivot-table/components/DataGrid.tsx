/*  eslint-disable no-param-reassign */
import React, { memo, useCallback, useLayoutEffect } from 'react';
import { VariableSizeGrid, areEqual, GridOnItemsRenderedProps } from 'react-window';
import { debouncer } from 'qlik-chart-modules';
import { DataModel, GridItemData, ScrollService } from '../../types/types';
import DataCell from './cells/DataCell';
// import useDebug from '../../hooks/use-debug';

interface DataGridProps {
  dataModel: DataModel;
  dataGridRef: React.RefObject<VariableSizeGrid>;
  getMeasureInfoWidth: (index: number) => number;
  height: number;
  rowHightCallback: () => number;
  width: number;
  scrollService: ScrollService;
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
      if (!data[rowIndex][colIndex]){
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
  scrollService,
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
  // });

  useLayoutEffect(() => {
    if (dataGridRef.current) {
      dataGridRef.current.resetAfterColumnIndex(0);
    }
  }, [dataModel]);

  useLayoutEffect(() => {
    if (dataGridRef.current) {
      dataGridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    }
  }, [width, height]);

  const onItemsRendered = useCallback(debouncer(({
    overscanColumnStartIndex,
    overscanColumnStopIndex,
    overscanRowStartIndex,
    overscanRowStopIndex,
    visibleColumnStartIndex,
    visibleColumnStopIndex,
    visibleRowStartIndex,
    visibleRowStopIndex
  }: GridOnItemsRenderedProps) => {
    if (dataModel.hasMoreRows && visibleRowStopIndex >= dataModel.pivotData.size.data.y - OFF_VIEW_THRESHOLD) {
      dataModel.fetchNextPage(true, overscanColumnStartIndex);
    } else if (dataModel.hasMoreColumns && visibleColumnStopIndex >= dataModel.pivotData.size.data.x - OFF_VIEW_THRESHOLD) {
      dataModel.fetchNextPage(false, overscanRowStartIndex);
    } else if (isMissingData(dataModel.pivotData.data, overscanColumnStartIndex, overscanColumnStopIndex, overscanRowStartIndex, overscanRowStopIndex)) {
      dataModel.fetchMoreData(
        overscanColumnStartIndex,
        overscanRowStartIndex,
        overscanColumnStopIndex - overscanColumnStartIndex + 1,
        overscanRowStopIndex - overscanRowStartIndex + 1
      );
    }

    scrollService.scrollLeftPosition = visibleColumnStartIndex;
    scrollService.scrollTopPosition = visibleRowStartIndex;
    scrollService.scrollWidth = overscanColumnStopIndex - overscanColumnStartIndex + 1;
    scrollService.scrollHeight = overscanRowStopIndex - overscanRowStartIndex + 1;
  }, 100), [dataModel]);

  const getColumnWidth = useCallback(
    (index) => getMeasureInfoWidth(dataModel.getMeasureInfoIndexFromCellIndex(index)),
    [getMeasureInfoWidth, dataModel]);

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
        matrix: dataModel.pivotData.data,
      } as GridItemData}
      onItemsRendered={onItemsRendered}
    >
      {MemoizedDataCell}
    </VariableSizeGrid>
  );
};

export default DataGrid;
