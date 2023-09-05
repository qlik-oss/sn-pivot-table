import type { Cell } from "../../../../../types/types";
import getNextCell from "../get-next-cell";

describe("getNextCell", () => {
  let cell: Cell;
  let index: number;
  let listValues: Cell[];

  beforeEach(() => {
    cell = { parent: null } as Cell;
    index = 0;
    listValues = [cell];
  });

  test("should return next cell", () => {
    const nextCell = {} as Cell;
    listValues[index + 1] = nextCell;

    expect(getNextCell(listValues, index, cell)).toBe(nextCell);
  });

  test("should return next cell when current cell is a pseudo dimension cell", () => {
    cell.isPseudoDimension = true;
    cell.parent = { children: [{}, {}, {}] } as Cell;
    const nextCell = {} as Cell;
    const indexAdjustedByPseudoDim = cell.parent.children.length - 1;
    listValues[index + 1 + indexAdjustedByPseudoDim] = nextCell;

    expect(getNextCell(listValues, index, cell)).toBe(nextCell);
  });

  test("should handle undefined celll", () => {
    expect(getNextCell(listValues, index)).toBe(undefined);
  });
});
