import type NxDimCellType from "../../../types/QIX";
import type { ExtendedDimensionInfo, PseudoDimension } from "../../../types/QIX";

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

export const createDimInfo = (length: number): (ExtendedDimensionInfo | PseudoDimension)[] =>
  Array.from(
    { length },
    (_, idx: number) => ({ cId: `id-${idx}`, qFallbackTitle: `dim ${idx}` } as unknown as ExtendedDimensionInfo)
  );
