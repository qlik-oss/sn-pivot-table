import { NxDimCellType, NxPivotDimensionCell } from '../../../types/QIX';

function createNode(qElemNo: number, qType: NxDimCellType): NxPivotDimensionCell {
  return {
    qType,
    qElemNo,
    qSubNodes: [],
  } as unknown as NxPivotDimensionCell;
}

export default function createNodes(count: number, type: NxDimCellType): NxPivotDimensionCell[] {
  return Array.from({ length: count}, (_, idx: number) => createNode(idx, type));
}
