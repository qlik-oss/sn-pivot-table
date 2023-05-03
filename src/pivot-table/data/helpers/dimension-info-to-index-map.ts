import { PSEUDO_DIMENSION_INDEX } from "../../../constants";
import NxDimCellType from "../../../types/QIX";
import type { List } from "../../../types/types";

const dimensionInfoToIndexMap =
  (startIndex: number, qEffectiveInterColumnSortOrder: number[]) =>
  (row: List, index: number): number => {
    const columnSortIndex = index + startIndex;

    if (Object.values(row)[0].ref.qType === NxDimCellType.NX_DIM_CELL_PSEUDO) {
      return PSEUDO_DIMENSION_INDEX;
    }
    return qEffectiveInterColumnSortOrder[columnSortIndex];
  };

export default dimensionInfoToIndexMap;
