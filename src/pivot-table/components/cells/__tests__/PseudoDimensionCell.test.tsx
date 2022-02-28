import React from 'react';
import { render, screen } from '@testing-library/react';
import PseudoDimensionCell, { testId } from '../PseudoDimensionCell';
import { CellValue } from '../../../../types/types';

test('should render on the top',  () => {
  const cell: CellValue = { qText: 'test' } as EngineAPI.INxPivotDimensionCell;
  const style: React.CSSProperties = {
    position: 'absolute',
    left: '25px',
    top: '35px',
    width: '100px',
    height: '150px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  render(<PseudoDimensionCell cell={cell} style={style} isLeftColumn={false} />);

  expect(screen.getByText('test')).toBeInTheDocument();
  expect(screen.getByTestId(testId)).toHaveStyle(style as Record<string, unknown>);
});


test('should render on the left',  () => {
  const cell: CellValue = { qText: 'test' } as EngineAPI.INxPivotDimensionCell;
  const style: React.CSSProperties = {
    position: 'absolute',
    left: '25px',
    top: '35px',
    width: '100px',
    height: '150px',
    display: 'flex',
    alignItems: 'center',
  };

  render(<PseudoDimensionCell cell={cell} style={style} isLeftColumn />);

  expect(screen.getByText('test')).toBeInTheDocument();
  expect(screen.getByTestId(testId)).toHaveStyle(style as Record<string, unknown>);
  expect(screen.getByTestId(testId)).not.toHaveStyle({ justifyContent: 'center' } as Record<string, unknown>);
});
