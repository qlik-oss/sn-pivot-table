import {
  ScrollDirection,
  type LayoutService,
  type MeasureData,
  type PageInfo,
  type ViewService,
} from "../../../../types/types";
import { MAX_BUFFER, MIN_BUFFER } from "../constants";
import getBackBuffer from "./get-back-buffer";

type GetColumnPages = {
  pageInfo: PageInfo;
  measureData: MeasureData;
  viewService: ViewService;
  scrollDirection: React.MutableRefObject<ScrollDirection>;
  layoutService: LayoutService;
};

type GetPages = {
  pageInfo: PageInfo;
  measureData: MeasureData;
  pageTop: number;
  qHeight: number;
  startLeft: number;
  endLeft: number;
};

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

const getPages = ({ pageInfo, measureData, pageTop, qHeight, startLeft, endLeft }: GetPages) => {
  const pages = [];
  const currentPageMinTop = pageInfo.page * pageInfo.rowsPerPage;

  for (let left = startLeft; left < endLeft; left++) {
    if (isMissingColumnData(measureData, left, pageTop, qHeight)) {
      const prevPage = pages[pages.length - 1] as EngineAPI.INxPage | undefined;
      const page = {
        qLeft: left,
        qTop: pageTop + currentPageMinTop,
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

const getColumnPages = ({ pageInfo, measureData, scrollDirection, layoutService, viewService }: GetColumnPages) => {
  const { gridColumnStartIndex, gridRowStartIndex, gridWidth, gridHeight } = viewService;
  const columnEndIndex = layoutService.size.x;
  const minBackBuffer = getBackBuffer(scrollDirection, MIN_BUFFER);
  const minBufferStartLeft = Math.max(gridColumnStartIndex - minBackBuffer, 0);
  const minBufferWidth = Math.min(gridWidth + MIN_BUFFER, columnEndIndex - minBufferStartLeft);
  const minBufferEndLeft = minBufferStartLeft + minBufferWidth;

  const minBufferPages = getPages({
    pageInfo,
    measureData,
    startLeft: minBufferStartLeft,
    endLeft: minBufferEndLeft,
    pageTop: gridRowStartIndex,
    qHeight: gridHeight,
  });

  const shouldFetchMaxBuffer = minBufferPages.length > 0;

  if (shouldFetchMaxBuffer) {
    const maxBufferStart =
      scrollDirection.current === ScrollDirection.Backward
        ? Math.max(0, minBufferStartLeft - MAX_BUFFER)
        : minBufferEndLeft;

    const maxBufferEnd = Math.min(maxBufferStart + MAX_BUFFER, columnEndIndex);

    const maxBufferPages = getPages({
      pageInfo,
      measureData,
      startLeft: maxBufferStart,
      endLeft: maxBufferEnd,
      pageTop: gridRowStartIndex,
      qHeight: gridHeight,
    });

    console.log("%c fetching column max buffer", "color: lime", {
      maxBufferStart,
      maxBufferEnd,
      size: maxBufferEnd - maxBufferStart,
      maxBufferPages,
      minBufferPages,
    });

    return [...minBufferPages, ...maxBufferPages];
  }

  return minBufferPages;
};

export default getColumnPages;
