import * as nebula from "@nebula.js/stardust";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { MAX_ROW_COUNT } from "../../pivot-table/constants";
import type { LayoutService } from "../../types/types";
import usePagination from "../use-pagination";

jest.mock("@nebula.js/stardust");

describe("usePagination", () => {
  let layoutService: LayoutService;

  const renderer = () => renderHook(() => usePagination(layoutService));

  beforeEach(() => {
    layoutService = {
      size: { x: 100, y: 100 },
      layout: {
        qHyperCube: {
          qSize: {
            qcx: 10_000_000,
            qcy: 10_000_000,
          },
        },
      },
    } as LayoutService;

    jest.spyOn(nebula, "useState").mockImplementation(React.useState);
    jest.spyOn(nebula, "useEffect").mockImplementation(React.useEffect);
  });

  test("should return correct pagination info for given values", () => {
    const {
      result: {
        current: { pageInfo },
      },
    } = renderer();
    const { qcy } = layoutService.layout.qHyperCube.qSize;

    expect(pageInfo).toMatchObject({
      page: 0,
      rowsPerPage: MAX_ROW_COUNT,
      shouldShowPagination: true,
      totalPages: Math.ceil(qcy / Math.min(qcy, MAX_ROW_COUNT)),
      totalRowCount: qcy,
      rowsOnCurrentPage: MAX_ROW_COUNT,
    });
  });

  test("should reset to last page in case of collapsing rows ends up reducing row counts tremendusly", async () => {
    const { result, rerender } = renderer();

    // get total pages based on layout info
    const totalPages = Math.ceil(layoutService.layout.qHyperCube.qSize.qcy / MAX_ROW_COUNT);

    // update the page to last page + 100 more pages (some thing out of curr pagination boundary)
    act(() => {
      result.current.updatePageInfo({ ...result.current.pageInfo, page: totalPages + 100 });
    });

    rerender();

    // check the the currPage to be the last page (considering that page count is based 0)
    await waitFor(() => {
      expect(result.current.pageInfo.page).toBe(totalPages - 1);
    });
    await waitFor(() => {
      expect(result.current.pageInfo.rowsOnCurrentPage).toBe(10_000);
    });
  });
});
