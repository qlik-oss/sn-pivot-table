import React from 'react';
import { CellValue } from '../../types/types';
import { borderStyle, textStyle } from './shared-styles';

interface LabelCellProps {
  cell: CellValue;
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
