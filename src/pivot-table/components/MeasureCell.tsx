import React from 'react';
import { NxPivotValuePoint } from '../../types/QIX';
import { Cell } from '../../types/types';
import { borderStyle, textStyle } from './shared-styles';

export interface MeasureCellProps {
  cell: Cell;
  style: React.CSSProperties;
}

const numericStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: '100%',
  ...borderStyle
};
const nilStyle: React.CSSProperties = {
  alignItems: 'center',
  backgroundColor: '#f2f2f2',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  height: '100%',
  backgroundClip: 'padding-box',
  ...borderStyle
};
const containerStyle: React.CSSProperties = {
  color: 'rgb(89, 89, 89)',
  justifyContent: 'center',
};

const MeasureCell = ({ cell, style }: MeasureCellProps): JSX.Element => {
  const { qNum, qText } = (cell.value as NxPivotValuePoint);

  return (
    <div style={{...style, ...containerStyle}}>
      <div style={qNum === 'NaN' ? nilStyle : numericStyle}>
        <div style={textStyle}>{qText}</div>
      </div>
    </div>
  )
};

export default MeasureCell;
