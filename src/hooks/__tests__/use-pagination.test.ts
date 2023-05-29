import * as nebula from "@nebula.js/stardust";
import { renderHook } from "@testing-library/react";
import React from "react";
import { MAX_ROW_COUNT } from "../../pivot-table/constants";
import type { LayoutService } from "../../types/types";
import usePagination from "../use-pagination";

jest.mock("@nebula.js/stardust");

describe("usePagination", () => {
  let layoutService: LayoutService;

  const renderer = () => renderHook(() => usePagination(layoutService)).result.current;

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
    const { pageInfo } = renderer();
    const { qcy } = layoutService.layout.qHyperCube.qSize;

    expect(pageInfo).toMatchObject({
      currentPage: 0,
      rowsPerPage: MAX_ROW_COUNT,
      shouldShowPagination: true,
      totalPages: Math.ceil(qcy / Math.min(qcy, MAX_ROW_COUNT)),
      totalRowCount: qcy,
    });
  });
});
