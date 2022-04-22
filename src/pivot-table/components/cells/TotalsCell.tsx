import React from 'react';
import { Cell } from '../../../types/types';
import { borderStyle, textStyle } from '../shared-styles';

interface LabelCellProps {
  style: React.CSSProperties;
  cell: Cell
}

const labelTextStyle: React.CSSProperties = {
  ...textStyle,
  fontWeight: 'bold'
};

export const testId = 'totals-cell';

const TotalsCell = ({ cell, style }: LabelCellProps): JSX.Element => (
  <div style={{ ...style, ...borderStyle }} data-testid={testId}>
    <div style={labelTextStyle}>{cell.ref.qText}</div>
  </div>
);

export default TotalsCell;
