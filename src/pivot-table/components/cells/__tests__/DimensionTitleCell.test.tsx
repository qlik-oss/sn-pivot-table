import React from 'react';
import { render, screen } from '@testing-library/react';
import DimensionTitleCell, { testId } from '../DimensionTitleCell';

test('should render',  () => {
  const cell = 'test value';
  const style: React.CSSProperties = {
    position: 'absolute',
    left: '25px',
    top: '35px',
    width: '100px',
    height: '150px'
  };

  render(<DimensionTitleCell cell={cell} style={style} />);

  expect(screen.getByText(cell)).toBeInTheDocument();
  expect(screen.getByTestId(testId)).toHaveStyle(style as Record<string, unknown>);
});
