import { debouncer, throttler } from "qlik-chart-modules";
import type { DataModel, LayoutService, MeasureData, PageInfo, ViewService } from "../../../../types/types";
import { ScrollDirection } from "../../use-scroll-direction";
import getColumnPages from "./get-column-pages";
import getRowPages from "./get-row-pages";

type FetchPages = (
  dataModel: DataModel,
  layoutService: LayoutService,
  measureData: MeasureData,
  pageInfo: PageInfo,
  viewService: ViewService,
  verticalScrollDirection: React.MutableRefObject<ScrollDirection>,
  horizontalScrollDirection: React.MutableRefObject<ScrollDirection>,
) => Promise<void>;

export const BUFFER = 25;

const fetchPages = async (
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
    const backBuffer = verticalScrollDirection.current === ScrollDirection.Back ? BUFFER : 0;
    const rowStartIndex = Math.max(gridRowStartIndex - backBuffer, 0);

    rowPages = getRowPages(
      pageInfo,
      measureData,
      gridColumnStartIndex,
      rowStartIndex,
      gridWidth,
      Math.min(gridHeight + BUFFER, layoutService.size.y - rowStartIndex),
    );
  }

  if (horizontalScrollDirection.current !== ScrollDirection.None) {
    const backBuffer = horizontalScrollDirection.current === ScrollDirection.Back ? BUFFER : 0;
    const columnStartIndex = Math.max(gridColumnStartIndex - backBuffer, 0);

    columnsPages = getColumnPages(
      measureData,
      columnStartIndex,
      gridRowStartIndex,
      Math.min(gridWidth + BUFFER, layoutService.size.x - columnStartIndex),
      gridHeight,
    );
  }

  await dataModel.fetchPages([...rowPages, ...columnsPages]);
};

export const throttledFetchPages: FetchPages = throttler(fetchPages, 100);
export const debouncedFetchPages: FetchPages = debouncer(fetchPages, 75);
