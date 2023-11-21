import { useCallback, useRef } from "react";

interface OnScroll {
  scrollLeft: number;
  scrollTop: number;
}

export enum ScrollDirection {
  Forward = "Forward",
  Back = "Back",
  None = "None", // If the user is not scrolling in any direction, use this value
}

const useScrollDirection = () => {
  const prevScrollLeft = useRef(0);
  const prevScrollTop = useRef(0);
  const verticalScrollDirection = useRef(ScrollDirection.None);
  const horizontalScrollDirection = useRef(ScrollDirection.None);

  const scrollHandler = useCallback(
    ({ scrollTop, scrollLeft }: OnScroll) => {
      // Set vertical scroll direction
      if (scrollTop > prevScrollTop.current) {
        verticalScrollDirection.current = ScrollDirection.Forward;
      } else if (scrollTop < prevScrollTop.current) {
        verticalScrollDirection.current = ScrollDirection.Back;
      } else {
        verticalScrollDirection.current = ScrollDirection.None;
      }

      // Set horizontal scroll direction
      if (scrollLeft > prevScrollLeft.current) {
        horizontalScrollDirection.current = ScrollDirection.Forward;
      } else if (scrollLeft < prevScrollLeft.current) {
        horizontalScrollDirection.current = ScrollDirection.Back;
      } else {
        horizontalScrollDirection.current = ScrollDirection.None;
      }

      prevScrollTop.current = scrollTop;
      prevScrollLeft.current = scrollLeft;
    },
    [prevScrollTop, prevScrollLeft, verticalScrollDirection, horizontalScrollDirection],
  );

  return {
    scrollHandler,
    verticalScrollDirection,
    horizontalScrollDirection,
  };
};

export default useScrollDirection;
