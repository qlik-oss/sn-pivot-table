import { useCallback, useRef } from "react";

interface OnScroll {
  scrollLeft: number;
  scrollTop: number;
  verticalScrollDirection: "forward" | "backward";
  horizontalScrollDirection: "forward" | "backward";
}

export enum ScrollDirection {
  Forward = "forward",
  Backward = "backward",
  None = "none", // If the user is not scrolling in any direction, use this value
}

const useScrollDirection = () => {
  const prevScrollLeft = useRef(0);
  const prevScrollTop = useRef(0);
  const vScrollDirection = useRef(ScrollDirection.None);
  const hScrollDirection = useRef(ScrollDirection.None);

  const scrollHandler = useCallback(
    ({ scrollTop, scrollLeft, verticalScrollDirection, horizontalScrollDirection }: OnScroll) => {
      if (prevScrollTop.current === scrollTop) {
        vScrollDirection.current = ScrollDirection.None;
      } else {
        vScrollDirection.current = verticalScrollDirection as ScrollDirection;
      }

      if (prevScrollLeft.current === scrollLeft) {
        hScrollDirection.current = ScrollDirection.None;
      } else {
        hScrollDirection.current = horizontalScrollDirection as ScrollDirection;
      }

      prevScrollTop.current = scrollTop;
      prevScrollLeft.current = scrollLeft;
    },
    [prevScrollTop, prevScrollLeft, vScrollDirection, hScrollDirection],
  );

  return {
    scrollHandler,
    verticalScrollDirection: vScrollDirection,
    horizontalScrollDirection: hScrollDirection,
  };
};

export default useScrollDirection;
