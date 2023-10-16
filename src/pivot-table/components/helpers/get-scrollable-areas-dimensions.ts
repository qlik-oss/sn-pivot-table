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
  isEmptySpaceExistsBelowLastRow: boolean;

  totalWidth: number;
  leftGridWidth: number;
  rightGridWidth: number;
  verticalScrollbarWidth: number;
}

interface getScrollableAreasDimensionsResult {
  ROOT_WRAPPER: ContainerDims;
  LEFT_WRAPPER: {
    containers: ContainerDims;
    headerGrid: Rect;
    leftGrid: Rect;
  };
  RIGHT_WRAPPER: {
    containers: ContainerDims; // & WrapperDims;
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
  isEmptySpaceExistsBelowLastRow,

  totalWidth,
  leftGridWidth,
  rightGridWidth,
  verticalScrollbarWidth,
}: getScrollableAreasDimensionsProps): getScrollableAreasDimensionsResult => {
  const modifiedVerticalScrollbarWidth = !isEmptySpaceExistsBelowLastRow ? verticalScrollbarWidth : 0;

  return {
    ROOT_WRAPPER: {
      scrollable: {
        width: tableRect.width,
        height: tableRect.height,
      },
      fullSize: {
        width: totalWidth - modifiedVerticalScrollbarWidth,
        height: containerHeight,
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
          height: isEmptySpaceExistsBelowLastRow ? topGridHeight + dataGridHeight + GRID_BORDER : tableRect.height,
        },
        fullSize: {
          width: leftGridWidth,
          height: containerHeight,
        },
        sticky: {
          width: leftGridWidth,
          height: tableRect.height,
        },
      },
      headerGrid: {
        width: -1,
        height: topGridHeight,
      },
      leftGrid: {
        width: leftGridWidth,
        height: leftGridHeight,
      },
    },
    RIGHT_WRAPPER: {
      containers: {
        scrollable: {
          width: rightGridWidth + GRID_BORDER - modifiedVerticalScrollbarWidth,
          height: isEmptySpaceExistsBelowLastRow ? topGridHeight + dataGridHeight + GRID_BORDER : tableRect.height,
        },
        fullSize: {
          width: totalWidth - leftGridWidth - modifiedVerticalScrollbarWidth,
          height: containerHeight,
        },
        sticky: {
          width: tableRect.width - leftGridWidth - modifiedVerticalScrollbarWidth,
          height: tableRect.height,
        },
        // wrapper: {
        //   width: rightGridWidth + GRID_BORDER - modifiedVerticalScrollbarWidth,
        //   height: tableRect.height,
        // },
      },
      topGrid: {
        width: rightGridWidth - modifiedVerticalScrollbarWidth,
        height: topGridHeight,
      },
      dataGrid: {
        width: rightGridWidth - modifiedVerticalScrollbarWidth,
        height: dataGridHeight,
      },
    },
  };
};

export default getScrollableAreasDimensions;
