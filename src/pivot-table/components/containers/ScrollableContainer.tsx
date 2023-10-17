import React from "react";
import type { ScrollableContainerOrigin } from "../../../types/types";
import { useBaseContext } from "../../contexts/BaseProvider";

interface ScrollableContainerProps {
  width: number;
  height: number;
  children: JSX.Element;
  onScroll: (e: React.SyntheticEvent) => void;
  style?: React.CSSProperties;
  showVerticalScrollbar?: boolean;
  showHorizontalScrollbar?: boolean;
  origin: ScrollableContainerOrigin;
}

const getDataKey = (origin: ScrollableContainerOrigin) => `scrollable-container--${origin}`;

const ScrollableContainer = (props: ScrollableContainerProps, ref: React.LegacyRef<HTMLDivElement>): JSX.Element => {
  const { width, height, children, onScroll, style, showVerticalScrollbar, showHorizontalScrollbar, origin } = props;
  const { interactions } = useBaseContext();

  return (
    <div
      ref={ref}
      data-key={getDataKey(origin)}
      style={{
        width,
        height,
        overscrollBehaviorX: "contain",
        overflowX: interactions.active && showHorizontalScrollbar ? "auto" : "hidden",
        overflowY: interactions.active && showVerticalScrollbar ? "auto" : "hidden",
        ...style,
      }}
      onScroll={onScroll}
    >
      {children}
    </div>
  );
};

export default React.forwardRef(ScrollableContainer);
