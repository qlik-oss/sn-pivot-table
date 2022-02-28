import React from 'react';
import { borderStyle } from '../shared-styles';

interface EmptyCellProps {
  style: React.CSSProperties;
}

export const testId = 'empty-cell';

const EmptyCell = ({ style }: EmptyCellProps): JSX.Element => (
  <div style={{ ...style, ...borderStyle }} data-testid={testId} >
    {null}
  </div>
);

export default EmptyCell;
