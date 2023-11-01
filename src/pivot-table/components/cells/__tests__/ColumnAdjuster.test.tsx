import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { ColumnWidthType } from "../../../../types/QIX";
import type { AdjusterCellInfo, DataModel, ExtendedSelections } from "../../../../types/types";
import TestWithProvider from "../../../__tests__/test-with-providers";
import ColumnAdjuster from "../ColumnAdjuster";

describe("<ColumnAdjuster />", () => {
  let cellInfo: AdjusterCellInfo;
  let columnWidth: number;
  let dataModel: DataModel | undefined;

  beforeEach(() => {
    columnWidth = 100;
    dataModel = {
      applyColumnWidth: jest.fn(),
    } as unknown as DataModel;
    cellInfo = { canBeResized: true } as AdjusterCellInfo;
  });

  const renderAdjuster = (isActive = false) =>
    render(
      <ColumnAdjuster cellInfo={cellInfo} columnWidth={columnWidth} dataModel={dataModel} isLastColumn={false} />,
      {
        wrapper: ({ children }) => (
          <TestWithProvider selections={{ isActive: () => isActive } as unknown as ExtendedSelections}>
            {children}
          </TestWithProvider>
        ),
      },
    );

  afterEach(() => jest.clearAllMocks());

  test("should render ColumnAdjuster", () => {
    renderAdjuster();
    expect(screen.queryByTestId("sn-pivot-table-column-adjuster")).toBeInTheDocument();
  });

  test("should not render ColumnAdjuster when isActive is true", () => {
    renderAdjuster(true);
    expect(screen.queryByTestId("sn-pivot-table-column-adjuster")).not.toBeInTheDocument();
  });

  test("should not render ColumnAdjuster when canBeResized is false", () => {
    cellInfo = { canBeResized: false } as AdjusterCellInfo;

    renderAdjuster();
    expect(screen.queryByTestId("sn-pivot-table-column-adjuster")).not.toBeInTheDocument();
  });

  test("should change column width using mouse", async () => {
    renderAdjuster();

    const columnAdjuster = screen.queryByTestId("sn-pivot-table-column-adjuster") as HTMLElement;
    const coord = {
      clientX: 0,
      clientY: 0,
    };
    fireEvent.mouseDown(columnAdjuster, coord);
    coord.clientX = 100;
    fireEvent.mouseMove(columnAdjuster, coord);
    fireEvent.mouseUp(columnAdjuster, coord);

    await waitFor(() => {
      expect(dataModel?.applyColumnWidth).toHaveBeenNthCalledWith(
        1,
        { type: ColumnWidthType.Pixels, pixels: 200 },
        cellInfo,
      );
    });
  });

  test("should not change column width using mouse when mouse is not moved", async () => {
    renderAdjuster();

    const columnAdjuster = screen.queryByTestId("sn-pivot-table-column-adjuster") as HTMLElement;
    fireEvent.mouseDown(columnAdjuster);
    fireEvent.mouseUp(columnAdjuster);

    await waitFor(() => {
      expect(dataModel?.applyColumnWidth).toHaveBeenCalledTimes(0);
    });
  });

  test("should call applyColumnWidths with type fitToContent on double click", async () => {
    renderAdjuster();

    const columnAdjuster = screen.queryByTestId("sn-pivot-table-column-adjuster") as HTMLElement;
    fireEvent.doubleClick(columnAdjuster);

    await waitFor(() => {
      expect(dataModel?.applyColumnWidth).toHaveBeenNthCalledWith(1, { type: ColumnWidthType.FitToContent }, cellInfo);
    });
  });
});
