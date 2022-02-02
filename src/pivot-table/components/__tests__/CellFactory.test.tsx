import React from 'react';
import { render } from '@testing-library/react'
import CellFactory from '../CellFactory';
import { Cell, DataModel, ItemData, TYPE } from '../../../types/types';
import { NxPivotDimensionCell, NxPivotValuePoint } from '../../../types/QIX';
import DimensionCell from '../DimensionCell';
import DimensionTitleCell from '../DimensionTitleCell';
import MeasureCell from '../MeasureCell';
import EmptyHeaderCell from '../EmptyHeaderCell';
import EmptyCell from '../EmptyCell';

jest.mock('../DimensionCell');
jest.mock('../DimensionTitleCell');
jest.mock('../MeasureCell');
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
  let cell: Cell;

  beforeEach(() => {
    constraints = {
      active: false,
      passive: false,
      select: false,
    };

    cell = {
      key: 1,
      type: TYPE.EMPTY,
      value: null
    };

    dataModel = {
      pivotData: {
        matrix: [
          [cell, cell, cell],
          [cell, cell, cell]
        ],
        topMatrix: [],
        leftMatrix: [],
        nbrTopRows: 0,
        nbrLeftColumns: 0
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
      constraints,
      pivotData: dataModel.pivotData
    };
  });

  test('should render dimension cell - left column', () => {
    const mockDimensionCell = DimensionCell as jest.MockedFunction<typeof DimensionCell>;
    mockDimensionCell.mockReturnValue(<div />);
    cell.value = { qText, qCanCollapse: false, qCanExpand: false } as NxPivotDimensionCell;
    cell.type = TYPE.DIMENSION;
    data.dataModel.pivotData.nbrTopRows = 1;

    render(<CellFactory columnIndex={0} rowIndex={1} style={style} data={data} />);

    expect(mockDimensionCell).toHaveBeenCalledWith({ style, cell, data, rowIndex: 0, colIndex: 0, isLeftColumn: true }, {});
  });

  test('should render dimension cell - top row', () => {
    const mockDimensionCell = DimensionCell as jest.MockedFunction<typeof DimensionCell>;
    mockDimensionCell.mockReturnValue(<div />);
    cell.value = { qText, qCanCollapse: false, qCanExpand: false } as NxPivotDimensionCell;
    cell.type = TYPE.DIMENSION;
    data.dataModel.pivotData.nbrTopRows = 3;
    data.dataModel.pivotData.nbrLeftColumns = 1;

    render(<CellFactory columnIndex={1} rowIndex={2} style={style} data={data} />);

    expect(mockDimensionCell).toHaveBeenCalledWith({ style, cell, data, rowIndex: 2, colIndex: 0, isLeftColumn: false }, {});
  });

  test('should render dimension title cell', () => {
    const mockDimensionTitleCell = DimensionTitleCell as jest.MockedFunction<typeof DimensionTitleCell>;
    mockDimensionTitleCell.mockReturnValue(<div />);
    cell.value = 'title';
    cell.type = TYPE.LABEL;

    render(<CellFactory columnIndex={0} rowIndex={0} style={style} data={data} />);

    expect(mockDimensionTitleCell).toHaveBeenCalledWith({ style, cell }, {});
  });

  test('should render measure cell', () => {
    const mockMeasureCell = MeasureCell as jest.MockedFunction<typeof MeasureCell>;
    mockMeasureCell.mockReturnValue(<div />);
    cell.value = { qText, qNum: 1 } as NxPivotValuePoint;
    cell.type = TYPE.MEASURE;

    render(<CellFactory columnIndex={0} rowIndex={0} style={style} data={data} />);

    expect(mockMeasureCell).toHaveBeenCalledWith({ style, cell }, {});
  });

  test('should render empty header cell', () => {
    const mockEmptyHeaderCell = EmptyHeaderCell as jest.MockedFunction<typeof EmptyHeaderCell>;
    mockEmptyHeaderCell.mockReturnValue(<div />);
    data.dataModel.pivotData.nbrTopRows = 1;
    cell.type = TYPE.EMPTY;

    render(<CellFactory columnIndex={0} rowIndex={0} style={style} data={data} />);

    expect(mockEmptyHeaderCell).toHaveBeenCalledWith({ style }, {});
  });

  test('should render empty cell', () => {
    const mockEmptyCell = EmptyCell as jest.MockedFunction<typeof EmptyCell>;
    mockEmptyCell.mockReturnValue(<div />);
    cell.type = TYPE.EMPTY;

    render(<CellFactory columnIndex={0} rowIndex={0} style={style} data={data} />);

    expect(mockEmptyCell).toHaveBeenCalledWith({ style }, {});
  });
});
