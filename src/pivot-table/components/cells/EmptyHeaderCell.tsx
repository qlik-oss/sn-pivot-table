import React from 'react';
import { borderStyle } from '../shared-styles';

interface EmptyHeaderCellProps {
  style: React.CSSProperties;
}

export const testId = 'empty-header-cell';

const EmptyHeaderCell = ({ style }: EmptyHeaderCellProps): JSX.Element => (
  <div style={{ ...style, ...borderStyle, ...{ borderLeftWidth: 0 } }} data-testid={testId}>
    {null}
  </div>
);

export default EmptyHeaderCell;
