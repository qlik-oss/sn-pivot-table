import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { VariableSizeGrid, VariableSizeList } from "react-window";
import { ScrollableContainerOrigin, type LayoutService, type PageInfo } from "../../types/types";

interface Props {
  layoutService: LayoutService;
  pageInfo: PageInfo;
  mockedRefs?: {
    topGridRef?: VariableSizeList<unknown>[];
    leftGridRef?: VariableSizeList<unknown>[];
    dataGridRef?: VariableSizeGrid<unknown>;
    verticalScrollableContainerRef?: HTMLDivElement;
    leftGridHorizontalScrollableContainerRef?: HTMLDivElement;
    dataGridHorizontalScrollableContainerRef?: HTMLDivElement;
  };
}

const useScroll = ({ layoutService, pageInfo, mockedRefs }: Props) => {
  const verticalScrollableContainerRef = useRef<HTMLDivElement>(mockedRefs?.verticalScrollableContainerRef ?? null);
  const leftGridHorizontalScrollableContainerRef = useRef<HTMLDivElement>(
    mockedRefs?.leftGridHorizontalScrollableContainerRef ?? null,
  );
  const dataGridHorizontalScrollableContainerRef = useRef<HTMLDivElement>(
    mockedRefs?.dataGridHorizontalScrollableContainerRef ?? null,
  );
  const topGridRef = useRef<VariableSizeList[]>(mockedRefs?.topGridRef ?? []);
  const leftGridRef = useRef<VariableSizeList[]>(mockedRefs?.leftGridRef ?? []);
  const dataGridRef = useRef<VariableSizeGrid>(mockedRefs?.dataGridRef ?? null);
  const currentScrollLeft = useRef<number>(0);
  const currentScrollTop = useRef<number>(0);
  const [verticalScrollbarWidth, setVerticalScrollbarWidth] = useState<number>(0);
  const [horizontalScrollbarHeight, setHorizontalScrollbarHeight] = useState<number>(0);

  const getScrollLeft = useCallback(() => currentScrollLeft.current, [currentScrollLeft]);
  const getScrollTop = useCallback(() => currentScrollTop.current, [currentScrollTop]);

  // If the layout change reset the scroll position, except if the layout
  // change because a node was expanded or collapsed
  useLayoutEffect(() => {
    if (!layoutService.layout.qHyperCube.qLastExpandedPos) {
      if (leftGridHorizontalScrollableContainerRef.current) {
        leftGridHorizontalScrollableContainerRef.current.scrollLeft = 0;
      }

      if (dataGridHorizontalScrollableContainerRef.current) {
        dataGridHorizontalScrollableContainerRef.current.scrollLeft = 0;
      }

      if (verticalScrollableContainerRef.current) {
        verticalScrollableContainerRef.current.scrollTop = 0;
      }
    }
  }, [layoutService]);

  // Reset scroll position when page has changed
  useLayoutEffect(() => {
    if (leftGridHorizontalScrollableContainerRef.current) {
      leftGridHorizontalScrollableContainerRef.current.scrollLeft = 0;
    }

    if (dataGridHorizontalScrollableContainerRef.current) {
      dataGridHorizontalScrollableContainerRef.current.scrollLeft = 0;
    }

    if (verticalScrollableContainerRef.current) {
      verticalScrollableContainerRef.current.scrollTop = 0;
    }
  }, [pageInfo.page]);

  // get vertical/horizontal scrollbar width/height
  useLayoutEffect(() => {
    if (verticalScrollableContainerRef.current) {
      const el = verticalScrollableContainerRef.current;
      const w = el.offsetWidth - el.clientWidth;
      setVerticalScrollbarWidth(w);
    }

    let maxScrollbarHeight = 0;
    if (leftGridHorizontalScrollableContainerRef.current) {
      const el = leftGridHorizontalScrollableContainerRef.current;
      maxScrollbarHeight = Math.max(maxScrollbarHeight, el.offsetHeight - el.clientHeight);
    }
    if (dataGridHorizontalScrollableContainerRef.current) {
      const el = dataGridHorizontalScrollableContainerRef.current;
      maxScrollbarHeight = Math.max(maxScrollbarHeight, el.offsetHeight - el.clientHeight);
    }
    setHorizontalScrollbarHeight(maxScrollbarHeight);
  }, []);

  const onHorizontalScrollHandler = (evt: React.SyntheticEvent) => {
    if (!(evt.target instanceof HTMLDivElement)) return;

    if (evt.target.dataset["key"] === `scrollable-container--${ScrollableContainerOrigin.DATA_GRID}`) {
      if (topGridRef.current) {
        topGridRef.current.forEach((list) => list?.scrollTo(evt.currentTarget.scrollLeft));
      }

      if (dataGridRef.current) {
        dataGridRef.current.scrollTo({
          scrollLeft: evt.currentTarget.scrollLeft,
        });
      }

      if (currentScrollLeft.current !== undefined) {
        // Set scrollLeft here so that when a top grid is expanded with a new row, scroll that row to scrollLeft position.
        // Otherwise it will be out-of-sync with the other rows.
        currentScrollLeft.current = evt.currentTarget.scrollLeft;
      }
    }
  };

  const onVerticalScrollHandler = (evt: React.SyntheticEvent) => {
    if (!(evt.target instanceof HTMLDivElement)) return;

    if (leftGridRef.current) {
      leftGridRef.current.forEach((list) => list.scrollTo(evt.currentTarget.scrollTop));
    }

    if (dataGridRef.current) {
      dataGridRef.current.scrollTo({
        scrollTop: evt.currentTarget.scrollTop,
      });
    }

    if (currentScrollTop.current !== undefined) {
      // Set scrollTop here so that when a left grid is expanded with a new column, scroll that row to scrollTop position.
      // Otherwise it will be out-of-sync with the other columns.
      currentScrollTop.current = evt.currentTarget.scrollTop;
    }
  };

  return {
    getScrollLeft,
    getScrollTop,
    onHorizontalScrollHandler,
    onVerticalScrollHandler,
    verticalScrollableContainerRef,
    leftGridHorizontalScrollableContainerRef,
    dataGridHorizontalScrollableContainerRef,
    dataGridRef,
    leftGridRef,
    topGridRef,
    verticalScrollbarWidth,
    horizontalScrollbarHeight,
    setHorizontalScrollbarHeight,
  };
};

export default useScroll;
