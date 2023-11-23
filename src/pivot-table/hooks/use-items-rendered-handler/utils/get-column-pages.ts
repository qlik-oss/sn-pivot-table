import type { MeasureData, PageInfo } from "../../../../types/types";

const isMissingColumnData = (measureData: MeasureData, x: number, y: number, height: number) => {
  const targetRows = measureData.slice(y, y + height);

  if (targetRows.length === 0) {
    return true; // Rows are not cached
  }

  return targetRows.some((row) => row?.[x] === undefined);
};

const canMergePages = (prevPage: EngineAPI.INxPage, page: EngineAPI.INxPage) =>
  prevPage.qLeft + prevPage.qWidth === page.qLeft && prevPage.qTop === page.qTop && prevPage.qHeight === page.qHeight;

const getColumnPages = (
  pageInfo: PageInfo,
  measureData: MeasureData,
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  const pages = [];

  for (let currX = x; currX < x + width; currX++) {
    if (isMissingColumnData(measureData, currX, y, height)) {
      const prevPage = pages[pages.length - 1] as EngineAPI.INxPage | undefined;
      const page = {
        qLeft: currX,
        qTop: Math.max(0, y + pageInfo.page * pageInfo.rowsPerPage),
        qHeight: height,
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
