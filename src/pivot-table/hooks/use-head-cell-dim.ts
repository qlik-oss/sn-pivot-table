import type { stardust } from "@nebula.js/stardust";
import { useState } from "react";

interface UseHeadCellDim {
  interactions: stardust.Interactions;
}

export const useHeadCellDim = ({ interactions }: UseHeadCellDim) => {
  const [open, setOpen] = useState(false);

  const handleOpenMenu = (evt: React.MouseEvent) =>
    interactions.active &&
    !(evt.target as HTMLElement)?.className.includes("sn-pivot-table-column-adjuster") &&
    setOpen(true);

  return { open, setOpen, handleOpenMenu };
};
