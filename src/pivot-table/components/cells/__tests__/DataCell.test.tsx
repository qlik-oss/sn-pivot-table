import React from 'react';
import { render, screen } from '@testing-library/react';
import DataCell, { testId } from '../DataCell';
import { GridItemData } from '../../../../types/types';
import NxDimCellType from '../../../../types/QIX';

describe('DataCell', () => {
  let cell: EngineAPI.INxPivotValuePoint;
  let data: GridItemData;

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
      qType: NxDimCellType.NX_DIM_CELL_NORMAL
    } as EngineAPI.INxPivotValuePoint;

    data = {
      grid: [[cell]]
    } as GridItemData;
  });

  test('should render',  () => {
    render(<DataCell data={data} style={style} columnIndex={0} rowIndex={0} />);

    expect(screen.getByText(cell.qText)).toBeInTheDocument();
    expect(screen.getByTestId(testId)).toHaveStyle(style as Record<string, unknown>);
  });

  test('should render null value',  () => {
    cell.qText = '-';
    cell.qType = NxDimCellType.NX_DIM_CELL_NULL;

    render(<DataCell data={data} style={style} columnIndex={0} rowIndex={0} />);

    expect(screen.getByText(cell.qText)).toBeInTheDocument();
    expect(screen.getByTestId(testId).childNodes[0])
      .toHaveStyle({ justifyContent: 'center', backgroundColor: '#f2f2f2' } as Record<string, unknown>);
  });
});
