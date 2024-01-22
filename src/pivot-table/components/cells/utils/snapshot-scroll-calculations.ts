import type { PivotLayout } from "../../../../types/QIX";
import type { ViewService } from "../../../../types/types";

const getCellOfLeftColumn = (
  dataYindex: number,
  cells?: NodeListOf<Element>,
): { el: Element; index: number } | undefined => {
  if (!cells) return undefined;
  for (let i = 0; i < cells.length; i++) {
    const dataY = cells[i].getAttribute("data-y");
    if (dataY && parseInt(dataY, 10) === dataYindex)
      return {
        el: cells[i],
        index: i,
      };
  }
  return undefined;
};

const findIndex = (
  position: "Start" | "End",
  cell: { el: Element; index: number } | undefined,
  bodyRect: DOMRect | undefined,
): number | undefined => {
  const cellRect = cell?.el?.getBoundingClientRect();
  if (!cellRect) return -1;
  if (position === "Start" && bodyRect && cellRect.bottom > bodyRect.top) return cell?.index;
  if (position === "End" && bodyRect && bodyRect.bottom > cellRect.top) return cell?.index;
  return -1;
};

export const getPartialTopScrollHeight = (
  cell: { el: Element; index: number } | undefined,
  bodyRect: DOMRect | undefined,
) => {
  if (!cell) return 0;
  const cellRect = cell?.el?.getBoundingClientRect();
  return bodyRect && Math.max(bodyRect.top - cellRect.top, 0);
};

export const findVisibleRow = (viewService: ViewService, element: HTMLElement) => {
  const leftColumnBody = element.querySelector(
    '[data-key="scrollable-container--leftGrid"] [data-key="sticky-container"]',
  )?.lastChild;
  const cells = element.querySelectorAll(
    '[data-key="scrollable-container--leftGrid"] [data-key="sticky-container"] [role="button"]',
  );
  let bodyRect: DOMRect | undefined;
  if (leftColumnBody instanceof Element) {
    bodyRect = leftColumnBody.getBoundingClientRect();
  }
  const { visibleTopIndex = 0, visibleRows = 0, page = 0, rowsPerPage = 0 } = viewService;
  const offset = page * rowsPerPage;
  const visibleTopInPage = visibleTopIndex - offset;
  const visibleBottomInPage = visibleTopInPage + visibleRows - 1;
  const topLeftCellProp = getCellOfLeftColumn(visibleTopInPage, cells);
  const visibleRowStartIndex =
    (findIndex("Start", topLeftCellProp, bodyRect) ? visibleTopInPage : visibleTopInPage + 1) + offset;
  const rowPartialHeight = getPartialTopScrollHeight(topLeftCellProp, bodyRect);

  let visibleRowEndIndex = visibleBottomInPage + offset;
  const bottomLeftCellProp = getCellOfLeftColumn(visibleBottomInPage, cells);
  if (!findIndex("End", bottomLeftCellProp, bodyRect)) visibleRowEndIndex = visibleBottomInPage - 1 + offset;

  return { rowPartialHeight, visibleRowStartIndex, visibleRowEndIndex };
};

// VisibleTop gives the first visible <row> index of the table
// getFirstCellOfRow checks whether the cell is part of this row or not.
// if it is it takes if as the startCell and then checks if it is included (whole or partial)

export const getVisibleRows = (
  visibleRowStartIndex: number,
  visibleRowEndIndex: number,
  viewService: ViewService,
  layout: PivotLayout,
) => {
  if (visibleRowEndIndex < 0) return 0;
  // const EXTRA_ROWS = viewService.viewState?.isMultiPage ? 0 : 3;
  const EXTRA_ROWS = 3;
  const totalRowCount = layout.qHyperCube.qSize.qcy;
  const visualRowsPerPage = viewService.rowsPerPage || 1500;
  return Math.min(totalRowCount, visualRowsPerPage, visibleRowEndIndex - visibleRowStartIndex + 1 + EXTRA_ROWS);
};
