import React, { memo, useLayoutEffect, useRef } from "react";
import { VariableSizeGrid, areEqual } from "react-window";
import { HeadersData } from "../../../types/types";
import DimensionTitleCell from "../cells/DimensionTitleCell";
// import useDebug from '../../hooks/use-debug';
import { gridBorderStyle } from "../shared-styles";

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
  borderWidth: "0px 1px 1px 0px",
  ...gridBorderStyle,
};

const HeaderCellFactory = ({ columnIndex, rowIndex, style, data }: GridCallbackProps): JSX.Element | null => {
  const cell = data.matrix[columnIndex][rowIndex];

  if (typeof cell === "string") {
    return <DimensionTitleCell cell={cell} style={style} />;
  }

  return null;
};

const HeaderGrid = ({
  columnWidthCallback,
  height,
  rowHightCallback,
  width,
  headersData,
}: HeaderGridProps): JSX.Element | null => {
  const headerGridRef = useRef<VariableSizeGrid>(null);
  const MemoizedCellFactory = memo(HeaderCellFactory, areEqual);

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
