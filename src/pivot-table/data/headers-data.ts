import type { HeadersData, VisibleDimensionInfo } from "../../types/types";
import extractHeaders from "./extract-headers";

const createHeadersData = (rowCount: number, visibleLeftDimensionInfo: VisibleDimensionInfo[]): HeadersData => {
  // rowCount cannot be 0, as it couse issue when there is no top data but there is left data
  const data = extractHeaders(Math.max(rowCount, 1), visibleLeftDimensionInfo);

  return {
    data,
    size: {
      x: data.length,
      y: data[0]?.length || 0,
    },
  };
};

export default createHeadersData;
