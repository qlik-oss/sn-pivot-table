/* eslint-disable no-param-reassign */
import type { Grid, PageInfo, Point } from "../../../types/types";

const assignDistanceToNextCell = (data: Grid, dirKey: "pageX" | "pageY", size: Point, pageInfo?: PageInfo) => {
  data.slice(0, -1).forEach((list) => {
    Object.values(list).forEach((cell, index, cells) => {
      const nextSibling = cells[index + 1];
      if (nextSibling) {
        // If a node a position 1 and another node at position 1337, but no other nodes between that.
        // The node at position 1 is using "distanceToNextCell" streched all the way to the node at
        // position 1337.
        cell.distanceToNextCell = nextSibling[dirKey] - (cell[dirKey] + cell.leafCount);
      } else {
        const gridLen = Object.values(data[data.length - 1]).length;
        const isLastPage = pageInfo && pageInfo.currentPage === pageInfo.totalPages - 1;
        // if in last page + grid length (total rows) is less than rows per page => distanceToNextCell should be 0
        if (dirKey === "pageY" && isLastPage && gridLen < pageInfo.rowsPerPage) {
          cell.distanceToNextCell = 0;
        } else {
          // This is what enables the dimensions with branch nodes to be fully scrollable.
          // By "faking" the distanceToNextCell for the last cell to include all other cells
          // the react-window list can render with a full size.
          const sizeDirectionKey: keyof Point = dirKey === "pageY" ? "y" : "x";
          cell.distanceToNextCell = size[sizeDirectionKey] - (cell[dirKey] + cell.leafCount);
        }
      }
    });
  });
};

export default assignDistanceToNextCell;
