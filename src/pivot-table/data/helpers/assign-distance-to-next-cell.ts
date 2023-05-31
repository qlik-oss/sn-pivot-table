/* eslint-disable no-param-reassign */
import type { Grid, PageInfo, Point } from "../../../types/types";

const assignDistanceToNextCell = (data: Grid, direction: "x" | "y", size: Point, pageInfo?: PageInfo) => {
  data.slice(0, -1).forEach((list) => {
    Object.values(list).forEach((cell, index, cells) => {
      const nextSibling = cells[index + 1];
      if (nextSibling) {
        // If a node a position 1 and another node at position 1337, but no other nodes between that.
        // The node at position 1 is using "distanceToNextCell" streched all the way to the node at
        // position 1337.
        cell.distanceToNextCell = nextSibling[direction] - (cell[direction] + cell.leafCount);
      } else {
        const gridLen = Object.values(data[data.length - 1]).length;
        const isLastPage = pageInfo && pageInfo.currentPage === pageInfo.totalPages - 1;
        // if is in last page + grid length (total rows) is less than rows per page => no distance to next cell (should be 0)
        if (direction === "y" && isLastPage && gridLen < pageInfo.rowsPerPage) {
          cell.distanceToNextCell = 0;
        } else {
          // This is what enables the dimensions with branch nodes to be fully scrollable.
          // By "faking" the distanceToNextCell for the last cell to include all other cells
          // the react-window list can render with a full size.
          cell.distanceToNextCell = size[direction] - (cell[direction] + cell.leafCount);
        }
      }
    });
  });
};

export default assignDistanceToNextCell;
