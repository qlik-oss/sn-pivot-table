import { PSEUDO_DIMENSION_INDEX } from "../../../constants";
import type { VisibleDimensionInfo } from "../../../types/types";

const getKey = (qDimensionInfo: VisibleDimensionInfo): string => {
  if (qDimensionInfo === PSEUDO_DIMENSION_INDEX) {
    return "-1";
  }

  return (
    qDimensionInfo.qLibraryId ??
    qDimensionInfo.cId ??
    qDimensionInfo.qGroupFallbackTitles?.join("") ??
    qDimensionInfo.qFallbackTitle
  );
};

export default getKey;
