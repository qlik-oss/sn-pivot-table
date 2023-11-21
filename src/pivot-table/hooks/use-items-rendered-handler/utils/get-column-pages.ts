import type { MeasureData } from "../../../../types/types";

const isMissingColumnData = (measureData: MeasureData, x: number, y: number, height: number) => {
  const targetRows = measureData.slice(y, y + height);

  if (targetRows.length === 0) {
    return true; // Rows are not cached
  }

  return targetRows.some((row) => !row?.[x]);
};

const canMergePages = (prevPage: EngineAPI.INxPage, page: EngineAPI.INxPage) =>
  prevPage.qLeft + prevPage.qWidth === page.qLeft && prevPage.qTop === page.qTop && prevPage.qHeight === page.qHeight;

const getColumnPages = (measureData: MeasureData, qLeft: number, qTop: number, qWidth: number, qHeight: number) => {
  const pages = [];

  for (let left = qLeft; left < qLeft + qWidth; left++) {
    if (isMissingColumnData(measureData, left, qTop, qHeight)) {
      const prevPage = pages[pages.length - 1] as EngineAPI.INxPage | undefined;
      const page = {
        qLeft: left,
        qTop,
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
