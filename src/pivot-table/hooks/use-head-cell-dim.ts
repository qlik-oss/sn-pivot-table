import type { stardust } from "@nebula.js/stardust";
import { useState } from "react";
import type { DataModel } from "../../types/types";
import isEventFromColumnAdjuster from "../components/cells/utils/is-event-from-column-adjuster";
import useIsAdjustingWidth from "./use-is-adjusting-width";

interface UseHeadCellDim {
  interactions: stardust.Interactions;
  dataModel: DataModel;
}

export const useHeadCellDim = ({ interactions, dataModel }: UseHeadCellDim) => {
  const [open, setOpen] = useState(false);
  const { isAdjustingWidth, setIsAdjustingWidth } = useIsAdjustingWidth([dataModel]);

  const handleOpenMenu = (evt: React.MouseEvent) =>
    interactions.active && !isEventFromColumnAdjuster(evt) && !isAdjustingWidth && setOpen(true);

  return { open, setOpen, handleOpenMenu, setIsAdjustingWidth };
};
