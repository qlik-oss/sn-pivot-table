import React, { memo, useLayoutEffect, useRef } from 'react';
import { VariableSizeGrid, areEqual } from 'react-window';
import { DataService } from '../../../types/types';
import DimensionTitleCell from '../cells/DimensionTitleCell';
// import useDebug from '../../hooks/use-debug';
import { gridBorderStyle } from '../shared-styles';

interface HeaderGridProps {
  columnWidthCallback: (index: number) => number;
  height: number;
  rowHightCallback: () => number;
  width: number;
  dataService: DataService;
}

interface GridCallbackProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    matrix: (string | null)[][]
  };
}

interface HeaderItemData {
  matrix: (string | null)[][];
}

const gridStyle: React.CSSProperties = {
  overflow: 'hidden',
  borderWidth: '0px 1px 1px 0px',
  ...gridBorderStyle
};

const HeaderCellFactory = ({ columnIndex, rowIndex, style, data }: GridCallbackProps): JSX.Element | null => {
  const cell = data.matrix[columnIndex][rowIndex];

  if (typeof cell === 'string') {
    return <DimensionTitleCell cell={cell} style={style} />;
  }

  return null;
};

const HeaderGrid = ({
  columnWidthCallback,
  height,
  rowHightCallback,
  width,
  dataService,
}: HeaderGridProps): JSX.Element | null => {
  if (dataService.size.headers.x === 0) {
    return null;
  }

  const headerGridRef = useRef<VariableSizeGrid>(null);
  const MemoizedCellFactory = memo(HeaderCellFactory, areEqual);
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
  }, [dataService]);

  useLayoutEffect(() => {
    if (headerGridRef.current) {
      headerGridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    }
  }, [width, height]);

  return (
    <VariableSizeGrid
      ref={headerGridRef}
      style={gridStyle}
      columnCount={dataService.size.headers.x}
      columnWidth={columnWidthCallback}
      height={height}
      rowCount={dataService.size.headers.y}
      rowHeight={rowHightCallback}
      width={width}
      itemData={{
        matrix: dataService.data.headers,
      } as HeaderItemData}
    >
      {MemoizedCellFactory}
    </VariableSizeGrid>
  );
};

export default HeaderGrid;
