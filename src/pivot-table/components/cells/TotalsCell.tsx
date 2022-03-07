import React from 'react';
import { borderStyle, textStyle } from '../shared-styles';

interface LabelCellProps {
  style: React.CSSProperties;
  cell: EngineAPI.INxPivotDimensionCell
}

const labelTextStyle: React.CSSProperties = {
  ...textStyle,
  fontWeight: 'bold'
};

export const testId = 'totals-cell';

const TotalsCell = ({ cell, style }: LabelCellProps): JSX.Element => (
  <div style={{ ...style, ...borderStyle }} data-testid={testId}>
    <div style={labelTextStyle}>{cell.qText}</div>
  </div>
);

export default TotalsCell;
