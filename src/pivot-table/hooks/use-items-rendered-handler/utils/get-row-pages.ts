import {
  ScrollDirection,
  type MeasureCell,
  type MeasureData,
  type PageInfo,
  type ViewService,
} from "../../../../types/types";
import { MAX_BUFFER, MIN_BUFFER } from "../constants";
import getBackBuffer from "./get-back-buffer";

type GetRowPages = {
  pageInfo: PageInfo;
  measureData: MeasureData;
  viewService: ViewService;
  scrollDirection: React.MutableRefObject<ScrollDirection>;
};

type GetPages = {
  pageInfo: PageInfo;
  measureData: MeasureData;
  startTop: number;
  endTop: number;
  qLeft: number;
  qWidth: number;
};

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

export const getMinBufferArea = (
  pageInfo: PageInfo,
  viewService: ViewService,
  scrollDirection: React.MutableRefObject<ScrollDirection>,
) => {
  const { gridColumnStartIndex, gridRowStartIndex, gridWidth, gridHeight } = viewService;
  const minBackBuffer = getBackBuffer(scrollDirection, MIN_BUFFER);
  const minBufferTop = Math.max(gridRowStartIndex - minBackBuffer, 0);
  const minBufferHeight = Math.min(gridHeight + MIN_BUFFER, pageInfo.rowsOnCurrentPage - minBufferTop);
  const minBufferEndTop = minBufferTop + minBufferHeight;

  return {
    startTop: minBufferTop,
    endTop: minBufferEndTop,
    qLeft: gridColumnStartIndex,
    qWidth: gridWidth,
  };
};

export const getPages = ({ startTop, endTop, qLeft, qWidth, measureData, pageInfo }: GetPages) => {
  const pages: EngineAPI.INxPage[] = [];
  const currentPageMinTop = pageInfo.page * pageInfo.rowsPerPage;

  for (let top = startTop; top < endTop; top++) {
    if (isMissingRowData(measureData, qLeft, top, qWidth)) {
      const prevPage = pages.at(-1);
      const page = {
        qLeft,
        qTop: top + currentPageMinTop,
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

const getRowPages = ({ pageInfo, measureData, scrollDirection, viewService }: GetRowPages) => {
  const { startTop, endTop, qLeft, qWidth } = getMinBufferArea(pageInfo, viewService, scrollDirection);

  const minBufferPages = getPages({
    startTop,
    endTop,
    qLeft,
    qWidth,
    measureData,
    pageInfo,
  });

  const shouldFetchMaxBuffer = minBufferPages.length > 0;

  if (shouldFetchMaxBuffer) {
    const maxBufferStart =
      scrollDirection.current === ScrollDirection.Backward ? Math.max(0, startTop - MAX_BUFFER) : endTop;

    const maxBufferEnd = Math.min(maxBufferStart + MAX_BUFFER, pageInfo.rowsOnCurrentPage);

    const maxBufferPages = getPages({
      startTop: maxBufferStart,
      endTop: maxBufferEnd,
      qLeft,
      qWidth,
      measureData,
      pageInfo,
    });

    return [...minBufferPages, ...maxBufferPages];
  }

  return minBufferPages;
};

export default getRowPages;
