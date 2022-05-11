/*  eslint-disable no-param-reassign */
import React, { memo, useCallback, useLayoutEffect } from 'react';
import { debouncer } from 'qlik-chart-modules';
import { VariableSizeGrid, areEqual, GridOnItemsRenderedProps } from 'react-window';
import { DataModel, GridItemData, LayoutService, MeasureData, ViewService } from '../../../types/types';
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
  measureData: MeasureData;
  hasMoreRows: boolean;
  hasMoreColumns: boolean;
}

type FetchModeData = (
  dataModel: DataModel,
  measureData: MeasureData,
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
  measureData: MeasureData,
  overscanColumnStartIndex: number,
  overscanColumnStopIndex: number,
  overscanRowStartIndex: number,
  overscanRowStopIndex: number
) => {
  if (overscanColumnStartIndex > measureData.size.x) {
    return;
  }

  if (overscanRowStartIndex > measureData.size.y) {
    return;
  }

  const shouldFetchData = isMissingData(
    measureData.data,
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

function DataGrid({
  dataModel,
  dataGridRef,
  getMeasureInfoWidth,
  height,
  rowHightCallback,
  width,
  viewService,
  layoutService,
  measureData,
  hasMoreRows,
  hasMoreColumns,
}: DataGridProps): JSX.Element | null {
  if (measureData.size.x === 0) {
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
  //   viewService,
  //   layoutService,
  //   measureData,
  //   hasMoreRows,
  //   hasMoreColumns
  // });

  useLayoutEffect(() => {
    if (dataGridRef.current) {
      dataGridRef.current.resetAfterColumnIndex(0); // Needs to be re-computed every time the data changes
    }
  }, [dataModel, measureData]);

  useLayoutEffect(() => {
    if (dataGridRef.current) {
      dataGridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    }
  }, [width, height, measureData]);

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

    if (hasMoreRows && visibleRowStopIndex >= measureData.size.y - OFF_VIEW_THRESHOLD) {
      dataModel.fetchNextPage(true, overscanColumnStartIndex);
      return;
    }

    if (hasMoreColumns && visibleColumnStopIndex >= measureData.size.x - OFF_VIEW_THRESHOLD) {
      dataModel.fetchNextPage(false, overscanRowStartIndex);
      return;
    }

    debouncedFetchMoreData(
      dataModel,
      measureData,
      overscanColumnStartIndex,
      overscanColumnStopIndex,
      overscanRowStartIndex,
      overscanRowStopIndex
    );
  }, [dataModel, measureData]);

  const getColumnWidth = useCallback(
    (index) => {
      if (measureData.size.x > 1) {
        return getMeasureInfoWidth(layoutService.getMeasureInfoIndexFromCellIndex(index));
      }

      return width;
    },
    [getMeasureInfoWidth, layoutService.getMeasureInfoIndexFromCellIndex, measureData.size.x, width]
  );

  return (
    <VariableSizeGrid
      ref={dataGridRef}
      style={gridStyle}
      columnCount={measureData.size.x}
      columnWidth={getColumnWidth}
      height={height}
      rowCount={measureData.size.y}
      rowHeight={rowHightCallback}
      width={width}
      itemData={{
        layoutService,
        grid: measureData.data,
        dataModel
      } as GridItemData}
      onItemsRendered={onItemsRendered}
    >
      {MemoizedDataCell}
    </VariableSizeGrid>
  );
};

export default memo(DataGrid);
