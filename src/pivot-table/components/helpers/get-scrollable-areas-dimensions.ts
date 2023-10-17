import type { HeadersData, PageInfo, Rect, TopDimensionData } from "../../../types/types";
import { GRID_BORDER } from "../../constants";
import useGridHeight from "../../hooks/use-grid-height";

type ContainerDims = {
  scrollable: Rect;
  fullSize: Rect;
  sticky: Rect;
};

type WrapperDims = {
  wrapper: Rect;
};

interface getScrollableAreasDimensionsProps {
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

interface getScrollableAreasDimensionsResult {
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
}: getScrollableAreasDimensionsProps): getScrollableAreasDimensionsResult => {
  const modifiedVerticalScrollbarWidth = !allRowsVisible ? verticalScrollbarWidth : 0;
  const modifiedHorizontalScrollbarHeight = horizontalScrollbarHeight;

  return {
    ROOT_WRAPPER: {
      scrollable: {
        width: tableRect.width,
        height: tableRect.height + (allRowsVisible ? modifiedHorizontalScrollbarHeight : 0),
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
            ? topGridHeight + dataGridHeight + GRID_BORDER + modifiedHorizontalScrollbarHeight
            : tableRect.height,
        },
        fullSize: {
          width: leftGridWidth,
          height: containerHeight - modifiedHorizontalScrollbarHeight,
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
        height: leftGridHeight + modifiedHorizontalScrollbarHeight * (allRowsVisible ? 1 : -1),
      },
    },
    RIGHT_WRAPPER: {
      containers: {
        scrollable: {
          width: rightGridWidth + GRID_BORDER - modifiedVerticalScrollbarWidth,
          height: allRowsVisible
            ? topGridHeight + dataGridHeight + GRID_BORDER + modifiedHorizontalScrollbarHeight
            : tableRect.height,
        },
        fullSize: {
          width: totalWidth - leftGridWidth - modifiedVerticalScrollbarWidth,
          height: containerHeight - modifiedHorizontalScrollbarHeight,
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
        height: dataGridHeight + modifiedHorizontalScrollbarHeight * (allRowsVisible ? 1 : -1),
      },
    },
  };
};

export default getScrollableAreasDimensions;
