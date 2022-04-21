import { stardust } from '@nebula.js/stardust';
import React from 'react';
import { render } from '@testing-library/react';
import ListCellFactory from '../ListCellFactory';
import { DataModel, ListItemData, PivotDimensionCellWithPosition } from '../../../../types/types';
import DimensionCell from '../DimensionCell';
import EmptyCell from '../EmptyCell';
import PseudoDimensionCell from '../PseudoDimensionCell';
import TotalsCell from '../TotalsCell';
import NxDimCellType from '../../../../types/QIX';
import dataModelMock from './__mocks__/data-model-mock';

jest.mock('../DimensionCell');
jest.mock('../EmptyCell');
jest.mock('../PseudoDimensionCell');
jest.mock('../TotalsCell');

describe('ListCellFactory', () => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: '25px',
    top: '35px',
    width: '100px',
    height: '150px'
  };
  const qText = 'test value';
  let constraints: stardust.Constraints;
  let dataModel: DataModel;
  let data: ListItemData;
  let cell: PivotDimensionCellWithPosition;

  beforeEach(() => {
    constraints = {
      active: false,
      passive: false,
      select: false,
    };

    dataModel = dataModelMock();

    data = {
      dataModel,
      list: [],
      constraints,
    };
  });

  test('should render dimension cell', () => {
    const mockDimensionCell = DimensionCell as jest.MockedFunction<typeof DimensionCell>;
    mockDimensionCell.mockReturnValue(<div />);
    cell = { qText, qCanCollapse: false, qCanExpand: false, x: 1, y: 2 } as PivotDimensionCellWithPosition;
    data.list[0] = cell;

    render(<ListCellFactory index={0} style={style} data={data} />);

    expect(mockDimensionCell).toHaveBeenCalledWith({ style, cell, data, rowIndex: 2, colIndex: 1, isLeftColumn: false }, {});
  });

  test('should render pseudo dimension cell', () => {
    const mockPseudoDimensionCell = PseudoDimensionCell as jest.MockedFunction<typeof PseudoDimensionCell>;
    mockPseudoDimensionCell.mockReturnValue(<div />);
    cell = { qText, qType: NxDimCellType.NX_DIM_CELL_PSEUDO } as PivotDimensionCellWithPosition;
    data.list[0] = cell;

    render(<ListCellFactory index={0} style={style} data={data} />);

    expect(mockPseudoDimensionCell).toHaveBeenCalledWith({ style, cell, isLeftColumn: false }, {});
  });

  test('should render totals cell', () => {
    const mockedTotalsCell = TotalsCell as jest.MockedFunction<typeof TotalsCell>;
    mockedTotalsCell.mockReturnValue(<div />);
    cell = { qText, qType: NxDimCellType.NX_DIM_CELL_TOTAL, qElemNo: -1 } as PivotDimensionCellWithPosition;
    data.list[0] = cell;

    render(<ListCellFactory index={0} style={style} data={data} />);

    expect(mockedTotalsCell).toHaveBeenCalledWith({ cell, style }, {});
  });

  test('should render empty cell', () => {
    const mockEmptyCell = EmptyCell as jest.MockedFunction<typeof EmptyCell>;
    mockEmptyCell.mockReturnValue(<div />);
    cell = { qText, qType: NxDimCellType.NX_DIM_CELL_EMPTY } as PivotDimensionCellWithPosition;;
    data.list[0] = cell;

    render(<ListCellFactory index={0} style={style} data={data} />);

    expect(mockEmptyCell).toHaveBeenCalledWith({ style }, {});
  });
});
