import type { Cell } from "../../../types/types";

const createCell = (
  node: EngineAPI.INxPivotDimensionCell,
  parent: Cell | null,
  root: Cell | null,
  x: number,
  y: number,
  dataY: number,
  isSnapshot: boolean
): Cell => ({
  ref: node,
  x,
  y, // position of cell in page
  dataY, // position of cell in dataset
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
