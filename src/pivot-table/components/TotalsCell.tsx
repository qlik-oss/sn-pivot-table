import React from 'react';
import { borderStyle, textStyle } from './shared-styles';

interface LabelCellProps {
  style: React.CSSProperties;
}

const labelTextStyle: React.CSSProperties = {
  ...textStyle,
  fontWeight: 'bold'
};

export const testId = 'totals-cell';

export const label = 'Totals'; // TODO translate

const TotalsCell = ({ style }: LabelCellProps): JSX.Element => (
  <div style={{ ...style, ...borderStyle }} data-testid={testId}>
    <div style={labelTextStyle}>{label}</div>
  </div>
);

export default TotalsCell;
