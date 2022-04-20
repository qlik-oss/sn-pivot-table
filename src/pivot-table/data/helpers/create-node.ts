import { PivotDimensionCellWithPosition } from '../../../types/types';

const createNode = (
  node: EngineAPI.INxPivotDimensionCell,
  parent: PivotDimensionCellWithPosition | null,
  root: PivotDimensionCellWithPosition | null,
  x: number,
  y: number,
): PivotDimensionCellWithPosition => ({
  ...node,
  x,
  y,
  parent,
  root,
  leafCount: node.qUp + node.qDown,
  incrementLeafCount() {
    this.leafCount += 1;
    if (parent) {
      parent.incrementLeafCount();
    }
  },
});

export default createNode;
