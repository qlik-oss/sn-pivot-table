import NxDimCellType from '../../../types/QIX';

function createNode(qElemNo: number, qType: NxDimCellType): EngineAPI.INxPivotDimensionCell {
  return {
    qType,
    qElemNo,
    qSubNodes: [],
  } as unknown as EngineAPI.INxPivotDimensionCell;
}

export default function createNodes(count: number, type: NxDimCellType): EngineAPI.INxPivotDimensionCell[] {
  return Array.from({ length: count}, (_, idx: number) => createNode(idx, type));
}
