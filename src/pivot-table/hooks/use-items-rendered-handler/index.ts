/*  eslint-disable no-param-reassign */
import { useCallback } from "react";
import { type GridOnItemsRenderedProps } from "react-window";
import type { DataModel, LayoutService, MeasureData, PageInfo, ViewService } from "../../../types/types";
import { ScrollDirection } from "../../../types/types";
import { BUFFER, debouncedFetchPages, throttledFetchPages } from "./utils/fetch-pages";

type Props = {
  viewService: ViewService;
  layoutService: LayoutService;
  dataModel: DataModel;
  measureData: MeasureData;
  pageInfo: PageInfo;
  leftColumnCount: number;
  topRowCount: number;
  verticalScrollDirection: React.MutableRefObject<ScrollDirection>;
  horizontalScrollDirection: React.MutableRefObject<ScrollDirection>;
};

const DEBOUNCED_GRID_SIZE_THRESHOLD = 1500;

const useItemsRenderedHandler = ({
  viewService,
  dataModel,
  measureData,
  layoutService,
  pageInfo,
  leftColumnCount,
  topRowCount,
  verticalScrollDirection,
  horizontalScrollDirection,
}: Props) =>
  /**
   * react-window callback that is called when the range of items rendered by the VariableSizeGrid changes.
   *
   * It's intended to handle the following scenarions that might require additional data to be fetch:
   * - Scrolling
   * - Re-sizing the chart
   * - Theme change (ex: go from large font-size to small could change the number of rendered cells)
   */
  useCallback(
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

      const estimatedWidth =
        viewService.gridWidth +
        leftColumnCount +
        (horizontalScrollDirection.current === ScrollDirection.None ? 0 : BUFFER);
      const estimatedHeight =
        viewService.gridHeight + topRowCount + (verticalScrollDirection.current === ScrollDirection.None ? 0 : BUFFER);

      /**
       * A throttled fetch gives the best user experience as it reduces the number of empty cells the
       * user sees. The debounced fetch greatly improves performance at the cost of the user experience.
       *
       * This is a control mechanism that allows us to tweak where the user experience vs performance
       * threshold should be.
       */
      let throttledOrDebouncedFetchPages = throttledFetchPages;
      if (estimatedHeight * estimatedWidth > DEBOUNCED_GRID_SIZE_THRESHOLD) {
        throttledOrDebouncedFetchPages = debouncedFetchPages;
      }

      await throttledOrDebouncedFetchPages(
        dataModel,
        layoutService,
        measureData,
        pageInfo,
        viewService,
        verticalScrollDirection,
        horizontalScrollDirection,
      );
    },
    [
      viewService,
      layoutService,
      dataModel,
      measureData,
      verticalScrollDirection,
      horizontalScrollDirection,
      pageInfo,
      leftColumnCount,
      topRowCount,
    ],
  );
export default useItemsRenderedHandler;
