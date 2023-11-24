import type { HeadersData, LayoutService, Rect, VisibleDimensionInfo } from "../../../types/types";

export type OverrideLeftGridWidth = (width: number, index: number) => void;

export interface LeftGridWidthInfo {
  leftGridWidth: number;
  leftGridColumnWidths: number[];
  leftGridFullWidth: number;
}

export interface GetHeaderCellsIconsVisibilityStatus {
  (
    idx: number,
    isLocked: boolean,
    title?: string,
  ): {
    shouldShowMenuIcon: boolean;
    shouldShowLockIcon: boolean;
  };
}

export interface ColumnWidthLeftHook {
  layoutService: LayoutService;
  tableRect: Rect;
  headersData: HeadersData;
}

export interface ColumnWidthRightHook {
  layoutService: LayoutService;
  tableRect: Rect;
  visibleTopDimensionInfo: VisibleDimensionInfo[];
  verticalScrollbarWidth: number;
  leftGridWidth: number;
}

export interface ColumnWidthHook extends ColumnWidthLeftHook {
  visibleTopDimensionInfo: VisibleDimensionInfo[];
  verticalScrollbarWidth: number;
  horizontalScrollbarHeightSetter: (shouldResetHeight?: boolean) => void;
}
