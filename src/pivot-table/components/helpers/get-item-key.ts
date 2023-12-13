import type { GridItemData, ListItemData } from "../../../types/types";
import getRandomUUID from "../../data/helpers/get-random-uuid";

// Fallback to uuid for empty cells
export const getListIemKey = (index: number, data: ListItemData): string => data.list[index]?.id ?? getRandomUUID();

// Fallback to uuid for empty cells
export const getGridItemKey = ({
  columnIndex,
  rowIndex,
  data,
}: {
  columnIndex: number;
  rowIndex: number;
  data: GridItemData;
}): string => data.grid[rowIndex]?.[columnIndex]?.id ?? getRandomUUID();
