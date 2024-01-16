import { PSEUDO_DIMENSION_INDEX } from "../../../constants";
import type NxDimCellType from "../../../types/QIX";
import type { ExtendedDimensionInfo } from "../../../types/QIX";
import type { VisibleDimensionInfo } from "../../../types/types";

function createNode(qElemNo: number, qType: NxDimCellType): EngineAPI.INxPivotDimensionCell {
  return {
    qType,
    qElemNo,
    qSubNodes: [],
    qUp: 1,
    qDown: 2,
  } as unknown as EngineAPI.INxPivotDimensionCell;
}

export default function createNodes(count: number, type: NxDimCellType): EngineAPI.INxPivotDimensionCell[] {
  return Array.from({ length: count }, (_, idx: number) => createNode(idx, type));
}
export const createDimInfo = (id: number): VisibleDimensionInfo =>
  id !== PSEUDO_DIMENSION_INDEX
    ? ({
        cId: `id-${id}`,
        qFallbackTitle: `dim ${id}`,
        qReverseSort: false,
        qSortIndicator: "A",
        qLibraryId: `id-${id}`,
        qGroupFieldDefs: [`dim ${id}`],
      } as unknown as ExtendedDimensionInfo)
    : PSEUDO_DIMENSION_INDEX;

export const createDimInfos = (ids: number[]): VisibleDimensionInfo[] => ids.map(createDimInfo);
