import { useEffect, useMemo, useState } from "react";

interface UseHeadCellDim {
  open: boolean;
}

export const useHeadCellDim = ({ open }: UseHeadCellDim) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!open) setIsHovered(false);
  }, [open]);

  const shadeOpacity = useMemo(() => {
    let opacity = 0;
    if (isHovered) opacity = 0.03;
    if (open) opacity = 0.05;
    return opacity;
  }, [open, isHovered]);

  return { setIsHovered, shadeOpacity };
};
