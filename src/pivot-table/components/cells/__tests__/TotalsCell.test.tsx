import React from 'react';
import { render, screen } from '@testing-library/react';
import TotalsCell, { label, testId } from '../TotalsCell';

test('should render',  () => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: '25px',
    top: '35px',
    width: '100px',
    height: '150px'
  };

  render(<TotalsCell style={style} />);

  expect(screen.getByText(label)).toBeInTheDocument();
  expect(screen.getByTestId(testId)).toHaveStyle(style as Record<string, unknown>);
});
