import { Cell } from "../../../types/types";

const assignDistanceToNextCell = (data: Cell[][], direction: "x" | "y") => {
  data.slice(0, -1).forEach((list) => {
    list.forEach((cell, index, cells) => {
      const nextSibling = cells[index + 1];
      if (nextSibling) {
        // eslint-disable-next-line no-param-reassign
        cell.distanceToNextCell = nextSibling[direction] - (cell[direction] + cell.leafCount);
      }
    });
  });
};

export default assignDistanceToNextCell;
