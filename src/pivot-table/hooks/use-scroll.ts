import { useCallback, useLayoutEffect, useRef } from "react";
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
    horizontalScrollableContainerRef?: HTMLDivElement;
  };
}

const useScroll = ({ layoutService, pageInfo, mockedRefs }: Props) => {
  const verticalScrollableContainerRef = useRef<HTMLDivElement>(mockedRefs?.verticalScrollableContainerRef ?? null);
  const horizontalScrollableContainerRef = useRef<HTMLDivElement>(mockedRefs?.horizontalScrollableContainerRef ?? null);
  const topGridRef = useRef<VariableSizeList[]>(mockedRefs?.topGridRef ?? []);
  const leftGridRef = useRef<VariableSizeList[]>(mockedRefs?.leftGridRef ?? []);
  const dataGridRef = useRef<VariableSizeGrid>(mockedRefs?.dataGridRef ?? null);
  const currentScrollLeft = useRef<number>(0);
  const currentScrollTop = useRef<number>(0);

  const getScrollLeft = useCallback(() => currentScrollLeft.current, [currentScrollLeft]);
  const getScrollTop = useCallback(() => currentScrollTop.current, [currentScrollTop]);

  // If the layout change reset the scroll position, except if the layout
  // change because a node was expanded or collapsed
  useLayoutEffect(() => {
    if (!layoutService.layout.qHyperCube.qLastExpandedPos) {
      if (horizontalScrollableContainerRef.current) {
        horizontalScrollableContainerRef.current.scrollLeft = 0;
      }

      if (verticalScrollableContainerRef.current) {
        verticalScrollableContainerRef.current.scrollTop = 0;
      }
    }
  }, [layoutService]);

  // Reset scroll position when page has changed
  useLayoutEffect(() => {
    if (horizontalScrollableContainerRef.current) {
      horizontalScrollableContainerRef.current.scrollLeft = 0;
    }

    if (verticalScrollableContainerRef.current) {
      verticalScrollableContainerRef.current.scrollTop = 0;
    }
  }, [pageInfo.page]);

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
    horizontalScrollableContainerRef,
    dataGridRef,
    leftGridRef,
    topGridRef,
  };
};

export default useScroll;
