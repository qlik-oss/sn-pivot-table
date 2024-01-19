import React from "react";
import { GRID_BORDER } from "../../constants";

interface FullSizeContainerProps {
  width: number;
  height: number;
  children: JSX.Element;
  isLeftGrid?: boolean;
}

const FullSizeContainer = ({ width, height, children, isLeftGrid }: FullSizeContainerProps): JSX.Element => (
  <div
    data-testid="full-size-container"
    style={{
      display: "block",
      // GRID_BORDER is added because there is a border between the different grids.
      // Otherwise the react-window components will not scroll to the end (off by 1 pixel).
      width: isLeftGrid ? "fit-content" : width,
      height: height + GRID_BORDER,
    }}
  >
    {children}
  </div>
);

export default FullSizeContainer;
