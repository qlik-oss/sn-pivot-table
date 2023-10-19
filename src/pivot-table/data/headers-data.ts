import type { ExtendedHyperCube } from "../../types/QIX";
import type { HeadersData, VisibleDimensionInfo } from "../../types/types";
import extractHeaders from "./extract-headers";

const createHeadersData = (
  qHyperCube: ExtendedHyperCube,
  visibleTopDimensionInfo: VisibleDimensionInfo[],
  visibleLeftDimensionInfo: VisibleDimensionInfo[],
): HeadersData => {
  // rowCount cannot be 0, as it couse issue when there is no top data but there is left data
  const data = extractHeaders(qHyperCube, visibleTopDimensionInfo, visibleLeftDimensionInfo);

  return {
    data,
    size: {
      x: data[0]?.length || 0,
      y: data.length,
    },
  };
};

export default createHeadersData;
