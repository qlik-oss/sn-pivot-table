/* eslint-disable no-param-reassign */
import type { Grid, Point } from "../../../types/types";

const assignDistanceToNextCell = (data: Grid, direction: "x" | "y", size: Point) => {
  data.slice(0, -1).forEach((list, idx) => {
    // console.log({ list });
    Object.values(list).forEach((cell, index, cells) => {
      const nextSibling = cells[index + 1];
      // index === 0 && idx === 0 && console.log({ cell, nextSibling, index, cells });
      if (nextSibling) {
        // If a node a position 1 and another node at position 1337, but no other nodes between that.
        // The node at position 1 is using "distanceToNextCell" streched all the way to the node at
        // position 1337.
        // index === 0 && idx === 0 && console.log(">>>>", nextSibling[direction], cell[direction], cell.leafCount);

        // if (nextSibling[direction] - (cell[direction] + cell.leafCount) < 0) {
        //   cell.distanceToNextCell = nextSibling[direction]; // - cell.leafCount;
        // } else {
        cell.distanceToNextCell = nextSibling[direction] - (cell[direction] + cell.leafCount);
        // } // 9 - (0 + 13) -> -4

        // index === 0 && idx === 0 && console.log(">>>>", cell.distanceToNextCell);
      } else {
        // This is what enables the dimensions with branch nodes to be fully scrollable.
        // By "faking" the distanceToNextCell for the last cell to include all other cells
        // the react-window list can render with a full size.
        cell.distanceToNextCell = size[direction] - (cell[direction] + cell.leafCount);
      }
    });
  });
};

export default assignDistanceToNextCell;
