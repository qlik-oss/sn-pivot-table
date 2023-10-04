import type { HeadersData, PageInfo, Rect, TopDimensionData } from "../../types/types";
import { GRID_BORDER } from "../constants";
import { useStyleContext } from "../contexts/StyleProvider";

interface GridHeightHook {
  pageInfo: PageInfo;
  headersData: HeadersData;
  topDimensionData: TopDimensionData;
  tableRect: Rect;
}

export default function useGridHeight({ pageInfo, headersData, topDimensionData, tableRect }: GridHeightHook) {
  const { headerCellHeight, contentCellHeight } = useStyleContext();

  const totalDataHeight = pageInfo.rowsOnCurrentPage * contentCellHeight;
  const headerGridHeight = headerCellHeight * headersData.size.y;
  const containerHeight = totalDataHeight + headerGridHeight;

  // Top grid should always have height to support cases when there is no top data but it need to occupy space to correctly render headers
  const topGridHeight = headerCellHeight * Math.max(topDimensionData.rowCount, 1);
  const leftGridHeight = Math.min(tableRect.height - headerGridHeight - GRID_BORDER, totalDataHeight);
  const dataGridHeight = Math.min(tableRect.height - topGridHeight - GRID_BORDER, totalDataHeight);

  const rowsCanFitInTableViewPort = Math.floor(tableRect.height / contentCellHeight);
  const showLastBottomBorder = pageInfo.rowsOnCurrentPage < rowsCanFitInTableViewPort;

  return { containerHeight, topGridHeight, leftGridHeight, dataGridHeight, showLastBottomBorder };
}
