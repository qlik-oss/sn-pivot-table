import type { PivotLayout } from "../../../../types/QIX";
import type { ViewService } from "../../../../types/types";
import { findVisibleRow, getVisibleRows } from "./snapshot-scroll-calculations";

export const getViewState = (viewService: ViewService, element: HTMLElement, layout: PivotLayout) => {
  const {
    rowPartialHeight = 0,
    visibleRowStartIndex = 0,
    visibleRowEndIndex = 0,
  } = findVisibleRow(viewService, element);
  return {
    // rowPartialHeight: 5,
    // visibleTopIndex: 5,
    // visibleRows: 16,
    // page: 0,
    // rowsPerPage: 50,
    rowPartialHeight,
    // visibleTopIndex: visibleRowStartIndex,
    // visibleRows: getVisibleRows(visibleRowStartIndex, visibleRowEndIndex, viewService, layout),
    // page: pageInfo.page,
    // rowsPerPage: pageInfo.rowsPerPage,
  };
};
