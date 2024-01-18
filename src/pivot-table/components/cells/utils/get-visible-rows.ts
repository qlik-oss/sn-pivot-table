// import type { ViewService } from "../../../../types/types";

// const getFirstCellOfRow = (rowIndex: number, cells?: NodeListOf<Element>) => {
//   if (!cells) return undefined;
//   for (let i = 0; i < cells.length; i++) {
//     const startIndex = cells[i].getAttribute("rowindex");
//     if (startIndex && parseInt(startIndex, 10) === rowIndex) return cells[i];
//   }
//   return undefined;
// };

// const shouldIncludeRowWithCell = (cellRect: DOMRect, min: number, max: number) => {
//   if (!cellRect) return false;
//   const center = cellRect.y + cellRect.height / 2;
//   return center >= min && center <= max;
// };

// //TODO: pageInfo contains page and rowsperPage ...
// export const getVisibleRows = (element: HTMLElement, viewService: ViewService) => {
//   // const EPSILON = 0.001;
//   const tableBody = element.querySelector('.qv-object-sn-pivot-table [data-key="scrollable-container--leftGrid"]');
//   const cells = tableBody?.querySelectorAll(".sn-table-cell");
//   const { visibleTop = 0, visibleHeight = 0, page = 0, rowsPerPage = 0 } = viewService;
//   const offset = page * rowsPerPage;
//   const visibleTopInPage = visibleTop - offset;
//   const topLeftCell = getFirstCellOfRow(visibleTopInPage, cells);
//   const topLeftCellRect = topLeftCell?.getBoundingClientRect();
//   const bodyRect = tableBody?.getBoundingClientRect();
//   const bodyYMin = bodyRect.y;
//   const bodyYMax = bodyRect.y + bodyRect.height;
//   const visibleRowStartIndex =
//     (shouldIncludeRowWithCell(topLeftCellRect, bodyYMin, bodyYMax) ? visibleTopInPage : visibleTopInPage + 1) + offset;
// };
