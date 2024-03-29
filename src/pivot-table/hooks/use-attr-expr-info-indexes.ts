import { useMemo } from "react";
import type { ExtendedMeasureInfo } from "../../types/QIX";
import type { AttrExprInfoIndexes, VisibleDimensionInfo } from "../../types/types";
import extractAttrExprInfoIndex from "../data/helpers/extract-attr-expr-info-index";

const useAttrExprInfoIndexes = (
  visibleLeftDimensionInfo: VisibleDimensionInfo[],
  visibleTopDimensionInfo: VisibleDimensionInfo[],
  visibleMeasureInfo: ExtendedMeasureInfo[],
): AttrExprInfoIndexes =>
  useMemo(
    () => ({
      left: visibleLeftDimensionInfo.map(extractAttrExprInfoIndex),
      top: visibleTopDimensionInfo.map(extractAttrExprInfoIndex),
      measures: visibleMeasureInfo.map(extractAttrExprInfoIndex),
    }),
    [visibleMeasureInfo, visibleLeftDimensionInfo, visibleTopDimensionInfo],
  );

export default useAttrExprInfoIndexes;
