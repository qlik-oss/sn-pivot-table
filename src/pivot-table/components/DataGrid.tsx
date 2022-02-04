import React, { memo } from "react";
import { VariableSizeGrid, areEqual, GridOnItemsRenderedProps } from 'react-window';
import { DataModel } from "../../types/types";
import CellFactory from "./CellFactory";
import useDebug from '../../hooks/use-debug';

interface DataGridProps {
  dataModel: DataModel;
  dataGridRef: React.RefObject<VariableSizeGrid>;
  columnWidthCallback: () => number;
  dataGridHeight: number;
  rowHightCallback: () => number;
  dataGridWidth: number;
  constraints: Stardust.Constraints;
  onItemsRendered: (params: GridOnItemsRenderedProps) => void;
}

const DataGrid = ({
  dataModel,
  dataGridRef,
  columnWidthCallback,
  dataGridHeight,
  rowHightCallback,
  dataGridWidth,
  constraints,
  onItemsRendered
}: DataGridProps): JSX.Element => {
  const MemoizedCellFactory = memo(CellFactory, areEqual);
  useDebug('DataGrid', {
    dataModel,
    dataGridRef,
    columnWidthCallback,
    dataGridHeight,
    rowHightCallback,
    dataGridWidth,
    constraints,
    onItemsRendered
  });

  return (
    <VariableSizeGrid
      ref={dataGridRef}
      style={{ overflow: 'hidden' }}
      columnCount={dataModel.stickyData.data.length}
      columnWidth={columnWidthCallback}
      height={dataGridHeight}
      rowCount={dataModel.stickyData.data[0].length}
      rowHeight={rowHightCallback}
      width={dataGridWidth}
      itemData={{
        dataModel,
        constraints,
        matrix: dataModel.stickyData.data,
      }}
      onItemsRendered={onItemsRendered}
    >
      {MemoizedCellFactory}
    </VariableSizeGrid>
  )
}

export default DataGrid;
