import React from 'react';
import { render } from '@testing-library/react'
import CellFactory from '../CellFactory';
import { CellValue, DataModel, ItemData } from '../../../types/types';
import { NxPivotDimensionCell } from '../../../types/QIX';
import DimensionCell from '../DimensionCell';
import DimensionTitleCell from '../DimensionTitleCell';
import EmptyHeaderCell from '../EmptyHeaderCell';
import EmptyCell from '../EmptyCell';

jest.mock('../DimensionCell');
jest.mock('../DimensionTitleCell');
jest.mock('../EmptyHeaderCell');
jest.mock('../EmptyCell');

describe('CellFactory', () => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: '25px',
    top: '35px',
    width: '100px',
    height: '150px'
  };
  const qText = 'test value';
  let constraints: Stardust.Constraints;
  let dataModel: DataModel;
  let data: ItemData;
  let cell: CellValue;

  beforeEach(() => {
    constraints = {
      active: false,
      passive: false,
      select: false,
    };

    dataModel = {
      pivotData: {
        data: [],
        left: [],
        top: [],
        headers: [],
        size: {
          data: { x: 0, y: 0 },
          headers: { x: 0, y: 0 },
          left: { x: 0, y: 0 },
          top: { x: 0, y: 0 },
          totalRows: 0,
          totalColumns: 0
        }
      },
      fetchNextPage: () => {},
      hasMoreColumns: false,
      hasMoreRows: false,
      collapseLeft: () => {},
      collapseTop: () => {},
      expandLeft: () => {},
      expandTop: () => {}
    };

    data = {
      dataModel,
      matrix: [[]],
      isLeftColumn: false,
      isHeader: false,
      constraints
    };
  });

  test('should render dimension cell - left column', () => {
    const mockDimensionCell = DimensionCell as jest.MockedFunction<typeof DimensionCell>;
    mockDimensionCell.mockReturnValue(<div />);
    cell = { qText, qCanCollapse: false, qCanExpand: false } as CellValue;
    data.matrix[0][0] = cell;
    data.isLeftColumn = true;

    render(<CellFactory columnIndex={0} rowIndex={0} style={style} data={data} />);

    expect(mockDimensionCell).toHaveBeenCalledWith({ style, cell, data, rowIndex: 0, colIndex: 0, isLeftColumn: true }, {});
  });

  test('should render dimension cell - top row', () => {
    const mockDimensionCell = DimensionCell as jest.MockedFunction<typeof DimensionCell>;
    mockDimensionCell.mockReturnValue(<div />);
    cell = { qText, qCanCollapse: false, qCanExpand: false } as NxPivotDimensionCell;
    data.matrix[0][0] = cell;
    data.isLeftColumn = false;

    render(<CellFactory columnIndex={0} rowIndex={0} style={style} data={data} />);

    expect(mockDimensionCell).toHaveBeenCalledWith({ style, cell, data, rowIndex: 0, colIndex: 0, isLeftColumn: false }, {});
  });

  test('should render dimension title cell', () => {
    const mockDimensionTitleCell = DimensionTitleCell as jest.MockedFunction<typeof DimensionTitleCell>;
    mockDimensionTitleCell.mockReturnValue(<div />);
    cell = 'title';
    data.matrix[0][0] = cell;

    render(<CellFactory columnIndex={0} rowIndex={0} style={style} data={data} />);

    expect(mockDimensionTitleCell).toHaveBeenCalledWith({ style, cell }, {});
  });

  test('should render empty header cell', () => {
    const mockEmptyHeaderCell = EmptyHeaderCell as jest.MockedFunction<typeof EmptyHeaderCell>;
    mockEmptyHeaderCell.mockReturnValue(<div />);
    data.isHeader = true;
    cell = null
    data.matrix[0][0] = cell;

    render(<CellFactory columnIndex={0} rowIndex={0} style={style} data={data} />);

    expect(mockEmptyHeaderCell).toHaveBeenCalledWith({ style }, {});
  });

  test('should render empty cell', () => {
    const mockEmptyCell = EmptyCell as jest.MockedFunction<typeof EmptyCell>;
    mockEmptyCell.mockReturnValue(<div />);
    cell = null;
    data.matrix[0][0] = cell;

    render(<CellFactory columnIndex={0} rowIndex={0} style={style} data={data} />);

    expect(mockEmptyCell).toHaveBeenCalledWith({ style }, {});
  });
});
