import React from 'react';
import { render, screen } from '@testing-library/react'
import DataCell, { testId } from '../DataCell';
import { NxPivotValuePoint } from '../../../types/QIX';
import { ItemData } from '../../../types/types';

describe('DataCell', () => {
  let cell: NxPivotValuePoint;
  let data: ItemData;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: '25px',
    top: '35px',
    width: '100px',
    height: '150px'
  };

  beforeEach(() => {
    cell = {
      qText: 'value',
      qNum: 1,
    } as NxPivotValuePoint;

    data = {
      matrix: [[cell]]
    } as ItemData;
  });

  test('should render',  () => {
    render(<DataCell data={data} style={style} columnIndex={0} rowIndex={0} />);

    expect(screen.getByText(cell.qText)).toBeInTheDocument()
    expect(screen.getByTestId(testId)).toHaveStyle(style as Record<string, unknown>);
  });

  test('should render null value',  () => {
    cell.qText = '-';
    cell.qNum = 'NaN';

    render(<DataCell data={data} style={style} columnIndex={0} rowIndex={0} />);

    expect(screen.getByText(cell.qText)).toBeInTheDocument()
    expect(screen.getByTestId(testId).childNodes[0])
      .toHaveStyle({ justifyContent: 'center', backgroundColor: '#f2f2f2' } as Record<string, unknown>);
  });
});
