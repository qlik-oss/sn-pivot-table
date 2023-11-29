import type { MeasureCell, MeasureData, PageInfo } from "../../../../types/types";

const isMissingRowData = (measureData: MeasureData, qLeft: number, pageTop: number, qWidth: number) => {
  const row = measureData[pageTop] as MeasureCell[] | undefined;

  if (row === undefined) {
    return true; // Row is not cached
  }

  for (let left = qLeft; left < qLeft + qWidth; left++) {
    const cell = row[left] as MeasureCell | undefined;
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
  pageTop: number,
  qWidth: number,
  qHeight: number,
) => {
  const pages = [];

  for (let top = pageTop; top < pageTop + qHeight; top++) {
    if (isMissingRowData(measureData, qLeft, top, qWidth)) {
      const prevPage = pages[pages.length - 1] as EngineAPI.INxPage | undefined;
      const page = {
        qLeft,
        qTop: Math.max(0, top + pageInfo.page * pageInfo.rowsPerPage),
        qWidth,
        qHeight: 1,
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
