import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { stardust } from '@nebula.js/stardust';
import DimensionCell, { testId, testIdCollapseIcon, testIdExpandIcon } from '../DimensionCell';
import { CellValue, DataModel, ItemData } from '../../../types/types';
import { useSelectionsContext } from '../../../contexts/SelectionsProvider';
import NxDimCellType, { NxSelectionCellType } from '../../../types/QIX';
import { SelectionModel } from '../../../hooks/use-selections-model';

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
  let mockedSelectionContext: jest.MockedFunction<() => SelectionModel>;

  afterEach(() => {
    jest.resetAllMocks();
  });

  beforeEach(() => {
    mockedSelectionContext = useSelectionsContext as jest.MockedFunction<typeof useSelectionsContext>;
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
      isDimensionLocked: () => false,
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
      qType: NxDimCellType.NX_DIM_CELL_NORMAL
    } as unknown as EngineAPI.INxPivotDimensionCell;
  });

  test('should render', () => {
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
    describe('expand/collapse', () => {
      test('should be possible to expand left column', () => {
        (cell as EngineAPI.INxPivotDimensionCell).qCanExpand = true;

        render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn />);

        expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
        userEvent.click(screen.getByTestId(testIdExpandIcon));

        expect(expandLeftSpy).toHaveBeenCalledWith(0, 1);
      });

      test('should not be possible to expand left column when active constraint is true', () => {
        (cell as EngineAPI.INxPivotDimensionCell).qCanExpand = true;
        (data.constraints as stardust.Constraints).active = true;

        render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn />);

        expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
        userEvent.click(screen.getByTestId(testIdExpandIcon));

        expect(expandLeftSpy).toHaveBeenCalledTimes(0);
      });

      test('should not be possible to expand left column when selections is active', () => {
        (cell as EngineAPI.INxPivotDimensionCell).qCanExpand = true;
        mockedSelectionContext.mockReturnValue({ select: () => () => {}, isSelected: () => false, isActive: true, isLocked: () => false });

        render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn />);

        expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
        userEvent.click(screen.getByTestId(testIdExpandIcon));

        expect(expandLeftSpy).toHaveBeenCalledTimes(0);
      });

      test('should be possible to collapse left column', () => {
        (cell as EngineAPI.INxPivotDimensionCell).qCanCollapse = true;

        render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn />);

        expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
        userEvent.click(screen.getByTestId(testIdCollapseIcon));

        expect(collapseLeftSpy).toHaveBeenCalledWith(0, 1);
      });

      test('should be not possible to collapse left column when active constraint is true', () => {
        (cell as EngineAPI.INxPivotDimensionCell).qCanCollapse = true;
        (data.constraints as stardust.Constraints).active = true;

        render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn />);

        expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
        userEvent.click(screen.getByTestId(testIdCollapseIcon));

        expect(collapseLeftSpy).toHaveBeenCalledTimes(0);
      });

      test('should be not possible to collapse left column when selections is active', () => {
        (cell as EngineAPI.INxPivotDimensionCell).qCanCollapse = true;
        mockedSelectionContext.mockReturnValue({ select: () => () => {}, isSelected: () => false, isActive: true, isLocked: () => false });

        render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn />);

        expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
        userEvent.click(screen.getByTestId(testIdCollapseIcon));

        expect(collapseLeftSpy).toHaveBeenCalledTimes(0);
      });
    });

    describe('selections', () => {
      test('should select cell', () => {
        const rowIdx = 0;
        const colIdx = 1;
        const selectHandlerSpy = jest.fn();
        const onClickHandlerSpy = jest.fn();
        selectHandlerSpy.mockReturnValue(onClickHandlerSpy);
        (cell as EngineAPI.INxPivotDimensionCell).qCanCollapse = true;
        mockedSelectionContext.mockReturnValue({ select: selectHandlerSpy, isSelected: () => false, isActive: true, isLocked: () => false });

        render(<DimensionCell cell={cell} data={data} rowIndex={rowIdx} colIndex={colIdx} style={style} isLeftColumn />);

        userEvent.click(screen.getByText(qText));

        expect(selectHandlerSpy).toHaveBeenCalledWith(NxSelectionCellType.NX_CELL_LEFT, rowIdx, colIdx);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(1);
      });

      test('should not be possible to select cell when cell is locked due to selections in top column', () => {
        const rowIdx = 0;
        const colIdx = 1;
        const selectHandlerSpy = jest.fn();
        const onClickHandlerSpy = jest.fn();
        selectHandlerSpy.mockReturnValue(onClickHandlerSpy);
        (cell as EngineAPI.INxPivotDimensionCell).qCanCollapse = true;
        mockedSelectionContext.mockReturnValue({ select: selectHandlerSpy, isSelected: () => false, isActive: true, isLocked: () => true });

        render(<DimensionCell cell={cell} data={data} rowIndex={rowIdx} colIndex={colIdx} style={style} isLeftColumn />);

        userEvent.click(screen.getByText(qText));

        expect(selectHandlerSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
      });

      test('should not be possible to select cell when dimension is locked', () => {
        const rowIdx = 0;
        const colIdx = 1;
        const selectHandlerSpy = jest.fn();
        const onClickHandlerSpy = jest.fn();
        const isDimensionLockedSpy = jest.fn();
        isDimensionLockedSpy.mockReturnValue(true);
        dataModel.isDimensionLocked = isDimensionLockedSpy;
        selectHandlerSpy.mockReturnValue(onClickHandlerSpy);
        (cell as EngineAPI.INxPivotDimensionCell).qCanCollapse = true;
        mockedSelectionContext.mockReturnValue({ select: selectHandlerSpy, isSelected: () => false, isActive: true, isLocked: () => false });

        render(<DimensionCell cell={cell} data={data} rowIndex={rowIdx} colIndex={colIdx} style={style} isLeftColumn />);

        userEvent.click(screen.getByText(qText));

        expect(isDimensionLockedSpy).toHaveBeenCalledWith(NxSelectionCellType.NX_CELL_LEFT, rowIdx, colIdx);
        expect(selectHandlerSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('top row interactions', () => {
    describe('expand/collapse', () => {
      test('should be possible to expand top row', () => {
        (cell as EngineAPI.INxPivotDimensionCell).qCanExpand = true;

        render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn={false} />);

        expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
        userEvent.click(screen.getByTestId(testIdExpandIcon));

        expect(expandTopSpy).toHaveBeenCalledWith(0, 1);
      });

      test('should not be possible to expand top row when active constraint is true', () => {
        (cell as EngineAPI.INxPivotDimensionCell).qCanExpand = true;
        (data.constraints as stardust.Constraints).active = true;

        render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn={false} />);

        expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
        userEvent.click(screen.getByTestId(testIdExpandIcon));

        expect(expandTopSpy).toHaveBeenCalledTimes(0);
      });

      test('should not be possible to expand top row when selections is active', () => {
        (cell as EngineAPI.INxPivotDimensionCell).qCanExpand = true;
        mockedSelectionContext.mockReturnValue({ select: () => () => {}, isSelected: () => false, isActive: true, isLocked: () => false });

        render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn={false} />);

        expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
        userEvent.click(screen.getByTestId(testIdExpandIcon));

        expect(expandTopSpy).toHaveBeenCalledTimes(0);
      });

      test('should be possible to collapse top row', () => {
        (cell as EngineAPI.INxPivotDimensionCell).qCanCollapse = true;

        render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn={false} />);

        expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
        userEvent.click(screen.getByTestId(testIdCollapseIcon));

        expect(collapseTopSpy).toHaveBeenCalledWith(0, 1);
      });

      test('should be not possible to collapse top row when active constraint is true', () => {
        (cell as EngineAPI.INxPivotDimensionCell).qCanCollapse = true;
        (data.constraints as stardust.Constraints).active = true;

        render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn={false} />);

        expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
        userEvent.click(screen.getByTestId(testIdCollapseIcon));

        expect(collapseTopSpy).toHaveBeenCalledTimes(0);
      });

      test('should be not possible to collapse top row when selections is active', () => {
        (cell as EngineAPI.INxPivotDimensionCell).qCanCollapse = true;
        mockedSelectionContext.mockReturnValue({ select: () => () => {}, isSelected: () => false, isActive: true, isLocked: () => false });

        render(<DimensionCell cell={cell} data={data} rowIndex={0} colIndex={1} style={style} isLeftColumn={false} />);

        expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
        userEvent.click(screen.getByTestId(testIdCollapseIcon));

        expect(collapseTopSpy).toHaveBeenCalledTimes(0);
      });
    });

    describe('selections', () => {
      test('should select cell', () => {
        const rowIdx = 0;
        const colIdx = 1;
        const selectHandlerSpy = jest.fn();
        const onClickHandlerSpy = jest.fn();
        selectHandlerSpy.mockReturnValue(onClickHandlerSpy);
        (cell as EngineAPI.INxPivotDimensionCell).qCanCollapse = true;
        mockedSelectionContext.mockReturnValue({ select: selectHandlerSpy, isSelected: () => false, isActive: true, isLocked: () => false });

        render(<DimensionCell cell={cell} data={data} rowIndex={rowIdx} colIndex={colIdx} style={style} isLeftColumn={false} />);

        userEvent.click(screen.getByText(qText));

        expect(selectHandlerSpy).toHaveBeenCalledWith(NxSelectionCellType.NX_CELL_TOP, rowIdx, colIdx);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(1);
      });

      test('should not be possible to select cell when cell is locked due to selections in left column', () => {
        const rowIdx = 0;
        const colIdx = 1;
        const selectHandlerSpy = jest.fn();
        const onClickHandlerSpy = jest.fn();
        selectHandlerSpy.mockReturnValue(onClickHandlerSpy);
        (cell as EngineAPI.INxPivotDimensionCell).qCanCollapse = true;
        mockedSelectionContext.mockReturnValue({ select: selectHandlerSpy, isSelected: () => false, isActive: true, isLocked: () => true });

        render(<DimensionCell cell={cell} data={data} rowIndex={rowIdx} colIndex={colIdx} style={style} isLeftColumn={false} />);

        userEvent.click(screen.getByText(qText));

        expect(selectHandlerSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
      });

      test('should not be possible to select cell when dimension is locked', () => {
        const rowIdx = 0;
        const colIdx = 1;
        const selectHandlerSpy = jest.fn();
        const onClickHandlerSpy = jest.fn();
        const isDimensionLockedSpy = jest.fn();
        isDimensionLockedSpy.mockReturnValue(true);
        dataModel.isDimensionLocked = isDimensionLockedSpy;
        selectHandlerSpy.mockReturnValue(onClickHandlerSpy);
        (cell as EngineAPI.INxPivotDimensionCell).qCanCollapse = true;
        mockedSelectionContext.mockReturnValue({ select: selectHandlerSpy, isSelected: () => false, isActive: true, isLocked: () => false });

        render(<DimensionCell cell={cell} data={data} rowIndex={rowIdx} colIndex={colIdx} style={style} isLeftColumn={false} />);

        userEvent.click(screen.getByText(qText));

        expect(isDimensionLockedSpy).toHaveBeenCalledWith(NxSelectionCellType.NX_CELL_TOP, rowIdx, colIdx);
        expect(selectHandlerSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
      });
    });
  });
});
