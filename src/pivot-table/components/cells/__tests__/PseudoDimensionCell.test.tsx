import { render, screen } from "@testing-library/react";
import React from "react";
import { Cell } from "../../../../types/types";
import PseudoDimensionCell, { testId } from "../PseudoDimensionCell";

test("should render on the top", () => {
  const cell = { ref: { qText: "test" } } as Cell;
  const style: React.CSSProperties = {
    position: "absolute",
    left: "25px",
    top: "35px",
    width: "100px",
    height: "150px",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  };

  render(<PseudoDimensionCell cell={cell} style={style} isLeftColumn={false} isLastRow isLastColumn />);

  expect(screen.getByText("test")).toBeInTheDocument();
  expect(screen.getByTestId(testId)).toHaveStyle(style as Record<string, unknown>);
});

test("should render on the left", () => {
  const cell = { ref: { qText: "test" } } as Cell;
  const style: React.CSSProperties = {
    position: "absolute",
    left: "25px",
    top: "35px",
    width: "100px",
    height: "150px",
    display: "flex",
    alignItems: "flex-start",
  };

  render(<PseudoDimensionCell cell={cell} style={style} isLeftColumn isLastRow isLastColumn />);

  expect(screen.getByText("test")).toBeInTheDocument();
  expect(screen.getByTestId(testId)).toHaveStyle(style as Record<string, unknown>);
  expect(screen.getByTestId(testId)).not.toHaveStyle({ justifyContent: "center" } as Record<string, unknown>);
});
