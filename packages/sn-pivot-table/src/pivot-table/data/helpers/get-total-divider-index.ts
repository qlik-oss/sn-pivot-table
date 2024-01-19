import type { Grid, List } from "../../../types/types";

/**
 * Finds the index where the total cell divider line should be.
 *
 * Only if the root cell is a total cell should there be a divider line. Such that if
 * the root cell is a pseudo dimension, there should not be a divider line.
 */
const getTotalDividerIndex = (grid: Grid) => {
  const rootList = grid[0] as List | undefined;
  const rootListAsArray = rootList ? Object.values(rootList) : [];
  const firstRootCell = rootList?.[0];
  const lastRootCell = rootListAsArray.at(-1);

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
