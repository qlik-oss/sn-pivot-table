import React from 'react';
import { borderStyle } from './shared-styles';

interface EmptyHeaderCellProps {
  style: React.CSSProperties;
}

const EmptyHeaderCell = ({ style }: EmptyHeaderCellProps): JSX.Element => (
  <div style={{ ...style, ...borderStyle, ...{ borderLeftWidth: 0 } }}>
    {null}
  </div>
);

export default EmptyHeaderCell;
