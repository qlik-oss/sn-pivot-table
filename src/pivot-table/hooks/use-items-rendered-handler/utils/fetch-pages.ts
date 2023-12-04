import { debouncer, throttler } from "qlik-chart-modules";
import type { DataModel, LayoutService, MeasureData, PageInfo, ViewService } from "../../../../types/types";
import { ScrollDirection } from "../../../../types/types";
import { MIN_BUFFER } from "../constants";
import getColumnPages from "./get-column-pages";
import getRowPages, { getPages } from "./get-row-pages";

type FetchPages = (
  dataModel: DataModel,
  layoutService: LayoutService,
  measureData: MeasureData,
  pageInfo: PageInfo,
  viewService: ViewService,
  verticalScrollDirection: React.MutableRefObject<ScrollDirection>,
  horizontalScrollDirection: React.MutableRefObject<ScrollDirection>,
) => Promise<void>;

const getBackBuffer = (dir: React.MutableRefObject<ScrollDirection>) =>
  dir.current === ScrollDirection.Backward ? MIN_BUFFER : 0;

export const fetchPages = async (
  dataModel: DataModel,
  layoutService: LayoutService,
  measureData: MeasureData,
  pageInfo: PageInfo,
  viewService: ViewService,
  verticalScrollDirection: React.MutableRefObject<ScrollDirection>,
  horizontalScrollDirection: React.MutableRefObject<ScrollDirection>,
) => {
  const { gridColumnStartIndex, gridRowStartIndex, gridWidth, gridHeight } = viewService;
  let rowPages: EngineAPI.INxPage[] = [];
  let columnsPages: EngineAPI.INxPage[] = [];

  if (verticalScrollDirection.current !== ScrollDirection.None) {
    // const backBuffer = getBackBuffer(verticalScrollDirection);
    // const rowStartIndex = Math.max(gridRowStartIndex - backBuffer, 0);

    rowPages = getRowPages({
      layoutService,
      pageInfo,
      measureData,
      scrollDirection: verticalScrollDirection,
      qLeft: gridColumnStartIndex,
      pageTop: gridRowStartIndex,
      qWidth: gridWidth,
      qHeight: gridHeight,
    });

    // rowPages = getRowPages(
    //   pageInfo,
    //   measureData,
    //   gridColumnStartIndex,
    //   rowStartIndex,
    //   gridWidth,
    //   Math.min(gridHeight + MIN_BUFFER, layoutService.size.y - rowStartIndex),
    // );
  }

  if (horizontalScrollDirection.current !== ScrollDirection.None) {
    // const backBuffer = getBackBuffer(horizontalScrollDirection);
    // const columnStartIndex = Math.max(gridColumnStartIndex - backBuffer, 0);

    columnsPages = getColumnPages({
      pageInfo,
      measureData,
      scrollDirection: horizontalScrollDirection,
      layoutService,
      qLeft: gridColumnStartIndex,
      pageTop: gridRowStartIndex,
      qWidth: gridWidth,
      qHeight: gridHeight,
    });

    // columnsPages = getColumnPages(
    //   pageInfo,
    //   measureData,
    //   columnStartIndex,
    //   gridRowStartIndex,
    //   Math.min(gridWidth + MIN_BUFFER, layoutService.size.x - columnStartIndex),
    //   gridHeight,
    // );
  }

  // A chart have been re-size which have triggered a onScroll event and reset both scroll directions
  if (
    verticalScrollDirection.current === ScrollDirection.None &&
    horizontalScrollDirection.current === ScrollDirection.None
  ) {
    rowPages = getPages({
      pageInfo,
      measureData,
      qLeft: gridColumnStartIndex,
      qWidth: gridWidth,
      startTop: gridRowStartIndex,
      endTop: Math.min(gridRowStartIndex + gridHeight, layoutService.size.y - gridRowStartIndex),
    });
  }

  await dataModel.fetchPages([...rowPages, ...columnsPages]);
};

export const throttledFetchPages: FetchPages = throttler(fetchPages, 100);
export const debouncedFetchPages: FetchPages = debouncer(fetchPages, 75);
