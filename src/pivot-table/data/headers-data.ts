import type { HeadersData, VisibleDimensionInfo } from "../../types/types";
import extractHeaders from "./extract-headers";

const createHeadersData = (
  visibleTopDimensionInfo: VisibleDimensionInfo[],
  visibleLeftDimensionInfo: VisibleDimensionInfo[]
): HeadersData => {
  const data = extractHeaders(visibleTopDimensionInfo, visibleLeftDimensionInfo);

  return {
    data,
    size: {
      rows: data.length,
      cols: data[0]?.length || 0,
    },
  };
};

export default createHeadersData;
