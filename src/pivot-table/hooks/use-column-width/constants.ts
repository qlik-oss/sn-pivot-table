import { DOUBLE_CELL_PADDING } from "../../components/shared-styles";
import { GRID_BORDER, HEADER_ICON_SIZE, PLUS_MINUS_ICON_SIZE } from "../../constants";

// Size of the icon + left/right padding on icon
export const EXPAND_ICON_SIZE = PLUS_MINUS_ICON_SIZE + DOUBLE_CELL_PADDING;
// CELL_PADDING as grid gap between header text and menu/lock icon
export const MENU_ICON_SIZE = HEADER_ICON_SIZE + DOUBLE_CELL_PADDING;
export const LOCK_ICON_SIZE = MENU_ICON_SIZE;

export const TOTAL_CELL_PADDING = DOUBLE_CELL_PADDING * 2 + GRID_BORDER;
export const LEFT_GRID_MAX_WIDTH_RATIO = 0.75;
