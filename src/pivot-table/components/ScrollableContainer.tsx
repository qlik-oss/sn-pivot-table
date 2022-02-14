import { stardust } from '@nebula.js/stardust';
import React from 'react';
import { Rect } from '../../types/types';

interface ScrollableContainerProps {
  constraints: stardust.Constraints;
  rect: Rect;
  children: JSX.Element;
  onScroll: (e: React.SyntheticEvent) => void;
}

const ScrollableContainer = ({ rect, children, onScroll, constraints }: ScrollableContainerProps): JSX.Element => (
  <div
    style={{
      overflow: constraints.active ? 'hidden' : 'auto',
      width: rect.width,
      height: rect.height
    }}
    onScroll={onScroll}
  >
    {children}
  </div>
);

export default ScrollableContainer;
