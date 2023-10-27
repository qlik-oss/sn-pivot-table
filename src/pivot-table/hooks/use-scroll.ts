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
  const [verticalScrollbarWidth, setVerticalScrollbarWidth] = useState<number>(0);
  const [horizontalScrollbarHeight, setHorizontalScrollbarHeight] = useState<number>(0);

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

  const horizontalScrollbarHeightSetter = useCallback(
    (shouldResetHeight?: boolean) => {
      if (shouldResetHeight) {
        setHorizontalScrollbarHeight(0);
        return;
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
    },
    [setHorizontalScrollbarHeight],
  );

  // get vertical/horizontal scrollbar width/height
  useLayoutEffect(() => {
    if (verticalScrollableContainerRef.current) {
      const el = verticalScrollableContainerRef.current;
      const w = el.offsetWidth - el.clientWidth;
      setVerticalScrollbarWidth(w);
    }

    horizontalScrollbarHeightSetter();
  }, [horizontalScrollbarHeightSetter]);

  useLayoutEffect(() => {
    // Call scrollTo here so that when a cell is expanded or collapsed, scroll to the last known position.
    // Otherwise it will be out-of-sync with the data grid.
    if (layoutService.layout.qHyperCube.qLastExpandedPos) {
      const scrollLeft = leftGridHorizontalScrollableContainerRef.current?.scrollLeft ?? 0;
      const scrollTop = verticalScrollableContainerRef.current?.scrollTop ?? 0;

      leftGridRef.current?.forEach((list) => list?.scrollTo(scrollTop));
      topGridRef.current?.forEach((list) => list?.scrollTo(scrollLeft));
    }
  }, [layoutService]);

  const onHorizontalScrollHandler = (evt: React.SyntheticEvent) => {
    if (!(evt.target instanceof HTMLDivElement)) return;

    if (evt.target.dataset["key"] === `scrollable-container--${ScrollableContainerOrigin.DATA_GRID}`) {
      topGridRef.current?.forEach((list) => list?.scrollTo(evt.currentTarget.scrollLeft));

      dataGridRef.current?.scrollTo({
        scrollLeft: evt.currentTarget.scrollLeft,
      });
    }
  };

  const onVerticalScrollHandler = (evt: React.SyntheticEvent) => {
    if (!(evt.target instanceof HTMLDivElement)) return;

    leftGridRef.current?.filter(Boolean).forEach((list) => list.scrollTo(evt.currentTarget.scrollTop));

    dataGridRef.current?.scrollTo({
      scrollTop: evt.currentTarget.scrollTop,
    });
  };

  return {
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
    horizontalScrollbarHeightSetter,
  };
};

export default useScroll;
