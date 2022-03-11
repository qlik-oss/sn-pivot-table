import React from 'react';
import { borderStyle, textStyle } from '../shared-styles';

interface LabelCellProps {
  cell: string;
  style: React.CSSProperties;
}

const labelTextStyle: React.CSSProperties = {
  ...textStyle,
  fontStyle: 'italic'
};

export const testId = 'title-cell';

const DimensionTitleCell = ({ cell, style }: LabelCellProps): JSX.Element => (
  <div style={{ ...style, ...borderStyle }} data-testid={testId}>
    <div style={labelTextStyle}>{cell as string}</div>
  </div>
);

export default DimensionTitleCell;
