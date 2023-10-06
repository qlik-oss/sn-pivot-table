import { PSEUDO_DIMENSION_INDEX } from "../../../constants";
import type { ExtendedMeasureInfo, ExtendedNxAttrExprInfo } from "../../../types/QIX";
import { AttrExprInfoIDs, type AttrExprInfoIndex, type VisibleDimensionInfo } from "../../../types/types";

const extractAttrExprInfoIndex = (info: ExtendedMeasureInfo | VisibleDimensionInfo): AttrExprInfoIndex => {
  if (info === PSEUDO_DIMENSION_INDEX) {
    return { cellForegroundColor: -1, cellBackgroundColor: -1 };
  }

  const exprInfo = info.qAttrExprInfo as unknown as ExtendedNxAttrExprInfo[];
  const cellForegroundColor = exprInfo.findIndex(({ id }) => id === AttrExprInfoIDs.CellForegroundColor.toString());
  const cellBackgroundColor = exprInfo.findIndex(({ id }) => id === AttrExprInfoIDs.CellBackgroundColor.toString());

  return { cellForegroundColor, cellBackgroundColor };
};

export default extractAttrExprInfoIndex;
