import { stardust } from '@nebula.js/stardust';
import React from 'react';
import { render } from '@testing-library/react';
import CellFactory from '../CellFactory';
import { CellValue, DataModel, GridItemData } from '../../../../types/types';
import DimensionCell from '../DimensionCell';
import EmptyCell from '../EmptyCell';
import PseudoDimensionCell from '../PseudoDimensionCell';
import TotalsCell from '../TotalsCell';
import NxDimCellType from '../../../../types/QIX';

jest.mock('../DimensionCell');
jest.mock('../EmptyCell');
jest.mock('../PseudoDimensionCell');
jest.mock('../TotalsCell');

describe('CellFactory', () => {
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
  let data: GridItemData;
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
        measureInfoIndexMap: [],
        leftDimensionInfoIndexMap: [],
        topDimensionInfoIndexMap: [],
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
      expandTop: () => {},
      hasData: true,
      isDimensionLocked: () => false,
      getDimensionInfo: () => [],
      getMeasureInfo: () => [],
      getNoLeftDims: () => 3,
    };

    data = {
      dataModel,
      matrix: [[]],
      isLeftColumn: false,
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
    cell = { qText, qCanCollapse: false, qCanExpand: false } as EngineAPI.INxPivotDimensionCell;
    data.matrix[0][0] = cell;
    data.isLeftColumn = false;

    render(<CellFactory columnIndex={0} rowIndex={0} style={style} data={data} />);

    expect(mockDimensionCell).toHaveBeenCalledWith({ style, cell, data, rowIndex: 0, colIndex: 0, isLeftColumn: false }, {});
  });

  test('should render pseudo dimension cell', () => {
    const mockPseudoDimensionCell = PseudoDimensionCell as jest.MockedFunction<typeof PseudoDimensionCell>;
    mockPseudoDimensionCell.mockReturnValue(<div />);
    cell = { qText, qType: NxDimCellType.NX_DIM_CELL_PSEUDO } as EngineAPI.INxPivotDimensionCell;
    data.matrix[0][0] = cell;
    data.isLeftColumn = false;

    render(<CellFactory columnIndex={0} rowIndex={0} style={style} data={data} />);

    expect(mockPseudoDimensionCell).toHaveBeenCalledWith({ style, cell, isLeftColumn: false }, {});
  });

  test('should render totals cell', () => {
    const mockedTotalsCell = TotalsCell as jest.MockedFunction<typeof TotalsCell>;
    mockedTotalsCell.mockReturnValue(<div />);
    cell = { qText, qType: NxDimCellType.NX_DIM_CELL_TOTAL, qElemNo: -1 } as EngineAPI.INxPivotDimensionCell;
    data.matrix[0][0] = cell;
    data.isLeftColumn = false;

    render(<CellFactory columnIndex={0} rowIndex={0} style={style} data={data} />);

    expect(mockedTotalsCell).toHaveBeenCalledWith({ cell, style }, {});
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
