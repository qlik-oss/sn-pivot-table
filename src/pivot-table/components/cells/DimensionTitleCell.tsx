import React from 'react';
import { useStyleContext } from '../../contexts/StyleProvider';
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

export default function DimensionTitleCell({ cell, style }: LabelCellProps): JSX.Element {
  const styleService = useStyleContext();

  return (
    <div title={cell as string} style={{ ...style, ...borderStyle }} data-testid={testId}>
      <div style={{ ...labelTextStyle, ...styleService.header }}>{cell as string}</div>
    </div>
  );
}
