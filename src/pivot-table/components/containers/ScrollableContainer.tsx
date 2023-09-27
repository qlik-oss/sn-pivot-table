import React from "react";
import type { Rect } from "../../../types/types";
import { useBaseContext } from "../../contexts/BaseProvider";

interface ScrollableContainerProps {
  rect: Rect;
  children: JSX.Element;
  onScroll: (e: React.SyntheticEvent) => void;
}

const ScrollableContainer = (props: ScrollableContainerProps, ref: React.LegacyRef<HTMLDivElement>): JSX.Element => {
  const { rect, children, onScroll } = props;
  const { interactions } = useBaseContext();

  return (
    <div
      ref={ref}
      data-testid="scrollable-container"
      style={{
        overflow: interactions.active ? "auto" : "hidden",
        width: rect.width,
        height: rect.height,
        overscrollBehaviorX: "contain",
      }}
      onScroll={onScroll}
    >
      {children}
    </div>
  );
};

export default React.forwardRef(ScrollableContainer);
