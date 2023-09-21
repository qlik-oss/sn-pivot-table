import { PAGINATION_HEIGHT } from "@qlik/nebula-table-utils/lib/constants";
import { useMemo } from "react";
import type { LayoutService, Rect } from "../../types/types";
import { DISCLAIMER_HEIGHT } from "../constants";

export const PAGINATION_FOOTER_BORDER = 1;

const useTableRect = (rect: Rect, layoutService: LayoutService, shouldShowPagination: boolean) =>
  useMemo(() => {
    let { height } = rect;

    if (layoutService.hasLimitedData) height -= DISCLAIMER_HEIGHT;
    if (shouldShowPagination) height -= PAGINATION_HEIGHT + PAGINATION_FOOTER_BORDER;

    return { ...rect, height };
  }, [rect, layoutService, shouldShowPagination]);

export default useTableRect;
