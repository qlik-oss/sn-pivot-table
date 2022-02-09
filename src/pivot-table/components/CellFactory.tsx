import React from 'react';
import { CellValue, ItemData } from '../../types/types';
import DimensionCell from './DimensionCell';
import DimensionTitleCell from './DimensionTitleCell';
import EmptyHeaderCell from './EmptyHeaderCell';
import EmptyCell from './EmptyCell';
// import useDebug from '../../hooks/use-debug';

interface GridCallbackProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: ItemData;
}

const CellFactory = ({ columnIndex, rowIndex, style, data }: GridCallbackProps): JSX.Element | null => {
  const { matrix, isLeftColumn = false, isHeader = false } = data;
  const cell = matrix[columnIndex][rowIndex] as CellValue;
  // useDebug('CellFactory', { columnIndex, rowIndex, style, data, cell }, { columnIndex, rowIndex, value: cell.value });

  if (typeof cell === 'string') {
    return <DimensionTitleCell cell={cell} style={style} />;
  }

  if (cell !== null) {
    return <DimensionCell
      cell={cell}
      data={data}
      rowIndex={rowIndex}
      colIndex={columnIndex}
      style={style}
      isLeftColumn={isLeftColumn}
    />;
  }

  if (cell === null && isHeader) {
    return <EmptyHeaderCell style={style} />;
  }

  return <EmptyCell style={style} />;
};

export default CellFactory;
