import { Cell } from '../../../types/types';

const createNode = (
  node: EngineAPI.INxPivotDimensionCell,
  parent: Cell | null,
  root: Cell | null,
  x: number,
  y: number,
): Cell => ({
  ref: node,
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
