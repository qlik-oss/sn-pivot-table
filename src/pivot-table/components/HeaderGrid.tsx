import React, { memo, useLayoutEffect, useRef } from "react";
import { VariableSizeGrid, areEqual } from 'react-window';
import { DataModel } from "../../types/types";
import CellFactory from "./CellFactory";
// import useDebug from '../../hooks/use-debug';
import { gridBorderStyle } from "./shared-styles";

interface HeaderGridProps {
  dataModel: DataModel;
  columnWidthCallback: () => number;
  height: number;
  rowHightCallback: () => number;
  width: number;
}

const gridStyle: React.CSSProperties = {
  overflow: 'hidden',
  borderWidth: '0px 1px 1px 0px',
  ...gridBorderStyle
};

const HeaderGrid = ({
  dataModel,
  columnWidthCallback,
  height,
  rowHightCallback,
  width,
}: HeaderGridProps): JSX.Element | null => {
  if (dataModel.pivotData.size.headers.x === 0) {
    return null;
  }

  const headerGridRef = useRef<VariableSizeGrid>(null);
  const MemoizedCellFactory = memo(CellFactory, areEqual);
  // useDebug('HeaderGrid', {
  //   dataModel,
  //   headerGridRef,
  //   columnWidthCallback,
  //   height,
  //   rowHightCallback,
  //   width,
  // });

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
      style={gridStyle}
      columnCount={dataModel.pivotData.size.headers.x}
      columnWidth={columnWidthCallback}
      height={height}
      rowCount={dataModel.pivotData.size.headers.y}
      rowHeight={rowHightCallback}
      width={width}
      itemData={{
        dataModel,
        matrix: dataModel.pivotData.headers,
        isHeader: true
      }}
    >
      {MemoizedCellFactory}
    </VariableSizeGrid>
  )
}

export default HeaderGrid;
