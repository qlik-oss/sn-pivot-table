import { PSEUDO_DIMENSION_INDEX, PSEUDO_DIMENSION_KEY } from "../../../constants";
import type { VisibleDimensionInfo } from "../../../types/types";

const getKey = (qDimensionInfo: VisibleDimensionInfo): string => {
  if (qDimensionInfo === PSEUDO_DIMENSION_INDEX) {
    return PSEUDO_DIMENSION_KEY;
  }

  return (
    qDimensionInfo.qLibraryId ??
    qDimensionInfo.cId ??
    qDimensionInfo.qGroupFallbackTitles?.join("") ??
    qDimensionInfo.qFallbackTitle
  );
};

export default getKey;
