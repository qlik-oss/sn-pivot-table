import { debouncer, throttler } from "qlik-chart-modules";
import type { DataModel, LayoutService, MeasureData, PageInfo } from "../../../../types/types";
import { ScrollDirection } from "../../use-scroll-direction";
import getColumnPages from "./get-column-pages";
import getRowPages from "./get-row-pages";

type FetchPages = (
  dataModel: DataModel,
  layoutService: LayoutService,
  measureData: MeasureData,
  pageInfo: PageInfo,
  overscanColumnStartIndex: number,
  overscanColumnStopIndex: number,
  overscanRowStartIndex: number,
  overscanRowStopIndex: number,
  verticalScrollDirection: React.MutableRefObject<ScrollDirection>,
  horizontalScrollDirection: React.MutableRefObject<ScrollDirection>,
) => Promise<void>;

const BUFFER = 25;

const getBuffers = (scrollDir: React.MutableRefObject<ScrollDirection>) => ({
  forwardBuffer: scrollDir.current === ScrollDirection.Forward ? BUFFER : 0,
  backBuffer: scrollDir.current === ScrollDirection.Back ? BUFFER : 0,
});

const fetchPages = async (
  dataModel: DataModel,
  layoutService: LayoutService,
  measureData: MeasureData,
  pageInfo: PageInfo,
  overscanColumnStartIndex: number,
  overscanColumnStopIndex: number,
  overscanRowStartIndex: number,
  overscanRowStopIndex: number,
  verticalScrollDirection: React.MutableRefObject<ScrollDirection>,
  horizontalScrollDirection: React.MutableRefObject<ScrollDirection>,
) => {
  let rowPages: EngineAPI.INxPage[] = [];
  let columnsPages: EngineAPI.INxPage[] = [];
  const qLeft = overscanColumnStartIndex;
  const qTop = overscanRowStartIndex;
  const qWidth = overscanColumnStopIndex - overscanColumnStartIndex + 1;
  const qHeight = overscanRowStopIndex - overscanRowStartIndex + 1;

  if (verticalScrollDirection.current !== ScrollDirection.None) {
    const { forwardBuffer, backBuffer } = getBuffers(verticalScrollDirection);
    const top = Math.max(qTop - backBuffer, 0);

    rowPages = getRowPages(
      pageInfo,
      measureData,
      qLeft,
      top,
      qWidth,
      Math.min(qHeight + forwardBuffer + backBuffer, layoutService.size.y - top),
    );
  }

  if (horizontalScrollDirection.current !== ScrollDirection.None) {
    const { forwardBuffer, backBuffer } = getBuffers(horizontalScrollDirection);
    const left = Math.max(qLeft - backBuffer, 0);

    columnsPages = getColumnPages(
      measureData,
      left,
      qTop,
      Math.min(qWidth + forwardBuffer + backBuffer, layoutService.size.x - left),
      qHeight,
    );
  }

  await dataModel.fetchPages([...rowPages, ...columnsPages]);
};

export const throttledFetchPages: FetchPages = throttler(fetchPages, 100);
export const debouncedFetchPages: FetchPages = debouncer(fetchPages, 75);
