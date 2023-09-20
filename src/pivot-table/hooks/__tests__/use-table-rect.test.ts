import { PAGINATION_HEIGHT } from "@qlik/nebula-table-utils/lib/components/PaginationFooter";
import { renderHook } from "@testing-library/react";
import type { LayoutService, Rect } from "../../../types/types";
import { DISCLAIMER_HEIGHT } from "../../constants";
import useTableRect from "../use-table-rect";

describe("use-table-rect", () => {
  let rect: Rect;
  let layoutService: LayoutService;
  let shouldShowPagination: boolean;

  beforeEach(() => {
    rect = {
      height: 1000,
    } as Rect;
    layoutService = {
      hasLimitedData: false,
    } as LayoutService;
    shouldShowPagination = false;
  });

  const renderer = () => renderHook(() => useTableRect(rect, layoutService, shouldShowPagination)).result.current;

  test("should return default rect height", () => {
    const { height } = renderer();
    expect(height).toBe(rect.height);
  });

  test("should consider limited columns disclaimer", () => {
    layoutService.hasLimitedData = true;
    const { height } = renderer();
    expect(height).toBe(rect.height - DISCLAIMER_HEIGHT);
  });

  test("should consider pagination height", () => {
    shouldShowPagination = true;
    const { height } = renderer();
    expect(height).toBe(rect.height - PAGINATION_HEIGHT - 1);
  });

  test("should consider pagination height and columns disclaimer in case of big datasets", () => {
    shouldShowPagination = true;
    layoutService.hasLimitedData = true;
    const { height } = renderer();
    expect(height).toBe(rect.height - PAGINATION_HEIGHT - 1 - DISCLAIMER_HEIGHT);
  });
});
