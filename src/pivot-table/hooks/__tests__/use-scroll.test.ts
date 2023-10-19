/* eslint-disable @typescript-eslint/unbound-method */
import { renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { act } from "react-dom/test-utils";
import type { VariableSizeGrid, VariableSizeList } from "react-window";
import { ScrollableContainerOrigin, type LayoutService, type PageInfo } from "../../../types/types";
import useScroll from "../use-scroll";

describe("useScroll", () => {
  let layoutService: LayoutService;
  let pageInfo: PageInfo;
  let mockedTopGridRef: VariableSizeList;
  let mockedLeftGridRef: VariableSizeList;
  let dataGridRef: VariableSizeGrid;
  let leftGridHorizontalScrollableContainerRefMock: HTMLDivElement;
  let dataGridHorizontalScrollableContainerRefMock: HTMLDivElement;

  const renderUseScroll = () =>
    renderHook(
      ({ layoutServiceAsProp, pageInfoAsProp }) =>
        useScroll({
          layoutService: layoutServiceAsProp,
          pageInfo: pageInfoAsProp,
          mockedRefs: {
            leftGridHorizontalScrollableContainerRef: leftGridHorizontalScrollableContainerRefMock,
            dataGridHorizontalScrollableContainerRef: dataGridHorizontalScrollableContainerRefMock,
            verticalScrollableContainerRef: {} as HTMLDivElement,
            topGridRef: [mockedTopGridRef],
            leftGridRef: [mockedLeftGridRef],
            dataGridRef,
          },
        }),
      {
        initialProps: {
          layoutServiceAsProp: layoutService,
          pageInfoAsProp: pageInfo,
        },
      },
    );

  beforeEach(() => {
    layoutService = {
      layout: {
        qHyperCube: {
          qLastExpandedPos: undefined,
        },
      },
    } as LayoutService;
    leftGridHorizontalScrollableContainerRefMock = {} as HTMLDivElement;
    dataGridHorizontalScrollableContainerRefMock = {} as HTMLDivElement;

    pageInfo = { page: 0 } as PageInfo;

    mockedTopGridRef = { scrollTo: jest.fn() } as unknown as VariableSizeList;
    mockedLeftGridRef = { scrollTo: jest.fn() } as unknown as VariableSizeList;
    dataGridRef = { scrollTo: jest.fn() } as unknown as VariableSizeGrid;
  });

  test("a change to layout service should reset scrollable container scroll positions", async () => {
    const {
      result: {
        current: {
          leftGridHorizontalScrollableContainerRef,
          dataGridHorizontalScrollableContainerRef,
          verticalScrollableContainerRef,
        },
      },
      rerender,
    } = renderUseScroll();

    if (leftGridHorizontalScrollableContainerRef.current)
      leftGridHorizontalScrollableContainerRef.current.scrollLeft = 100;
    if (dataGridHorizontalScrollableContainerRef.current)
      dataGridHorizontalScrollableContainerRef.current.scrollLeft = 100;
    if (verticalScrollableContainerRef.current) verticalScrollableContainerRef.current.scrollTop = 100;

    expect(leftGridHorizontalScrollableContainerRef.current?.scrollLeft).toBe(100);
    expect(dataGridHorizontalScrollableContainerRef.current?.scrollLeft).toBe(100);
    expect(verticalScrollableContainerRef.current?.scrollTop).toBe(100);
    rerender({ layoutServiceAsProp: { ...layoutService }, pageInfoAsProp: pageInfo });
    await waitFor(() => expect(leftGridHorizontalScrollableContainerRef.current?.scrollLeft).toBe(0));
    await waitFor(() => expect(dataGridHorizontalScrollableContainerRef.current?.scrollLeft).toBe(0));
    await waitFor(() => expect(verticalScrollableContainerRef.current?.scrollTop).toBe(0));
  });

  test("a change to page should reset scrollable container scroll positions", async () => {
    const {
      result: {
        current: {
          leftGridHorizontalScrollableContainerRef,
          dataGridHorizontalScrollableContainerRef,
          verticalScrollableContainerRef,
        },
      },
      rerender,
    } = renderUseScroll();

    if (leftGridHorizontalScrollableContainerRef.current)
      leftGridHorizontalScrollableContainerRef.current.scrollLeft = 100;
    if (dataGridHorizontalScrollableContainerRef.current)
      dataGridHorizontalScrollableContainerRef.current.scrollLeft = 100;
    if (verticalScrollableContainerRef.current) verticalScrollableContainerRef.current.scrollTop = 100;

    expect(leftGridHorizontalScrollableContainerRef.current?.scrollLeft).toBe(100);
    expect(dataGridHorizontalScrollableContainerRef.current?.scrollLeft).toBe(100);
    expect(verticalScrollableContainerRef.current?.scrollTop).toBe(100);
    rerender({ layoutServiceAsProp: layoutService, pageInfoAsProp: { ...pageInfo, page: 1 } });
    await waitFor(() => expect(leftGridHorizontalScrollableContainerRef.current?.scrollLeft).toBe(0));
    await waitFor(() => expect(dataGridHorizontalScrollableContainerRef.current?.scrollLeft).toBe(0));
    await waitFor(() => expect(verticalScrollableContainerRef.current?.scrollTop).toBe(0));
  });

  describe("onScrollHandlers", () => {
    let fakeTarget: HTMLElement;

    beforeEach(() => {
      fakeTarget = document.createElement("DIV");
      fakeTarget.dataset.key = `scrollable-container--${ScrollableContainerOrigin.DATA_GRID}`;
    });

    test("when called `onHorizontalScrollHandler()` should update grids with new scroll position", () => {
      const scrollLeft = 123;
      const {
        result: {
          current: { onHorizontalScrollHandler, getScrollLeft },
        },
      } = renderUseScroll();

      onHorizontalScrollHandler({
        currentTarget: { scrollLeft },
        target: fakeTarget,
      } as unknown as React.SyntheticEvent);

      expect(mockedTopGridRef.scrollTo).toHaveBeenCalledWith(scrollLeft);
      expect(dataGridRef.scrollTo).toHaveBeenCalledWith({ scrollLeft });
      expect(getScrollLeft()).toEqual(scrollLeft);
    });

    test("when called `onVerticalScrollHandler()` should update grids with new scroll position", () => {
      const scrollTop = 321;
      const {
        result: {
          current: { onVerticalScrollHandler, getScrollTop },
        },
      } = renderUseScroll();

      onVerticalScrollHandler({
        currentTarget: { scrollTop },
        target: fakeTarget,
      } as unknown as React.SyntheticEvent);

      expect(mockedLeftGridRef.scrollTo).toHaveBeenCalledWith(scrollTop);
      expect(dataGridRef.scrollTo).toHaveBeenCalledWith({ scrollTop });
      expect(getScrollTop()).toEqual(scrollTop);
    });
  });

  describe("horizontalScrollbarHeightSetter()", () => {
    beforeEach(() => {
      leftGridHorizontalScrollableContainerRefMock = {
        offsetHeight: 114,
        clientHeight: 100,
      } as HTMLDivElement;
      dataGridHorizontalScrollableContainerRefMock = leftGridHorizontalScrollableContainerRefMock;
    });

    test("should calculate horizontal scrollbar height and invoke `setHorizontalScrollbarHeight(...)` when not meant to reset the height of horizontal scrollbar", () => {
      const {
        result: {
          current: { horizontalScrollbarHeightSetter, horizontalScrollbarHeight },
        },
      } = renderUseScroll();

      act(() => {
        horizontalScrollbarHeightSetter();
      });

      const { offsetHeight, clientHeight } = leftGridHorizontalScrollableContainerRefMock;
      expect(horizontalScrollbarHeight).toBe(offsetHeight - clientHeight);
    });

    test("should reset the hesight of horizontal scrollbar when proper argument is passed", async () => {
      const { result } = renderUseScroll();

      act(() => {
        result.current.horizontalScrollbarHeightSetter(true);
      });

      expect(result.current.horizontalScrollbarHeight).toBe(0);
    });
  });
});
