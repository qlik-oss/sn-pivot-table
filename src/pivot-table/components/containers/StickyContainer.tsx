import React, { type ReactNode } from "react";
import type { Rect } from "../../../types/types";

interface StickyContainerProps {
  // rect: Rect;
  width: number;
  height: number;
  children: ReactNode;
  // leftColumnsWidth: number;
  // rightColumnsWidth: number;
  style?: React.CSSProperties;
}

const StickyContainer = ({
  // rect,
  width,
  height,
  // rightColumnsWidth,
  // leftColumnsWidth,
  children,
  style,
}: StickyContainerProps): JSX.Element => (
  <div
    data-testid="sticky-container"
    style={{
      // display: "grid",
      position: "sticky",
      top: 0,
      left: 0,
      // gridTemplateColumns: leftColumnsWidth // If leftColumnsWidth is 0, this means no data exist for "headers" or "left"
      //   ? `${leftColumnsWidth}px ${rightColumnsWidth}px`
      //   : `${rightColumnsWidth}px`,
      width: width,
      height: height,
      ...style,
    }}
  >
    {children}
  </div>
);

export default StickyContainer;
