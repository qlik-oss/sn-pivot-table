import type { Cell } from "../../../../types/types";

export default function shouldRenderColumnAdjuster(cell: Cell, isActive: boolean) {
  return !isActive && !cell.isLeftColumn && cell.isLeafNode;
}
