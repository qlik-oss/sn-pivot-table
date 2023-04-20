/*  eslint-disable no-param-reassign */
import { debouncer } from "qlik-chart-modules";
import React, { memo, useCallback, useLayoutEffect, useMemo } from "react";
import { GridOnItemsRenderedProps, VariableSizeGrid } from "react-window";
import { DataModel, GridItemData, LayoutService, MeasureData, ViewService } from "../../../types/types";
import MemoizedDataCell from "../cells/DataCell";
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
) => Promise<void>;

const EXPONENT = 2;

const gridStyle: React.CSSProperties = { overflow: "hidden" };

const isMissingData = (
  data: EngineAPI.INxPivotValuePoint[][],
  visibleColumnStartIndex: number,
  visibleColumnStopIndex: number,
  visibleRowStartIndex: number,
  visibleRowStopIndex: number
) => {
  for (let rowIndex = visibleRowStartIndex; rowIndex <= visibleRowStopIndex; rowIndex++) {
    for (let colIndex = visibleColumnStartIndex; colIndex <= visibleColumnStopIndex; colIndex++) {
      if (!data[rowIndex]?.[colIndex]) {
        return true;
      }
    }
  }

  return false;
};

const debouncedFetchMoreData: FetchModeData = debouncer(
  async (
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
      await dataModel.fetchMoreData(
        overscanColumnStartIndex,
        overscanRowStartIndex,
        overscanColumnStopIndex - overscanColumnStartIndex + 1,
        overscanRowStopIndex - overscanRowStartIndex + 1
      );
    }
  },
  150
);

const DataGrid = ({
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
}: DataGridProps): JSX.Element | null => {
  useLayoutEffect(() => {
    if (dataGridRef.current) {
      dataGridRef.current.resetAfterColumnIndex(0); // Needs to be re-computed every time the data changes
    }
  }, [dataGridRef, dataModel, measureData]);

  useLayoutEffect(() => {
    if (dataGridRef.current) {
      dataGridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    }
  }, [width, height, measureData, dataGridRef]);

  // Use a logarithmic value as the threshold should scale with the size of the data. This helps create a smooth scrolling experience where.
  // It should reduce the risk of the scroll hitting the "end" of the scrollable area before new data have been fetch.
  const columnFetchThreshold = useMemo(
    () => measureData.size.x - Math.round(Math.log(measureData.size.x) ** EXPONENT),
    [measureData.size.x]
  );
  const rowFetchThreshold = useMemo(
    () => measureData.size.y - Math.round(Math.log(measureData.size.y) ** EXPONENT),
    [measureData.size.y]
  );

  const onItemsRendered = useCallback(
    async ({
      overscanColumnStartIndex,
      overscanColumnStopIndex,
      overscanRowStartIndex,
      overscanRowStopIndex,
      visibleColumnStartIndex,
      visibleColumnStopIndex,
      visibleRowStartIndex,
      visibleRowStopIndex,
    }: GridOnItemsRenderedProps) => {
      viewService.gridColumnStartIndex = visibleColumnStartIndex;
      viewService.gridRowStartIndex = visibleRowStartIndex;
      viewService.gridWidth = overscanColumnStopIndex - overscanColumnStartIndex + 1;
      viewService.gridHeight = overscanRowStopIndex - overscanRowStartIndex + 1;

      if (hasMoreRows && visibleRowStopIndex >= rowFetchThreshold) {
        await dataModel.fetchNextPage(true, overscanColumnStartIndex);
        return;
      }

      if (hasMoreColumns && visibleColumnStopIndex >= columnFetchThreshold) {
        await dataModel.fetchNextPage(false, overscanRowStartIndex);
        return;
      }

      await debouncedFetchMoreData(
        dataModel,
        measureData,
        overscanColumnStartIndex,
        overscanColumnStopIndex,
        overscanRowStartIndex,
        overscanRowStopIndex
      );
    },
    [viewService, hasMoreRows, rowFetchThreshold, hasMoreColumns, columnFetchThreshold, dataModel, measureData]
  );

  const getColumnWidth = useCallback(
    (index: number) => getMeasureInfoWidth(layoutService.getMeasureInfoIndexFromCellIndex(index)),
    [getMeasureInfoWidth, layoutService]
  );

  if (measureData.size.x === 0) {
    return null;
  }

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
      itemData={
        {
          layoutService,
          grid: measureData.data,
          dataModel,
        } as GridItemData
      }
      onItemsRendered={onItemsRendered}
    >
      {MemoizedDataCell}
    </VariableSizeGrid>
  );
};

export default memo(DataGrid);
