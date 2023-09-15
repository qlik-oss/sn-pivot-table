import type { Cell, Grid } from "../../../../types/types";
import getTotalDividerIndex from "../get-total-divider-index";

describe("getTotalDividerIndex", () => {
  let grid: Grid;
  let firstRootCell: Cell;
  let lastRootCell: Cell;

  beforeEach(() => {
    firstRootCell = { isTotal: false, isLeafNode: false, mainAxisPageCoord: 0, leafCount: 0 } as Cell;
    lastRootCell = { isTotal: false, isLeafNode: false, mainAxisPageCoord: 0, leafCount: 0 } as Cell;
    grid = [
      {
        0: firstRootCell,
        1337: lastRootCell,
      },
    ] as unknown as Grid;
  });

  test("should resolve index from the first root node when is a leaf node", () => {
    firstRootCell.isTotal = true;
    firstRootCell.isLeafNode = true;
    firstRootCell.mainAxisPageCoord = 3;

    const index = getTotalDividerIndex(grid);
    expect(index).toEqual(3);
  });

  test("should resolve index from the first root node when it NOT a leaf node", () => {
    firstRootCell.isTotal = true;
    firstRootCell.mainAxisPageCoord = 3;
    firstRootCell.leafCount = 10;
    const index = getTotalDividerIndex(grid);
    expect(index).toEqual(12);
  });

  test("should resolve index from the last root node", () => {
    lastRootCell.isTotal = true;
    lastRootCell.isLeafNode = true;
    lastRootCell.mainAxisPageCoord = 3;
    lastRootCell.leafCount = 10;
    const index = getTotalDividerIndex(grid);
    expect(index).toEqual(2);
  });

  test("should resolve default index when there is no total cell", () => {
    firstRootCell.isTotal = false;
    lastRootCell.isTotal = false;
    const index = getTotalDividerIndex(grid);
    expect(index).toEqual(-1);
  });
});
