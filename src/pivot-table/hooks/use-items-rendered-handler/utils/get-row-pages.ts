import {
  ScrollDirection,
  type LayoutService,
  type MeasureCell,
  type MeasureData,
  type PageInfo,
} from "../../../../types/types";
import { MAX_BUFFER, MIN_BUFFER } from "../constants";
import getBackBuffer from "./get-back-buffer";

type GetRowPages = {
  pageInfo: PageInfo;
  measureData: MeasureData;
  qLeft: number;
  pageTop: number;
  qWidth: number;
  qHeight: number;
  scrollDirection: React.MutableRefObject<ScrollDirection>;
  layoutService: LayoutService;
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

export const getPages = ({ startTop, endTop, qLeft, qWidth, pageInfo, measureData }: GetPages) => {
  const pages: EngineAPI.INxPage[] = [];

  for (let top = startTop; top < endTop; top++) {
    if (isMissingRowData(measureData, qLeft, top, qWidth)) {
      const prevPage = pages.at(-1);
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

const getRowPages = ({
  pageInfo,
  measureData,
  scrollDirection,
  layoutService,
  qLeft,
  pageTop,
  qWidth,
  qHeight,
}: GetRowPages) => {
  const minBackBuffer = getBackBuffer(scrollDirection, MIN_BUFFER);
  const minBufferPageTop = Math.max(pageTop - minBackBuffer, 0);
  const minBufferHeight = Math.min(qHeight + MIN_BUFFER, layoutService.size.y - minBufferPageTop);
  const minBufferEndTop = minBufferPageTop + minBufferHeight;

  const minBufferPages = getPages({
    startTop: minBufferPageTop,
    endTop: minBufferEndTop,
    qLeft,
    qWidth,
    pageInfo,
    measureData,
  });

  const firstMinBufferPage = minBufferPages.at(0);
  // TODO also check for forward scroll
  if (firstMinBufferPage && firstMinBufferPage.qTop > 0) {
    const maxBufferStart =
      scrollDirection.current === ScrollDirection.Backward
        ? Math.max(0, minBufferPageTop - MAX_BUFFER)
        : minBufferEndTop;

    const maxBufferEnd = Math.min(maxBufferStart + MAX_BUFFER, layoutService.size.y - maxBufferStart);
    console.log("%c maxBufferStart", "color: orangered", { maxBufferStart, maxBufferEnd });

    const maxBufferPages = getPages({
      startTop: maxBufferStart,
      endTop: maxBufferEnd,
      qLeft,
      qWidth,
      pageInfo,
      measureData,
    });

    return [...minBufferPages, ...maxBufferPages];
  }

  return minBufferPages;
};

export default getRowPages;
