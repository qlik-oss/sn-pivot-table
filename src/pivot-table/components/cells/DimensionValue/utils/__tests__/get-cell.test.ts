import type { Cell, ListItemData } from "../../../../../../types/types";
import getCell from "../get-cell";

describe("getCell", () => {
  let data: ListItemData;
  let cell: Cell;

  beforeEach(() => {
    cell = {} as Cell;

    data = {
      isLast: false,
      list: { 0: cell },
      listValues: [cell],
    } as unknown as ListItemData;
  });

  test("should return cell when it's NOT a leaf node", () => {
    const index = 3;
    data.isLast = false;
    data.list = { [index + 1]: cell };
    data.listValues = []; // cell should be resolved from listValues
    data.listValues[index] = cell;

    const resolvedCell = getCell(index, data);

    expect(resolvedCell).toBe(cell);
  });

  test("should return cell when it's a leaf node", () => {
    const index = 3;
    data.isLast = true;
    data.list = { [index]: cell }; // cell should be resolved from list
    data.listValues = [];
    data.listValues[index + 1] = cell;

    const resolvedCell = getCell(index, data);

    expect(resolvedCell).toBe(cell);
  });

  test("should return undefined when there is no cell at index", () => {
    const index = 123;

    const resolvedCell = getCell(index, data);

    expect(resolvedCell).toBe(undefined);
  });
});
