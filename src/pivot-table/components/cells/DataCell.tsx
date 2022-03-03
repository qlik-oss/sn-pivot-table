import React from 'react';
import NxDimCellType from '../../../types/QIX';
import { GridItemData } from '../../../types/types';
import { borderStyle, textStyle } from '../shared-styles';

export interface MeasureCellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: GridItemData;
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

export const testId = 'measure-cell';

const MeasureCell = ({ columnIndex, rowIndex, style, data }: MeasureCellProps): JSX.Element => {
  const { qText, qType } = data.matrix[rowIndex][columnIndex] as EngineAPI.INxPivotValuePoint;

  return (
    <div style={{...style, ...containerStyle}} data-testid={testId}>
      <div style={qType === NxDimCellType.NX_DIM_CELL_NULL ? nilStyle : numericStyle}>
        <div style={textStyle}>{qText}</div>
      </div>
    </div>
  );
};

export default MeasureCell;
