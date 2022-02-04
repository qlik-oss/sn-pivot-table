import React, { memo, useLayoutEffect, useRef } from "react";
import { VariableSizeGrid, areEqual } from 'react-window';
import { DataModel } from "../../types/types";
import CellFactory from "./CellFactory";
import useDebug from '../../hooks/use-debug';

interface HeaderGridProps {
  dataModel: DataModel;
  columnWidthCallback: () => number;
  height: number;
  rowHightCallback: () => number;
  width: number;
}

const HeaderGrid = ({
  dataModel,
  columnWidthCallback,
  height,
  rowHightCallback,
  width,
}: HeaderGridProps): JSX.Element => {
  const headerGridRef = useRef<VariableSizeGrid>(null);
  const MemoizedCellFactory = memo(CellFactory, areEqual);
  useDebug('HeaderGrid', {
    dataModel,
    headerGridRef,
    columnWidthCallback,
    height,
    rowHightCallback,
    width,
  });

  useLayoutEffect(() => {
    if (headerGridRef.current) {
      headerGridRef.current.resetAfterColumnIndex(0);
    }
  }, [dataModel]);

  useLayoutEffect(() => {
    if (headerGridRef.current) {
      headerGridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    }
  }, [width, height]);

  return (
    <VariableSizeGrid
      ref={headerGridRef}
      style={{ overflow: 'hidden' }}
      columnCount={dataModel.stickyData.nbrLeftColumns}
      columnWidth={columnWidthCallback}
      height={height}
      rowCount={dataModel.stickyData.headers[0].length}
      rowHeight={rowHightCallback}
      width={width}
      itemData={{
        dataModel,
        matrix: dataModel.stickyData.headers,
        isHeader: true
      }}
    >
      {MemoizedCellFactory}
    </VariableSizeGrid>
  )
}

export default HeaderGrid;
