import { stardust } from '@nebula.js/stardust';
import React from 'react';
import { render } from '@testing-library/react';
import ListCellFactory from '../ListCellFactory';
import { DataModel, Cell, ListItemData, LayoutService } from '../../../../types/types';
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
  let cell: Cell;
  let layoutService: LayoutService;

  beforeEach(() => {
    constraints = {
      active: false,
      passive: false,
      select: false,
    };

    dataModel = dataModelMock();

    layoutService = {} as LayoutService;

    data = {
      layoutService,
      dataModel,
      list: [],
      constraints,
    };
  });

  test('should render dimension cell', () => {
    const mockDimensionCell = DimensionCell as jest.MockedFunction<typeof DimensionCell>;
    mockDimensionCell.mockReturnValue(<div />);
    cell = { x: 1, y: 2, ref: { qText, qCanCollapse: false, qCanExpand: false } } as Cell;
    data.list[0] = cell;

    render(<ListCellFactory index={0} style={style} data={data} />);

    expect(mockDimensionCell).toHaveBeenCalledWith({ style, cell, data, rowIndex: 2, colIndex: 1, isLeftColumn: false }, {});
  });

  test('should render pseudo dimension cell', () => {
    const mockPseudoDimensionCell = PseudoDimensionCell as jest.MockedFunction<typeof PseudoDimensionCell>;
    mockPseudoDimensionCell.mockReturnValue(<div />);
    cell = { ref: { qText, qType: NxDimCellType.NX_DIM_CELL_PSEUDO } } as Cell;
    data.list[0] = cell;

    render(<ListCellFactory index={0} style={style} data={data} />);

    expect(mockPseudoDimensionCell).toHaveBeenCalledWith({ style, cell, isLeftColumn: false }, {});
  });

  test('should render totals cell', () => {
    const mockedTotalsCell = TotalsCell as jest.MockedFunction<typeof TotalsCell>;
    mockedTotalsCell.mockReturnValue(<div />);
    cell = { ref: { qText, qType: NxDimCellType.NX_DIM_CELL_TOTAL, qElemNo: -1 } } as Cell;
    data.list[0] = cell;

    render(<ListCellFactory index={0} style={style} data={data} />);

    expect(mockedTotalsCell).toHaveBeenCalledWith({ cell, style }, {});
  });

  test('should render empty cell', () => {
    const mockEmptyCell = EmptyCell as jest.MockedFunction<typeof EmptyCell>;
    mockEmptyCell.mockReturnValue(<div />);
    cell = { ref: { qText, qType: NxDimCellType.NX_DIM_CELL_EMPTY } } as Cell;
    data.list[0] = cell;

    render(<ListCellFactory index={0} style={style} data={data} />);

    expect(mockEmptyCell).toHaveBeenCalledWith({ style }, {});
  });
});
