import type { ExtendedDimensionInfo } from "../../../../../types/QIX";
import type { Cell, Flags, LayoutService } from "../../../../../types/types";
import resolveTextAlign from "../../utils/resolve-text-align";

const getJustifyContent = (cell: Cell, layoutService: LayoutService, isLeftColumn: boolean, flags: Flags) => {
  const defaultAlign = isLeftColumn ? "flex-start" : "center";

  if (cell.isPseudoDimension && cell.visibleMeasureInfoIndex !== undefined) {
    const { labelTextAlign } = layoutService.visibleMeasureInfo[cell.visibleMeasureInfoIndex] ?? {};

    return resolveTextAlign(labelTextAlign, defaultAlign, flags);
  }

  const { textAlign } = (layoutService.getDimensionInfo(cell.dimensionInfoIndex) as ExtendedDimensionInfo) ?? {};

  return resolveTextAlign(textAlign, defaultAlign, flags);
};

export default getJustifyContent;
