import React, { memo, useLayoutEffect, useRef } from "react";
import { VariableSizeGrid, areEqual } from "react-window";
import { HeadersData } from "../../../types/types";
import DimensionTitleCell from "../cells/DimensionTitleCell";
// import useDebug from '../../hooks/use-debug';

interface HeaderGridProps {
  columnWidthCallback: (index: number) => number;
  height: number;
  rowHightCallback: () => number;
  width: number;
  headersData: HeadersData;
}

interface HeaderItemData {
  matrix: (string | null)[][];
}

interface GridCallbackProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: HeaderItemData;
}

const gridStyle: React.CSSProperties = {
  overflow: "hidden",
};

const MemoizedCellFactory = memo(({ columnIndex, rowIndex, style, data }: GridCallbackProps): JSX.Element | null => {
  const cell = data.matrix[columnIndex][rowIndex];
  const isLastColumn = columnIndex === data.matrix.length - 1;

  if (typeof cell === "string") {
    return <DimensionTitleCell cell={cell} style={style} isLastColumn={isLastColumn} />;
  }

  return null;
}, areEqual);

const HeaderGrid = ({
  columnWidthCallback,
  height,
  rowHightCallback,
  width,
  headersData,
}: HeaderGridProps): JSX.Element | null => {
  const headerGridRef = useRef<VariableSizeGrid>(null);

  useLayoutEffect(() => {
    if (headerGridRef.current) {
      headerGridRef.current.resetAfterColumnIndex(0);
    }
  }, [headersData]);

  useLayoutEffect(() => {
    if (headerGridRef.current) {
      headerGridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    }
  }, [width, height]);

  if (headersData.size.x === 0) {
    return null;
  }

  return (
    <VariableSizeGrid
      ref={headerGridRef}
      style={gridStyle}
      columnCount={headersData.size.x}
      columnWidth={columnWidthCallback}
      height={height}
      rowCount={headersData.size.y}
      rowHeight={rowHightCallback}
      width={width}
      itemData={
        {
          matrix: headersData.data,
        } as HeaderItemData
      }
    >
      {MemoizedCellFactory}
    </VariableSizeGrid>
  );
};

export default memo(HeaderGrid);
