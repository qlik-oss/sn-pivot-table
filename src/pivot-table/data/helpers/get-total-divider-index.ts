import type { Grid } from "../../../types/types";

/**
 * Finds the index where the total cell divider line should be.
 *
 * Only if the root cell is a total cell should there be a divider line. Such that if
 * the root cell is a pseudo dimension, there should not be a divider line.
 */
const getTotalDividerIndex = (grid: Grid, gridSize: number) => {
  const firstRootCell = grid[0]?.[0];
  const lastCell = grid.at(-1)?.[gridSize - 1];
  const lastRootCell = lastCell?.root === null ? lastCell : lastCell?.root;

  if (firstRootCell?.isTotal) {
    return firstRootCell.isLeafNode
      ? firstRootCell.mainAxisPageCoord
      : firstRootCell.mainAxisPageCoord + firstRootCell.leafCount - 1;
  }

  if (lastRootCell?.isTotal) {
    return lastRootCell.mainAxisPageCoord - 1;
  }

  return -1;
};

export default getTotalDividerIndex;
