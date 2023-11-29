import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { VariableSizeGrid, VariableSizeList } from "react-window";
import {
  ScrollDirection,
  ScrollableContainerOrigin,
  type LayoutService,
  type PageInfo,
  type Rect,
} from "../../types/types";
import { useBaseContext } from "../contexts/BaseProvider";

interface Props {
  layoutService: LayoutService;
  pageInfo: PageInfo;
  tableRect: Rect;
  mockedRefs?: {
    topGridRef?: VariableSizeList<unknown>[];
    leftGridRef?: VariableSizeList<unknown>[];
    dataGridRef?: VariableSizeGrid<unknown>;
    verticalScrollableContainerRef?: HTMLDivElement;
    leftGridHorizontalScrollableContainerRef?: HTMLDivElement;
    dataGridHorizontalScrollableContainerRef?: HTMLDivElement;
  };
}

const getScrollDirection = (scroll: number, prevScroll: number) => {
  if (scroll > prevScroll) {
    return ScrollDirection.Forward;
  }

  if (scroll < prevScroll) {
    return ScrollDirection.Backward;
  }

  return ScrollDirection.None;
};

const useScroll = ({ layoutService, pageInfo, tableRect, mockedRefs }: Props) => {
  const { theme } = useBaseContext();
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
  const prevScrollLeft = useRef(0);
  const prevScrollTop = useRef(0);
  const vScrollDirection = useRef(ScrollDirection.None);
  const hScrollDirection = useRef(ScrollDirection.None);
  const [verticalScrollbarWidth, setVerticalScrollbarWidth] = useState<number>(0);
  const [horizontalScrollbarHeight, setHorizontalScrollbarHeight] = useState<number>(0);
  const themeName = theme.name();

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

  // Call scrollTo here so that when a cell is expanded or collapsed, scroll to the last known position.
  // Otherwise it will be out-of-sync with the data grid.
  useLayoutEffect(() => {
    if (layoutService.layout.qHyperCube.qLastExpandedPos) {
      const scrollLeft = dataGridHorizontalScrollableContainerRef.current?.scrollLeft ?? 0;
      const scrollTop = verticalScrollableContainerRef.current?.scrollTop ?? 0;

      leftGridRef.current?.forEach((list) => list?.scrollTo(scrollTop));
      topGridRef.current?.forEach((list) => list?.scrollTo(scrollLeft));
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
  }, [horizontalScrollbarHeightSetter, layoutService, tableRect.width, tableRect.height, themeName]);

  const onHorizontalScrollHandler = (evt: React.SyntheticEvent) => {
    if (!(evt.target instanceof HTMLDivElement)) return;

    if (evt.target.dataset["key"] === `scrollable-container--${ScrollableContainerOrigin.DATA_GRID}`) {
      hScrollDirection.current = getScrollDirection(evt.currentTarget.scrollLeft, prevScrollLeft.current);
      prevScrollLeft.current = evt.currentTarget.scrollLeft;

      topGridRef.current?.forEach((list) => list?.scrollTo(evt.currentTarget.scrollLeft));

      dataGridRef.current?.scrollTo({
        scrollLeft: evt.currentTarget.scrollLeft,
      });
    }
  };

  const onVerticalScrollHandler = (evt: React.SyntheticEvent) => {
    if (!(evt.target instanceof HTMLDivElement)) return;

    vScrollDirection.current = getScrollDirection(evt.currentTarget.scrollTop, prevScrollTop.current);
    prevScrollTop.current = evt.currentTarget.scrollTop;

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
    verticalScrollDirection: vScrollDirection,
    horizontalScrollDirection: hScrollDirection,
  };
};

export default useScroll;
