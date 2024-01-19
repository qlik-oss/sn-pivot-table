import React, { type ReactNode } from "react";

interface StickyContainerProps {
  width: number;
  height: number;
  children: ReactNode;
  style?: React.CSSProperties;
  isLeftGrid?: boolean;
}

const StickyContainer = ({ width, height, children, style, isLeftGrid }: StickyContainerProps): JSX.Element => (
  <div
    data-testid="sticky-container"
    style={{
      position: "sticky",
      top: 0,
      left: 0,
      width: isLeftGrid ? "fit-content" : width,
      height,
      ...style,
    }}
  >
    {children}
  </div>
);

export default StickyContainer;
