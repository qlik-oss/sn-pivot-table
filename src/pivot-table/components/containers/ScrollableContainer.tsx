import { stardust } from "@nebula.js/stardust";
import React from "react";
import { Rect } from "../../../types/types";

interface ScrollableContainerProps {
  constraints: stardust.Constraints;
  rect: Rect;
  children: JSX.Element;
  onScroll: (e: React.SyntheticEvent) => void;
}

const ScrollableContainer = (props: ScrollableContainerProps, ref: React.LegacyRef<HTMLDivElement>): JSX.Element => {
  const { rect, children, onScroll, constraints } = props;

  return (
    <div
      ref={ref}
      data-testid="scrollable-container"
      style={{
        overflow: constraints.active ? "hidden" : "auto",
        width: rect.width,
        height: rect.height,
      }}
      onScroll={onScroll}
    >
      {children}
    </div>
  );
};

export default React.forwardRef(ScrollableContainer);
