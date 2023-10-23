import { render, screen } from "@testing-library/react";
import React from "react";
import EmptyHeaderCell, { testId } from "../EmptyHeaderCell";

jest.mock("../../../contexts/StyleProvider");

test("should render", () => {
  const style: React.CSSProperties = {
    gridRowStart: 1,
    gridRowEnd: "span 2",
    gridColumnStart: 1,
    gridColumnEnd: "span 2",
  };

  render(<EmptyHeaderCell columnSpan={2} rowSpan={2} />);

  const elm = screen.getByTestId(testId);
  expect(elm).toBeInTheDocument();
  expect(elm).toHaveStyle(style as Record<string, unknown>);
});
