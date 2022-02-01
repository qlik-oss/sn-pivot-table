import React from 'react';
import { render, screen } from '@testing-library/react'
import MeasureCell, { testId } from '../MeasureCell';
import { Cell } from '../../../types/types';
import { NxPivotValuePoint } from '../../../types/QIX';

describe('MeasureCell', () => {
  let cell: Cell;
  const style: React.CSSProperties = {
    position: 'absolute',
    left: '25px',
    top: '35px',
    width: '100px',
    height: '150px'
  };

  beforeEach(() => {
    cell = {
      key: 1,
      type: 'a cell',
      value: {
        qText: 'value',
        qNum: 1,
      } as NxPivotValuePoint
    };
  });

  test('should render',  () => {
    render(<MeasureCell cell={cell} style={style} />);

    expect(screen.getByText((cell.value as NxPivotValuePoint).qText)).toBeInTheDocument()
    expect(screen.getByTestId(testId)).toHaveStyle(style as Record<string, unknown>);
  });

  test('should render null value',  () => {
    (cell.value as NxPivotValuePoint).qText = '-';
    (cell.value as NxPivotValuePoint).qNum = 'NaN';

    render(<MeasureCell cell={cell} style={style} />);

    expect(screen.getByText((cell.value as NxPivotValuePoint).qText)).toBeInTheDocument()
    expect(screen.getByTestId(testId).childNodes[0])
      .toHaveStyle({ justifyContent: 'center', backgroundColor: '#f2f2f2' } as Record<string, unknown>);
  });
});
