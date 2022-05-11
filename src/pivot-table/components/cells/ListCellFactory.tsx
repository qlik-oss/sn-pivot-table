import React from 'react';
import { ListItemData } from '../../../types/types';
import DimensionCell from './DimensionCell';
import EmptyCell from './EmptyCell';
import NxDimCellType from '../../../types/QIX';
import PseudoDimensionCell from './PseudoDimensionCell';
import TotalsCell from './TotalsCell';
import { TOTALS_CELL } from '../../../constants';
// import useDebug from '../../hooks/use-debug';

interface ListCallbackProps {
  index: number;
  style: React.CSSProperties;
  data: ListItemData;
}

export default function ListCellFactory({ index, style, data}: ListCallbackProps): JSX.Element | null {
  const { list, isLeftColumn = false  } = data;
  const cell = list[index];
  // useDebug('CellFactory', { columnIndex, rowIndex, style, data, cell }, { columnIndex, rowIndex, value: cell.value });

  if (cell.ref.qType === NxDimCellType.NX_DIM_CELL_PSEUDO) {
    return <PseudoDimensionCell
      cell={cell}
      style={style}
      isLeftColumn={isLeftColumn}
    />;
  }

  if (cell.ref.qType === NxDimCellType.NX_DIM_CELL_TOTAL && cell.ref.qElemNo === TOTALS_CELL) {
    return <TotalsCell cell={cell} style={style} />;
  }

  if (cell.ref.qType === NxDimCellType.NX_DIM_CELL_EMPTY) {
    return <EmptyCell style={style} />;
  }

  return <DimensionCell
    cell={cell}
    data={data}
    rowIndex={cell.y}
    colIndex={cell.x}
    style={style}
    isLeftColumn={isLeftColumn}
  />;
}
