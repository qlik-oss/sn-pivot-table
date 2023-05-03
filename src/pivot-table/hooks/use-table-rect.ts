import { useMemo } from "react";
import type { LayoutService, Rect } from "../../types/types";
import { DISCLAIMER_HEIGHT } from "../constants";

export const useTableRect = (rect: Rect, layoutService: LayoutService) =>
  useMemo(
    () => (layoutService.hasLimitedData ? { ...rect, height: rect.height - DISCLAIMER_HEIGHT } : rect),
    [rect, layoutService]
  );
