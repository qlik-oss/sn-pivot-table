import React from 'react';
import { borderStyle } from './shared-styles';

interface EmptyCellProps {
  style: ReactWindow.ItemStyle;
}

const EmptyCell = ({ style }: EmptyCellProps): JSX.Element => (
  <div style={{ ...style, ...borderStyle }}>
    {null}
  </div>
);

export default EmptyCell;
