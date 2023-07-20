import type { Cell } from "../../../types/types";

const createCell = (
  node: EngineAPI.INxPivotDimensionCell,
  parent: Cell | null,
  root: Cell | null,
  x: number,
  y: number,
  pageY: number,
  isSnapshot: boolean
): Cell => ({
  ref: node,
  x,
  y,
  // TODO:
  // pageX might change to reflect x in current x axis page
  // when we implement horizontal pagination feature (exactly like the relation btw y and pageY)
  pageX: x,
  pageY,
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
