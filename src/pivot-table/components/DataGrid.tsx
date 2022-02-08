import React, { memo, useCallback, useLayoutEffect } from 'react';
import { VariableSizeGrid, areEqual, GridOnItemsRenderedProps } from 'react-window';
import { DataModel } from '../../types/types';
import DataCell from './DataCell';
// import useDebug from '../../hooks/use-debug';

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
}: DataGridProps): JSX.Element | null => {
  if (dataModel.pivotData.size.data.x === 0) {
    return null;
  }

  const MemoizedDataCell = memo(DataCell, areEqual);
  // useDebug('DataGrid', {
  //   dataModel,
  //   dataGridRef,
  //   columnWidthCallback,
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

  const onItemsRendered = useCallback(({
    visibleColumnStopIndex,
    visibleRowStopIndex
  }: GridOnItemsRenderedProps) => {
    if (dataModel.hasMoreRows && visibleRowStopIndex >= dataModel.pivotData.size.data.y - 1) {
      dataModel.fetchNextPage(true);
    } else if (dataModel.hasMoreColumns && visibleColumnStopIndex >= dataModel.pivotData.size.data.x - 1) {
      dataModel.fetchNextPage(false);
    }
  }, [dataModel]);

  return (
    <VariableSizeGrid
      ref={dataGridRef}
      style={gridStyle}
      columnCount={dataModel.pivotData.size.data.x}
      columnWidth={columnWidthCallback}
      height={height}
      rowCount={dataModel.pivotData.size.data.y}
      rowHeight={rowHightCallback}
      width={width}
      itemData={{
        dataModel,
        matrix: dataModel.pivotData.data,
      }}
      onItemsRendered={onItemsRendered}
    >
      {MemoizedDataCell}
    </VariableSizeGrid>
  );
};

export default DataGrid;
