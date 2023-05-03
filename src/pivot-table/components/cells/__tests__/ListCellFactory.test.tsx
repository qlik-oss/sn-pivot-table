import { type stardust } from "@nebula.js/stardust";
import { render } from "@testing-library/react";
import React from "react";
import NxDimCellType from "../../../../types/QIX";
import type { Cell, DataModel, LayoutService, ListItemData } from "../../../../types/types";
import DimensionCell from "../DimensionCell";
import EmptyCell from "../EmptyCell";
import ListCellFactory from "../ListCellFactory";
import PseudoDimensionCell from "../PseudoDimensionCell";
import TotalsCell from "../TotalsCell";
// eslint-disable-next-line jest/no-mocks-import
import dataModelMock from "./__mocks__/data-model-mock";

jest.mock("../DimensionCell");
jest.mock("../EmptyCell");
jest.mock("../PseudoDimensionCell");
jest.mock("../TotalsCell");

describe("ListCellFactory", () => {
  const style: React.CSSProperties = {
    position: "absolute",
    left: "25px",
    top: "35px",
    width: "100px",
    height: "150px",
  };
  const qText = "test value";
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
      list: {},
      constraints,
      isLast: false,
    };
  });

  test("should render dimension cell", () => {
    const index = 0;
    const mockDimensionCell = DimensionCell as jest.MockedFunction<typeof DimensionCell>;
    mockDimensionCell.mockReturnValue(<div />);
    cell = { x: 1, y: 2, ref: { qText, qCanCollapse: false, qCanExpand: false } } as Cell;
    data.list[index] = cell;

    render(<ListCellFactory index={index} style={style} data={data} />);

    expect(mockDimensionCell).toHaveBeenCalledWith(
      { style, cell, data, rowIndex: 2, colIndex: 1, isLeftColumn: false },
      {}
    );
  });

  test("should render pseudo dimension cell", () => {
    const index = 0;
    const mockPseudoDimensionCell = PseudoDimensionCell as jest.MockedFunction<typeof PseudoDimensionCell>;
    mockPseudoDimensionCell.mockReturnValue(<div />);
    cell = { ref: { qText, qType: NxDimCellType.NX_DIM_CELL_PSEUDO } } as Cell;
    data.list[index] = cell;

    render(<ListCellFactory index={index} style={style} data={data} />);

    expect(mockPseudoDimensionCell).toHaveBeenCalledWith({ style, cell, isLeftColumn: false }, {});
  });

  test("should render totals cell", () => {
    const index = 0;
    const mockedTotalsCell = TotalsCell as jest.MockedFunction<typeof TotalsCell>;
    mockedTotalsCell.mockReturnValue(<div />);
    cell = { ref: { qText, qType: NxDimCellType.NX_DIM_CELL_TOTAL, qElemNo: -1 } } as Cell;
    data.list[index] = cell;

    render(<ListCellFactory index={index} style={style} data={data} />);

    expect(mockedTotalsCell).toHaveBeenCalledWith({ cell, style, isLeftColumn: false }, {});
  });

  test("should render empty cell", () => {
    const index = 0;
    const mockEmptyCell = EmptyCell as jest.MockedFunction<typeof EmptyCell>;
    mockEmptyCell.mockReturnValue(<div />);
    cell = { ref: { qText, qType: NxDimCellType.NX_DIM_CELL_EMPTY } } as Cell;
    data.list[index] = cell;

    render(<ListCellFactory index={index} style={style} data={data} />);

    expect(mockEmptyCell).toHaveBeenCalledWith({ style, index }, {});
  });

  test("should render undefined cell", () => {
    const index = 1;
    const mockEmptyCell = EmptyCell as jest.MockedFunction<typeof EmptyCell>;
    mockEmptyCell.mockReturnValue(<div />);
    cell = { ref: { qText, qType: NxDimCellType.NX_DIM_CELL_EMPTY } } as Cell;
    data.list[index] = cell;
    data.isLast = true;

    render(<ListCellFactory index={index} style={style} data={data} />);

    expect(mockEmptyCell).toHaveBeenCalledWith({ style, index }, {});
  });
});
