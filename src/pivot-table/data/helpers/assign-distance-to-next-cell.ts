/* eslint-disable no-param-reassign */
import type { Grid } from "../../../types/types";

const assignDistanceToNextCell = (data: Grid, size: number) => {
  data.slice(0, -1).forEach((list) => {
    Object.values(list).forEach((cell, index, cells) => {
      const nextSibling = cells[index + 1];
      if (nextSibling) {
        // If a node a position 1 and another node at position 1337, but no other nodes between that.
        // The node at position 1 is using "distanceToNextCell" streched all the way to the node at
        // position 1337.
        cell.distanceToNextCell = nextSibling.mainAxisPageCoord - (cell.mainAxisPageCoord + cell.leafCount);
      } else {
        // This is what enables the dimensions with branch nodes to be fully scrollable.
        // By "faking" the distanceToNextCell for the last cell to include all other cells
        // the react-window list can render with a full size.
        cell.distanceToNextCell = size - (cell.mainAxisPageCoord + cell.leafCount);
      }
    });
  });
};

export default assignDistanceToNextCell;
