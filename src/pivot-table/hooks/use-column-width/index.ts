import { useMeasureText } from "@qlik/nebula-table-utils/lib/hooks";
import { useCallback, useEffect } from "react";
import { GRID_BORDER } from "../../constants";
import { useStyleContext } from "../../contexts/StyleProvider";
import { LOCK_ICON_SIZE, MENU_ICON_SIZE, TOTAL_CELL_PADDING } from "./constants";
import type { ColumnWidthHook, GetHeaderCellsIconsVisibilityStatus } from "./types";
import useColumnWidthLeft from "./use-column-width-left";
import useColumnWidthRight from "./use-column-width-right";
import { getMeasureTextArgs } from "./utils";

export type { GetHeaderCellsIconsVisibilityStatus, OverrideLeftGridWidth } from "./types";

export default function useColumnWidth({
  layoutService,
  tableWidth,
  headersData,
  visibleTopDimensionInfo,
  verticalScrollbarWidth,
  horizontalScrollbarHeightSetter,
}: ColumnWidthHook) {
  const styleService = useStyleContext();
  const { measureText: measureTextForHeader } = useMeasureText(getMeasureTextArgs(styleService.header));

  const leftWidths = useColumnWidthLeft({ layoutService, tableWidth, headersData });

  const rightWidths = useColumnWidthRight({
    layoutService,
    tableWidth,
    visibleTopDimensionInfo,
    verticalScrollbarWidth,
    leftGridWidth: leftWidths.leftGridWidth,
  });

  // The full scrollable width of the chart
  const totalWidth = leftWidths.leftGridWidth + rightWidths.rightGridFullWidth + GRID_BORDER;

  const showLastRightBorder = totalWidth < tableWidth;

  const getHeaderCellsIconsVisibilityStatus = useCallback<GetHeaderCellsIconsVisibilityStatus>(
    (idx, isLocked, title = "") => {
      const colWidth = leftWidths.leftGridColumnWidths[idx];
      let shouldShowMenuIcon = false;
      let shouldShowLockIcon = false;
      const measuredTextForHeader = measureTextForHeader(title);

      let headerSize = measuredTextForHeader + TOTAL_CELL_PADDING;

      if (isLocked && headerSize + LOCK_ICON_SIZE <= colWidth) {
        shouldShowLockIcon = true;
        headerSize += LOCK_ICON_SIZE;
      }
      if (headerSize + MENU_ICON_SIZE <= colWidth) {
        shouldShowMenuIcon = true;
      }

      return {
        shouldShowMenuIcon,
        shouldShowLockIcon,
      };
    },
    [leftWidths.leftGridColumnWidths, measureTextForHeader],
  );

  // Horizontal scrollbar height control based on columns (full) visibility
  useEffect(() => {
    const allLeftGridColumnsVisible = leftWidths.leftGridWidth === leftWidths.leftGridFullWidth;
    const allDataGridColumnsVisible = rightWidths.rightGridWidth === rightWidths.rightGridFullWidth;

    horizontalScrollbarHeightSetter(allLeftGridColumnsVisible && allDataGridColumnsVisible);
  }, [
    horizontalScrollbarHeightSetter,
    leftWidths.leftGridWidth,
    leftWidths.leftGridFullWidth,
    rightWidths.rightGridWidth,
    rightWidths.rightGridFullWidth,
  ]);

  return {
    ...leftWidths,
    ...rightWidths,
    totalWidth,
    showLastRightBorder,
    getHeaderCellsIconsVisibilityStatus,
  };
}
