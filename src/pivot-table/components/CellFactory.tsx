import React from 'react';
import { ItemData, TYPE } from '../../types/types';
import DimensionCell from './DimensionCell';
import MeasureCell from './MeasureCell';
import DimensionTitleCell from './DimensionTitleCell';
import EmptyHeaderCell from './EmptyHeaderCell';
import EmptyCell from './EmptyCell';

interface GridCallbackProps {
  columnIndex: number;
  rowIndex: number;
  style: ReactWindow.ItemStyle;
  data: ItemData;
}

const CellFactory = ({ columnIndex, rowIndex, style, data }: GridCallbackProps): JSX.Element | null => {
  const { model, pivotData } = data;
  const cell = pivotData.matrix[columnIndex][rowIndex];

  if (cell.type === TYPE.DIMENSION) {
    const isLeftColumn = rowIndex >= pivotData.nbrTopRows;

    return <DimensionCell
      cell={cell}
      model={model}
      isLeftColumn={isLeftColumn}
      rowIndex={isLeftColumn ? rowIndex - pivotData.nbrTopRows : rowIndex}
      colIndex={isLeftColumn ? columnIndex : columnIndex - pivotData.nbrLeftColumns}
      style={style}
    />;
  }

  if (cell.type === TYPE.MEASURE) {
    return <MeasureCell
      cell={cell}
      style={style}
    />
  }

  if (cell.type === TYPE.LABEL) {
    return <DimensionTitleCell cell={cell} style={style} />
  }

  if (cell.type === TYPE.EMPTY && rowIndex < pivotData.nbrTopRows) {
    return <EmptyHeaderCell style={style} />
  }

  return <EmptyCell style={style} />
}

export default CellFactory;
