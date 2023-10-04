import { renderHook } from "@testing-library/react";
import type {
  Cell,
  Grid,
  HeadersData,
  LeftDimensionData,
  PageInfo,
  Rect,
  StyleService,
  TopDimensionData,
} from "../../../types/types";
import * as styleProvider from "../../contexts/StyleProvider";
import useGridHeight from "../use-grid-height";

describe("useGridHeight", () => {
  const headersData = { size: { y: 3 } } as HeadersData;
  const topDimensionData = { rowCount: 3 } as TopDimensionData;
  const tableRect = { height: 500 } as Rect;
  let leftDimensionData: LeftDimensionData;
  let pageInfo: PageInfo;

  const createGrid = (rows: number) => {
    const grid: Grid = [{}];
    for (let index = 0; index < rows; index++) {
      grid[0][index] = {} as Cell;
    }
    return grid;
  };

  beforeEach(() => {
    pageInfo = { rowsOnCurrentPage: 100 } as PageInfo;
    leftDimensionData = { grid: createGrid(100) } as LeftDimensionData;

    jest
      .spyOn(styleProvider, "useStyleContext")
      .mockImplementation(() => ({ headerCellHeight: 20, contentCellHeight: 16 }) as StyleService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderUseGridHeight = () => {
    const {
      result: { current },
    } = renderHook(() => useGridHeight({ pageInfo, headersData, topDimensionData, leftDimensionData, tableRect }));
    return current;
  };

  test("should return grid heights when data overflows the chart", () => {
    const { containerHeight, topGridHeight, leftGridHeight, dataGridHeight, showLastBottomBorder } =
      renderUseGridHeight();

    expect(containerHeight).toBe(1660);
    expect(topGridHeight).toBe(60);
    expect(leftGridHeight).toBe(439);
    expect(dataGridHeight).toBe(439);
    expect(showLastBottomBorder).toBe(false);
  });
  test("should return grid heights when data doesn't overflows the chart", () => {
    pageInfo.rowsOnCurrentPage = 10;
    leftDimensionData.grid = createGrid(10);

    const { containerHeight, topGridHeight, leftGridHeight, dataGridHeight, showLastBottomBorder } =
      renderUseGridHeight();

    expect(containerHeight).toBe(220);
    expect(topGridHeight).toBe(60);
    expect(leftGridHeight).toBe(160);
    expect(dataGridHeight).toBe(160);
    expect(showLastBottomBorder).toBe(true);
  });
});
