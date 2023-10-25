import type { stardust } from "@nebula.js/stardust";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import DimensionValue from "..";
import NxDimCellType from "../../../../../types/QIX";
import type {
  Cell,
  DataModel,
  ExtendedSelections,
  LayoutService,
  ListItemData,
  PageInfo,
} from "../../../../../types/types";
import TestWithProvider from "../../../../__tests__/test-with-providers";
import type { SelectionModel } from "../../../../hooks/use-selections-model";
import useSelectionsModel from "../../../../hooks/use-selections-model";
import { testId } from "../Container";
// import { getLockedStyleFromSelection, selectedStyle } from "../../utils/get-dimension-cell-style";
import { testIdCollapseIcon } from "../../../icons/Minus";
import { testIdExpandIcon } from "../../../icons/Plus";
import { testId as emptyCellTestId } from "../../EmptyCell";
// eslint-disable-next-line jest/no-mocks-import
import dataModelMock from "../../__tests__/__mocks__/data-model-mock";

jest.mock("../../../../hooks/use-selections-model");

describe("DimensionValue", () => {
  let interactions: stardust.Interactions;
  let dataModel: DataModel;
  let data: ListItemData;
  let cell: Cell;
  const style: React.CSSProperties = {
    position: "absolute",
    left: 25,
    top: 35,
    width: 100,
    height: 150,
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
  let renderCell: (index?: number) => unknown;

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
      size: { x: 100 },
    } as unknown as LayoutService;

    expandLeftSpy = jest.spyOn(dataModel, "expandLeft");
    expandTopSpy = jest.spyOn(dataModel, "expandTop");
    collapseLeftSpy = jest.spyOn(dataModel, "collapseLeft");
    collapseTopSpy = jest.spyOn(dataModel, "collapseTop");

    cell = {
      y: 0,
      x: 0,
      pageY: 0,
      pageX: 0,
      mainAxisPageCoord: 0,
      ref: {
        qText,
        qCanExpand: false,
        qCanCollapse: false,
        qType: NxDimCellType.NX_DIM_CELL_NORMAL,
      },
      expressionColor: {
        color: null,
        background: null,
      },
      isLeafNode: true,
      isNull: false,
      isEmpty: false,
      isPseudoDimension: false,
      isTotal: false,
      isAncestorPseudoDimension: false,
    } as Cell;

    data = {
      layoutService,
      dataModel,
      showLastBorder: { right: false, bottom: false },
      list: { 0: cell },
      listValues: [cell],
      isLeftColumn: true,
      isLast: false,
      itemCount: 1,
      totalDividerIndex: -1,
    } as ListItemData;

    renderCell = (index = 0) =>
      render(<DimensionValue index={index} data={data} style={style} />, {
        wrapper: ({ children }) => <TestWithProvider interactions={interactions}>{children}</TestWithProvider>,
      });
  });

  test("should render", () => {
    renderCell();

    expect(screen.getByText(qText)).toBeInTheDocument();
    // Verify "border-right-color" to ensure that the total cell divider is not visible
    expect(screen.getByTestId(testId)).toHaveStyle({ "border-right-color": "rgba(0, 0, 0, 0.15)" } as Record<
      string,
      unknown
    >);
  });

  test("should render empty cell", () => {
    const emptyCellIndex = 123;
    renderCell(emptyCellIndex);

    expect(screen.getByTestId(emptyCellTestId)).toBeInTheDocument();
  });

  test("should render cell with null value text", () => {
    cell.isNull = true;
    layoutService.getNullValueText = () => "null";
    renderCell();

    expect(screen.getByText("null")).toBeInTheDocument();
  });

  test("should not render expand or collapse icon if cell is not expandable or collapseable", () => {
    cell.ref.qCanExpand = false;
    cell.ref.qCanCollapse = false;

    renderCell();

    expect(screen.getByText(qText)).toBeInTheDocument();
    expect(screen.queryByTestId(testIdExpandIcon)).toBeNull();
    expect(screen.queryByTestId(testIdCollapseIcon)).toBeNull();
  });

  describe("left column interactions", () => {
    beforeEach(() => {
      data.isLeftColumn = true;
    });

    describe("expand/collapse", () => {
      test("should be possible to expand left column", async () => {
        cell.ref.qCanExpand = true;

        renderCell();

        expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdExpandIcon));

        expect(expandLeftSpy).toHaveBeenCalledWith(cell.y, cell.x);
      });

      test("should not be possible to expand left column when active interaction is false", async () => {
        cell.ref.qCanExpand = true;
        interactions.active = false;

        renderCell();

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

        renderCell();

        expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdExpandIcon));

        expect(expandLeftSpy).toHaveBeenCalledTimes(0);
      });

      test("should be possible to collapse left column", async () => {
        cell.ref.qCanCollapse = true;

        renderCell();

        expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdCollapseIcon));

        expect(collapseLeftSpy).toHaveBeenCalledWith(cell.y, cell.x);
      });

      test("should be not possible to collapse left column when active interaction is false", async () => {
        cell.ref.qCanCollapse = true;
        interactions.active = false;

        renderCell();

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

        renderCell();

        expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdCollapseIcon));

        expect(collapseLeftSpy).toHaveBeenCalledTimes(0);
      });
    });

    describe("selections", () => {
      test("should select cell", async () => {
        cell.ref.qCanCollapse = true;

        renderCell();

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledWith(cell);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(1);
      });

      test("should style selected cell", () => {
        cell.ref.qCanCollapse = true;
        isSelectedSpy.mockReturnValue(true);

        renderCell();

        expect(isSelectedSpy).toHaveBeenCalledWith(cell);
        expect(screen.getByTestId(testId)).toHaveStyle({ background: "#0aaf54" } as Record<string, string>);
      });

      test("should not be possible to select cell when interactions is not active", async () => {
        interactions.active = false;
        cell.ref.qCanCollapse = true;
        isSelectedSpy.mockReturnValue(true);

        renderCell();

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
      });

      test("should not be possible to select cell when select interaction is false", async () => {
        interactions.select = false;
        cell.ref.qCanCollapse = true;
        isSelectedSpy.mockReturnValue(true);

        renderCell();

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
      });

      test("should not be possible to select cell when cell is locked due to selections in another field", async () => {
        cell.ref.qCanCollapse = true;
        isLockedSpy.mockReturnValue(true);

        renderCell();

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
      });

      test("should not be possible to select cell when dimension is locked", async () => {
        cell.isLockedByDimension = true;
        cell.ref.qCanCollapse = true;

        renderCell();

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe("top row interactions", () => {
    beforeEach(() => {
      data.isLeftColumn = false;
    });

    describe("expand/collapse", () => {
      test("should be possible to expand top row", async () => {
        cell.ref.qCanExpand = true;

        renderCell();

        expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdExpandIcon));

        expect(expandTopSpy).toHaveBeenCalledWith(cell.y, cell.x);
      });

      test("should not be possible to expand top row when active interaction is false", async () => {
        cell.ref.qCanExpand = true;
        interactions.active = false;

        renderCell();

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

        renderCell();

        expect(screen.queryByTestId(testIdExpandIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdExpandIcon));

        expect(expandTopSpy).toHaveBeenCalledTimes(0);
      });

      test("should be possible to collapse top row", async () => {
        cell.ref.qCanCollapse = true;

        renderCell();

        expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdCollapseIcon));

        expect(collapseTopSpy).toHaveBeenCalledWith(cell.y, cell.x);
      });

      test("should be not possible to collapse top row when active interaction is false", async () => {
        cell.ref.qCanCollapse = true;
        interactions.active = false;

        renderCell();

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

        renderCell();

        expect(screen.queryByTestId(testIdCollapseIcon)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(testIdCollapseIcon));

        expect(collapseTopSpy).toHaveBeenCalledTimes(0);
      });
    });

    describe("selections", () => {
      test("should select cell", async () => {
        cell.ref.qCanCollapse = true;

        renderCell();

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledWith(cell);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(1);
      });

      test("should not be possible to select cell when interaction is not active", async () => {
        interactions.active = false;
        cell.ref.qCanCollapse = true;
        isSelectedSpy.mockReturnValue(true);

        renderCell();

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
      });

      test("should not be possible to select cell when select interaction is false", async () => {
        interactions.select = false;
        cell.ref.qCanCollapse = true;
        isSelectedSpy.mockReturnValue(true);

        renderCell();

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
      });

      test("should not be possible to select cell when cell is locked due to selections in another field", async () => {
        cell.ref.qCanCollapse = true;
        isLockedSpy.mockReturnValue(true);

        renderCell();

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
      });

      test("should not be possible to select cell when dimension is locked", async () => {
        cell.isLockedByDimension = true;
        cell.ref.qCanCollapse = true;

        renderCell();

        await userEvent.click(screen.getByText(qText));

        expect(selectSpy).toHaveBeenCalledTimes(0);
        expect(onClickHandlerSpy).toHaveBeenCalledTimes(0);
      });
    });
  });
});
