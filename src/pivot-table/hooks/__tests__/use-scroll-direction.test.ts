import { renderHook } from "@testing-library/react";
import useScrollDirection, { ScrollDirection } from "../use-scroll-direction";

describe("useScrollDirection", () => {
  test("should initiate with none as scroll direction", () => {
    const { result } = renderHook(() => useScrollDirection());

    expect(result.current.verticalScrollDirection.current).toEqual(ScrollDirection.None);
    expect(result.current.horizontalScrollDirection.current).toEqual(ScrollDirection.None);
  });

  test("should handle when a user scrolls DOWN", () => {
    const { result } = renderHook(() => useScrollDirection());

    result.current.scrollHandler({ scrollTop: 250, scrollLeft: 0 });

    expect(result.current.verticalScrollDirection.current).toEqual(ScrollDirection.Forward);
    expect(result.current.horizontalScrollDirection.current).toEqual(ScrollDirection.None);
  });

  test("should handle when a user scrolls UP", () => {
    const { result } = renderHook(() => useScrollDirection());

    result.current.scrollHandler({ scrollTop: 250, scrollLeft: 0 });
    result.current.scrollHandler({ scrollTop: 50, scrollLeft: 0 });

    expect(result.current.verticalScrollDirection.current).toEqual(ScrollDirection.Backward);
    expect(result.current.horizontalScrollDirection.current).toEqual(ScrollDirection.None);
  });

  test("should handle when a user scrolls RIGHT", () => {
    const { result } = renderHook(() => useScrollDirection());

    result.current.scrollHandler({ scrollTop: 0, scrollLeft: 100 });

    expect(result.current.verticalScrollDirection.current).toEqual(ScrollDirection.None);
    expect(result.current.horizontalScrollDirection.current).toEqual(ScrollDirection.Forward);
  });

  test("should handle when a user scrolls LEFT", () => {
    const { result } = renderHook(() => useScrollDirection());

    result.current.scrollHandler({ scrollTop: 0, scrollLeft: 100 });
    result.current.scrollHandler({ scrollTop: 0, scrollLeft: 50 });

    expect(result.current.verticalScrollDirection.current).toEqual(ScrollDirection.None);
    expect(result.current.horizontalScrollDirection.current).toEqual(ScrollDirection.Backward);
  });

  test("should handle when a user scrolls both vertically and horizontally", () => {
    const { result } = renderHook(() => useScrollDirection());

    result.current.scrollHandler({ scrollTop: 200, scrollLeft: 100 });

    expect(result.current.verticalScrollDirection.current).toEqual(ScrollDirection.Forward);
    expect(result.current.horizontalScrollDirection.current).toEqual(ScrollDirection.Forward);
  });
});
