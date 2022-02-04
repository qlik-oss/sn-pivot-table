import React, { memo } from "react";
import { VariableSizeGrid, areEqual } from 'react-window';
import { DataModel } from "../../types/types";
import CellFactory from "./CellFactory";
import useDebug from '../../hooks/use-debug';

interface HeaderGridProps {
  dataModel: DataModel;
  headerGridRef: React.RefObject<VariableSizeGrid>;
  columnWidthCallback: () => number;
  headerGridHeight: number;
  rowHightCallback: () => number;
  headerGridWidth: number;
  constraints: Stardust.Constraints;
}

const HeaderGrid = ({
  dataModel,
  headerGridRef,
  columnWidthCallback,
  headerGridHeight,
  rowHightCallback,
  headerGridWidth,
  constraints
}: HeaderGridProps): JSX.Element => {
  const MemoizedCellFactory = memo(CellFactory, areEqual);
  useDebug('HeaderGrid', {
    dataModel,
    headerGridRef,
    columnWidthCallback,
    headerGridHeight,
    rowHightCallback,
    headerGridWidth,
    constraints
  });

  return (
    <VariableSizeGrid
      ref={headerGridRef}
      style={{ overflow: 'hidden' }}
      columnCount={dataModel.stickyData.nbrLeftColumns}
      columnWidth={columnWidthCallback}
      height={headerGridHeight}
      rowCount={dataModel.stickyData.headers[0].length}
      rowHeight={rowHightCallback}
      width={headerGridWidth}
      itemData={{
        dataModel,
        constraints,
        matrix: dataModel.stickyData.headers,
        isHeader: true
      }}
    >
      {MemoizedCellFactory}
    </VariableSizeGrid>
  )
}

export default HeaderGrid;
