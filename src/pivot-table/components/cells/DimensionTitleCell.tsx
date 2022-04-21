import React from 'react';
import { borderStyle, textStyle } from '../shared-styles';

interface LabelCellProps {
  cell: string;
  style: React.CSSProperties;
}

const labelTextStyle: React.CSSProperties = {
  ...textStyle,
  color: '#595959',
  fontStyle: 'italic'
};

export const testId = 'title-cell';

const DimensionTitleCell = ({ cell, style }: LabelCellProps): JSX.Element => (
  <div title={cell as string} style={{ ...style, ...borderStyle }} data-testid={testId}>
    <div style={labelTextStyle}>{cell as string}</div>
  </div>
);

export default DimensionTitleCell;
