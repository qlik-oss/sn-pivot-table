import React from 'react';
import { CellValue, GridItemData } from '../../../types/types';
import DimensionCell from './DimensionCell';
import DimensionTitleCell from './DimensionTitleCell';
import EmptyHeaderCell from './EmptyHeaderCell';
import EmptyCell from './EmptyCell';
import NxDimCellType from '../../../types/QIX';
import PseudoDimensionCell from './PseudoDimensionCell';
import TotalsCell from './TotalsCell';
import { TOTALS_CELL } from '../../../constants';
// import useDebug from '../../hooks/use-debug';

interface GridCallbackProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: GridItemData;
}

const CellFactory = ({ columnIndex, rowIndex, style, data }: GridCallbackProps): JSX.Element | null => {
  const { matrix, isLeftColumn = false, isHeader = false } = data;
  const cell = matrix[columnIndex][rowIndex] as CellValue;
  // useDebug('CellFactory', { columnIndex, rowIndex, style, data, cell }, { columnIndex, rowIndex, value: cell.value });

  if (typeof cell === 'string') {
    return <DimensionTitleCell cell={cell} style={style} />;
  }

  if (cell !== null) {
    if (cell.qType === NxDimCellType.NX_DIM_CELL_PSEUDO) {
      return <PseudoDimensionCell
        cell={cell}
        style={style}
        isLeftColumn={isLeftColumn}
      />;
    }

    if (cell.qType === NxDimCellType.NX_DIM_CELL_TOTAL && cell.qElemNo === TOTALS_CELL) {
      return <TotalsCell style={style} />;
    }

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
