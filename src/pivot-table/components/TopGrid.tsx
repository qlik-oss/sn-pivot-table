import React, { memo } from "react";
import { VariableSizeGrid, areEqual } from 'react-window';
import { DataModel } from "../../types/types";
import CellFactory from "./CellFactory";
import useDebug from '../../hooks/use-debug';

interface TopGridProps {
  dataModel: DataModel;
  topGridRef: React.RefObject<VariableSizeGrid>;
  columnWidthCallback: () => number;
  topGridHeight: number;
  rowHightCallback: () => number;
  topGridWidth: number;
  constraints: Stardust.Constraints;
}

const TopGrid = ({
  dataModel,
  topGridRef,
  columnWidthCallback,
  topGridHeight,
  rowHightCallback,
  topGridWidth,
  constraints
}: TopGridProps): JSX.Element => {
  const MemoizedCellFactory = memo(CellFactory, areEqual);
  useDebug('TopGrid', {
    dataModel,
    topGridRef,
    columnWidthCallback,
    topGridHeight,
    rowHightCallback,
    topGridWidth,
    constraints
  });

  return (
    <VariableSizeGrid
      ref={topGridRef}
      style={{ overflow: 'hidden' }}
      columnCount={dataModel.stickyData.top.length}
      columnWidth={columnWidthCallback}
      height={topGridHeight}
      rowCount={dataModel.stickyData.top[0].length}
      rowHeight={rowHightCallback}
      width={topGridWidth}
      itemData={{
        dataModel,
        constraints,
        matrix: dataModel.stickyData.top,
        isHeader: false
      }}
    >
      {MemoizedCellFactory}
    </VariableSizeGrid>
  )
}

export default TopGrid;
