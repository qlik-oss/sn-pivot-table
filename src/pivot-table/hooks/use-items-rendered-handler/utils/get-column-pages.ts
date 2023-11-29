import type { MeasureData, PageInfo } from "../../../../types/types";

const isMissingColumnData = (measureData: MeasureData, qLeft: number, pageTop: number, qHeight: number) => {
  for (let top = pageTop; top < pageTop + qHeight; top++) {
    const row = measureData[top];
    if (row === undefined || row[qLeft] === undefined) {
      return true;
    }
  }

  return false;
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
        qWidth: 1,
        qHeight,
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
