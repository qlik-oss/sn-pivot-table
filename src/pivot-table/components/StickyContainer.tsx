import React from "react";
import { Rect } from "../../types/types";

interface StickyContainerProps {
  rect: Rect;
  children: JSX.Element | JSX.Element[];
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const StickyContainer = (
  {rect, children, left, right, top, bottom }:
  StickyContainerProps
): JSX.Element => (
  <div
    style={{
      display: 'grid',
      position: 'sticky',
      top: 0,
      left: 0,
      gridTemplateColumns: `${left}px ${right}px`,
      gridTemplateRows: `${top}px ${bottom}px`,
      width: rect.width,
      height: rect.height
    }}
  >
    {children}
  </div>
);

export default StickyContainer;
