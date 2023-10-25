import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { ColumnWidthType } from "../../../../types/QIX";
import type { Cell, DataModel } from "../../../../types/types";
import ColumnAdjuster from "../ColumnAdjuster";

describe("<ColumnAdjuster />", () => {
  const cell = {} as Cell;
  let columnWidth: number;
  let dataModel: DataModel | undefined;

  beforeEach(() => {
    columnWidth = 100;
    dataModel = {
      applyColumnWidth: jest.fn(),
    } as unknown as DataModel;

    render(<ColumnAdjuster cell={cell} columnWidth={columnWidth} dataModel={dataModel} isLastColumn={false} />);
  });

  afterEach(() => jest.clearAllMocks());

  test("should render columnAdjuster", () => {
    expect(screen.queryByTestId("sn-pivot-table-column-adjuster")).toBeInTheDocument();
  });

  test("should change column width using mouse", async () => {
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
        cell,
      );
    });
  });

  test("should not change column width using mouse when mouse is not moved", async () => {
    const columnAdjuster = screen.queryByTestId("sn-pivot-table-column-adjuster") as HTMLElement;
    fireEvent.mouseDown(columnAdjuster);
    fireEvent.mouseUp(columnAdjuster);

    await waitFor(() => {
      expect(dataModel?.applyColumnWidth).toHaveBeenCalledTimes(0);
    });
  });

  test("should call applyColumnWidths with type fitToContent on double click", async () => {
    const columnAdjuster = screen.queryByTestId("sn-pivot-table-column-adjuster") as HTMLElement;
    fireEvent.doubleClick(columnAdjuster);

    await waitFor(() => {
      expect(dataModel?.applyColumnWidth).toHaveBeenNthCalledWith(1, { type: ColumnWidthType.FitToContent }, cell);
    });
  });
});
