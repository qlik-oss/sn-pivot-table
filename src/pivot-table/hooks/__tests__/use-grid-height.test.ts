import { renderHook } from "@testing-library/react";
import type { HeadersData, PageInfo, Rect, StyleService, TopDimensionData } from "../../../types/types";
import * as styleProvider from "../../contexts/StyleProvider";
import useGridHeight from "../use-grid-height";

describe("useGridHeight", () => {
  const headersData = { size: { y: 3 } } as HeadersData;
  const topDimensionData = { rowCount: 3 } as TopDimensionData;
  const tableRect = { height: 500 } as Rect;
  const horizontalScrollbarHeight = 0;
  let pageInfo: PageInfo;

  beforeEach(() => {
    pageInfo = { rowsOnCurrentPage: 100 } as PageInfo;

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
    } = renderHook(() =>
      useGridHeight({ pageInfo, headersData, topDimensionData, tableRect, horizontalScrollbarHeight }),
    );
    return current;
  };

  test("should return grid heights when data overflows the chart", () => {
    const { containerHeight, topGridHeight, leftGridHeight, dataGridHeight, allRowsVisible } = renderUseGridHeight();

    expect(containerHeight).toBe(1660);
    expect(topGridHeight).toBe(60);
    expect(leftGridHeight).toBe(439);
    expect(dataGridHeight).toBe(439);
    expect(allRowsVisible).toBe(false);
  });
  test("should return grid heights when data doesn't overflows the chart", () => {
    pageInfo.rowsOnCurrentPage = 10;

    const { containerHeight, topGridHeight, leftGridHeight, dataGridHeight, allRowsVisible } = renderUseGridHeight();

    expect(containerHeight).toBe(220);
    expect(topGridHeight).toBe(60);
    expect(leftGridHeight).toBe(160);
    expect(dataGridHeight).toBe(160);
    expect(allRowsVisible).toBe(true);
  });
});
