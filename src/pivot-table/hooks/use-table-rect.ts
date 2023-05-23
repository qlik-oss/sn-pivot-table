import { useMemo } from "react";
import type { LayoutService, Rect } from "../../types/types";
import { DISCLAIMER_HEIGHT, PAGINATION_HEIGHT } from "../constants";

const useTableRect = (rect: Rect, layoutService: LayoutService, shouldShowPagination: boolean) =>
  useMemo(() => {
    let { height } = rect;

    if (layoutService.hasLimitedData) height -= DISCLAIMER_HEIGHT;
    if (shouldShowPagination) height -= PAGINATION_HEIGHT;

    return { ...rect, height };
  }, [rect, layoutService, shouldShowPagination]);

export default useTableRect;
