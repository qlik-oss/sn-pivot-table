import React from 'react';
import { Rect } from '../../types/types';

interface StickyContainerProps {
  rect: Rect;
  children: JSX.Element | JSX.Element[];
  leftColumnsWidth: number;
  rightColumnsWidth: number;
  topRowsHeight: number;
  bottomRowsHeight: number;
}

const StickyContainer = (
  {
    rect,
    children,
    leftColumnsWidth,
    rightColumnsWidth,
    topRowsHeight,
    bottomRowsHeight
  }:
  StickyContainerProps
): JSX.Element => (
  <div
    style={{
      display: 'grid',
      position: 'sticky',
      top: 0,
      left: 0,
      gridTemplateColumns: leftColumnsWidth // If leftColumnsWidth is 0, this means no data exist for "headers" or "left"
      ? `${leftColumnsWidth}px ${rightColumnsWidth}px`
      : `${rightColumnsWidth}px`,
      gridTemplateRows: `${topRowsHeight}px ${bottomRowsHeight}px`,
      width: rect.width,
      height: rect.height
    }}
  >
    {children}
  </div>
);

export default StickyContainer;
