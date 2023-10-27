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
  const modifiedVerticalScrollbarWidth = verticalScrollbarWidth * (allRowsVisible ? 0 : 1);
  const modifiedHorizontalScrollbarHeight = horizontalScrollbarHeight * (allRowsVisible ? 0 : 1);

  const childWrappersScrollableContainerHeight = allRowsVisible
    ? topGridHeight + dataGridHeight + GRID_BORDER + horizontalScrollbarHeight
    : tableRect.height;
  const childWrappersStickyContainerHeight = tableRect.height - modifiedHorizontalScrollbarHeight;

  const actualRightGridWidth = totalWidth - leftGridWidth - modifiedVerticalScrollbarWidth;
  const avaliableRightGridW = tableRect.width - leftGridWidth - modifiedVerticalScrollbarWidth;

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
        height: topGridHeight,
      },
      leftGrid: {
        width: leftGridWidth,
        height: leftGridHeight - modifiedHorizontalScrollbarHeight,
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
          width: actualRightGridWidth < avaliableRightGridW ? actualRightGridWidth : avaliableRightGridW,
          height: childWrappersStickyContainerHeight,
        },
      },
      topGrid: {
        width: rightGridWidth - modifiedVerticalScrollbarWidth,
        height: topGridHeight,
      },
      dataGrid: {
        width: rightGridWidth - modifiedVerticalScrollbarWidth,
        height: dataGridHeight - modifiedHorizontalScrollbarHeight,
      },
    },
  };
};

export default getScrollableAreasDimensions;
