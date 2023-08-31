import type { Cell } from "../../../../types/types";

const getPseudoDimensionAdjustedIndex = (cell: Cell | null): number => {
  if (!cell || !cell.parent) {
    return 0;
  }

  if (cell.isPseudoDimension) {
    return cell.parent.children.length - 1;
  }

  return getPseudoDimensionAdjustedIndex(cell.parent);
};

const getNextCell = (list: Cell[], index: number, cell?: Cell) => {
  if (cell === undefined) {
    return undefined;
  }

  let nextCellIndex = index + 1;
  nextCellIndex += getPseudoDimensionAdjustedIndex(cell);

  return list[nextCellIndex];
};

export default getNextCell;
