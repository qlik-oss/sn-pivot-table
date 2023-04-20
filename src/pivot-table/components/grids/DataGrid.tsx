/*  eslint-disable no-param-reassign */
import { debouncer } from "qlik-chart-modules";
import React, { memo, useCallback } from "react";
import { GridOnItemsRenderedProps, VariableSizeGrid, areEqual } from "react-window";
import { DataModel, GridItemData, LayoutService, MeasureData, ViewService } from "../../../types/types";
import useOnPropsChange from "../../hooks/use-on-props-change";
import DataCell from "../cells/DataCell";

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
}

type FetchModeData = (
  dataModel: DataModel,
  measureData: MeasureData,
  overscanColumnStartIndex: number,
  overscanColumnStopIndex: number,
  overscanRowStartIndex: number,
  overscanRowStopIndex: number
) => Promise<void>;

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
}: DataGridProps): JSX.Element | null => {
  const MemoizedDataCell = memo(DataCell, areEqual);

  useOnPropsChange(() => {
    if (dataGridRef.current) {
      dataGridRef.current.resetAfterColumnIndex(0, false); // Needs to be re-computed every time the data changes
    }
  }, [dataGridRef, dataModel, measureData]);

  useOnPropsChange(() => {
    if (dataGridRef.current) {
      dataGridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    }
  }, [width, height, dataGridRef]);

  const onItemsRendered = useCallback(
    async ({
      overscanColumnStartIndex,
      overscanColumnStopIndex,
      overscanRowStartIndex,
      overscanRowStopIndex,
      visibleColumnStartIndex,
      visibleRowStartIndex,
    }: GridOnItemsRenderedProps) => {
      viewService.gridColumnStartIndex = visibleColumnStartIndex;
      viewService.gridRowStartIndex = visibleRowStartIndex;
      viewService.gridWidth = overscanColumnStopIndex - overscanColumnStartIndex + 1;
      viewService.gridHeight = overscanRowStopIndex - overscanRowStartIndex + 1;

      await debouncedFetchMoreData(
        dataModel,
        measureData,
        overscanColumnStartIndex,
        overscanColumnStopIndex,
        overscanRowStartIndex,
        overscanRowStopIndex
      );
    },
    [viewService, dataModel, measureData]
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
      columnCount={layoutService.layout.qHyperCube.qSize.qcx}
      columnWidth={getColumnWidth}
      height={height}
      rowCount={layoutService.layout.qHyperCube.qSize.qcy}
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
      estimatedRowHeight={28}
    >
      {MemoizedDataCell}
    </VariableSizeGrid>
  );
};

export default memo(DataGrid);
