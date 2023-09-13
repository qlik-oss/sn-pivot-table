import { render, screen } from "@testing-library/react";
import React from "react";
import type { Cell } from "../../../../types/types";
import { leftContainerCellStyle, topContainerCellStyle } from "../../shared-styles";
import PseudoDimensionCell, { testId } from "../PseudoDimensionCell";

jest.mock("../../../contexts/StyleProvider");

test("should render on the top", () => {
  const cell = { ref: { qText: "test" }, root: null, isPseudoDimension: true } as Cell;
  const style: React.CSSProperties = {
    position: "absolute",
    left: "25px",
    top: "35px",
    width: "100px",
    height: "150px",
    display: "flex",
    ...topContainerCellStyle,
  };

  render(
    <PseudoDimensionCell
      cell={cell}
      style={style}
      isLeftColumn={false}
      isLastRow
      isLastColumn
      showLastRowBorderBottom
      showTotalCellDivider={false}
    />,
  );

  expect(screen.getByText("test")).toBeInTheDocument();
  expect(screen.getByTestId(testId)).toHaveStyle(style as Record<string, unknown>);
});

test("should render on the left", () => {
  const cell = { ref: { qText: "test" }, root: null, isPseudoDimension: true } as Cell;
  const style: React.CSSProperties = {
    position: "absolute",
    left: "25px",
    top: "35px",
    width: "100px",
    height: "150px",
    display: "flex",
    ...leftContainerCellStyle,
  };

  render(
    <PseudoDimensionCell
      cell={cell}
      style={style}
      isLeftColumn
      isLastRow
      isLastColumn
      showLastRowBorderBottom
      showTotalCellDivider={false}
    />,
  );

  expect(screen.getByText("test")).toBeInTheDocument();
  expect(screen.getByTestId(testId)).toHaveStyle(style as Record<string, unknown>);
  expect(screen.getByTestId(testId)).not.toHaveStyle({ justifyContent: "center" } as Record<string, unknown>);
});
