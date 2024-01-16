import type { Rect } from "../../../types/types";
import { GRID_BORDER } from "../../constants";

type ContainerDims = {
  scrollable: Rect;
  fullSize: Rect;
  sticky: Rect;
};

interface GetScrollableAreasDimensionsProps {
  tableRect: Rect;

  containerHeight: number;
  headerGridHeight: number;
  leftGridHeight: number;
  topGridHeight: number;
  dataGridHeight: number;
  allRowsVisible: boolean;

  totalWidth: number;
  leftGridWidth: number;
  rightGridWidth: number;
  verticalScrollbarWidth: number;
  horizontalScrollbarHeight: number;
}

interface GetScrollableAreasDimensionsResult {
  rootWrapper: ContainerDims;
  leftWrapper: {
    containers: ContainerDims;
    headerGrid: Rect;
    leftGrid: Rect;
  };
  rightWrapper: {
    containers: ContainerDims;
    topGrid: Rect;
    dataGrid: Rect;
  };
}

const getScrollableAreasDimensions = ({
  tableRect,

  containerHeight,
  headerGridHeight,
  leftGridHeight,
  topGridHeight,
  dataGridHeight,
  allRowsVisible,

  totalWidth,
  leftGridWidth,
  rightGridWidth,
  verticalScrollbarWidth,
  horizontalScrollbarHeight,
}: GetScrollableAreasDimensionsProps): GetScrollableAreasDimensionsResult => {
  const allRowsTotalHeight = topGridHeight + dataGridHeight + GRID_BORDER;
  // When the last row is not visisble because there is a horizontal scroll, a gap
  // is created. This variable is there to fill that gap.
  const gapToHorizontalScrollbar = allRowsVisible ? 0 : Math.max(0, tableRect.height - allRowsTotalHeight);

  const modifiedVerticalScrollbarWidth = verticalScrollbarWidth * (allRowsVisible ? 0 : 1);
  const modifiedHorizontalScrollbarHeight = horizontalScrollbarHeight * (allRowsVisible ? 0 : 1);

  const childWrappersScrollableContainerHeight = allRowsVisible
    ? allRowsTotalHeight + horizontalScrollbarHeight
    : tableRect.height;
  const childWrappersStickyContainerHeight = tableRect.height - modifiedHorizontalScrollbarHeight;

  const actualRightGridWidth = totalWidth - leftGridWidth - modifiedVerticalScrollbarWidth;
  const availableRightGridWidth = tableRect.width - leftGridWidth - modifiedVerticalScrollbarWidth;

  return {
    rootWrapper: {
      scrollable: tableRect,
      fullSize: {
        width: totalWidth - modifiedVerticalScrollbarWidth,
        height: containerHeight + modifiedHorizontalScrollbarHeight,
      },
      sticky: {
        width: tableRect.width - modifiedVerticalScrollbarWidth,
        height: tableRect.height,
      },
    },
    leftWrapper: {
      containers: {
        scrollable: {
          width: leftGridWidth,
          height: childWrappersScrollableContainerHeight,
        },
        fullSize: {
          width: leftGridWidth,
          height: containerHeight,
        },
        sticky: {
          width: leftGridWidth,
          height: childWrappersStickyContainerHeight,
        },
      },
      headerGrid: {
        width: -1,
        height: headerGridHeight,
      },
      leftGrid: {
        width: leftGridWidth,
        height: leftGridHeight - modifiedHorizontalScrollbarHeight + gapToHorizontalScrollbar,
      },
    },
    rightWrapper: {
      containers: {
        scrollable: {
          width: rightGridWidth + GRID_BORDER - modifiedVerticalScrollbarWidth,
          height: childWrappersScrollableContainerHeight,
        },
        fullSize: {
          width: actualRightGridWidth,
          height: containerHeight,
        },
        sticky: {
          width: actualRightGridWidth < availableRightGridWidth ? actualRightGridWidth : availableRightGridWidth,
          height: childWrappersStickyContainerHeight,
        },
      },
      topGrid: {
        width: rightGridWidth - modifiedVerticalScrollbarWidth,
        height: topGridHeight,
      },
      dataGrid: {
        width: rightGridWidth - modifiedVerticalScrollbarWidth,
        height: dataGridHeight - modifiedHorizontalScrollbarHeight + gapToHorizontalScrollbar,
      },
    },
  };
};

export default getScrollableAreasDimensions;
