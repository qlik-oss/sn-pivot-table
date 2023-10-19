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
  ROOT_WRAPPER: ContainerDims;
  LEFT_WRAPPER: {
    containers: ContainerDims;
    headerGrid: Rect;
    leftGrid: Rect;
  };
  RIGHT_WRAPPER: {
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

  return {
    ROOT_WRAPPER: {
      scrollable: {
        width: tableRect.width,
        height: tableRect.height,
      },
      fullSize: {
        width: totalWidth - modifiedVerticalScrollbarWidth,
        height: containerHeight + modifiedHorizontalScrollbarHeight,
      },
      sticky: {
        width: totalWidth - modifiedVerticalScrollbarWidth,
        height: tableRect.height,
      },
    },
    LEFT_WRAPPER: {
      containers: {
        scrollable: {
          width: leftGridWidth,
          height: allRowsVisible
            ? topGridHeight + dataGridHeight + GRID_BORDER + horizontalScrollbarHeight
            : tableRect.height,
        },
        fullSize: {
          width: leftGridWidth,
          height: containerHeight,
        },
        sticky: {
          width: leftGridWidth,
          height: tableRect.height - modifiedHorizontalScrollbarHeight,
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
    RIGHT_WRAPPER: {
      containers: {
        scrollable: {
          width: rightGridWidth + GRID_BORDER - modifiedVerticalScrollbarWidth,
          height: allRowsVisible
            ? topGridHeight + dataGridHeight + GRID_BORDER + horizontalScrollbarHeight
            : tableRect.height,
        },
        fullSize: {
          width: totalWidth - leftGridWidth - modifiedVerticalScrollbarWidth,
          height: containerHeight,
        },
        sticky: {
          width: tableRect.width - leftGridWidth - modifiedVerticalScrollbarWidth,
          height: tableRect.height - modifiedHorizontalScrollbarHeight,
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
