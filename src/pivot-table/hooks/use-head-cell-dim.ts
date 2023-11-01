import type { stardust } from "@nebula.js/stardust";
import { useState } from "react";
import isEventFromColumnAdjuster from "../components/cells/utils/is-event-from-column-adjuster";

interface UseHeadCellDim {
  interactions: stardust.Interactions;
}

export const useHeadCellDim = ({ interactions }: UseHeadCellDim) => {
  const [open, setOpen] = useState(false);

  const handleOpenMenu = (evt: React.MouseEvent) =>
    interactions.active && !isEventFromColumnAdjuster(evt) && setOpen(true);

  return { open, setOpen, handleOpenMenu };
};
