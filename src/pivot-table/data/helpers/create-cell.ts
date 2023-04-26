import { Cell } from "../../../types/types";

const createCell = (
  node: EngineAPI.INxPivotDimensionCell,
  parent: Cell | null,
  root: Cell | null,
  x: number,
  y: number,
  isSnapshot: boolean
): Cell => ({
  ref: node,
  x,
  y,
  parent,
  root,
  leafCount: isSnapshot ? 0 : node.qUp + node.qDown,
  distanceToNextCell: 0,
  incrementLeafCount() {
    this.leafCount += 1;
    if (parent) {
      parent.incrementLeafCount();
    }
  },
});

export default createCell;
