import { useOnPropsChange } from "@qlik/nebula-table-utils/lib/hooks";
import { useLayoutEffect } from "react";
import type { VariableSizeList } from "react-window";
import type { LayoutService, LeftDimensionData, TopDimensionData } from "../../types/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Refs = React.RefObject<(VariableSizeList<any> | null)[]>;

/**
 * Scenarios that will invalidate the list cache and requires a re-render
 * - New layout
 * - Re-sizing the chart or columns
 * - Theme/Styling change (ex: go from large font-size to small could change size of the cells)
 */
export const useResetListCacheAndRerender = (
  refs: Refs,
  width: number,
  height: number,
  contentHeight: number,
  layoutService: LayoutService,
) => {
  useLayoutEffect(() => {
    refs.current?.forEach((list) => list?.resetAfterIndex(0, true));
  }, [refs, width, height, contentHeight, layoutService]);
};

/**
 * Scenarios that will invalidate the list but does not require a re-render
 * - Scrolling that fetches more data
 */
export const useResetListCache = (refs: Refs, data: LeftDimensionData | TopDimensionData) => {
  useOnPropsChange(() => {
    refs.current?.forEach((list) => list?.resetAfterIndex(0, false));
  }, [refs, data]);
};
