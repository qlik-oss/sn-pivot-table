import React, { memo, useLayoutEffect } from "react";
import { VariableSizeGrid, areEqual } from 'react-window';
import { DataModel } from "../../types/types";
import CellFactory from "./CellFactory";
import useDebug from '../../hooks/use-debug';
import { gridBorderStyle } from "./shared-styles";

interface TopGridProps {
  dataModel: DataModel;
  topGridRef: React.RefObject<VariableSizeGrid>;
  columnWidthCallback: () => number;
  rowHightCallback: () => number;
  width: number;
  height: number;
  constraints: Stardust.Constraints;
}

const gridStyle: React.CSSProperties = {
  overflow: 'hidden',
  borderWidth: '0px 0px 1px 0px',
  ...gridBorderStyle
};

const TopGrid = ({
  dataModel,
  topGridRef,
  columnWidthCallback,
  rowHightCallback,
  width,
  height,
  constraints
}: TopGridProps): JSX.Element => {
  const MemoizedCellFactory = memo(CellFactory, areEqual);
  useDebug('TopGrid', {
    dataModel,
    topGridRef,
    columnWidthCallback,
    rowHightCallback,
    width,
    height,
    constraints
  });

  useLayoutEffect(() => {
    if (topGridRef.current) {
      topGridRef.current.resetAfterColumnIndex(0);
    }
  }, [dataModel]);

  useLayoutEffect(() => {
    if (topGridRef.current) {
      topGridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    }
  }, [width, height]);

  return (
    <VariableSizeGrid
      ref={topGridRef}
      style={gridStyle}
      columnCount={dataModel.stickyData.top.length}
      columnWidth={columnWidthCallback}
      height={height}
      rowCount={dataModel.stickyData.top[0].length}
      rowHeight={rowHightCallback}
      width={width}
      itemData={{
        dataModel,
        constraints,
        matrix: dataModel.stickyData.top,
        isHeader: true
      }}
    >
      {MemoizedCellFactory}
    </VariableSizeGrid>
  )
}

export default TopGrid;
