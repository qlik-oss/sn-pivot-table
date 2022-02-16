import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { stardust } from '@nebula.js/stardust';
import DimensionCell, { testId, testIdCollapseIcon, testIdExpandIcon } from '../DimensionCell';
import { CellValue, DataModel, ItemData } from '../../../types/types';
import { useSelectionsContext } from '../../../contexts/SelectionsProvider';

jest.mock('../../../contexts/SelectionsProvider');

describe('DimensionCell', () => {
  let constraints: stardust.Constraints;
  let dataModel: DataModel;
  let data: ItemData;
  let cell: CellValue;
  const style: React.CSSProperties = {
    position: 'absolute',
    left: '25px',
    top: '35px',
    width: '100px',
    height: '150px'
  };
  const qText = 'test value';

  let expandLeftSpy: jest.SpyInstance;
  let expandTopSpy: jest.SpyInstance;
  let collapseLeftSpy: jest.SpyInstance;
  let collapseTopSpy: jest.SpyInstance;

  beforeEach(() => {
    const mockedSelectionContext = useSelectionsContext as jest.MockedFunction<typeof useSelectionsContext>;
    mockedSelectionContext.mockReturnValue({ select: () => () => {}, isSelected: () => false, isActive: false, isLocked: () => false });

    constraints = {
      active: false,
      passive: false,
      select: false,
    };

    dataModel = {
      pivotData: {
        data: [],
        left: [
          [cell, cell, cell],
          [cell, cell, cell]
        ],
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
      expandTop: () => {},
      hasData: true,
      isLocked: () => false,
    };

    expandLeftSpy = jest.spyOn(dataModel, 'expandLeft');
    expandTopSpy = jest.spyOn(dataModel, 'expandTop');
    collapseLeftSpy = jest.spyOn(dataModel, 'collapseLeft');
    collapseTopSpy = jest.spyOn(dataModel, 'collapseTop');

    data = {
      dataModel,
      matrix: dataModel.pivotData.left,
      isLeftColumn: false,
      isHeader: false,
      constraints
    };

    cell = {
      qText,
      qCanExpand: false,
      qCanCollapse: false,
    } as EngineAPI.INxPivotDimensionCell;
  });

  test.only('should render', () => {
    render(<DimensionCell
      cell={cell}
      data={data}
      rowIndex={0}
      colIndex={1}
      style={style}
      isLeftColumn={false}
    />);

    expect(screen.getByText(qText)).toBeInTheDocument();
    expect(screen.getByTestId(testId)).toHaveStyle(style as Record<string, unknown>);
  });

  test('should not render expand or collapse icon if cell is not expandable or collapseable', () => {
    (cell as EngineAPI.INxPivotDimensionCell).qCanExpand = false;
    (cell as EngineAPI.INxPivotDimensionCell).qCanCollapse = false;

    render(<DimensionCell
      cell={cell}
      data={data}
      rowIndex={0}
      colIndex={1}
      style={style}
      isLeftColumn={false}
    />);

    expect(screen.queryByTestId(testIdExpandIcon)).toBeNull();
    expect(screen.queryByTestId(testIdCollapseIcon)).toBeNull();
  });

  describe('left column interactions', () => {
    test('should be possible to expand left column', () => {
      (cell as EngineAPI.INxPivotDimensionCell).qCanExpand = true;

      render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn />);

      expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
      userEvent.click(screen.getByText(qText));

      expect(expandLeftSpy).toHaveBeenCalledWith(0, 1);
    });

    test('should not be possible to expand left column when active constraint is true', () => {
      (cell as EngineAPI.INxPivotDimensionCell).qCanExpand = true;
      (data.constraints as stardust.Constraints).active = true;

      render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn />);

      expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
      userEvent.click(screen.getByText(qText));

      expect(expandLeftSpy).toHaveBeenCalledTimes(0);
    });

    test('should be possible to collapse left column', () => {
      (cell as EngineAPI.INxPivotDimensionCell).qCanCollapse = true;

      render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn />);

      expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
      userEvent.click(screen.getByText(qText));

      expect(collapseLeftSpy).toHaveBeenCalledWith(0, 1);
    });

    test('should be not possible to collapse left column when active constraint is true', () => {
      (cell as EngineAPI.INxPivotDimensionCell).qCanCollapse = true;
      (data.constraints as stardust.Constraints).active = true;

      render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn />);

      expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
      userEvent.click(screen.getByText(qText));

      expect(collapseLeftSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('top row interactions', () => {
    test('should be possible to expand top row', () => {
      (cell as EngineAPI.INxPivotDimensionCell).qCanExpand = true;

      render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn={false} />);

      expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
      userEvent.click(screen.getByText(qText));

      expect(expandTopSpy).toHaveBeenCalledWith(0, 1);
    });

    test('should not be possible to expand top row when active constraint is true', () => {
      (cell as EngineAPI.INxPivotDimensionCell).qCanExpand = true;
      (data.constraints as stardust.Constraints).active = true;

      render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn={false} />);

      expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
      userEvent.click(screen.getByText(qText));

      expect(expandTopSpy).toHaveBeenCalledTimes(0);
    });

    test('should be possible to collapse top row', () => {
      (cell as EngineAPI.INxPivotDimensionCell).qCanCollapse = true;

      render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn={false} />);

      expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
      userEvent.click(screen.getByText(qText));

      expect(collapseTopSpy).toHaveBeenCalledWith(0, 1);
    });

    test('should be not possible to collapse top row when active constraint is true', () => {
      (cell as EngineAPI.INxPivotDimensionCell).qCanCollapse = true;
      (data.constraints as stardust.Constraints).active = true;

      render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn={false} />);

      expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
      userEvent.click(screen.getByText(qText));

      expect(collapseTopSpy).toHaveBeenCalledTimes(0);
    });
  });
});
