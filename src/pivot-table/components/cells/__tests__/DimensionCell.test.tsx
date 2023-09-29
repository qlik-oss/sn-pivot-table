import type { stardust } from "@nebula.js/stardust";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import NxDimCellType, { NxSelectionCellType } from "../../../../types/QIX";
import type {
  Cell,
  DataModel,
  ExtendedSelections,
  LayoutService,
  ListItemData,
  PageInfo,
} from "../../../../types/types";
import TestWithProvider from "../../../__tests__/test-with-providers";
import type { SelectionModel } from "../../../hooks/use-selections-model";
import useSelectionsModel from "../../../hooks/use-selections-model";
import DimensionCell, { testId, testIdCollapseIcon, testIdExpandIcon } from "../DimensionCell";
import { getLockedStyleFromSelection, selectedStyle } from "../utils/get-dimension-cell-style";
// eslint-disable-next-line jest/no-mocks-import
import dataModelMock from "./__mocks__/data-model-mock";

jest.mock("../../../hooks/use-selections-model");

describe("DimensionCell", () => {
  let interactions: stardust.Interactions;
  let dataModel: DataModel;
  let data: ListItemData;
  let cell: Cell;
  const style: React.CSSProperties = {
    position: "absolute",
    left: "25px",
    top: "35px",
    width: "100px",
    height: "150px",
  };
  const qText = "test value";

  let expandLeftSpy: jest.SpyInstance;
  let expandTopSpy: jest.SpyInstance;
  let collapseLeftSpy: jest.SpyInstance;
  let collapseTopSpy: jest.SpyInstance;
  let mockedUseSelectionsModel: jest.MockedFunction<
    (selections: ExtendedSelections, updatePageInfo: (args: Partial<PageInfo>) => void) => SelectionModel
  >;
  let selectSpy: jest.MockedFunction<() => () => Promise<void>>;
  let onClickHandlerSpy: jest.MockedFunction<() => Promise<void>>;
  let isSelectedSpy: jest.MockedFunction<() => boolean>;
  let isLockedSpy: jest.MockedFunction<() => boolean>;
  let mockedSelectionModel: SelectionModel;
  let layoutService: LayoutService;

  afterEach(() => {
    jest.resetAllMocks();
  });

  beforeEach(() => {
    selectSpy = jest.fn();
    onClickHandlerSpy = jest.fn();
    isSelectedSpy = jest.fn();
    isLockedSpy = jest.fn();
    selectSpy.mockReturnValue(onClickHandlerSpy);
    mockedSelectionModel = {
      select: selectSpy,
      isSelected: isSelectedSpy,
      isActive: false,
      isLocked: isLockedSpy,
    };

    mockedUseSelectionsModel = useSelectionsModel as jest.MockedFunction<typeof useSelectionsModel>;
    mockedUseSelectionsModel.mockReturnValue(mockedSelectionModel);

    interactions = {
      active: true,
      passive: true,
      select: true,
    };

    dataModel = dataModelMock();

    layoutService = {
      isDimensionLocked: jest.fn().mockReturnValue(false),
      showTotalsAbove: true,
    } as unknown as LayoutService;

    expandLeftSpy = jest.spyOn(dataModel, "expandLeft");
    expandTopSpy = jest.spyOn(dataModel, "expandTop");
    collapseLeftSpy = jest.spyOn(dataModel, "collapseLeft");
    collapseTopSpy = jest.spyOn(dataModel, "collapseTop");

    data = {
      layoutService,
      dataModel,
      showLastBorder: { right: false, bottom: false },
      list: {},
    } as ListItemData;

    cell = {
      y: 0,
      x: 0,
      pageY: 0,
      pageX: 0,
      ref: {
        qText,
        qCanExpand: false,
        qCanCollapse: false,
        qType: NxDimCellType.NX_DIM_CELL_NORMAL,
      },
    } as Cell;
  });

  test("should render", () => {
    render(
      <DimensionCell
        cell={cell}
        data={data}
        rowIndex={0}
        colIndex={1}
        style={style}
        isLeftColumn={false}
        isLastRow={false}
        isLastColumn={false}
        showTotalCellDivider={false}
      />,
      { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
    );

    expect(screen.getByText(qText)).toBeInTheDocument();
    // Verify "border-right-color" to ensure that the total cell divider is not visible
    expect(screen.getByTestId(testId)).toHaveStyle({ ...style, "border-right-color": "rgba(0, 0, 0, 0.15)" } as Record<
      string,
      unknown
    >);
  });

  test("should not render expand or collapse icon if cell is not expandable or collapseable", () => {
    cell.ref.qCanExpand = false;
    cell.ref.qCanCollapse = false;

    render(
      <DimensionCell
        cell={cell}
        data={data}
        rowIndex={0}
        colIndex={1}
        style={style}
        isLeftColumn={false}
        isLastRow={false}
        isLastColumn={false}
        showTotalCellDivider={false}
      />,
      { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
    );

    expect(screen.getByText(qText)).toBeInTheDocument();
    expect(screen.queryByTestId(testIdExpandIcon)).toBeNull();
    expect(screen.queryByTestId(testIdCollapseIcon)).toBeNull();
  });

  test("should render with total divider styling when totals is shown below", () => {
    layoutService.showTotalsAbove = false;
    cell.ref.qCanExpand = false;
    cell.ref.qCanCollapse = false;

    render(
      <DimensionCell
        cell={cell}
        data={data}
        rowIndex={0}
        colIndex={0}
        style={style}
        isLeftColumn={false}
        isLastRow={false}
        isLastColumn={false}
        showTotalCellDivider
      />,
      { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
    );

    expect(screen.getByTestId(testId)).toHaveStyle({ "border-right-color": "rgba(0, 0, 0, 0.6)" } as Record<
      string,
      unknown
    >);
  });

  describe("left column interactions", () => {
    describe("expand/collapse", () => {
      test("should be possible to expand left column", async () => {
        cell.ref.qCanExpand = true;

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={0}
            colIndex={1}
            style={style}
            isLeftColumn
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdExpandIcon));

        expect(expandLeftSpy).toHaveBeenCalledWith(0, 1);
      });

      test("should not be possible to expand left column when active interaction is false", async () => {
        cell.ref.qCanExpand = true;
        interactions.active = false;

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={0}
            colIndex={1}
            style={style}
            isLeftColumn
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdExpandIcon));

        expect(expandLeftSpy).toHaveBeenCalledTimes(0);
      });

      test("should not be possible to expand left column when selections is active", async () => {
        cell.ref.qCanExpand = true;
        mockedUseSelectionsModel.mockReturnValue({
          select: () => () => Promise.resolve(),
          isSelected: () => false,
          isActive: true,
          isLocked: () => false,
        });

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={0}
            colIndex={1}
            style={style}
            isLeftColumn
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdExpandIcon));

        expect(expandLeftSpy).toHaveBeenCalledTimes(0);
      });

      test("should be possible to collapse left column", async () => {
        cell.ref.qCanCollapse = true;

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={0}
            colIndex={1}
            style={style}
            isLeftColumn
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdCollapseIcon));

        expect(collapseLeftSpy).toHaveBeenCalledWith(0, 1);
      });

      test("should be not possible to collapse left column when active interaction is false", async () => {
        cell.ref.qCanCollapse = true;
        interactions.active = false;

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={0}
            colIndex={1}
            style={style}
            isLeftColumn
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdCollapseIcon));

        expect(collapseLeftSpy).toHaveBeenCalledTimes(0);
      });

      test("should be not possible to collapse left column when selections is active", async () => {
        cell.ref.qCanCollapse = true;
        mockedUseSelectionsModel.mockReturnValue({
          select: () => () => Promise.resolve(),
          isSelected: () => false,
          isActive: true,
          isLocked: () => false,
        });

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={0}
            colIndex={1}
            style={style}
            isLeftColumn
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdCollapseIcon));

        expect(collapseLeftSpy).toHaveBeenCalledTimes(0);
      });
    });

    describe("selections", () => {
      test("should select cell", async () => {
        const rowIdx = 0;
        const colIdx = 1;
        cell.ref.qCanCollapse = true;
        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={rowIdx}
            colIndex={colIdx}
            style={style}
            isLeftColumn
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledWith(NxSelectionCellType.NX_CELL_LEFT, rowIdx, colIdx);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(1);
      });

      test("should style selected cell", () => {
        const rowIdx = 0;
        const colIdx = 1;
        cell.ref.qCanCollapse = true;
        isSelectedSpy.mockReturnValue(true);

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={rowIdx}
            colIndex={colIdx}
            style={style}
            isLeftColumn
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        expect(isSelectedSpy).toHaveBeenCalledWith(NxSelectionCellType.NX_CELL_LEFT, rowIdx, colIdx);
        expect(screen.getByTestId(testId)).toHaveStyle(selectedStyle as Record<string, string>);
      });

      test("should not be possible to select cell when interactions is not active", async () => {
        const rowIdx = 0;
        const colIdx = 1;
        interactions.active = false;
        cell.ref.qCanCollapse = true;
        isSelectedSpy.mockReturnValue(true);

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={rowIdx}
            colIndex={colIdx}
            style={style}
            isLeftColumn
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
      });

      test("should not be possible to select cell when select interaction is false", async () => {
        const rowIdx = 0;
        const colIdx = 1;
        interactions.select = false;
        cell.ref.qCanCollapse = true;
        isSelectedSpy.mockReturnValue(true);

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={rowIdx}
            colIndex={colIdx}
            style={style}
            isLeftColumn
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
      });

      test("should not be possible to select cell when cell is locked due to selections in top column", async () => {
        const rowIdx = 0;
        const colIdx = 1;
        cell.ref.qCanCollapse = true;
        isLockedSpy.mockReturnValue(true);

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={rowIdx}
            colIndex={colIdx}
            style={style}
            isLeftColumn
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
        expect(screen.getByTestId(testId)).toHaveStyle(getLockedStyleFromSelection() as Record<string, string>);
      });

      test("should not be possible to select cell when dimension is locked", async () => {
        const rowIdx = 0;
        const colIdx = 1;
        cell.isLockedByDimension = true;
        cell.ref.qCanCollapse = true;

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={rowIdx}
            colIndex={colIdx}
            style={style}
            isLeftColumn
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
        expect(screen.getByTestId(testId)).toHaveStyle(getLockedStyleFromSelection() as Record<string, string>);
      });
    });
  });

  describe("top row interactions", () => {
    describe("expand/collapse", () => {
      test("should be possible to expand top row", async () => {
        cell.ref.qCanExpand = true;

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={0}
            colIndex={1}
            style={style}
            isLeftColumn={false}
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdExpandIcon));

        expect(expandTopSpy).toHaveBeenCalledWith(0, 1);
      });

      test("should not be possible to expand top row when active interaction is false", async () => {
        cell.ref.qCanExpand = true;
        interactions.active = false;

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={0}
            colIndex={1}
            style={style}
            isLeftColumn={false}
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdExpandIcon));

        expect(expandTopSpy).toHaveBeenCalledTimes(0);
      });

      test("should not be possible to expand top row when selections is active", async () => {
        cell.ref.qCanExpand = true;
        mockedUseSelectionsModel.mockReturnValue({
          select: () => () => Promise.resolve(),
          isSelected: () => false,
          isActive: true,
          isLocked: () => false,
        });

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={0}
            colIndex={1}
            style={style}
            isLeftColumn={false}
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdExpandIcon));

        expect(expandTopSpy).toHaveBeenCalledTimes(0);
      });

      test("should be possible to collapse top row", async () => {
        cell.ref.qCanCollapse = true;

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={0}
            colIndex={1}
            style={style}
            isLeftColumn={false}
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdCollapseIcon));

        expect(collapseTopSpy).toHaveBeenCalledWith(0, 1);
      });

      test("should be not possible to collapse top row when active interaction is false", async () => {
        cell.ref.qCanCollapse = true;
        interactions.active = false;

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={0}
            colIndex={1}
            style={style}
            isLeftColumn={false}
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdCollapseIcon));

        expect(collapseTopSpy).toHaveBeenCalledTimes(0);
      });

      test("should be not possible to collapse top row when selections is active", async () => {
        cell.ref.qCanCollapse = true;
        mockedUseSelectionsModel.mockReturnValue({
          select: () => () => Promise.resolve(),
          isSelected: () => false,
          isActive: true,
          isLocked: () => false,
        });

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={0}
            colIndex={1}
            style={style}
            isLeftColumn={false}
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdCollapseIcon));

        expect(collapseTopSpy).toHaveBeenCalledTimes(0);
      });
    });

    describe("selections", () => {
      test("should select cell", async () => {
        const rowIdx = 0;
        const colIdx = 1;
        cell.ref.qCanCollapse = true;

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={rowIdx}
            colIndex={colIdx}
            style={style}
            isLeftColumn={false}
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledWith(NxSelectionCellType.NX_CELL_TOP, rowIdx, colIdx);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(1);
      });

      test("should style selected cell", () => {
        const rowIdx = 0;
        const colIdx = 1;
        cell.ref.qCanCollapse = true;
        isSelectedSpy.mockReturnValue(true);

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={rowIdx}
            colIndex={colIdx}
            style={style}
            isLeftColumn={false}
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        expect(isSelectedSpy).toHaveBeenCalledWith(NxSelectionCellType.NX_CELL_TOP, rowIdx, colIdx);
        expect(screen.getByTestId(testId)).toHaveStyle(selectedStyle as Record<string, string>);
      });

      test("should not be possible to select cell when interaction is not active", async () => {
        const rowIdx = 0;
        const colIdx = 1;
        interactions.active = false;
        cell.ref.qCanCollapse = true;
        isSelectedSpy.mockReturnValue(true);

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={rowIdx}
            colIndex={colIdx}
            style={style}
            isLeftColumn={false}
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
      });

      test("should not be possible to select cell when select interaction is false", async () => {
        const rowIdx = 0;
        const colIdx = 1;
        interactions.select = false;
        cell.ref.qCanCollapse = true;
        isSelectedSpy.mockReturnValue(true);

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={rowIdx}
            colIndex={colIdx}
            style={style}
            isLeftColumn={false}
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
      });

      test("should not be possible to select cell when cell is locked due to selections in left column", async () => {
        const rowIdx = 0;
        const colIdx = 1;
        cell.ref.qCanCollapse = true;
        isLockedSpy.mockReturnValue(true);

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={rowIdx}
            colIndex={colIdx}
            style={style}
            isLeftColumn={false}
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
        expect(screen.getByTestId(testId)).toHaveStyle(getLockedStyleFromSelection() as Record<string, string>);
      });

      test("should not be possible to select cell when dimension is locked", async () => {
        const rowIdx = 0;
        const colIdx = 1;
        cell.isLockedByDimension = true;
        cell.ref.qCanCollapse = true;

        render(
          <DimensionCell
            cell={cell}
            data={data}
            rowIndex={rowIdx}
            colIndex={colIdx}
            style={style}
            isLeftColumn={false}
            isLastRow={false}
            isLastColumn={false}
            showTotalCellDivider={false}
          />,
          { wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider> },
        );

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
        expect(screen.getByTestId(testId)).toHaveStyle(getLockedStyleFromSelection() as Record<string, string>);
      });
    });
  });
});
