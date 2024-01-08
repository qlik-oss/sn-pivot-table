import { debouncer, throttler } from "qlik-chart-modules";
import type { DataModel, LayoutService, MeasureData, PageInfo, ViewService } from "../../../../types/types";
import { ScrollDirection } from "../../../../types/types";
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
    rowPages = getRowPages({
      pageInfo,
      measureData,
      scrollDirection: verticalScrollDirection,
      viewService,
    });
  }

  if (horizontalScrollDirection.current !== ScrollDirection.None) {
    columnsPages = getColumnPages({
      pageInfo,
      measureData,
      scrollDirection: horizontalScrollDirection,
      layoutService,
      viewService,
    });
  }

  // A chart have been re-size which have triggered a onScroll event and reset both scroll directions
  if (
    verticalScrollDirection.current === ScrollDirection.None &&
    horizontalScrollDirection.current === ScrollDirection.None
  ) {
    rowPages = getPages({
      measureData,
      pageInfo,
      qLeft: gridColumnStartIndex,
      qWidth: gridWidth,
      startTop: gridRowStartIndex,
      endTop: gridRowStartIndex + gridHeight,
    });
  }

  await dataModel.fetchPages([...rowPages, ...columnsPages]);
};

export const throttledFetchPages: FetchPages = throttler(fetchPages, 100);
export const debouncedFetchPages: FetchPages = debouncer(fetchPages, 75);
