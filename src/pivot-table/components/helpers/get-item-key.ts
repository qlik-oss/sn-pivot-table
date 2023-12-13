import type { GridItemData, ListItemData } from "../../../types/types";

/**
 * Fallback to row/col index for empty cells. Ideally they should be random uuid but generating those
 * on every render is expensive. There could for example be issue in the future when rendering empty cells
 * that mix shorthand and non-shorthand style properties.
 */

export const getListIemKey = (index: number, data: ListItemData): string => data.list[index]?.id ?? index.toString();

export const getGridItemKey = ({
  columnIndex,
  rowIndex,
  data,
}: {
  columnIndex: number;
  rowIndex: number;
  data: GridItemData;
}): string => data.grid[rowIndex]?.[columnIndex]?.id ?? `${rowIndex}-${columnIndex}`;
