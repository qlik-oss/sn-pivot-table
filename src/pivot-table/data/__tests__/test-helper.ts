import { NxDimCellType, NxPivotDimensionCell } from '../../../types/QIX';

function createNode(qElemNo: number, qType: NxDimCellType): NxPivotDimensionCell {
  return {
    qType,
    qElemNo,
    qCanCollapse: false,
    qCanExpand: false,
    qSubNodes: [],
    qText: '',
    qValue: '',
    qUp: 0,
    qDown: 0,
  };
}

export default function createNodes(count: number, type: NxDimCellType): NxPivotDimensionCell[] {
  return Array.from({ length: count}, (_, idx: number) => createNode(idx, type));
}
