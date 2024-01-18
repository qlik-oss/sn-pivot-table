import type { ExtendedDimensionInfo } from "../../../../../types/QIX";
import type { Cell, Flags, LayoutService } from "../../../../../types/types";
import resolveTextAlign from "../../utils/resolve-text-align";

const getTextAlign = (cell: Cell, layoutService: LayoutService, isLeftColumn: boolean, flags: Flags) => {
  const { textAlign } = (layoutService.getDimensionInfo(cell.dimensionInfoIndex) as ExtendedDimensionInfo) ?? {};
  const defaultAlign = isLeftColumn ? undefined : "center";

  return resolveTextAlign(textAlign, defaultAlign, flags);
};

export default getTextAlign;
