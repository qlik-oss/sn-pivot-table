import { render, screen } from "@testing-library/react";
import React from "react";
import EmptyCell, { testId } from "../EmptyCell";

jest.mock("../../../contexts/StyleProvider");

test("should render", () => {
  const style: React.CSSProperties = {
    position: "absolute",
    left: "25px",
    top: "35px",
    width: "100px",
    height: "150px",
  };

  render(
    <EmptyCell
      isLeftColumn
      style={style}
      isLastRow={false}
      isLastColumn={false}
      showLastRowBorderBottom={false}
      index={0}
      showTotalCellDivider={false}
    />,
  );

  const elm = screen.getByTestId(testId);
  expect(elm).toBeInTheDocument();
  expect(elm).toHaveStyle(style as Record<string, unknown>);
});
