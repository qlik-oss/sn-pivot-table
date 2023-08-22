import { render, screen, type RenderResult } from "@testing-library/react";
import React from "react";
import NxDimCellType from "../../../../types/QIX";
import type { GridItemData, LayoutService } from "../../../../types/types";
import TestWithProvider from "../../../__tests__/test-with-providers";
import DataCell, { testId } from "../DataCell";

describe("DataCell", () => {
  let cell: EngineAPI.INxPivotValuePoint;
  let data: GridItemData;
  let layoutService: LayoutService;
  let renderDataCell: () => RenderResult;

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
      showLastRowBorderBottom: false,
      isTotalCellAt: () => false,
    } as GridItemData;

    renderDataCell = () =>
      render(
        <TestWithProvider>
          <DataCell data={data} style={style} columnIndex={0} rowIndex={0} />
        </TestWithProvider>
      );
  });

  test("should render", () => {
    renderDataCell();

    expect(screen.getByText(cell.qText)).toBeInTheDocument();
    expect(screen.getByTestId(testId)).toHaveStyle(style as Record<string, unknown>);
    expect(screen.getByTestId(testId).childNodes[0]).toHaveStyle({
      color: "contentColor",
      background: "contentBackground",
    } as Record<string, unknown>);
  });

  test("should render cell with total styling", () => {
    data.isTotalCellAt = () => true;
    renderDataCell();

    expect(screen.getByText(cell.qText)).toBeInTheDocument();
    expect(screen.getByTestId(testId).childNodes[0]).toHaveStyle({
      color: "totalValueColor",
      background: "totalValueBackground",
      fontWeight: "600",
    } as Record<string, unknown>);
  });

  test("should render null value", () => {
    cell.qType = NxDimCellType.NX_DIM_CELL_NULL;

    renderDataCell();

    expect(screen.getByText(layoutService.getNullValueText())).toBeInTheDocument();
    expect(screen.getByTestId(testId).childNodes[0]).toHaveStyle({
      justifyContent: "center",
      backgroundColor: "contentNullBackground",
      color: "contentNullColor",
    } as Record<string, unknown>);
  });

  test("should return empty cell", () => {
    data = { ...data, grid: [[]] };
    const { container } = renderDataCell();
    expect(container.firstChild).toHaveAttribute("data-testid", "empty-cell");
  });
});
