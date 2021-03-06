import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyCell, { testId } from '../EmptyCell';

test('should render',  () => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: '25px',
    top: '35px',
    width: '100px',
    height: '150px'
  };

  render(<EmptyCell style={style} />);

  const elm = screen.getByTestId(testId);
  expect(elm).toBeInTheDocument();
  expect(elm).toHaveStyle(style as Record<string, unknown>);
});
