import type { stardust } from "@nebula.js/stardust";
import { useState } from "react";

interface UseHeadCellDim {
  interactions: stardust.Interactions;
}

export const useHeadCellDim = ({ interactions }: UseHeadCellDim) => {
  const [open, setOpen] = useState(false);

  const handleOpenMenu = () => interactions.active && setOpen(true);

  return { open, setOpen, handleOpenMenu };
};
