import { render, screen } from "@testing-library/react";
import React from "react";
import NxDimCellType from "../../../../types/QIX";
import type { GridItemData, LayoutService } from "../../../../types/types";
import { Colors } from "../../shared-styles";
import DataCell, { testId } from "../DataCell";

jest.mock("../../../contexts/StyleProvider");

describe("DataCell", () => {
  let cell: EngineAPI.INxPivotValuePoint;
  let data: GridItemData;
  let layoutService: LayoutService;

  const style: React.CSSProperties = {
    position: "absolute",
    left: "25px",
    top: "35px",
    width: "100px",
    height: "150px",
  };

  beforeEach(() => {
    cell = {
      qText: "value",
      qNum: 1,
      qType: NxDimCellType.NX_DIM_CELL_NORMAL,
    } as EngineAPI.INxPivotValuePoint;

    layoutService = {
      getNullValueText: () => "-",
      size: { x: 1, y: 2 },
    } as LayoutService;

    data = {
      grid: [[cell]],
      layoutService,
    } as GridItemData;
  });

  test("should render", () => {
    render(<DataCell data={data} style={style} columnIndex={0} rowIndex={0} />);

    expect(screen.getByText(cell.qText)).toBeInTheDocument();
    expect(screen.getByTestId(testId)).toHaveStyle(style as Record<string, unknown>);
  });

  test("should render null value", () => {
    cell.qType = NxDimCellType.NX_DIM_CELL_NULL;

    render(<DataCell data={data} style={style} columnIndex={0} rowIndex={0} />);

    expect(screen.getByText(layoutService.getNullValueText())).toBeInTheDocument();
    expect(screen.getByTestId(testId).childNodes[0]).toHaveStyle({
      justifyContent: "center",
      backgroundColor: Colors.Black5,
    } as Record<string, unknown>);
  });
});
