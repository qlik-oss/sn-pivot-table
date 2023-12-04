import type { LayoutService, MeasureData, PageInfo, ScrollDirection } from "../../../../types/types";
import { MIN_BUFFER } from "../constants";
import getBackBuffer from "./get-back-buffer";

type GetColumnPages = {
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

  for (let left = startLeft; left < endLeft; left++) {
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

const getColumnPages = ({
  pageInfo,
  measureData,
  scrollDirection,
  layoutService,
  qLeft,
  pageTop,
  qWidth,
  qHeight,
}: GetColumnPages) => {
  const minBackBuffer = getBackBuffer(scrollDirection, MIN_BUFFER);
  const minBufferStartLeft = Math.max(qLeft - minBackBuffer, 0);
  const minBufferWidth = Math.min(qWidth + MIN_BUFFER, layoutService.size.x - minBufferStartLeft);

  const pages = getPages({
    pageInfo,
    measureData,
    startLeft: minBufferStartLeft,
    endLeft: minBufferStartLeft + minBufferWidth,
    pageTop,
    qHeight,
  });

  // for (let left = qLeft; left < qLeft + qWidth; left++) {
  //   if (isMissingColumnData(measureData, left, pageTop, qHeight)) {
  //     const prevPage = pages[pages.length - 1] as EngineAPI.INxPage | undefined;
  //     const page = {
  //       qLeft: left,
  //       qTop: Math.max(0, pageTop + pageInfo.page * pageInfo.rowsPerPage),
  //       qWidth: 1,
  //       qHeight,
  //     };

  //     if (prevPage !== undefined && canMergePages(prevPage, page)) {
  //       prevPage.qWidth += page.qWidth;
  //     } else {
  //       pages.push(page);
  //     }
  //   }
  // }
  console.log("%c getColumnPages", "color: orangered", pages);
  return pages;
};

export default getColumnPages;
