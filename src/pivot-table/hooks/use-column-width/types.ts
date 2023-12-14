import type { HeadersData, LayoutService, VisibleDimensionInfo } from "../../../types/types";

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
  tableWidth: number;
  headersData: HeadersData;
}

export interface ColumnWidthRightHook {
  layoutService: LayoutService;
  tableWidth: number;
  visibleTopDimensionInfo: VisibleDimensionInfo[];
  verticalScrollbarWidth: number;
  leftGridWidth: number;
}

export interface ColumnWidthHook extends ColumnWidthLeftHook {
  visibleTopDimensionInfo: VisibleDimensionInfo[];
  verticalScrollbarWidth: number;
  horizontalScrollbarHeightSetter: (shouldResetHeight?: boolean) => void;
}
