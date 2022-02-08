import React, { memo, useLayoutEffect } from "react";
import { VariableSizeGrid, areEqual } from 'react-window';
import { DataModel } from "../../types/types";
import CellFactory from "./CellFactory";
// import useDebug from '../../hooks/use-debug';
import { gridBorderStyle } from './shared-styles';

interface LeftGridProps {
  dataModel: DataModel;
  leftGridRef: React.RefObject<VariableSizeGrid>;
  columnWidthCallback: () => number;
  rowHightCallback: () => number;
  width: number;
  height: number;
  constraints: Stardust.Constraints;
}

const gridStyle: React.CSSProperties = {
  overflow: 'hidden',
  borderWidth: '0px 1px 0px 0px',
  ...gridBorderStyle
};

const LeftGrid = ({
  dataModel,
  leftGridRef,
  columnWidthCallback,
  rowHightCallback,
  width,
  height,
  constraints
}: LeftGridProps): JSX.Element | null => {
  if (dataModel.pivotData.size.left.x === 0) {
    return null;
  }

  const MemoizedCellFactory = memo(CellFactory, areEqual);
  // useDebug('LeftGrid', {
  //   dataModel,
  //   leftGridRef,
  //   columnWidthCallback,
  //   rowHightCallback,
  //   width,
  //   height,
  //   constraints
  // });

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
      style={gridStyle}
      columnCount={dataModel.pivotData.size.left.x}
      columnWidth={columnWidthCallback}
      height={height}
      rowCount={dataModel.pivotData.size.left.y}
      rowHeight={rowHightCallback}
      width={width}
      itemData={{
        dataModel,
        constraints,
        matrix: dataModel.pivotData.left,
        isLeftColumn: true
      }}
    >
      {MemoizedCellFactory}
    </VariableSizeGrid>
  )
}

export default LeftGrid;
