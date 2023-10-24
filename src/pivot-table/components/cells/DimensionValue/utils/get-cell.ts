import type { Cell, ListItemData } from "../../../../../types/types";

const getCell = (index: number, data: ListItemData) => {
  const { isLast, list, listValues } = data;

  /**
   * When "isLast" is true, the keys in the "list" object, which are numerical values (ex. "{ 0: cell, 1: cell }"),
   * matches the number of rows the react-window List component. So "index" will exist, as some point, as a key in "list".
   *
   * But when "isLast" is false, the keys in "list" object, are not guaranteed to match "index".
   * To get around that, the "list" object is converted to an array.
   */
  return (isLast ? list[index] : listValues[index]) as Cell | undefined;
};

export default getCell;
