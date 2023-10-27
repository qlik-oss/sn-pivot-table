import type { stardust } from "@nebula.js/stardust";
import { useState } from "react";
import cancelEventsFromColumnAdjuster from "../components/cells/utils/cancel-events-from-column-adjuster";

interface UseHeadCellDim {
  interactions: stardust.Interactions;
}

export const useHeadCellDim = ({ interactions }: UseHeadCellDim) => {
  const [open, setOpen] = useState(false);

  const handleOpenMenu = (evt: React.MouseEvent) =>
    interactions.active && !cancelEventsFromColumnAdjuster(evt) && setOpen(true);

  return { open, setOpen, handleOpenMenu };
};
