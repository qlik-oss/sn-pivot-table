import React from 'react';
import { StyleService } from '../../../types/types';
import { borderStyle, textStyle } from '../shared-styles';

interface LabelCellProps {
  cell: string;
  style: React.CSSProperties;
  styleService: StyleService;
}

const labelTextStyle: React.CSSProperties = {
  ...textStyle,
  fontStyle: 'italic'
};

export const testId = 'title-cell';

export default function DimensionTitleCell({ cell, style, styleService }: LabelCellProps): JSX.Element {
  return (
    <div title={cell as string} style={{ ...style, ...borderStyle }} data-testid={testId}>
      <div style={{ ...labelTextStyle, ...styleService.title }}>{cell as string}</div>
    </div>
  );
}
