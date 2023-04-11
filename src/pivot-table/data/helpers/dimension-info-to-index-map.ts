import { PSEUDO_DIMENSION_INDEX } from "../../../constants";
import NxDimCellType from "../../../types/QIX";
import { Cell } from "../../../types/types";

const dimensionInfoToIndexMap =
  (startIndex: number, qEffectiveInterColumnSortOrder: number[]) =>
  (row: Cell[], index: number): number => {
    const columnSortIndex = index + startIndex;
    if (row[0].ref.qType === NxDimCellType.NX_DIM_CELL_PSEUDO) return PSEUDO_DIMENSION_INDEX;
    return qEffectiveInterColumnSortOrder[columnSortIndex];
  };

export default dimensionInfoToIndexMap;
