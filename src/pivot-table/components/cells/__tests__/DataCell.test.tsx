import { render, screen, type RenderResult } from "@testing-library/react";
import React from "react";
import NxDimCellType from "../../../../types/QIX";
import type { Cell, GridItemData, LayoutService, MeasureCell, PageInfo } from "../../../../types/types";
import TestWithProvider from "../../../__tests__/test-with-providers";
import DataCell, { testId } from "../DataCell";

describe("DataCell", () => {
  let cell: MeasureCell;
  let dimensionCell: Cell;
  let data: GridItemData;
  let layoutService: LayoutService;
  let renderDataCell: () => RenderResult;
  let pageInfo: PageInfo;

  const style: React.CSSProperties = {
    position: "absolute",
    left: "25px",
    top: "35px",
    width: "100px",
    height: "150px",
  };

  beforeEach(() => {
    cell = {
      ref: {
        qText: "value",
        qNum: 1,
        qType: NxDimCellType.NX_DIM_CELL_NORMAL,
      } as EngineAPI.INxPivotValuePoint,
      isNull: false,
      expressionColor: {
        color: null,
        background: null,
      },
    } as MeasureCell;

    layoutService = {
      getNullValueText: () => "-",
      size: { x: 1, y: 2 },
      hasPseudoDimOnLeft: false,
      showTotalsAbove: true,
      layout: {
        qHyperCube: {
          qMeasureInfo: [],
        },
      },
    } as unknown as LayoutService;

    pageInfo = {
      rowsOnCurrentPage: 2,
    } as PageInfo;

    dimensionCell = {
      visibleMeasureInfoIndex: 0,
    } as Cell;

    data = {
      grid: [[cell]],
      layoutService,
      showLastBorder: { right: false, bottom: false },
      shouldShowTotalCellBottomDivider: () => false,
      shouldShowTotalCellRightDivider: () => false,
      isTotalValue: () => false,
      pageInfo,
      lastColumn: { 0: dimensionCell },
      lastRow: { 0: dimensionCell },
      attrExprInfoIndexes: [],
    } as GridItemData;

    renderDataCell = () =>
      render(
        <TestWithProvider>
          <DataCell data={data} style={style} columnIndex={0} rowIndex={0} />
        </TestWithProvider>,
      );
  });

  test("should render", () => {
    renderDataCell();

    expect(screen.getByText(cell.ref.qText)).toBeInTheDocument();
    expect(screen.getByTestId(testId)).toHaveStyle(style as Record<string, unknown>);
    expect(screen.getByTestId(testId).childNodes[0]).toHaveStyle({
      color: "contentColor",
      background: "contentBackground",
    } as Record<string, unknown>);
  });

  test("should render cell with total styling", () => {
    data.isTotalValue = () => true;
    data.shouldShowTotalCellBottomDivider = () => true;
    data.shouldShowTotalCellRightDivider = () => true;
    renderDataCell();

    expect(screen.getByTestId(testId).childNodes[0]).toHaveStyle({
      color: "totalValueColor",
      background: "totalValueBackground",
      borderBottomColor: "rgba(0, 0, 0, 0.6)",
      borderRightColor: "rgba(0, 0, 0, 0.6)",
    } as Record<string, unknown>);
    expect(screen.getByText(cell.ref.qText)).toHaveStyle({
      fontWeight: "600",
    } as Record<string, unknown>);
  });

  test("should render null value", () => {
    cell.isNull = true;

    renderDataCell();

    expect(screen.getByText(layoutService.getNullValueText())).toBeInTheDocument();
    expect(screen.getByTestId(testId).childNodes[0]).toHaveStyle({
      justifyContent: "center",
      backgroundColor: "nullBackground",
      color: "nullColor",
    } as Record<string, unknown>);
  });

  test("should return empty cell", () => {
    data = { ...data, grid: [[]] };
    const { container } = renderDataCell();
    expect(container.firstChild).toHaveAttribute("data-testid", "empty-cell");
  });
});
