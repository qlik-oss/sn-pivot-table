import React from 'react';
import { render, screen } from '@testing-library/react';
import TotalsCell, { testId } from '../TotalsCell';
import { Cell } from '../../../../types/types';

test('should render',  () => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: '25px',
    top: '35px',
    width: '100px',
    height: '150px'
  };
  const cell = { ref: { qText: 'test' } } as Cell;

  render(<TotalsCell cell={cell} style={style} />);

  expect(screen.getByText(cell.ref.qText)).toBeInTheDocument();
  expect(screen.getByTestId(testId)).toHaveStyle(style as Record<string, unknown>);
});
