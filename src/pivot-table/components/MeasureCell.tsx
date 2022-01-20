import React from 'react';
import { NxPivotValuePoint } from '../../types/QIX';
import { Cell } from '../handle-data';

export interface MeasureCellProps {
  cell: Cell;
  style: any;
}

const MeasureCell = ({ cell, style }: MeasureCellProps): JSX.Element => {
  const { qNum, qText } = (cell.value as NxPivotValuePoint);
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
  const numericStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    ...borderStyle
  };
  const nilStyle = {
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    height: '100%',
    // padding: '4px',
    backgroundClip: 'padding-box',
    ...borderStyle
  };
  const containerStyle = {
    color: 'rgb(89, 89, 89)',
    minHeight: 24,
    justifyContent: 'center',
  };

  return (
    <div style={{...style, ...containerStyle}}>
      <div style={qNum === 'NaN' ? nilStyle : numericStyle}>
        <div>{qText}</div>
      </div>
    </div>
  )
};

export default MeasureCell;
