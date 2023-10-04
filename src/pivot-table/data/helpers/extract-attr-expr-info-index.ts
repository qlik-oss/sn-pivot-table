import { PSEUDO_DIMENSION_INDEX } from "../../../constants";
import type { ExtendedMeasureInfo, ExtendedNxAttrExprInfo } from "../../../types/QIX";
import type { AttrExprInfoIndex, VisibleDimensionInfo } from "../../../types/types";

const extractAttrExprInfoIndex = (info: ExtendedMeasureInfo | VisibleDimensionInfo): AttrExprInfoIndex => {
  if (info === PSEUDO_DIMENSION_INDEX) {
    return { foregroundColorIdx: -1, backgroundColorIdx: -1 };
  }

  const exprInfo = info.qAttrExprInfo as unknown as ExtendedNxAttrExprInfo[];
  const foregroundColorIdx = exprInfo.findIndex(({ id }) => id === "cellForegroundColor") as -1 | 0 | 1;
  const backgroundColorIdx = exprInfo.findIndex(({ id }) => id === "cellBackgroundColor") as -1 | 0 | 1;

  return { foregroundColorIdx, backgroundColorIdx };
};

export default extractAttrExprInfoIndex;
