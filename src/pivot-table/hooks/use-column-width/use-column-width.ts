import { useEffect, useMemo } from "react";
import { GRID_BORDER } from "../../constants";
import type { ColumnWidthHook } from "./types";
import useColumnWidthLeft from "./use-column-width-left";
import useColumnWidthRight from "./use-column-width-right";

export default function useColumnWidth({
  layoutService,
  tableRect,
  headersData,
  visibleTopDimensionInfo,
  verticalScrollbarWidth,
  horizontalScrollbarHeightSetter,
}: ColumnWidthHook) {
  const leftWidths = useColumnWidthLeft({ layoutService, tableRect, headersData });

  const rightWidths = useColumnWidthRight({
    layoutService,
    tableRect,
    visibleTopDimensionInfo,
    verticalScrollbarWidth,
    leftGridWidth: leftWidths.leftGridWidth,
  });

  // The full scrollable width of the chart
  const totalWidth = useMemo(
    () => leftWidths.leftGridWidth + rightWidths.rightGridFullWidth + GRID_BORDER,
    [leftWidths.leftGridWidth, rightWidths.rightGridFullWidth],
  );

  const showLastRightBorder = useMemo(() => totalWidth < tableRect.width, [totalWidth, tableRect.width]);

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
  };
}
