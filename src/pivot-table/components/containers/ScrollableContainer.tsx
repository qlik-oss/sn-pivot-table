import { styled } from "@mui/material";
import React from "react";
import type { Rect } from "../../../types/types";
import { useBaseContext } from "../../contexts/BaseProvider";

type Origin = "leftGrid" | "dataGrid" | "containerGrid";

interface ScrollableContainerProps {
  width: number;
  height: number;
  children: JSX.Element;
  onScroll: (e: React.SyntheticEvent) => void;
  style?: React.CSSProperties;
  showVerticalScrollbar?: boolean;
  showHorizontalScrollbar?: boolean;
  origin: Origin;
}

const getTestId = (origin: Origin) => `scrollable-container--${origin}`;

const ScrollableContainer = (props: ScrollableContainerProps, ref: React.LegacyRef<HTMLDivElement>): JSX.Element => {
  const {
    width,
    height,
    children,
    onScroll,
    style,
    showVerticalScrollbar = true,
    showHorizontalScrollbar = true,
    origin,
  } = props;
  const { interactions } = useBaseContext();

  return (
    <div
      ref={ref}
      data-testid={getTestId(origin)}
      style={{
        width: width,
        height: height,
        overscrollBehaviorX: "contain",
        overflowX: interactions.active && showHorizontalScrollbar ? "auto" : "hidden",
        overflowY: interactions.active && showVerticalScrollbar ? "auto" : "hidden",
        // display: "inline-block",
        // paddingBottom: 14, // TODO: this is unstable
        ...style,
      }}
      onScroll={onScroll}
    >
      {children}
    </div>
  );
};

export default React.forwardRef(ScrollableContainer);
