import type { MeasureCell, MeasureData, PageInfo } from "../../../../types/types";

const isMissingRowData = (measureData: MeasureData, x: number, pageRowIdx: number, width: number) => {
  const row = measureData[pageRowIdx] as MeasureCell[] | undefined;

  if (row === undefined) {
    return true; // Row is not cached
  }

  for (let colIndex = x; colIndex < x + width; colIndex++) {
    const cell = row[colIndex] as MeasureCell | undefined;
    if (cell === undefined) {
      return true; // Column is not cached
    }
  }

  return false;
};

const canMergePages = (prevPage: EngineAPI.INxPage, page: EngineAPI.INxPage) =>
  prevPage.qTop + prevPage.qHeight === page.qTop && prevPage.qLeft === page.qLeft && prevPage.qWidth === page.qWidth;

const getRowPages = (
  pageInfo: PageInfo,
  measureData: MeasureData,
  qLeft: number,
  qTop: number,
  qWidth: number,
  qHeight: number,
) => {
  const pages = [];

  for (let top = qTop; top < qTop + qHeight; top++) {
    const pageTop = Math.max(0, top - pageInfo.page * pageInfo.rowsPerPage);
    if (isMissingRowData(measureData, qLeft, pageTop, qWidth)) {
      const prevPage = pages[pages.length - 1] as EngineAPI.INxPage | undefined;
      const page = {
        qLeft,
        qTop: top,
        qHeight: 1,
        qWidth,
      };

      if (prevPage !== undefined && canMergePages(prevPage, page)) {
        prevPage.qHeight += page.qHeight;
      } else {
        pages.push(page);
      }
    }
  }

  return pages;
};

export default getRowPages;
