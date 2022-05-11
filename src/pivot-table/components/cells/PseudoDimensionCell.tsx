import React from 'react';
import { Cell } from '../../../types/types';
import { borderStyle, textStyle } from '../shared-styles';

interface LabelCellProps {
  cell: Cell;
  style: React.CSSProperties;
  isLeftColumn: boolean;
}

const labelTextStyle: React.CSSProperties = {
  ...textStyle,
};

const topContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const leftContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

export const testId = 'pseudo-dimension-cell';

export default function PseudoDimensionCell({ cell, style, isLeftColumn }: LabelCellProps): JSX.Element {
  return (
    <div style={{ ...style, ...borderStyle, ...(isLeftColumn ? leftContainerStyle : topContainerStyle) }} data-testid={testId}>
      <div style={labelTextStyle}>{cell.ref.qText}</div>
    </div>
  );
}
