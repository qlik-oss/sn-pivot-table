import type { MeasureCell, MeasureData, PageInfo } from "../../../../types/types";

const isMissingRowData = (measureData: MeasureData, x: number, y: number, width: number) => {
  const row = measureData[y] as MeasureCell[] | undefined;

  if (row === undefined) {
    return true; // Row is not cached
  }

  for (let currX = x; currX < x + width; currX++) {
    const cell = row[currX] as MeasureCell | undefined;
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
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  const pages = [];

  for (let currY = y; currY < y + height; currY++) {
    if (isMissingRowData(measureData, x, currY, width)) {
      const prevPage = pages[pages.length - 1] as EngineAPI.INxPage | undefined;
      const page = {
        qLeft: x,
        qTop: Math.max(0, currY + pageInfo.page * pageInfo.rowsPerPage),
        qHeight: 1,
        qWidth: width,
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
