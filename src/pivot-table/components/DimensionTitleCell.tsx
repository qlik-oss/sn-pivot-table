import React from 'react';
import { Cell } from '../../types/types';
import { borderStyle, textStyle } from './shared-styles';

interface LabelCellProps {
  cell: Cell;
  style: React.CSSProperties;
}

const labelTextStyle: React.CSSProperties = {
  ...textStyle,
  fontStyle: 'italic'
};

export const testId = 'title-cell';

const DimensionTitleCell = ({ cell, style }: LabelCellProps): JSX.Element => (
  <div style={{ ...style, ...borderStyle }} data-testid={testId}>
    <div style={labelTextStyle}>{cell.value}</div>
  </div>
);

export default DimensionTitleCell;
