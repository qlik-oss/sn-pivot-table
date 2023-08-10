import { PSEUDO_DIMENSION_INDEX } from "../../../constants";
import type { ExtendedDimensionInfo, PseudoDimension } from "../../../types/QIX";

const getKey = (qDimensionInfo: ExtendedDimensionInfo | PseudoDimension): string => {
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
