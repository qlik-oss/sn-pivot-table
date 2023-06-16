import { render, screen } from "@testing-library/react";
import React from "react";
import DimensionTitleCell, { testId } from "../DimensionTitleCell";

jest.mock("../../../contexts/StyleProvider");

test("should render left title", () => {
  const title = "test value";
  const style: React.CSSProperties = {
    position: "absolute",
    left: "25px",
    top: "35px",
    width: "100px",
    height: "150px",
  };

  render(<DimensionTitleCell title={title} type="left" style={style} isLastRow isLastColumn isFirstColumn={false} />);

  expect(screen.getByText(title)).toBeInTheDocument();
  expect(screen.getByTestId(testId)).toBeInTheDocument();
  const cell = screen.getByTestId(testId);
  expect(cell).toHaveStyle(style as Record<string, unknown>);

  expect(cell).toHaveStyle({ "border-right-width": "1px" });
  expect(cell).toHaveStyle({ "border-left-width": 0 });
  expect(cell).toHaveStyle({ "border-top-width": 0 });
  expect(cell).toHaveStyle({ "border-bottom-width": 0 });
});

test("should render left_last title", () => {
  const title = "test value";
  const style: React.CSSProperties = {
    position: "absolute",
    left: "25px",
    top: "35px",
    width: "100px",
    height: "150px",
  };

  render(
    <DimensionTitleCell
      title={title}
      type="left_last"
      style={style}
      isLastRow
      isLastColumn={false}
      isFirstColumn={false}
    />
  );

  expect(screen.getByText(title)).toBeInTheDocument();
  expect(screen.getByTestId(testId)).toBeInTheDocument();
  const cell = screen.getByTestId(testId);
  expect(cell).toHaveStyle(style as Record<string, unknown>);

  expect(cell).toHaveStyle({ "border-right-width": "1px" });
  expect(cell).toHaveStyle({ "border-left-width": 0 });
  expect(cell).toHaveStyle({ "border-top-width": 0 });
  expect(cell).toHaveStyle({ "border-bottom-width": 0 });
});

test("should render left_last title at last column", () => {
  const title = "test value";
  const style: React.CSSProperties = {
    position: "absolute",
    left: "25px",
    top: "35px",
    width: "100px",
    height: "150px",
  };

  render(
    <DimensionTitleCell title={title} type="left_last" style={style} isLastRow isLastColumn isFirstColumn={false} />
  );

  expect(screen.getByText(title)).toBeInTheDocument();
  expect(screen.getByTestId(testId)).toBeInTheDocument();
  const cell = screen.getByTestId(testId);
  expect(cell).toHaveStyle(style as Record<string, unknown>);

  expect(cell).toHaveStyle({ "border-right-width": 0 });
  expect(cell).toHaveStyle({ "border-left-width": 0 });
  expect(cell).toHaveStyle({ "border-top-width": 0 });
  expect(cell).toHaveStyle({ "border-bottom-width": 0 });
});

test("should render top title", () => {
  const title = "test value";
  const style: React.CSSProperties = {
    position: "absolute",
    left: "25px",
    top: "35px",
    width: "100px",
    height: "150px",
  };

  render(
    <DimensionTitleCell title={title} type="top" style={style} isLastRow={false} isLastColumn isFirstColumn={false} />
  );

  expect(screen.getByText(title)).toBeInTheDocument();
  expect(screen.getByTestId(testId)).toBeInTheDocument();
  const cell = screen.getByTestId(testId);
  expect(cell).toHaveStyle(style as Record<string, unknown>);

  expect(cell).toHaveStyle({ "border-right-width": 0 });
  expect(cell).toHaveStyle({ "border-left-width": "1px" });
  expect(cell).toHaveStyle({ "border-top-width": 0 });
  expect(cell).toHaveStyle({ "border-bottom-width": "1px" });
});

test("should render top_last title", () => {
  const title = "test value";
  const style: React.CSSProperties = {
    position: "absolute",
    left: "25px",
    top: "35px",
    width: "100px",
    height: "150px",
  };

  render(
    <DimensionTitleCell
      title={title}
      type="top_last"
      style={style}
      isLastRow={false}
      isLastColumn={false}
      isFirstColumn={false}
    />
  );

  expect(screen.getByText(title)).toBeInTheDocument();
  expect(screen.getByTestId(testId)).toBeInTheDocument();
  const cell = screen.getByTestId(testId);
  expect(cell).toHaveStyle(style as Record<string, unknown>);

  expect(cell).toHaveStyle({ "border-right-width": 0 });
  expect(cell).toHaveStyle({ "border-left-width": "1px" });
  expect(cell).toHaveStyle({ "border-top-width": 0 });
  expect(cell).toHaveStyle({ "border-bottom-width": "2px" });
});

test("should render top_last title at last row", () => {
  const title = "test value";
  const style: React.CSSProperties = {
    position: "absolute",
    left: "25px",
    top: "35px",
    width: "100px",
    height: "150px",
  };

  render(
    <DimensionTitleCell
      title={title}
      type="top_last"
      style={style}
      isLastRow
      isLastColumn={false}
      isFirstColumn={false}
    />
  );

  expect(screen.getByText(title)).toBeInTheDocument();
  expect(screen.getByTestId(testId)).toBeInTheDocument();
  const cell = screen.getByTestId(testId);
  expect(cell).toHaveStyle(style as Record<string, unknown>);

  expect(cell).toHaveStyle({ "border-right-width": 0 });
  expect(cell).toHaveStyle({ "border-left-width": "1px" });
  expect(cell).toHaveStyle({ "border-top-width": 0 });
  expect(cell).toHaveStyle({ "border-bottom-width": "1px" });
});
