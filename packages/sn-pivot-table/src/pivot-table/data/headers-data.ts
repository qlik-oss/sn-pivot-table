import type { HeadersData, LayoutService, VisibleDimensionInfo } from "../../types/types";
import extractHeaders from "./extract-headers";

const createHeadersData = (
  layoutService: LayoutService,
  visibleTopDimensionInfo: VisibleDimensionInfo[],
  visibleLeftDimensionInfo: VisibleDimensionInfo[],
): HeadersData => {
  const data = extractHeaders(layoutService, visibleTopDimensionInfo, visibleLeftDimensionInfo);
  const size = {
    x: data[0]?.length ?? 0, // number of columns
    y: data.length, // number of rows
  };
  return {
    data,
    size,
  };
};

export default createHeadersData;
