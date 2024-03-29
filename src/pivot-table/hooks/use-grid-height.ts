import type { HeadersData, PageInfo, Rect, TopDimensionData } from "../../types/types";
import { GRID_BORDER } from "../constants";
import { useStyleContext } from "../contexts/StyleProvider";

interface GridHeightHook {
  pageInfo: PageInfo;
  headersData: HeadersData;
  topDimensionData: TopDimensionData;
  tableRect: Rect;
  horizontalScrollbarHeight: number;
}

export default function useGridHeight({
  pageInfo,
  headersData,
  topDimensionData,
  tableRect,
  horizontalScrollbarHeight,
}: GridHeightHook) {
  const { headerCellHeight, contentCellHeight } = useStyleContext();

  const totalDataHeight = pageInfo.rowsOnCurrentPage * contentCellHeight;
  const headerGridHeight = headerCellHeight * headersData.size.y;
  const containerHeight = totalDataHeight + headerGridHeight;

  // Top grid should always have height to support cases when there is no top data but it need to occupy space to correctly render headers
  const topGridHeight = headerCellHeight * Math.max(headersData.size.y, topDimensionData.rowCount, 1);
  const leftGridHeight = Math.min(tableRect.height - headerGridHeight - GRID_BORDER, totalDataHeight);
  const dataGridHeight = Math.min(tableRect.height - topGridHeight - GRID_BORDER, totalDataHeight);

  const allRowsVisible = topGridHeight + GRID_BORDER + totalDataHeight + horizontalScrollbarHeight <= tableRect.height;

  return {
    containerHeight,
    headerGridHeight,
    topGridHeight,
    leftGridHeight,
    dataGridHeight,
    allRowsVisible,
  };
}
