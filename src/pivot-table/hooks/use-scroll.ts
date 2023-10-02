import { useCallback, useLayoutEffect, useRef } from "react";
import type { VariableSizeGrid, VariableSizeList } from "react-window";
import type { LayoutService, PageInfo } from "../../types/types";

interface Props {
  layoutService: LayoutService;
  pageInfo: PageInfo;
  mockedRefs?: {
    topGridRef?: VariableSizeList<unknown>[];
    leftGridRef?: VariableSizeList<unknown>[];
    dataGridRef?: VariableSizeGrid<unknown>;
    scrollableContainerRef?: HTMLDivElement;
  };
}

const useScroll = ({ layoutService, pageInfo, mockedRefs }: Props) => {
  const scrollableContainerRef = useRef<HTMLDivElement>(mockedRefs?.scrollableContainerRef ?? null);
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
      if (scrollableContainerRef.current) {
        scrollableContainerRef.current.scrollLeft = 0;
        scrollableContainerRef.current.scrollTop = 0;
      }
    }
  }, [layoutService]);

  // Reset scroll position when page has changed
  useLayoutEffect(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollLeft = 0;
      scrollableContainerRef.current.scrollTop = 0;
    }
  }, [pageInfo.page]);

  const onScrollHandler = (event: React.SyntheticEvent) => {
    if (topGridRef.current) {
      topGridRef.current.forEach((list) => list?.scrollTo(event.currentTarget.scrollLeft));
    }

    if (leftGridRef.current) {
      leftGridRef.current.forEach((list) => list?.scrollTo(event.currentTarget.scrollTop));
    }

    if (dataGridRef.current) {
      dataGridRef.current.scrollTo({
        scrollLeft: event.currentTarget.scrollLeft,
        scrollTop: event.currentTarget.scrollTop,
      });
    }

    if (currentScrollLeft.current !== undefined) {
      // Set scrollLeft here so that when a top grid is expanded with a new row, scroll that row to scrollLeft position.
      // Otherwise it will be out-of-sync with the other rows.
      currentScrollLeft.current = event.currentTarget.scrollLeft;
    }

    if (currentScrollTop.current !== undefined) {
      // Set scrollTop here so that when a left grid is expanded with a new column, scroll that row to scrollTop position.
      // Otherwise it will be out-of-sync with the other columns.
      currentScrollTop.current = event.currentTarget.scrollTop;
    }
  };

  return {
    getScrollLeft,
    getScrollTop,
    onScrollHandler,
    scrollableContainerRef,
    dataGridRef,
    leftGridRef,
    topGridRef,
  };
};

export default useScroll;
