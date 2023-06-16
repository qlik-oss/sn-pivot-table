import { render, screen } from "@testing-library/react";
import React from "react";
import type { HeadersData } from "../../../../types/types";
import HeaderGrid, { testId } from "../HeaderGrid";

jest.mock("../../../contexts/StyleProvider");

const headerCellHeight = 20;
const getLeftColumnWidth = () => 20;

test("should not render when 0 cols", () => {
  const headersData: HeadersData = {
    size: { rows: 1, cols: 0 },
    data: [[]],
  };

  render(<HeaderGrid columnWidthCallback={getLeftColumnWidth} rowHight={headerCellHeight} headersData={headersData} />);

  const grid = screen.queryByTestId(testId);
  expect(grid).toBeNull();
});

test("should not render when 0 rows", () => {
  const headersData: HeadersData = {
    size: { rows: 0, cols: 0 },
    data: [],
  };

  render(<HeaderGrid columnWidthCallback={getLeftColumnWidth} rowHight={headerCellHeight} headersData={headersData} />);

  const grid = screen.queryByTestId(testId);
  expect(grid).toBeNull();
});

test("should render 2 left dimensions and 0 top", () => {
  const headersData: HeadersData = {
    size: { rows: 1, cols: 2 },
    data: [
      [
        { id: "1", title: "1", type: "left", approximateMaxGlyphCount: 1, includeMeasures: false },
        { id: "2", title: "2", type: "left_last", approximateMaxGlyphCount: 1, includeMeasures: false },
      ],
    ],
  };

  render(<HeaderGrid columnWidthCallback={getLeftColumnWidth} rowHight={headerCellHeight} headersData={headersData} />);

  const grid = screen.getByTestId(testId);

  expect(grid).toBeInTheDocument();
  expect(grid).toHaveStyle({ "grid-template-rows": "20px" });
  expect(grid).toHaveStyle({ "grid-template-columns": "20px 20px" });
  expect(grid.children.length).toBe(2);
});

test("should render 2 left dimensions and one top dimension", () => {
  const headersData: HeadersData = {
    size: { rows: 2, cols: 2 },
    data: [
      [null, { id: "3", title: "3", type: "top_last", approximateMaxGlyphCount: 1, includeMeasures: false }],
      [
        { id: "1", title: "1", type: "left", approximateMaxGlyphCount: 1, includeMeasures: false },
        { id: "2", title: "2", type: "left_last", approximateMaxGlyphCount: 1, includeMeasures: false },
      ],
    ],
  };

  render(<HeaderGrid columnWidthCallback={getLeftColumnWidth} rowHight={headerCellHeight} headersData={headersData} />);

  const grid = screen.getByTestId(testId);

  expect(grid).toBeInTheDocument();
  expect(grid).toHaveStyle({ "grid-template-rows": "20px 20px" });
  expect(grid).toHaveStyle({ "grid-template-columns": "20px 20px" });
  expect(grid.children.length).toBe(4);
});

test("should render 0 left dimensions and 2 top", () => {
  const headersData: HeadersData = {
    size: { rows: 2, cols: 1 },
    data: [
      [{ id: "1", title: "1", type: "top", approximateMaxGlyphCount: 1, includeMeasures: false }],
      [{ id: "2", title: "2", type: "top_last", approximateMaxGlyphCount: 1, includeMeasures: false }],
    ],
  };

  render(<HeaderGrid columnWidthCallback={getLeftColumnWidth} rowHight={headerCellHeight} headersData={headersData} />);

  const grid = screen.getByTestId(testId);

  expect(grid).toBeInTheDocument();
  expect(grid).toHaveStyle({ "grid-template-rows": "20px 20px" });
  expect(grid).toHaveStyle({ "grid-template-columns": "20px" });
  expect(grid.children.length).toBe(2);
});
