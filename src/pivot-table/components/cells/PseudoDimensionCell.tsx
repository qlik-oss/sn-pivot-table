import React from 'react';
import { CellValue } from '../../../types/types';
import { borderStyle, textStyle } from '../shared-styles';

interface LabelCellProps {
  cell: CellValue;
  style: React.CSSProperties;
  isLeftColumn: boolean;
}

const labelTextStyle: React.CSSProperties = {
  ...textStyle,
};

const topContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const leftContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

export const testId = 'pseudo-dimension-cell';

const PseudoDimensionCell = ({ cell, style, isLeftColumn }: LabelCellProps): JSX.Element => (
  <div style={{ ...style, ...borderStyle, ...(isLeftColumn ? leftContainerStyle : topContainerStyle) }} data-testid={testId}>
    <div style={labelTextStyle}>{(cell as EngineAPI.INxPivotDimensionCell).qText}</div>
  </div>
);

export default PseudoDimensionCell;
