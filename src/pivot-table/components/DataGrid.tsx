import React, { memo, useCallback, useLayoutEffect } from "react";
import { VariableSizeGrid, areEqual, GridOnItemsRenderedProps } from 'react-window';
import { DataModel } from "../../types/types";
import CellFactory from "./CellFactory";
import useDebug from '../../hooks/use-debug';

interface DataGridProps {
  dataModel: DataModel;
  dataGridRef: React.RefObject<VariableSizeGrid>;
  columnWidthCallback: () => number;
  height: number;
  rowHightCallback: () => number;
  width: number;
}

const gridStyle: React.CSSProperties = { overflow: 'hidden' };

const DataGrid = ({
  dataModel,
  dataGridRef,
  columnWidthCallback,
  height,
  rowHightCallback,
  width,
}: DataGridProps): JSX.Element => {
  const MemoizedCellFactory = memo(CellFactory, areEqual);
  useDebug('DataGrid', {
    dataModel,
    dataGridRef,
    columnWidthCallback,
    height,
    rowHightCallback,
    width,
  });

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

  const onItemsRendered = useCallback(({
    visibleColumnStopIndex,
    visibleRowStopIndex
  }: GridOnItemsRenderedProps) => {
    if (dataModel.hasMoreRows && visibleRowStopIndex >= dataModel.pivotData.data[0].length - 1) {
      dataModel.fetchNextPage(true);
    } else if (dataModel.hasMoreColumns && visibleColumnStopIndex >= dataModel.pivotData.data.length - 1) {
      dataModel.fetchNextPage(false);
    }
  }, [dataModel]);

  return (
    <VariableSizeGrid
      ref={dataGridRef}
      style={gridStyle}
      columnCount={dataModel.pivotData.data.length}
      columnWidth={columnWidthCallback}
      height={height}
      rowCount={dataModel.pivotData.data[0].length}
      rowHeight={rowHightCallback}
      width={width}
      itemData={{
        dataModel,
        matrix: dataModel.pivotData.data,
      }}
      onItemsRendered={onItemsRendered}
    >
      {MemoizedCellFactory}
    </VariableSizeGrid>
  )
}

export default DataGrid;
