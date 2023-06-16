import { PSEUDO_DIMENSION_INDEX } from "../../../constants";
import type { VisibleDimensionInfo } from "../../../types/types";

const getTitle = (qDimensionInfo: VisibleDimensionInfo): string => {
  if (qDimensionInfo === PSEUDO_DIMENSION_INDEX) {
    return "";
  }

  return qDimensionInfo.qFallbackTitle;
};

export default getTitle;
