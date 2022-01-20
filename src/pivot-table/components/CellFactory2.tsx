import React from 'react';
import { ItemData } from '../../types/types';
import { TYPE } from '../handle-data';
import DimensionCell from './DimensionCell';
import MeasureCell from './MeasureCell';

interface GridCallbackProps {
  columnIndex: number;
  rowIndex: number;
  style: any;
  data: ItemData;
}

const borderStyle = {
  boxSizing: 'border-box',
  padding: '4px',
  borderLeftWidth: 1,
  borderBottomWidth: 1,
  borderRightWidth: 0,
  borderTopWidth: 0,
  borderColor: 'rgb(230, 230, 230)',
  borderStyle: 'solid',
};

const textStyle = {
  fontFamily: '"Source Sans Pro", sans-serif',
  fontSize: 13,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  fontStyle: 'italic'
};

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
    return (
      <div style={{ ...style, ...borderStyle }}>
        <div style={textStyle}>{cell.value}</div>
      </div>
    );
  }

  return (
    <div style={{ ...style, ...borderStyle }}>
      {null}
    </div>
  );
}

export default CellFactory;
