/*  eslint-disable no-param-reassign */
import { useCallback } from "react";
import { type GridOnItemsRenderedProps } from "react-window";
import type { DataModel, LayoutService, MeasureData, PageInfo, ViewService } from "../../../types/types";
import useScrollDirection from "../use-scroll-direction";
import { debouncedFetchPages, throttledFetchPages } from "./utils/fetch-pages";

type Props = {
  viewService: ViewService;
  layoutService: LayoutService;
  dataModel: DataModel;
  measureData: MeasureData;
  pageInfo: PageInfo;
};

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

      let throttledOrDebouncedFetchPages = throttledFetchPages;
      if (viewService.gridWidth * viewService.gridHeight > 1500) {
        console.log("%c debouncedFetchPages", "color: orangered", viewService.gridWidth * viewService.gridHeight);
        throttledOrDebouncedFetchPages = debouncedFetchPages;
      }

      await throttledOrDebouncedFetchPages(
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
