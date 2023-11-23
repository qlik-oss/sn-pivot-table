import type { MeasureData, PageInfo } from "../../../../types/types";

const isMissingColumnData = (measureData: MeasureData, qLeft: number, pageTop: number, qHeight: number) => {
  const targetRows = measureData.slice(pageTop, pageTop + qHeight);

  if (targetRows.length === 0) {
    return true; // Rows are not cached
  }

  return targetRows.some((row) => row?.[qLeft] === undefined);
};

const canMergePages = (prevPage: EngineAPI.INxPage, page: EngineAPI.INxPage) =>
  prevPage.qLeft + prevPage.qWidth === page.qLeft && prevPage.qTop === page.qTop && prevPage.qHeight === page.qHeight;

const getColumnPages = (
  pageInfo: PageInfo,
  measureData: MeasureData,
  qLeft: number,
  pageTop: number,
  qWidth: number,
  qHeight: number,
) => {
  const pages = [];

  for (let left = qLeft; left < qLeft + qWidth; left++) {
    if (isMissingColumnData(measureData, left, pageTop, qHeight)) {
      const prevPage = pages[pages.length - 1] as EngineAPI.INxPage | undefined;
      const page = {
        qLeft: left,
        qTop: Math.max(0, pageTop + pageInfo.page * pageInfo.rowsPerPage),
        qHeight,
        qWidth: 1,
      };

      if (prevPage !== undefined && canMergePages(prevPage, page)) {
        prevPage.qWidth += page.qWidth;
      } else {
        pages.push(page);
      }
    }
  }

  return pages;
};

export default getColumnPages;
