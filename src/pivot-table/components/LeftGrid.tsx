import React, { memo, useLayoutEffect } from "react";
import { VariableSizeGrid, areEqual } from 'react-window';
import { DataModel } from "../../types/types";
import CellFactory from "./CellFactory";
import useDebug from '../../hooks/use-debug';

interface LeftGridProps {
  dataModel: DataModel;
  leftGridRef: React.RefObject<VariableSizeGrid>;
  columnWidthCallback: () => number;
  rowHightCallback: () => number;
  width: number;
  height: number;
  constraints: Stardust.Constraints;
}

const LeftGrid = ({
  dataModel,
  leftGridRef,
  columnWidthCallback,
  rowHightCallback,
  width,
  height,
  constraints
}: LeftGridProps): JSX.Element => {
  const MemoizedCellFactory = memo(CellFactory, areEqual);
  useDebug('LeftGrid', {
    dataModel,
    leftGridRef,
    columnWidthCallback,
    rowHightCallback,
    width,
    height,
    constraints
  });

  useLayoutEffect(() => {
    if (leftGridRef.current) {
      leftGridRef.current.resetAfterColumnIndex(0);
    }
  }, [dataModel]);

  useLayoutEffect(() => {
    if (leftGridRef.current) {
      leftGridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    }
  }, [width, height]);

  return (
    <VariableSizeGrid
      ref={leftGridRef}
      style={{ overflow: 'hidden' }}
      columnCount={dataModel.stickyData.nbrLeftColumns}
      columnWidth={columnWidthCallback}
      height={height}
      rowCount={dataModel.stickyData.left[0].length}
      rowHeight={rowHightCallback}
      width={width}
      itemData={{
        dataModel,
        constraints,
        matrix: dataModel.stickyData.left,
        isLeftColumn: true
      }}
    >
      {MemoizedCellFactory}
    </VariableSizeGrid>
  )
}

export default LeftGrid;
