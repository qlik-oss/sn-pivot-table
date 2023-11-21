/*  eslint-disable no-param-reassign */
import { throttler } from "qlik-chart-modules";
import { useCallback } from "react";
import { type GridOnItemsRenderedProps } from "react-window";
import type { DataModel, LayoutService, MeasureData, PageInfo, ViewService } from "../../../types/types";
import useScrollDirection, { ScrollDirection } from "../use-scroll-direction";
import getColumnPages from "./utils/get-column-pages";
import getRowPages from "./utils/get-row-pages";

type FetchModeData = (
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

type Props = {
  viewService: ViewService;
  layoutService: LayoutService;
  dataModel: DataModel;
  measureData: MeasureData;
  pageInfo: PageInfo;
};

const BUFFER = 25;

const getBuffers = (scrollDir: React.MutableRefObject<ScrollDirection>) => ({
  forwardBuffer: scrollDir.current === ScrollDirection.Forward ? BUFFER : 0,
  backBuffer: scrollDir.current === ScrollDirection.Back ? BUFFER : 0,
});

const throttledFetchPages: FetchModeData = throttler(
  async (
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
  },
  100,
);

const useItemsRenderedHandler = ({ viewService, dataModel, measureData, layoutService, pageInfo }: Props) => {
  const { scrollHandler, verticalScrollDirection, horizontalScrollDirection } = useScrollDirection();

  /**
   * react-window callback that is called when the range of items rendered by the VariableSizeGrid changes.
   *
   * It's intended to handle the following scenarions that might require additional data to be fetch:
   * - Scrolling
   * - Re-sizing the chart
   * - Theme change (ex: go from large font-size to small could change the number of rendered cells)
   */
  const onItemsRenderedHandler = useCallback(
    async ({
      overscanColumnStartIndex,
      overscanColumnStopIndex,
      overscanRowStartIndex,
      overscanRowStopIndex,
      visibleColumnStartIndex,
    }: GridOnItemsRenderedProps) => {
      viewService.gridColumnStartIndex = visibleColumnStartIndex;
      viewService.gridRowStartIndex = overscanRowStartIndex;
      viewService.gridWidth = overscanColumnStopIndex - overscanColumnStartIndex + 1;
      viewService.gridHeight = overscanRowStopIndex - overscanRowStartIndex + 1;

      await throttledFetchPages(
        dataModel,
        layoutService,
        measureData,
        pageInfo,
        overscanColumnStartIndex,
        overscanColumnStopIndex,
        overscanRowStartIndex,
        overscanRowStopIndex,
        verticalScrollDirection,
        horizontalScrollDirection,
      );
    },
    [viewService, layoutService, dataModel, measureData, verticalScrollDirection, horizontalScrollDirection, pageInfo],
  );

  return {
    scrollHandler,
    onItemsRenderedHandler,
  };
};

export default useItemsRenderedHandler;
