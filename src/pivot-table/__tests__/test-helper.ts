import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import type NxDimCellType from "../../types/QIX";
import type { VisibleDimensionInfo } from "../../types/types";

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

export const createDim = (id: number): VisibleDimensionInfo =>
  id === PSEUDO_DIMENSION_INDEX
    ? id
    : ({ cId: `id-${id}`, qFallbackTitle: `dim ${id}`, qApprMaxGlyphCount: 1 } as VisibleDimensionInfo);

export const createDims = (...ids: number[]): VisibleDimensionInfo[] => ids.map(createDim);

export const createMeasure = (id: number): EngineAPI.INxMeasureInfo =>
  ({ qCardinal: id, qFallbackTitle: `m ${id}` } as EngineAPI.INxMeasureInfo);

export const createMeasures = (...ids: number[]): EngineAPI.INxMeasureInfo[] => ids.map(createMeasure);
