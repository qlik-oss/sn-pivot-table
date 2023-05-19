import { render, screen } from "@testing-library/react";
import React from "react";
import type { Cell } from "../../../../types/types";
import TotalsCell, { testId } from "../TotalsCell";

jest.mock("../../../contexts/StyleProvider");

test("should render", () => {
  const style: React.CSSProperties = {
    position: "absolute",
    left: "25px",
    top: "35px",
    width: "100px",
    height: "150px",
  };
  const cell = { ref: { qText: "test" } } as Cell;

  render(<TotalsCell cell={cell} style={style} isLeftColumn={false} isLastRow={false} isLastColumn={false} />);

  expect(screen.getByText(cell.ref.qText)).toBeInTheDocument();
  expect(screen.getByTestId(testId)).toHaveStyle(style as Record<string, unknown>);
});
