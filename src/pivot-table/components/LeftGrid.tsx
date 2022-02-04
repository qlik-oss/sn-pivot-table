import React, { memo } from "react";
import { VariableSizeGrid, areEqual } from 'react-window';
import { DataModel } from "../../types/types";
import CellFactory from "./CellFactory";
import useDebug from '../../hooks/use-debug';

interface LeftGridProps {
  dataModel: DataModel;
  leftGridRef: React.RefObject<VariableSizeGrid>;
  columnWidthCallback: () => number;
  leftGridHeight: number;
  rowHightCallback: () => number;
  leftGridWidth: number;
  constraints: Stardust.Constraints;
}

const LeftGrid = ({
  dataModel,
  leftGridRef,
  columnWidthCallback,
  leftGridHeight,
  rowHightCallback,
  leftGridWidth,
  constraints
}: LeftGridProps): JSX.Element => {
  const MemoizedCellFactory = memo(CellFactory, areEqual);
  useDebug('LeftGrid', {
    dataModel,
    leftGridRef,
    columnWidthCallback,
    leftGridHeight,
    rowHightCallback,
    leftGridWidth,
    constraints
  });

  return (
    <VariableSizeGrid
      ref={leftGridRef}
      style={{ overflow: 'hidden' }}
      columnCount={dataModel.stickyData.nbrLeftColumns}
      columnWidth={columnWidthCallback}
      height={leftGridHeight}
      rowCount={dataModel.stickyData.left[0].length}
      rowHeight={rowHightCallback}
      width={leftGridWidth}
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
